
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { PropertyDetailsContent } from './PropertyDetailsContent';
import { VisitSchedulingForm } from './VisitSchedulingForm';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';

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
  const { payments } = useFirebasePayments();

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

  // Calculs financiers dynamiques basés sur les paiements réels du mois en cours
  const getFinancialMetrics = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11
    const currentYear = currentDate.getFullYear();
    
    // Filtrer les paiements pour cette propriété et le mois en cours
    const currentMonthPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate || payment.dueDate);
      const paymentMonth = paymentDate.getMonth();
      const paymentYear = paymentDate.getFullYear();
      
      // Vérifier si c'est le bon mois/année et la bonne propriété
      return paymentMonth === currentMonth && 
             paymentYear === currentYear &&
             payment.property === property.title &&
             payment.status === 'Payé';
    });
    
    console.log(`📅 Mois en cours: ${currentMonth + 1}/${currentYear}`);
    console.log(`🏠 Propriété: ${property.title}`);
    console.log(`💳 Paiements trouvés pour ce mois:`, currentMonthPayments.length);
    
    if (property.locationType === 'Colocation') {
      // Calculer les revenus réels à partir des paiements du mois
      const monthlyRevenue = currentMonthPayments.reduce((sum, payment) => {
        if (payment.paymentType === 'loyer') {
          const amount = Number(payment.paidAmount || payment.rentAmount) || 0;
          console.log(`💰 Paiement loyer de ${payment.tenantName}: ${amount}€`);
          return sum + amount;
        }
        return sum;
      }, 0);
      
      // Calculer les charges réelles payées ce mois
      const monthlyCharges = currentMonthPayments.reduce((sum, payment) => {
        if (payment.paymentType === 'charges') {
          const amount = Number(payment.paidAmount || payment.rentAmount) || 0;
          console.log(`💸 Paiement charges de ${payment.tenantName}: ${amount}€`);
          return sum + amount;
        }
        return sum;
      }, 0);
      
      const profit = monthlyRevenue - monthlyCharges;
      
      // Calcul du taux d'occupation basé sur les colocataires actifs
      const activeRoommates = roommates.filter(
        roommate => roommate.property === property.title && roommate.status === 'Actif'
      );
      const totalRooms = property.totalRooms || 1;
      const occupancyRate = Math.round((activeRoommates.length / totalRooms) * 100);
      
      console.log(`📊 Revenus réels du mois: ${monthlyRevenue}€`);
      console.log(`💸 Charges réelles du mois: ${monthlyCharges}€`);
      console.log(`📈 Bénéfice net réel: ${profit}€`);
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
      const monthlyRevenue = currentMonthPayments
        .filter(p => p.paymentType === 'loyer')
        .reduce((sum, payment) => sum + (Number(payment.paidAmount || payment.rentAmount) || 0), 0);
      
      const monthlyCharges = currentMonthPayments
        .filter(p => p.paymentType === 'charges')
        .reduce((sum, payment) => sum + (Number(payment.paidAmount || payment.rentAmount) || 0), 0);
      
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
