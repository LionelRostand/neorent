
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PropertyDetailsContent } from './PropertyDetailsContent';
import { VisitSchedulingForm } from './VisitSchedulingForm';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';

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
  const { roommates } = useFirebaseRoommates();

  if (!property) return null;

  // Calculer le statut réel (même logique que dans PublicPropertiesList)
  const getRealStatus = (property: any) => {
    if (property.locationType === 'Colocation') {
      const activeRoommates = roommates.filter(
        roommate => roommate.property === property.title && roommate.status === 'Actif'
      ).length;
      
      const totalRooms = property.totalRooms || 1;
      const availableRooms = totalRooms - activeRoommates;
      
      if (availableRooms === totalRooms) {
        return { status: 'Libre', color: 'bg-green-100 text-green-800' };
      } else if (availableRooms > 0) {
        return { status: 'Partiellement occupé', color: 'bg-yellow-100 text-yellow-800' };
      } else {
        return { status: 'Occupé', color: 'bg-red-100 text-red-800' };
      }
    } else {
      return { 
        status: property.status, 
        color: getStatusColor(property.status) 
      };
    }
  };

  const realStatus = getRealStatus(property);

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

  // Calculs financiers dynamiques
  const getFinancialMetrics = () => {
    if (property.locationType === 'Colocation') {
      const activeRoommates = roommates.filter(
        roommate => roommate.property === property.title && roommate.status === 'Actif'
      );
      
      const monthlyRevenue = activeRoommates.reduce((sum, roommate) => sum + Number(roommate.rentAmount || 0), 0);
      const monthlyCharges = Number(property.charges) || 0;
      const profit = monthlyRevenue - monthlyCharges;
      const totalRooms = property.totalRooms || 1;
      const occupancyRate = Math.round((activeRoommates.length / totalRooms) * 100);
      
      return {
        revenue: monthlyRevenue,
        charges: monthlyCharges,
        profit,
        occupancyRate,
        occupiedRooms: activeRoommates.length,
        totalRooms
      };
    } else {
      const monthlyRevenue = Number(property.rent) || 0;
      const monthlyCharges = Number(property.charges) || 0;
      const profit = monthlyRevenue - monthlyCharges;
      const occupancyRate = property.status === 'Occupé' ? 100 : 0;
      
      return {
        revenue: monthlyRevenue,
        charges: monthlyCharges,
        profit,
        occupancyRate,
        occupiedRooms: property.status === 'Occupé' ? 1 : 0,
        totalRooms: 1
      };
    }
  };

  const financialMetrics = getFinancialMetrics();

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
            <Badge className={realStatus.color}>
              {realStatus.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        {!showVisitForm ? (
          <PropertyDetailsContent 
            property={property}
            financialMetrics={financialMetrics}
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
