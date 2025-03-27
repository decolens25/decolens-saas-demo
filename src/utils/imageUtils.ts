/**
 * Utility functions for image processing
 */

/**
 * Scales down an image to a maximum width or height while maintaining aspect ratio
 * @param imageUrl URL or data URL of the image
 * @param maxDimension Maximum width or height in pixels
 * @returns Promise that resolves to a data URL of the scaled image
 */
export const scaleImageToMaxDimension = async (imageUrl: string, maxDimension: number = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Get original dimensions
      const originalWidth = img.width;
      const originalHeight = img.height;
      
      // If image is already smaller than max dimension, return original
      if (originalWidth <= maxDimension && originalHeight <= maxDimension) {
        resolve(imageUrl);
        return;
      }
      
      // Calculate new dimensions while maintaining aspect ratio
      let newWidth, newHeight;
      if (originalWidth > originalHeight) {
        newWidth = maxDimension;
        newHeight = Math.floor(originalHeight * (maxDimension / originalWidth));
      } else {
        newHeight = maxDimension;
        newWidth = Math.floor(originalWidth * (maxDimension / originalHeight));
      }
      
      // Create canvas and draw scaled image
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw image with smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert to data URL (JPEG for better compression)
      const scaledImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(scaledImageUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
};

/**
 * Converts a data URL to a Blob
 * @param dataUrl The data URL to convert
 * @returns A Blob representing the data
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};