/**
 * ======================================================================================
 * MODEL: ProofOfDelivery (POD / Asset Verification)
 * ======================================================================================
 * The final verification layer for logistics mission completion.
 * 
 * Features:
 * 1. Asset Linking: Securely associates digital proof with specific Load IDs.
 * 2. Visual Persistence: Stores Cloudinary-backed URIs for legal and operational audit.
 * 3. Temporal Integrity: Automatically captures upload timestamps for SLA tracking.
 * ======================================================================================
 */
import mongoose, { Schema, Document } from 'mongoose';

export interface IProofOfDelivery extends Document {
  loadId: mongoose.Types.ObjectId;
  imageUrl: string;
  uploadedAt: Date;
}

const ProofOfDeliverySchema = new Schema<IProofOfDelivery>(
  {
    loadId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Load', 
      required: true 
    },
    imageUrl: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ProofOfDelivery || mongoose.model<IProofOfDelivery>('ProofOfDelivery', ProofOfDeliverySchema);
