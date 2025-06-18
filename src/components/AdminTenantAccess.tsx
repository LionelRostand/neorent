
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Users, ArrowLeft, Shield } from 'lucide-react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminTenantAccess: React.FC = () => {
  const {
    isAuthorizedAdmin,
    getAllTenantProfiles,
    switchToTenantProfile,
    switchBackToAdmin,
    selectedTenantProfile,
    isImpersonating
  } = useAdminTenantAccess();
  const navigate = useNavigate();
  const [selectedTenantId, setSelectedTenantId] = useState('');

  if (!isAuthorizedAdmin) {
    console.log('User not authorized for admin access');
    return null;
  }

  const tenantProfiles = getAllTenantProfiles();
  console.log('Available tenant profiles for selection:', tenantProfiles);

  const handleSwitchToTenant = () => {
    const tenant = tenantProfiles.find(t => t.id === selectedTenantId);
    console.log('Selected tenant for switch:', { selectedTenantId, tenant });
    
    if (!tenant) {
      console.error('Tenant not found for ID:', selectedTenantId);
      toast.error('Locataire introuvable');
      return;
    }

    if (switchToTenantProfile(tenant)) {
      console.log('Successfully switched to tenant profile, navigating to tenant space');
      toast.success(`Accès à l'espace de ${tenant.name}`, {
        description: `Vous consultez maintenant l'espace ${tenant.type}`
      });
      
      // Small delay to ensure state is updated before navigation
      setTimeout(() => {
        navigate('/tenant-space');
      }, 100);
    } else {
      console.error('Failed to switch to tenant profile');
      toast.error('Erreur lors de l\'accès à l\'espace locataire');
    }
  };

  const handleSwitchBack = () => {
    console.log('Switching back to admin');
    switchBackToAdmin();
    toast.info('Retour à l\'espace administrateur');
    navigate('/admin/settings');
  };

  const handleViewTenantSpace = () => {
    console.log('Viewing tenant space with current profile:', selectedTenantProfile);
    navigate('/tenant-space');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
          <span className="break-words">Accès Administrateur aux Espaces Locataires</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        {isImpersonating ? (
          <div className="space-y-4">
            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-blue-900 text-sm sm:text-base break-words">
                      Consultation de l'espace de {selectedTenantProfile?.name}
                    </p>
                    <div className="space-y-1 mt-2">
                      <p className="text-xs sm:text-sm text-blue-700">
                        <span className="font-medium">Type:</span> {selectedTenantProfile?.type}
                      </p>
                      <p className="text-xs sm:text-sm text-blue-600 break-all">
                        <span className="font-medium">Email:</span> {selectedTenantProfile?.email}
                      </p>
                      <p className="text-xs sm:text-sm text-blue-600 break-words">
                        <span className="font-medium">Adresse:</span> {selectedTenantProfile?.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    Mode Admin
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                onClick={handleSwitchBack}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="truncate">Retour à l'administration</span>
              </Button>
              <Button 
                onClick={handleViewTenantSpace}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-sm"
              >
                <Users className="h-4 w-4" />
                <span className="truncate">Voir l'espace locataire</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium block">
                Sélectionner un locataire/colocataire
              </label>
              <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un profil à consulter" />
                </SelectTrigger>
                <SelectContent>
                  {tenantProfiles.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 py-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{tenant.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {tenant.type}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500 break-all">({tenant.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleSwitchToTenant}
              disabled={!selectedTenantId}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Users className="h-4 w-4" />
              <span>Accéder à l'espace locataire</span>
            </Button>
            
            <p className="text-xs text-gray-500 text-center break-words">
              Fonctionnalité réservée à admin@neotech-consulting.com
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTenantAccess;
