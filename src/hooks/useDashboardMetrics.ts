
import { useMemo } from 'react';
import { useFirebaseProperties } from './useFirebaseProperties';
import { useFirebaseTenants } from './useFirebaseTenants';
import { useFirebaseRoommates } from './useFirebaseRoommates';
import { useFirebaseContracts } from './useFirebaseContracts';
import { useFirebaseInspections } from './useFirebaseInspections';
import { useFirebasePayments } from './useFirebasePayments';
import { useFirebaseCharges } from './useFirebaseCharges';

export const useDashboardMetrics = () => {
  const { properties } = useFirebaseProperties();
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();
  const { contracts } = useFirebaseContracts();
  const { inspections } = useFirebaseInspections();
  const { payments } = useFirebasePayments();
  const { charges } = useFirebaseCharges();

  const metrics = useMemo(() => {
    // Calcul des revenus de ce mois
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Calcul des revenus du mois en tenant compte des types de paiements
    const monthlyRevenue = payments
      .filter(payment => {
        if (!payment.paymentDate) return false;
        const paymentDate = new Date(payment.paymentDate);
        const isCurrentMonth = paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear;
        const isPaid = payment.status === 'Payé';
        // Inclure seulement les loyers et charges, exclure cautions et avances
        const isRegularPayment = !payment.paymentType || 
                               payment.paymentType === 'loyer' || 
                               payment.paymentType === 'charges';
        
        return isCurrentMonth && isPaid && isRegularPayment;
      })
      .reduce((sum, payment) => sum + payment.rentAmount, 0);

    // Calcul des avances et cautions (pour information)
    const advancePayments = payments
      .filter(payment => payment.paymentType === 'avance' && payment.status === 'Payé')
      .reduce((sum, payment) => sum + payment.rentAmount, 0);
    
    const securityDeposits = payments
      .filter(payment => payment.paymentType === 'caution' && payment.status === 'Payé')
      .reduce((sum, payment) => sum + payment.rentAmount, 0);

    // Nombre total de biens
    const totalProperties = properties.length;

    // Fonction pour calculer le statut réel d'une propriété
    const getPropertyStatus = (property: any) => {
      const activeRoommates = roommates.filter(roommate => 
        roommate.property === property.title && roommate.status === 'Actif'
      );

      if (property.locationType === 'Colocation') {
        const totalRooms = property.totalRooms || 0;
        const occupiedRooms = activeRoommates.length;
        const availableRooms = Math.max(0, totalRooms - occupiedRooms);
        
        if (availableRooms > 0 && occupiedRooms > 0) {
          return 'Partiellement occupé';
        } else if (occupiedRooms > 0) {
          return 'Complet';
        } else {
          return 'Libre';
        }
      } else {
        // Location classique
        return activeRoommates.length > 0 ? 'Occupé' : 'Libre';
      }
    };

    // Calculer les propriétés occupées avec le statut réel
    const occupiedProperties = properties.filter(p => {
      const realStatus = getPropertyStatus(p);
      return realStatus === 'Occupé' || realStatus === 'Complet' || realStatus === 'Partiellement occupé';
    }).length;

    // Nombre total de locataires actifs (locataires + colocataires)
    const activeTenants = tenants.filter(t => t.status === 'Actif').length;
    const activeRoommates = roommates.filter(r => r.status === 'Actif').length;
    const totalActiveTenants = activeTenants + activeRoommates;

    // Calcul du taux d'occupation
    const occupancyRate = totalProperties > 0 ? (occupiedProperties / totalProperties) * 100 : 0;

    // Calcul du rendement moyen basé sur les revenus annuels et la valeur des propriétés
    const annualRevenue = monthlyRevenue * 12;
    const totalPropertyValue = properties.reduce((sum, property) => {
      let propertyValue = 0;
      
      // Si creditImmobilier existe et est réaliste (> 50000€), l'utiliser
      if (property.creditImmobilier && parseFloat(property.creditImmobilier.toString()) > 50000) {
        propertyValue = parseFloat(property.creditImmobilier.toString());
      } else {
        // Sinon, estimer la valeur à 200x le loyer mensuel (plus réaliste que 15x annuel)
        const monthlyRent = parseFloat(property.rent || '0');
        propertyValue = monthlyRent * 200; // Estimation réaliste: 200x le loyer mensuel
      }
      
      return sum + propertyValue;
    }, 0);

    // Rendement plafonné à 15% maximum pour éviter les valeurs aberrantes
    const calculatedYield = totalPropertyValue > 0 ? (annualRevenue / totalPropertyValue) * 100 : 0;
    const averageYield = Math.min(calculatedYield, 15); // Maximum 15% de rendement

    return {
      monthlyRevenue,
      totalProperties,
      totalActiveTenants,
      occupancyRate,
      averageYield: Math.round(averageYield * 100) / 100, // Arrondir à 2 décimales
      // Nouvelles métriques pour les types de paiements
      advancePayments,
      securityDeposits,
      // Données pour les alertes
      latePayments: payments.filter(p => p.status === 'En retard').length,
      expiringContracts: contracts.filter(c => {
        if (!c.endDate) return false;
        const endDate = new Date(c.endDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      }).length,
      urgentInspections: inspections.filter(i => i.status === 'Urgent').length
    };
  }, [properties, tenants, roommates, contracts, inspections, payments, charges]);

  return metrics;
};
