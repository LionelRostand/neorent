
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building, Users, ArrowLeft, Shield } from 'lucide-react';
import { useAdminOwnerAccess } from '@/hooks/useAdminOwnerAccess';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminOwnerAccess: React.FC = () => {
  const { t } = useTranslation();
  const {
    isAuthorizedAdmin,
    getAllOwnerProfiles,
    switchToOwnerProfile,
    switchBackToAdmin,
    selectedOwnerProfile,
    isImpersonating
  } = useAdminOwnerAccess();
  const navigate = useNavigate();
  const [selectedOwnerId, setSelectedOwnerId] = useState('');

  if (!isAuthorizedAdmin) {
    console.log('User not authorized for admin owner access');
    return null;
  }

  const ownerProfiles = getAllOwnerProfiles();
  console.log('Available owner profiles for selection:', ownerProfiles);

  const handleSwitchToOwner = () => {
    const owner = ownerProfiles.find(o => o.id === selectedOwnerId);
    console.log('Selected owner for switch:', { selectedOwnerId, owner });
    
    if (!owner) {
      console.error('Owner not found for ID:', selectedOwnerId);
      toast.error('Propriétaire introuvable');
      return;
    }

    if (switchToOwnerProfile(owner)) {
      console.log('Successfully switched to owner profile, navigating to owner space');
      toast.success(`Accès à l'espace propriétaire de ${owner.name}`, {
        description: 'Consultation en mode administrateur'
      });
      
      // Small delay to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/owner-space');
      }, 100);
    } else {
      console.error('Failed to switch to owner profile');
      toast.error('Erreur lors de l\'accès à l\'espace propriétaire');
    }
  };

  const handleSwitchBack = () => {
    console.log('Switching back to admin');
    switchBackToAdmin();
    toast.info('Retour au mode administrateur');
    navigate('/admin/settings');
  };

  const handleViewOwnerSpace = () => {
    console.log('Viewing owner space with current profile:', selectedOwnerProfile);
    navigate('/owner-space');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex flex-col gap-2 text-sm sm:text-base md:text-lg">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            <span className="break-words leading-tight text-xs sm:text-sm md:text-base">
              Accès Espace Propriétaire
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6">
        {isImpersonating ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Building className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
                    <div className="space-y-2">
                      <h3 className="font-medium text-green-900 text-xs sm:text-sm md:text-base break-words leading-tight">
                        Consultation espace propriétaire - {selectedOwnerProfile?.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            Mode Admin
                          </Badge>
                          <Button 
                            onClick={handleSwitchBack}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-xs px-2 py-1 h-7 sm:h-8 flex-shrink-0"
                          >
                            <ArrowLeft className="h-3 w-3" />
                            <span className="hidden xs:inline">Retour</span>
                            <span className="xs:hidden">Retour</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/50 rounded-md p-2 sm:p-3 space-y-1">
                      <p className="text-xs sm:text-sm text-green-700">
                        <span className="font-medium">Consultation en tant qu'administrateur</span>
                      </p>
                      <div className="space-y-0.5 sm:space-y-1 text-xs">
                        <p className="text-green-700">
                          <span className="font-medium">Type:</span> Propriétaire
                        </p>
                        <p className="text-green-600 break-all">
                          <span className="font-medium">Email:</span> {selectedOwnerProfile?.email}
                        </p>
                        <p className="text-green-600 break-words">
                          <span className="font-medium">Rôle:</span> {selectedOwnerProfile?.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleViewOwnerSpace}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-xs sm:text-sm min-h-[40px] sm:min-h-[44px]"
              >
                <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="truncate">Voir l'espace propriétaire</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium block">
                Sélectionner un propriétaire
              </label>
              <Select value={selectedOwnerId} onValueChange={setSelectedOwnerId}>
                <SelectTrigger className="w-full text-xs sm:text-sm">
                  <SelectValue placeholder="Choisir un propriétaire à consulter" />
                </SelectTrigger>
                <SelectContent>
                  {ownerProfiles.map((owner) => (
                    <SelectItem key={owner.id} value={owner.id.toString()}>
                      <div className="flex flex-col gap-1 py-1 w-full">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs sm:text-sm">{owner.name}</span>
                          <Badge variant="outline" className="text-xs">
                            Propriétaire
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500 break-all">({owner.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleSwitchToOwner}
              disabled={!selectedOwnerId}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-xs sm:text-sm min-h-[40px] sm:min-h-[44px]"
            >
              <Building className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Accéder à l'espace propriétaire</span>
            </Button>
            
            <p className="text-xs text-gray-500 text-center break-words">
              Fonctionnalité réservée aux administrateurs
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminOwnerAccess;
