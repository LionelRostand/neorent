
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, FileText, Users, Home, Calculator, Wrench } from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';
import RoommateForm from '@/components/RoommateForm';
import InspectionForm from '@/components/InspectionForm';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseContracts } from '@/hooks/useFirebaseContracts';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';
import { useToast } from '@/hooks/use-toast';

interface OwnerQuickActionsProps {
  ownerProfile: any;
}

const OwnerQuickActions: React.FC<OwnerQuickActionsProps> = ({ ownerProfile }) => {
  const { t } = useTranslation();
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

  const quickActions = [
    {
      id: 'property',
      title: "Nouvelle propriété",
      description: "Ajouter un bien",
      icon: Plus,
      color: 'bg-blue-500',
      action: () => {
        console.log('Opening property dialog');
        setOpenDialog('property');
      },
      preview: `${ownerProperties.length} propriétés`,
      navigationAction: () => navigate('/admin/properties')
    },
    {
      id: 'contract',
      title: "Nouveau contrat",
      description: "Créer un bail",
      icon: FileText,
      color: 'bg-green-500',
      action: () => {
        console.log('Navigating to contracts');
        navigate('/admin/contracts');
      },
      preview: `${expiringContracts} contrats expirent bientôt`,
      navigationAction: () => navigate('/admin/contracts')
    },
    {
      id: 'tenant',
      title: "Ajouter locataire",
      description: "Enregistrer un locataire",
      icon: Users,
      color: 'bg-purple-500',
      action: () => {
        console.log('Opening tenant dialog');
        setOpenDialog('roommate');
      },
      preview: `${activeTenants.length} locataires actifs`,
      navigationAction: () => navigate('/admin/roommates')
    },
    {
      id: 'inspection',
      title: "État des lieux",
      description: "Programmer une visite",
      icon: Home,
      color: 'bg-orange-500',
      action: () => {
        console.log('Opening inspection dialog');
        setOpenDialog('inspection');
      },
      preview: '2 inspections programmées',
      navigationAction: () => navigate('/admin/inspections')
    },
    {
      id: 'charges',
      title: "Calculer charges",
      description: "Révision annuelle",
      icon: Calculator,
      color: 'bg-indigo-500',
      action: () => {
        console.log('Navigating to rental charges');
        navigate('/admin/rental-charges');
      },
      preview: `${pendingPayments} paiements en attente`,
      navigationAction: () => navigate('/admin/rental-charges')
    },
    {
      id: 'maintenance',
      title: "Maintenance",
      description: "Demande d'intervention",
      icon: Wrench,
      color: 'bg-red-500',
      action: () => {
        console.log('Navigating to maintenance');
        navigate('/admin/maintenance');
      },
      preview: '1 demande urgente',
      navigationAction: () => navigate('/admin/maintenance')
    }
  ];

  return (
    <>
      <Card className="h-fit w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Plus className="h-4 w-4" />
            Actions rapides
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-4 pt-0">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-gray-50 rounded-lg border-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log(`Clicking action: ${action.id}`);
                  action.action();
                }}
              >
                <div className="flex items-center space-x-3 w-full min-w-0">
                  <div className={`p-2 rounded-lg ${action.color} text-white flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-left flex-1 min-w-0 overflow-hidden">
                    <p className="font-medium text-gray-900 text-sm leading-tight truncate">{action.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{action.description}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">{action.preview}</p>
                  </div>
                </div>
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Property Form Dialog */}
      {openDialog === 'property' && (
        <Dialog open={true} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle propriété</DialogTitle>
            </DialogHeader>
            <PropertyForm 
              onSubmit={handlePropertySubmit}
              onClose={() => setOpenDialog(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Roommate Form Dialog */}
      {openDialog === 'roommate' && (
        <Dialog open={true} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau locataire</DialogTitle>
            </DialogHeader>
            <RoommateForm 
              onSubmit={handleRoommateSubmit}
              onClose={() => setOpenDialog(null)}
              properties={properties}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Inspection Form Dialog */}
      {openDialog === 'inspection' && (
        <Dialog open={true} onOpenChange={() => setOpenDialog(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Programmer un état des lieux</DialogTitle>
            </DialogHeader>
            <InspectionForm 
              onSubmit={handleInspectionSubmit}
              onClose={() => setOpenDialog(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default OwnerQuickActions;
