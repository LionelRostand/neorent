
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const PermissionDeniedView: React.FC = () => {
  const { i18n } = useTranslation();
  const { userType, userProfile } = useAuth();

  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      adminOnly: {
        fr: 'Seuls les administrateurs peuvent gérer les actions rapides',
        en: 'Only administrators can manage quick actions'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">Permissions insuffisantes</h3>
        </div>
        
        <div className="space-y-3">
          <p className="text-gray-600 text-sm sm:text-base">{getLocalizedText('adminOnly')}</p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Informations utilisateur :</span>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Type :</strong> {userType || 'Non défini'}</p>
              <p><strong>Email :</strong> {userProfile?.email || 'Non disponible'}</p>
              <p><strong>Nom :</strong> {userProfile?.name || 'Non disponible'}</p>
              {userProfile?.permissions && (
                <div>
                  <strong>Permissions :</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.isArray(userProfile.permissions) ? (
                      userProfile.permissions.map((permission: string) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {userProfile.permissions}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>Note :</strong> Pour gérer les actions rapides, vous devez être connecté en tant qu'administrateur.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionDeniedView;
