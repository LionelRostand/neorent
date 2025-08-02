
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

  // Calculs financiers dynamiques basés sur les données réelles
  const getFinancialMetrics = () => {
    if (property.locationType === 'Colocation') {
      // Filtrer les colocataires actifs pour cette propriété
      const activeRoommates = roommates.filter(
        roommate => roommate.property === property.title && roommate.status === 'Actif'
      );
      
      // Calculer les revenus réels à partir des loyers des colocataires actifs
      const monthlyRevenue = activeRoommates.reduce((sum, roommate) => {
        const rent = Number(roommate.rentAmount || 0);
        console.log(`💰 Colocataire ${roommate.name}: ${rent}€`);
        return sum + rent;
      }, 0);
      
      // Calculer les charges réelles à partir des données de la propriété
      let monthlyCharges = 0;
      if (property.charges) {
        if (typeof property.charges === 'object' && property.charges !== null) {
          // Additionner toutes les charges de l'objet
          const chargeSum = Object.values(property.charges).reduce((sum: number, charge: unknown) => {
            const chargeValue = Number(charge) || 0;
            console.log(`💸 Charge: ${chargeValue}€`);
            return sum + chargeValue;
          }, 0);
          monthlyCharges = Number(chargeSum);
        } else {
          // Si c'est un nombre simple
          monthlyCharges = Number(property.charges) || 0;
        }
      }
      
      const profit = monthlyRevenue - monthlyCharges;
      const totalRooms = property.totalRooms || 1;
      const occupancyRate = Math.round((activeRoommates.length / totalRooms) * 100);
      
      console.log(`📊 Propriété: ${property.title}`);
      console.log(`💰 Revenus totaux: ${monthlyRevenue}€`);
      console.log(`💸 Charges totales: ${monthlyCharges}€`);
      console.log(`📈 Bénéfice net: ${profit}€`);
      console.log(`🏠 Occupation: ${activeRoommates.length}/${totalRooms} (${occupancyRate}%)`);
      
      return {
        revenue: monthlyRevenue,
        charges: monthlyCharges,
        profit,
        occupancyRate,
        occupiedRooms: activeRoommates.length,
        totalRooms
      };
    } else {
      // Pour les propriétés non-colocation
      const monthlyRevenue = Number(property.rent) || 0;
      
      let monthlyCharges = 0;
      if (property.charges) {
        if (typeof property.charges === 'object' && property.charges !== null) {
          const chargeSum = Object.values(property.charges).reduce((sum: number, charge: unknown) => {
            return sum + (Number(charge) || 0);
          }, 0);
          monthlyCharges = Number(chargeSum);
        } else {
          monthlyCharges = Number(property.charges) || 0;
        }
      }
      
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
