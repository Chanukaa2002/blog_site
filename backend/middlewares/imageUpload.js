import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const multerUpload = multer({ storage });

// Cloudinary Image Upload Middleware
export const uploadImageMiddleware = async (req, res, next) => {
  console.log(req.file);  // To confirm file is uploaded

  try {
    if (req.file) {
      // Create a writable stream to upload the file
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "posts",
          resource_type: "image",
        },
        (error, uploadedResponse) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ message: "Image upload failed", error });
          }

          // Handle successful upload
          req.body.image = uploadedResponse.secure_url;
          next();
        }
      );

      // Pipe the file buffer to Cloudinary's upload stream
      uploadStream.end(req.file.buffer);  // Pass the buffer to upload_stream
    } else {
      console.error("No file uploaded");
      req.body.image = "";
      next();  // Proceed if no file uploaded
    }
  } catch (error) {
    console.error("Error in uploadImageMiddleware:", error);
    res.status(500).json({ message: "Image upload failed", error });
  }
};

// Export Multer for single file uploads
export const upload = multerUpload.single("image");
