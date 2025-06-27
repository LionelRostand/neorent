
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/LanguageSelector';

interface OwnerSpaceProfileHeaderProps {
  currentProfile: any;
}

const OwnerSpaceProfileHeader: React.FC<OwnerSpaceProfileHeaderProps> = ({ currentProfile }) => {
  const navigate = useNavigate();
  const { userType, logout } = useAuth();
  const { t, i18n } = useTranslation();
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
    <div className="bg-white px-4 sm:px-6 py-4 flex-shrink-0 border-b">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            {currentProfile?.name || t('ownerSpace.owner')}
          </h2>
          <p className="text-sm text-gray-500 truncate">
            {currentProfile?.email || t('ownerSpace.ownerSpace')}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Sélecteur de langue */}
          <LanguageSelector />

          {/* Bouton de retour pour les admins */}
          {userType === 'admin' && (
            <Button
              variant="outline"
              onClick={handleBackToAdmin}
              className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{t('settings.backToAdmin')}</span>
              <span className="sm:hidden">Admin</span>
            </Button>
          )}

          {/* Bouton de déconnexion */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">{i18n.language === 'fr' ? 'Se déconnecter' : 'Logout'}</span>
            <span className="sm:hidden">{i18n.language === 'fr' ? 'Sortir' : 'Out'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OwnerSpaceProfileHeader;
