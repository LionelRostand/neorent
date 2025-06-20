
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import PropertyDetailsHeader from './PropertyDetails/PropertyDetailsHeader';
import PropertyProfitabilitySection from './PropertyDetails/PropertyProfitabilitySection';
import PropertyConfigurationSection from './PropertyDetails/PropertyConfigurationSection';
import PropertyOccupantsList from './PropertyDetails/PropertyOccupantsList';

interface Property {
  id: string;
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  status: string;
  tenant: string | null;
  image: string;
  locationType: string;
  totalRooms?: number | null;
  availableRooms?: number | null;
  creditImmobilier?: string;
  floor?: string;
  charges?: {
    electricity?: number;
    water?: number;
    heating?: number;
    maintenance?: number;
    insurance?: number;
    garbage?: number;
    internet?: number;
    taxes?: number;
  };
}

interface Occupant {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'Locataire principal' | 'Colocataire';
  roomNumber?: string;
  rentAmount?: string;
}

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({ property, isOpen, onClose }) => {
  const { roommates } = useFirebaseRoommates();

  if (!property) return null;

  // Récupérer les vrais occupants de cette propriété
  const getOccupants = (property: Property): Occupant[] => {
    const occupants: Occupant[] = [];
    
    // Récupérer les colocataires de cette propriété
    const propertyRoommates = roommates.filter(roommate => 
      roommate.property === property.title && roommate.status === 'Actif'
    );

    propertyRoommates.forEach(roommate => {
      occupants.push({
        id: roommate.id,
        name: roommate.name,
        email: roommate.email,
        phone: roommate.phone,
        type: roommate.primaryTenant ? 'Locataire principal' : 'Colocataire',
        roomNumber: roommate.roomNumber,
        rentAmount: roommate.rentAmount
      });
    });

    return occupants;
  };

  const occupants = getOccupants(property);

  // Calculer le statut d'occupation et les chambres disponibles
  const getOccupancyInfo = () => {
    if (property.locationType === 'Colocation') {
      const totalRooms = property.totalRooms || 0;
      const occupiedRooms = occupants.length;
      const availableRooms = Math.max(0, totalRooms - occupiedRooms);
      
      return {
        status: availableRooms > 0 ? 'Partiellement occupé' : 'Complet',
        availableRooms,
        totalRooms,
        occupiedRooms
      };
    } else {
      // Location classique
      return {
        status: occupants.length > 0 ? 'Occupé' : 'Libre',
        availableRooms: 0,
        totalRooms: 1,
        occupiedRooms: occupants.length
      };
    }
  };

  const occupancyInfo = getOccupancyInfo();

  // Calculer les revenus totaux de cette propriété
  const calculateTotalRevenue = () => {
    return occupants.reduce((total, occupant) => {
      if (occupant.rentAmount) {
        const amount = parseFloat(occupant.rentAmount.replace(/[^0-9.-]+/g, ''));
        return total + (isNaN(amount) ? 0 : amount);
      }
      return total;
    }, 0);
  };

  // Calculer les charges totales à partir des données de la propriété
  const calculateTotalCharges = () => {
    if (!property.charges) return 0;
    
    const total = Object.values(property.charges).reduce((sum, value) => {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
      return sum + numValue;
    }, 0);
    
    return isNaN(total) ? 0 : total;
  };

  const totalRevenue = calculateTotalRevenue();
  const totalCharges = calculateTotalCharges();
  const profit = totalRevenue - totalCharges;

  // Fonction pour calculer le taux d'occupation en pourcentage
  const calculateOccupancyRate = () => {
    if (property.locationType === 'Colocation') {
      const totalRooms = property.totalRooms || 0;
      const occupiedRooms = occupants.length;
      if (totalRooms === 0) return 0;
      return Math.round((occupiedRooms / totalRooms) * 100);
    } else {
      // Location classique: 100% si occupé, 0% si libre
      return occupants.length > 0 ? 100 : 0;
    }
  };

  const occupancyRate = calculateOccupancyRate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{property.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image et informations principales */}
          <PropertyDetailsHeader 
            property={property}
            occupancyInfo={occupancyInfo}
            occupantsCount={occupants.length}
          />

          {/* Rentabilité et bénéfices */}
          <PropertyProfitabilitySection
            totalRevenue={totalRevenue}
            totalCharges={totalCharges}
            profit={profit}
            occupancyRate={occupancyRate}
            occupantsCount={occupants.length}
          />

          {/* Configuration du bien */}
          <PropertyConfigurationSection
            property={property}
            occupancyInfo={occupancyInfo}
            occupantsCount={occupants.length}
          />

          {/* Liste des occupants */}
          <PropertyOccupantsList occupants={occupants} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailsModal;
