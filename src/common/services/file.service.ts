import { Express } from 'express';
import { cloudinaryService } from './cloudinary.service';
import path from 'path';

export class FileService {
  private static readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  private static readonly ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  private static getPublicIdFromUrl(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w{3,4})?$/);

    if (match && match[1]) {
      return match[1];
    }

    return null;
  }

  static async saveAvatarCloudinary(file: Express.Multer.File): Promise<string> {
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (
      !FileService.ALLOWED_MIME_TYPES.includes(file.mimetype) ||
      !FileService.ALLOWED_EXTENSIONS.includes(fileExtension)
    ) {
      throw new Error('Invalid file format. Only JPG, JPEG, PNG, GIF, WebP images are allowed.');
    }

    try {
      const uploadResult = await cloudinaryService.uploadFile(file.buffer, 'avatars');

      return uploadResult.secure_url;
    } catch (error: unknown) {
      console.error('Failed to upload avatar to Cloudinary:', error);
      throw new Error('Failed to save avatar file.');
    }
  }

  static async deleteAvatarCloudinary(avatarUrl: string): Promise<void> {
    try {
      const publicId = FileService.getPublicIdFromUrl(avatarUrl);
      if (publicId) {
        await cloudinaryService.deleteFile(publicId);
      } else {
        console.warn(`Could not extract publicId from URL: ${avatarUrl}`);
      }
    } catch (error: unknown) {
      console.error('Failed to delete avatar from Cloudinary:', error);
      throw new Error('Failed to delete avatar file.');
    }
  }

  static async saveTaskFiles(files: Express.Multer.File[]): Promise<string[]> {
    for (const file of files) {
      const fileExtension = path.extname(file.originalname).toLowerCase();
      if (
        !FileService.ALLOWED_MIME_TYPES.includes(file.mimetype) ||
        !FileService.ALLOWED_EXTENSIONS.includes(fileExtension)
      ) {
        throw new Error(
          `Invalid file format for ${file.originalname}. Only JPG, PNG, GIF, WebP are allowed.`,
        );
      }
    }

    const uploadPromises = files.map((file) => cloudinaryService.uploadFile(file.buffer, 'tasks'));

    try {
      const uploadResults = await Promise.all(uploadPromises);
      return uploadResults.map((result) => result.secure_url);
    } catch (error) {
      console.error('Failed to upload task files to Cloudinary:', error);
      throw new Error('Failed to save task files.');
    }
  }

  static async deleteTaskFilesCloudinary(fileUrls: string[]): Promise<void> {
    const deletePromises = fileUrls.map((url) => {
      const publicId = FileService.getPublicIdFromUrl(url);
      if (publicId) {
        return cloudinaryService.deleteFile(publicId);
      }
      console.warn(`Could not extract publicId from URL: ${url}`);
      return Promise.resolve();
    });

    try {
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Failed to delete task files from Cloudinary:', error);
      throw new Error('Failed to delete task files.');
    }
  }
}
