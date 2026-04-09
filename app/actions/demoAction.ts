"use server";

import { sendAdminDemoAlertEmail, sendAdminEstimationAlertEmail } from "@/lib/email";

export async function submitDemoRequest(data: {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  assetTier: string;
}) {
  console.log("Processing demo request for", data.email);
  
  // Here we would typically also save to DB, alert admins, etc.
  
  // Send the notification email to the admin/team directly instead of thanking the user via email
  const result = await sendAdminDemoAlertEmail({
    email: data.email,
    name: data.fullName,
    companyName: data.companyName,
    phone: data.phone,
    assetTier: data.assetTier,
  });

  if (result.error) {
    console.error("Failed to send demo response email", result.error);
    return { success: false, error: "Failed to process request." };
  }

  return { success: true };
}

export async function submitPricingRequest(data: {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  assetTier: string;
}) {
  console.log("Processing pricing estimate request for", data.email);
  
  const result = await sendAdminEstimationAlertEmail({
    email: data.email,
    name: data.fullName,
    companyName: data.companyName,
    phone: data.phone,
    assetTier: data.assetTier,
  });

  if (result.error) {
    console.error("Failed to send pricing response email", result.error);
    return { success: false, error: "Failed to process request." };
  }

  return { success: true };
}
