
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, User, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LanguageSelector from '@/components/LanguageSelector';
import { useToast } from '@/hooks/use-toast';

interface OwnerSpaceProfileHeaderProps {
  currentProfile: any;
}

const OwnerSpaceProfileHeader: React.FC<OwnerSpaceProfileHeaderProps> = ({ currentProfile }) => {
  const navigate = useNavigate();
  const { userType, logout } = useAuth();
  const { t, i18n } = useTranslation(['ownerSpace', 'settings']);
  const { toast } = useToast();
  
  const handleBackToAdmin = () => {
    navigate('/admin/dashboard');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: i18n.language === 'fr' ? "Déconnexion" : "Logout",
        description: i18n.language === 'fr' ? "Vous avez été déconnecté avec succès." : "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: i18n.language === 'fr' ? "Erreur" : "Error",
        description: i18n.language === 'fr' ? "Erreur lors de la déconnexion." : "Error during logout.",
        variant: "destructive",
      });
    }
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
                {t('ownerSpace:title')}
              </h1>
              <p className="text-white/90 mt-1">
                {t('ownerSpace:welcome')}, {currentProfile?.name || t('ownerSpace:status.owner')}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Sélecteur de langue */}
            <LanguageSelector />
            
            {/* Bouton de retour pour les admins */}
            {userType === 'admin' && (
              <Button
                variant="outline"
                onClick={handleBackToAdmin}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('settings:backToAdmin')}
              </Button>
            )}

            {/* Bouton de déconnexion */}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {i18n.language === 'fr' ? 'Se déconnecter' : 'Logout'}
            </Button>
            
            <div className="hidden md:flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
              <User className="h-5 w-5" />
              <span className="font-medium">{t('ownerSpace:status.owner')}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerSpaceProfileHeader;
