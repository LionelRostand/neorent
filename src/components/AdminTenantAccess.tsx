
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
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Accès Administrateur aux Espaces Locataires
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isImpersonating ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <UserCheck className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    Consultation de l'espace de {selectedTenantProfile?.name}
                  </p>
                  <p className="text-sm text-blue-700">
                    Type: {selectedTenantProfile?.type}
                  </p>
                  <p className="text-sm text-blue-600">
                    Email: {selectedTenantProfile?.email}
                  </p>
                  <p className="text-sm text-blue-600">
                    Adresse: {selectedTenantProfile?.address}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Mode Admin
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSwitchBack}
                variant="outline"
                className="flex-1 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'administration
              </Button>
              <Button 
                onClick={handleViewTenantSpace}
                className="flex-1 flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Users className="h-4 w-4" />
                Voir l'espace locataire
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Sélectionner un locataire/colocataire
              </label>
              <Select value={selectedTenantId} onValueChange={setSelectedTenantId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un profil à consulter" />
                </SelectTrigger>
                <SelectContent>
                  {tenantProfiles.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{tenant.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {tenant.type}
                        </Badge>
                        <span className="text-xs text-gray-500">({tenant.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleSwitchToTenant}
              disabled={!selectedTenantId}
              className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Users className="h-4 w-4" />
              Accéder à l'espace locataire
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Fonctionnalité réservée à admin@neotech-consulting.com
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminTenantAccess;
