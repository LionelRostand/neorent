
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface OwnerSpaceHeaderProps {
  ownerProfile: any;
}

const OwnerSpaceHeader: React.FC<OwnerSpaceHeaderProps> = ({ ownerProfile }) => {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const { t } = useTranslation();
  
  const handleBackToAdmin = () => {
    navigate('/admin/dashboard');
  };

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Building className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Espace Propriétaire
              </h1>
              <p className="text-white/90 mt-1">
                Bienvenue, {ownerProfile?.name || 'Propriétaire'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Bouton de retour pour les admins */}
            {userType === 'admin' && (
              <Button
                variant="outline"
                onClick={handleBackToAdmin}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('settings.backToAdmin')}
              </Button>
            )}
            <div className="hidden md:flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
              <User className="h-5 w-5" />
              <span className="font-medium">{ownerProfile?.role || 'Propriétaire'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerSpaceHeader;
