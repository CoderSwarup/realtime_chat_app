import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import path from "path";
dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (file, FileName) => {
  try {
    // if (localFilePath === '') return null;

    const fileExtension = path.extname(FileName);
    // console.log(conversation_id);
    const GenerateFileName = `${Date.now()}_${Math.floor(
      Math.random() * 100000
    )}${fileExtension}`;
    // console.log(GenerateFileName);
    let fileBuffer = Buffer.from(file);

    // Define the file path where you want to store the buffer data
    const filePath = `./Public/Temp/${GenerateFileName}`;

    // Write the buffer data to the file
    fs.writeFile(filePath, fileBuffer, async (err) => {
      if (err) {
        // console.error("Error writing file:", err);
        return null;
      }
    });
    const response = await cloudinary.uploader.upload(filePath, {
      folder: "Talk_Live",
      resource_type: "auto",
    });

    // console.log('file is uploaded on cloudinary ', response.url);
    fs.unlinkSync(filePath);

    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const DeleteImageFromCloudinary = async (fileId) => {
  try {
    const response = await cloudinary.uploader.destroy(fileId);
    if (!response.result) {
      throw new Error("File not found in Cloudinary");
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { cloudinary, uploadFileOnCloudinary, DeleteImageFromCloudinary };
