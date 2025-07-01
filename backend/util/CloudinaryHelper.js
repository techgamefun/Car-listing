import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

class CloudinaryHelper {
  static uploadSingle(fileBuffer, options) {
    return new Promise((resolve, reject) => {
      const defaultOptions = {
        folder: "uploads",
        resource_type: "auto",
      };

      const uploadOptions = options
        ? { ...defaultOptions, ...options }
        : defaultOptions;

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  static async uploadMultiple(fileBuffers, options) {
    const uploadPromises = fileBuffers.map((buffer, index) => {
      let fileOptions = options ? { ...options } : {};

      // Add index to public_id if it exists
      if (fileOptions.public_id) {
        fileOptions.public_id = `${fileOptions.public_id}_${index}`;
      }

      return this.uploadSingle(buffer, fileOptions);
    });

    return Promise.all(uploadPromises);
  }

  static deleteFile(publicId) {
    return cloudinary.uploader.destroy(publicId);
  }

  static deleteMultiple(publicIds) {
    return cloudinary.api.delete_resources(publicIds);
  }
}

export default CloudinaryHelper;
