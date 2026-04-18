import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// 🔐 Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// 📸 Upload Function
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No file path provided");
      return null;
    }

    // ✅ Upload file
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // 🧹 Delete local file after upload
    fs.unlinkSync(localFilePath);

    // 🔥 Return only useful data
    return {
      url: response.secure_url,   // always use secure_url
      public_id: response.public_id,
    };

  } catch (error) {
    console.log("Cloudinary upload error:", error);

    // 🧹 Cleanup if failed
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };