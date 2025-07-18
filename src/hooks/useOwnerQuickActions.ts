
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebaseInspections } from '@/hooks/useFirebaseInspections';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useOwnerData } from '@/hooks/useOwnerData';

export const useOwnerQuickActions = (ownerProfile: any) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  
  const { addProperty } = useFirebaseProperties();
  const { addRoommate } = useFirebaseRoommates();
  const { addTenant } = useFirebaseTenants();
  const { addContract } = useFirebaseContracts();
  const { addInspection } = useFirebaseInspections();
  const { addPayment } = useFirebasePayments();
  const { createUserAccount } = useFirebaseAuth();
  
  // Get owner data
  const { properties, tenants, contracts, payments } = useOwnerData(ownerProfile);
  
  // Calculate metrics
  const ownerProperties = properties;
  const activeTenants = tenants.filter(t => t.status === 'Actif');
  const expiringContracts = contracts.filter(c => {
    const endDate = new Date(c.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;
  const pendingPayments = payments.filter(p => p.status === 'En attente').length;

  // Enhanced navigate function that handles admin paths
  const enhancedNavigate = (path: string) => {
    console.log('Enhanced navigate called with path:', path);
    
    // Since we're in OwnerSpace context, we should NOT navigate away from the owner space
    // Instead, we should use the setActiveView function if available
    // This function will be overridden by components that provide a setActiveView function
    if (path.startsWith('/admin/')) {
      console.log('Admin path detected, should use setActiveView instead of navigate');
      // This will be handled by the component that calls this hook
      return;
    } else {
      // For other paths, use the original navigate
      navigate(path);
    }
  };

  const handlePropertySubmit = async (propertyData: any) => {
    try {
      const propertyWithOwner = {
        ...propertyData,
        owner: ownerProfile?.name || ownerProfile?.email || 'Unknown',
        createdAt: new Date().toISOString()
      };
      
      await addProperty(propertyWithOwner);
      
      toast({
        title: "Propriété ajoutée",
        description: "La propriété a été ajoutée avec succès.",
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de la propriété:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout de la propriété",
        variant: "destructive",
      });
    }
  };

  const handleRoommateSubmit = async (roommateData: any) => {
    try {
      const roommateWithOwner = {
        ...roommateData,
        owner: ownerProfile?.name || ownerProfile?.email || 'Unknown',
        createdAt: new Date().toISOString()
      };
      
      await addRoommate(roommateWithOwner);
      
      toast({
        title: "Colocataire ajouté",
        description: "Le colocataire a été ajouté avec succès.",
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du colocataire:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout du colocataire",
        variant: "destructive",
      });
    }
  };

  const handleTenantSubmit = async (tenantData: any) => {
    try {
      // Créer le compte utilisateur si un mot de passe est fourni
      if (tenantData.password) {
        try {
          await createUserAccount(tenantData.email, tenantData.password);
        } catch (authError: any) {
          // Si l'email existe déjà, continuer quand même avec l'ajout du locataire
          if (authError.message?.includes('déjà utilisé')) {
            console.warn('Email déjà utilisé, mais continuation de l\'ajout du locataire');
            toast({
              title: "Attention",
              description: "L'email est déjà utilisé, mais le locataire a été ajouté avec succès.",
              variant: "default",
            });
          } else {
            throw authError;
          }
        }
      }

      const { password, ...tenantDataWithoutPassword } = tenantData;
      const tenantWithOwner = {
        ...tenantDataWithoutPassword,
        owner: ownerProfile?.name || ownerProfile?.email || 'Unknown',
        createdAt: new Date().toISOString()
      };
      
      await addTenant(tenantWithOwner);
      
      toast({
        title: "Locataire ajouté",
        description: "Le locataire a été ajouté avec succès.",
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du locataire:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout du locataire",
        variant: "destructive",
      });
    }
  };

  const handleContractSubmit = async (contractData: any) => {
    try {
      const contractWithOwner = {
        ...contractData,
        owner: ownerProfile?.name || ownerProfile?.email || 'Unknown',
        createdAt: new Date().toISOString()
      };
      
      await addContract(contractWithOwner);
      
      toast({
        title: "Contrat ajouté",
        description: "Le contrat a été ajouté avec succès.",
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du contrat:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout du contrat",
        variant: "destructive",
      });
    }
  };

  const handleInspectionSubmit = async (inspectionData: any) => {
    try {
      const inspectionWithOwner = {
        ...inspectionData,
        owner: ownerProfile?.name || ownerProfile?.email || 'Unknown',
        createdAt: new Date().toISOString()
      };
      
      await addInspection(inspectionWithOwner);
      
      toast({
        title: "Inspection ajoutée",
        description: "L'inspection a été ajoutée avec succès.",
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout de l\'inspection:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout de l'inspection",
        variant: "destructive",
      });
    }
  };

  const handlePaymentSubmit = async (paymentData: any) => {
    try {
      const paymentWithOwner = {
        ...paymentData,
        owner: ownerProfile?.name || ownerProfile?.email || 'Unknown',
        createdAt: new Date().toISOString()
      };
      
      await addPayment(paymentWithOwner);
      
      toast({
        title: "Paiement ajouté",
        description: "Le paiement a été ajouté avec succès.",
      });
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du paiement:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout du paiement",
        variant: "destructive",
      });
    }
  };

  return {
    // Dialog state
    openDialog,
    setOpenDialog,
    
    // Navigation - use enhanced navigate
    navigate: enhancedNavigate,
    
    // Data
    properties,
    ownerProperties,
    activeTenants,
    expiringContracts,
    pendingPayments,
    
    // Submit handlers
    handlePropertySubmit,
    handleRoommateSubmit,
    handleTenantSubmit,
    handleContractSubmit,
    handleInspectionSubmit,
    handlePaymentSubmit
  };
};
