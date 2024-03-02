import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (FileLcoalPath) => {
  try {
    // if (localFilePath === '') return null;
    const response = await cloudinary.uploader.upload(FileLcoalPath, {
      folder: "Talk_Live",
      resource_type: "auto",
    });

    // console.log('file is uploaded on cloudinary ', response.url);

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
