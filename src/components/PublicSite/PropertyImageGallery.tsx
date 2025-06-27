
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertyImageGalleryProps {
  property: any;
}

export const PropertyImageGallery = ({ property }: PropertyImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Collect all available images
  const images = [];
  if (property.image && property.image !== '/placeholder.svg') {
    images.push(property.image);
  }
  if (property.images && Array.isArray(property.images)) {
    images.push(...property.images);
  }
  
  // Remove duplicates and limit to 3
  const uniqueImages = [...new Set(images)].slice(0, 3);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % uniqueImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + uniqueImages.length) % uniqueImages.length);
  };

  if (uniqueImages.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <ImageIcon className="h-16 w-16 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">Aucune image disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
        <img 
          src={uniqueImages[currentImageIndex]} 
          alt={`${property.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Navigation buttons - only show if more than 1 image */}
      {uniqueImages.length > 1 && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Image indicators */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {uniqueImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>

          {/* Image counter */}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentImageIndex + 1} / {uniqueImages.length}
          </div>
        </>
      )}
    </div>
  );
};
