import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import { dotenvConfig } from '../../config/dotenv.config';

class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: dotenvConfig.CLOUDINARY_CLOUD_NAME,
      api_key: dotenvConfig.CLOUDINARY_API_KEY,
      api_secret: dotenvConfig.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Uploads the file to Cloudinary
   * @param fileBuffer - File buffer received from multer
   * @param folder - Folder in Cloudinary for storage
   * @returns Promise with the download result
   */
  async uploadFile(fileBuffer: Buffer, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Cloudinary upload result is undefined.'));
          }
        },
      );

      const readableStream = new Readable();
      readableStream._read = () => {};
      readableStream.push(fileBuffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log(`Cloudinary: deleted file with publicId ${publicId}. Result:`, result);
      return result;
    } catch (error: unknown) {
      console.error(`Cloudinary: failed to delete file with publicId ${publicId}. Error:`, error);
      throw new Error('Failed to delete file from Cloudinary.');
    }
  }
}

export const cloudinaryService = new CloudinaryService();
