/**
 * Image Upload Provider
 * Handles image uploads, compression, and management for products
 */

import { ApiError } from '@/utils/api';
import React, { createContext, useContext, useState } from 'react';

export type ImageFormat = 'jpeg' | 'png' | 'webp';
export type ImageQuality = 'low' | 'medium' | 'high';

export interface ImageUploadOptions {
  format?: ImageFormat;
  quality?: ImageQuality;
  maxWidth?: number;
  maxHeight?: number;
  maxSizeKB?: number;
}

export interface UploadedImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  originalName: string;
  size: number;
  format: ImageFormat;
  width: number;
  height: number;
  uploadedAt: string;
  uploadedBy: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface ImageUploadResult {
  success: boolean;
  image?: UploadedImage;
  error?: string;
}

interface ImageUploadContextType {
  // State
  uploadedImages: UploadedImage[];
  currentUploads: Map<string, UploadProgress>;
  loading: boolean;
  error: string | null;

  // Upload methods
  uploadImage: (file: any, options?: ImageUploadOptions) => Promise<ImageUploadResult>;
  uploadMultipleImages: (files: any[], options?: ImageUploadOptions) => Promise<ImageUploadResult[]>;
  uploadFromCamera: (options?: ImageUploadOptions) => Promise<ImageUploadResult>;
  uploadFromGallery: (options?: ImageUploadOptions) => Promise<ImageUploadResult>;

  // Image management
  deleteImage: (imageId: string) => Promise<boolean>;
  getImageUrl: (imageId: string, size?: 'original' | 'thumbnail') => string;
  compressImage: (file: any, options: ImageUploadOptions) => Promise<any>;

  // Utilities
  getSupportedFormats: () => ImageFormat[];
  validateImage: (file: any) => { valid: boolean; errors: string[] };
  getImageDimensions: (file: any) => Promise<{ width: number; height: number }>;
  formatFileSize: (bytes: number) => string;

  // Batch operations
  clearUploads: () => void;
  retryUpload: (uploadId: string) => Promise<ImageUploadResult>;
}

const ImageUploadContext = createContext<ImageUploadContextType | undefined>(undefined);

