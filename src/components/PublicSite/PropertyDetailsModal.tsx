
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PropertyDetailsContent } from './PropertyDetailsContent';
import { VisitSchedulingForm } from './VisitSchedulingForm';

interface PropertyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export const PropertyDetailsModal = ({
  isOpen,
  onClose,
  property
}: PropertyDetailsModalProps) => {
  const [showVisitForm, setShowVisitForm] = useState(false);

  if (!property) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Libre':
        return 'bg-green-100 text-green-800';
      case 'Occupé':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleScheduleVisit = () => {
    setShowVisitForm(true);
  };

  const handleCloseVisitForm = () => {
    setShowVisitForm(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{property.title}</span>
            <Badge className={getStatusColor(property.status)}>
              {property.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        {!showVisitForm ? (
          <PropertyDetailsContent 
            property={property}
            onScheduleVisit={handleScheduleVisit}
            onClose={onClose}
          />
        ) : (
          <VisitSchedulingForm 
            property={property}
            onClose={handleCloseVisitForm}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
