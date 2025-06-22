
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useToast } from '@/hooks/use-toast';

export const useOwnerQuickActions = (ownerProfile: any) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { properties = [], addProperty } = useFirebaseProperties();
  const { roommates = [], addRoommate } = useFirebaseRoommates();
  const { contracts = [] } = useFirebaseContracts();
  const { payments = [] } = useFirebasePayments();
  
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handlePropertySubmit = async (propertyData: any) => {
    try {
      console.log('Ajout de propriété:', propertyData);
      await addProperty(propertyData);
      toast({
        title: "Succès",
        description: "Propriété ajoutée avec succès",
      });
      setOpenDialog(null);
    } catch (error) {
      console.error('Error adding property:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de la propriété",
        variant: "destructive",
      });
    }
  };

  const handleRoommateSubmit = async (roommateData: any) => {
    try {
      console.log('Ajout de locataire:', roommateData);
      await addRoommate(roommateData);
      toast({
        title: "Succès",
        description: "Locataire ajouté avec succès",
      });
      setOpenDialog(null);
    } catch (error) {
      console.error('Error adding roommate:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du locataire",
        variant: "destructive",
      });
    }
  };

  const handleInspectionSubmit = (inspectionData: any) => {
    console.log('Inspection data:', inspectionData);
    toast({
      title: "Succès",
      description: "Inspection programmée avec succès",
    });
    setOpenDialog(null);
  };

  // Calculs sécurisés pour éviter les erreurs
  const ownerProperties = Array.isArray(properties) ? properties.filter(property => 
    property.owner === ownerProfile?.name || property.owner === ownerProfile?.email
  ) : [];

  const activeTenants = Array.isArray(roommates) ? roommates.filter(roommate => 
    roommate.status === 'Actif' && 
    ownerProperties.some(property => property.title === roommate.property)
  ) : [];

  const expiringContracts = Array.isArray(contracts) ? contracts.filter(contract => {
    if (!contract.endDate) return false;
    const endDate = new Date(contract.endDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length : 0;

  const pendingPayments = Array.isArray(payments) ? payments.filter(payment => 
    payment.status === 'En attente' && 
    ownerProperties.some(property => property.title === payment.property)
  ).length : 0;

  return {
    openDialog,
    setOpenDialog,
    properties,
    navigate,
    handlePropertySubmit,
    handleRoommateSubmit,
    handleInspectionSubmit,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments
  };
};
