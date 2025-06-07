"use server";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

export async function uploadToCloudinary(base64File: string) {
  try {
    // Upload to Cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${base64File}`, {
      folder:  "downdating/payment-screenshots", // Change folder as needed
    });

    return uploadResponse.secure_url; // Return Cloudinary URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
}