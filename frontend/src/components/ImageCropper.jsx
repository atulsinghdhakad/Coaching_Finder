import React, { useState, useRef, useEffect } from 'react';
import './ImageCropper.css';
import { toast } from 'react-hot-toast';

const ImageCropper = ({ imageSrc, onCrop, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCropping, setIsCropping] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (imageRef.current && imageSrc) {
      const img = imageRef.current;
      
      const handleLoad = () => {
        console.log('🖼️ Image loaded');
        
        // Wait for image to be fully rendered
        setTimeout(() => {
          const rect = img.getBoundingClientRect();
          console.log('📏 Image rect:', rect);
          
          // Calculate crop size (square, 80% of smaller dimension)
          const cropSize = Math.min(rect.width, rect.height) * 0.8;
          
          // Center the crop area
          const cropX = (rect.width - cropSize) / 2;
          const cropY = (rect.height - cropSize) / 2;
          
          const cropArea = {
            x: cropX,
            y: cropY,
            width: cropSize,
            height: cropSize
          };
          
          console.log('✂️ Setting crop area:', cropArea);
          setCrop(cropArea);
        }, 200);
      };
      
      if (img.complete) {
        handleLoad();
      } else {
        img.onload = handleLoad;
      }
    }
  }, [imageSrc]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if click is within crop area
    if (x >= crop.x && x <= crop.x + crop.width && 
        y >= crop.y && y <= crop.y + crop.height) {
      console.log('🖱️ Starting drag at:', { x, y });
      setIsDragging(true);
      setDragStart({
        x: x - crop.x,
        y: y - crop.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newX = x - dragStart.x;
    const newY = y - dragStart.y;
    
    // Constrain to image bounds
    const imgRect = imageRef.current.getBoundingClientRect();
    const maxX = imgRect.width - crop.width;
    const maxY = imgRect.height - crop.height;
    
    setCrop(prev => ({
      ...prev,
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    }));
  };

  const handleMouseUp = () => {
    if (isDragging) {
      console.log('🖱️ Drag ended, crop area:', crop);
    }
    setIsDragging(false);
  };

  const handleCrop = async () => {
    console.log('🚀 Starting HD crop process...');
    
    if (!imageRef.current || isCropping) {
      console.log('❌ Cannot crop: image not ready or already cropping');
      return;
    }

    setIsCropping(true);
    
    try {
      const img = imageRef.current;
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set HD output size (increased from 300 to 512 for better quality)
      const outputSize = 512;
      canvas.width = outputSize;
      canvas.height = outputSize;
      
      console.log('📏 HD Canvas size:', { width: canvas.width, height: canvas.height });
      
      // Get image dimensions
      const imgRect = img.getBoundingClientRect();
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      
      console.log('📏 Image dimensions:', {
        natural: { width: naturalWidth, height: naturalHeight },
        display: { width: imgRect.width, height: imgRect.height }
      });
      
      // Calculate scale factors
      const scaleX = naturalWidth / imgRect.width;
      const scaleY = naturalHeight / imgRect.height;
      
      // Calculate actual crop coordinates
      const actualX = crop.x * scaleX;
      const actualY = crop.y * scaleY;
      const actualWidth = crop.width * scaleX;
      const actualHeight = crop.height * scaleY;
      
      console.log('✂️ HD Crop calculations:', {
        crop,
        scaleX,
        scaleY,
        actualX,
        actualY,
        actualWidth,
        actualHeight
      });
      
      // Clear canvas
      ctx.clearRect(0, 0, outputSize, outputSize);
      
      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw the cropped image
      console.log('🎨 Drawing HD image to canvas...');
      ctx.drawImage(
        img,
        actualX,
        actualY,
        actualWidth,
        actualHeight,
        0,
        0,
        outputSize,
        outputSize
      );
      
      console.log('✅ HD Image drawn to canvas successfully');
      
      // Convert to blob with high quality (increased from 0.9 to 0.95)
      canvas.toBlob((blob) => {
        if (blob && blob.size > 0) {
          console.log('✅ HD crop successful! Blob size:', blob.size, 'bytes');
          console.log('✅ Blob type:', blob.type);
          console.log('✅ Calling onCrop with HD blob...');
          onCrop(blob);
        } else {
          console.error('❌ Failed to create blob or blob is empty');
          console.error('❌ Blob details:', blob);
          toast.error('Failed to crop image. Please try again.');
        }
        setIsCropping(false);
      }, 'image/jpeg', 0.95);
      
    } catch (error) {
      console.error('❌ HD Crop error:', error);
      toast.error(`Failed to crop image: ${error.message}`);
      setIsCropping(false);
    }
  };

  if (!imageSrc) return null;

  return (
    <div className="image-cropper-overlay" onClick={onClose}>
      <div className="image-cropper-modal" onClick={(e) => e.stopPropagation()}>
        <div className="image-cropper-header">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            ✂️ Crop Profile Picture (HD Quality)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
            disabled={isCropping}
          >
            ✕
          </button>
        </div>

        <div className="image-cropper-content">
          <div 
            ref={containerRef}
            className="image-cropper-container"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseDown={handleMouseDown}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop preview"
              className="image-cropper-image"
              draggable={false}
            />
            
            <div
              className="image-cropper-crop-area"
              style={{
                left: crop.x,
                top: crop.y,
                width: crop.width,
                height: crop.height,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              <div className="resize-handle nw" onMouseDown={(e) => e.stopPropagation()}></div>
              <div className="resize-handle ne" onMouseDown={(e) => e.stopPropagation()}></div>
              <div className="resize-handle sw" onMouseDown={(e) => e.stopPropagation()}></div>
              <div className="resize-handle se" onMouseDown={(e) => e.stopPropagation()}></div>
            </div>
          </div>
        </div>

        <div className="image-cropper-footer">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            disabled={isCropping}
          >
            Cancel
          </button>
          
          <button
            onClick={handleCrop}
            disabled={isCropping}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCropping ? '🔄 Cropping...' : '✂️ Crop & Save (HD)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper; 