export function ImageUploadProvider({ children }: { children: React.ReactNode }) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [currentUploads, setCurrentUploads] = useState<Map<string, UploadProgress>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: any, options: ImageUploadOptions = {}): Promise<ImageUploadResult> => {
    setLoading(true);
    setError(null);

    try {
      // Validate image
      const validation = validateImage(file);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Compress if needed
      const compressedFile = await compressImage(file, options);

      // Generate upload ID for tracking
      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Initialize progress
      setCurrentUploads(prev => new Map(prev.set(uploadId, {
        loaded: 0,
        total: compressedFile.size,
        percentage: 0
      })));

      // Simulate upload with progress
      const uploadPromise = new Promise<ImageUploadResult>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);

            // Simulate success/failure
            const isSuccess = Math.random() > 0.1; // 90% success rate

            if (isSuccess) {
              const uploadedImage: UploadedImage = {
                id: `img_${Date.now()}`,
                url: `https://api.drop.com/images/${uploadId}.jpg`,
                thumbnailUrl: `https://api.drop.com/images/${uploadId}_thumb.jpg`,
                originalName: file.name || 'uploaded_image.jpg',
                size: compressedFile.size,
                format: options.format || 'jpeg',
                width: 800, // Mock dimensions
                height: 600,
                uploadedAt: new Date().toISOString(),
                uploadedBy: 'current_user' // In real app, get from auth context
              };

              setUploadedImages(prev => [...prev, uploadedImage]);
              resolve({ success: true, image: uploadedImage });
            } else {
              resolve({ success: false, error: 'Upload failed. Please try again.' });
            }
          }

          setCurrentUploads(prev => new Map(prev.set(uploadId, {
            loaded: (progress / 100) * compressedFile.size,
            total: compressedFile.size,
            percentage: progress
          })));
        }, 200);
      });

      const result = await uploadPromise;

      // Clean up progress
      setCurrentUploads(prev => {
        const newMap = new Map(prev);
        newMap.delete(uploadId);
        return newMap;
      });

      // In a real app:
      // const formData = new FormData();
      // formData.append('image', compressedFile);
      // formData.append('options', JSON.stringify(options));
      //
      // const response = await apiClient.post('/images/upload', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      //   onUploadProgress: (progressEvent) => {
      //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //     setCurrentUploads(prev => new Map(prev.set(uploadId, {
      //       loaded: progressEvent.loaded,
      //       total: progressEvent.total,
      //       percentage: progress
      //     })));
      //   }
      // });

      return result;

    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Image upload failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const uploadMultipleImages = async (files: any[], options: ImageUploadOptions = {}): Promise<ImageUploadResult[]> => {
    const results: ImageUploadResult[] = [];

    for (const file of files) {
      try {
        const result = await uploadImage(file, options);
        results.push(result);
      } catch (err) {
        results.push({ success: false, error: (err as Error).message });
      }
    }

    return results;
  };

  const uploadFromCamera = async (options: ImageUploadOptions = {}): Promise<ImageUploadResult> => {
    // In a real app, this would open the camera
    // For now, simulate taking a photo
    const mockFile = {
      name: 'camera_photo.jpg',
      size: 1024000, // 1MB
      type: 'image/jpeg'
    };

    return uploadImage(mockFile, options);
  };

  const uploadFromGallery = async (options: ImageUploadOptions = {}): Promise<ImageUploadResult> => {
    // In a real app, this would open the gallery picker
    // For now, simulate selecting from gallery
    const mockFile = {
      name: 'gallery_photo.jpg',
      size: 512000, // 512KB
      type: 'image/jpeg'
    };

    return uploadImage(mockFile, options);
  };

  const deleteImage = async (imageId: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Remove from local state
      setUploadedImages(prev => prev.filter(img => img.id !== imageId));

      // In a real app:
      // await apiClient.delete(`/images/${imageId}`);

      return true;

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to delete image');
      return false;
    }
  };

  const getImageUrl = (imageId: string, size: 'original' | 'thumbnail' = 'original'): string => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (!image) return '';

    return size === 'thumbnail' && image.thumbnailUrl ? image.thumbnailUrl : image.url;
  };

  const compressImage = async (file: any, options: ImageUploadOptions): Promise<any> => {
    // In a real app, this would use a library like react-native-image-picker or expo-image-manipulator
    // For now, simulate compression
    const compressedSize = Math.max(file.size * 0.7, 100000); // Reduce to 70% or minimum 100KB

    return {
      ...file,
      size: compressedSize,
      compressed: true
    };
  };

  const getSupportedFormats = (): ImageFormat[] => {
    return ['jpeg', 'png', 'webp'];
  };

  const validateImage = (file: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!file) {
      errors.push('No file provided');
    } else {
      if (file.size > maxSize) {
        errors.push('File size must be less than 5MB');
      }

      if (!supportedTypes.includes(file.type)) {
        errors.push('File must be a JPEG, PNG, or WebP image');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  };

  const getImageDimensions = async (file: any): Promise<{ width: number; height: number }> => {
    // In a real app, this would read the image dimensions
    // For now, return mock dimensions
    return {
      width: Math.floor(Math.random() * 1000) + 500,
      height: Math.floor(Math.random() * 1000) + 500
    };
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearUploads = () => {
    setCurrentUploads(new Map());
  };

  const retryUpload = async (uploadId: string): Promise<ImageUploadResult> => {
    // In a real implementation, this would retry a failed upload
    // For now, simulate a retry
    const mockFile = {
      name: 'retry_upload.jpg',
      size: 256000,
      type: 'image/jpeg'
    };

    return uploadImage(mockFile);
  };

  const value: ImageUploadContextType = {
    uploadedImages,
    currentUploads,
    loading,
    error,
    uploadImage,
    uploadMultipleImages,
    uploadFromCamera,
    uploadFromGallery,
    deleteImage,
    getImageUrl,
    compressImage,
    getSupportedFormats,
    validateImage,
    getImageDimensions,
    formatFileSize,
    clearUploads,
    retryUpload
  };

  return (
    <ImageUploadContext.Provider value={value}>
      {children}
    </ImageUploadContext.Provider>
  );
}

export const useImageUpload = () => {
  const context = useContext(ImageUploadContext);
  if (!context) {
    throw new Error('useImageUpload must be used within ImageUploadProvider');
  }
  return context;
};