import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Eye, User, Mail, Phone, ArrowRight } from 'lucide-react';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useNavigate } from 'react-router-dom';

const OwnerImpersonationPanel: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { 
    getAllOwnerProfiles, 
    switchToOwnerProfile, 
    isAuthorizedAdmin 
  } = useAdminTenantAccess();

  const ownerProfiles = getAllOwnerProfiles();

  const handleViewOwnerSpace = (ownerProfile: any) => {
    if (!isAuthorizedAdmin) {
      console.error('Accès non autorisé');
      return;
    }

    console.log('Admin viewing owner space for:', ownerProfile.name, ownerProfile);
    
    // Basculer vers le profil du propriétaire
    const success = switchToOwnerProfile(ownerProfile);
    
    if (success) {
      console.log('✅ Navigation vers owner-space avec profil:', ownerProfile.name);
      navigate('/owner-space');
    } else {
      console.error('❌ Échec du changement de profil vers:', ownerProfile.name);
    }
  };

  if (!isAuthorizedAdmin) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Consultation des Espaces Propriétaires
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Consultez l'espace propriétaire de chaque propriétaire pour voir leurs données
        </p>
      </CardHeader>
      <CardContent>
        {ownerProfiles.length === 0 ? (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun propriétaire trouvé</p>
            <p className="text-sm text-gray-400">
              Les propriétaires apparaîtront ici une fois qu'ils seront inscrits
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownerProfiles.map((owner) => (
              <Card key={owner.id} className="border border-gray-200 hover:border-green-300 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{owner.name}</h3>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Propriétaire
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{owner.email}</span>
                    </div>
                    
                    {(owner as any).phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{(owner as any).phone}</span>
                      </div>
                    )}
                    
                    {(owner as any).company && (
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Building className="h-3 w-3" />
                        <span className="truncate">{(owner as any).company}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleViewOwnerSpace(owner)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Consulter l'espace
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OwnerImpersonationPanel;