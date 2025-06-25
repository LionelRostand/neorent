
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface PropertyImageSectionProps {
  property: any;
}

export const PropertyImageSection = ({ property }: PropertyImageSectionProps) => {
  return (
    <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
      {property.image && property.image !== '/placeholder.svg' ? (
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageIcon className="h-16 w-16 text-gray-400" />
        </div>
      )}
    </div>
  );
};
