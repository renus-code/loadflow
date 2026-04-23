/**
 * ======================================================================================
 * API ROUTE: /api/pods (Proof of Delivery)
 * ======================================================================================
 * Orchestrates the secure upload of delivery documents to Cloudinary.
 * 
 * Features:
 * 1. Multi-Part Uploads: Processes binary file data from client-side forms.
 * 2. Cloudinary Integration: Routes assets to cloud storage with specific transformations.
 * 3. Link Persistence: Saves secure URLs to the database and links them to specific loads.
 * 4. Auth Verification: Ensures only authorized personnel can submit documentation.
 * ======================================================================================
 */
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import dbConnect from "@/lib/mongodb";
import ProofOfDelivery from "@/models/ProofOfDelivery";
import Load from "@/models/Load";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import { logAction } from "@/lib/audit";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    if (!requireRole(user, ['Admin', 'Driver', 'Dispatcher'])) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const loadId = formData.get("loadId") as string | null;

    if (!file || !loadId) {
      return NextResponse.json({ error: "File and loadId are required" }, { status: 400 });
    }

    // ── FILE TYPE & SIZE GUARD ─────────────────────────────────────────────────────
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File is too large. Maximum allowed size is 10 MB.' },
        { status: 400 }
      );
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only image files (JPEG, PNG, WEBP, etc.) are accepted.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify load exists and if Driver, belongs to them
    const load = await Load.findById(loadId);
    if (!load) {
      return NextResponse.json({ error: "Load not found" }, { status: 404 });
    }
    if (user!.role === 'Driver' && load.assignedDriverId?.toString() !== user!.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary via stream
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "loadflow_pods" },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload failed without an error."));
        }
      );
      uploadStream.end(buffer);
    });

    const pod = await ProofOfDelivery.create({
      loadId,
      imageUrl: uploadResult.secure_url,
    });

    // Save the podUrl to the Load document so it's easily accessible in all load queries
    load.podUrl = uploadResult.secure_url;
    await load.save();

    // AUDIT LOG POD UPLOAD
    await logAction({ 
      req, 
      userId: user!.id, 
      action: 'POD_UPLOADED', 
      entityType: 'Load', 
      entityId: loadId,
      details: { podId: pod._id.toString() }
    });

    // NOTE: We no longer auto-complete the load. 
    // Dispatchers must verify and complete manually in the dashboard.
    // This allows for human verification of the POD before closing the load.

    return NextResponse.json(pod, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "An error occurred" }, { status: 500 });
  }
}
