
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useToast } from '@/hooks/use-toast';
import LanguageSelector from '@/components/LanguageSelector';

interface OwnerSpaceProfileHeaderProps {
  currentProfile: any;
}

const OwnerSpaceProfileHeader: React.FC<OwnerSpaceProfileHeaderProps> = ({ currentProfile }) => {
  const navigate = useNavigate();
  const { userType, logout } = useAuth();
  const { isAuthorizedAdmin } = useAdminTenantAccess();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  
  const handleBackToAdmin = () => {
    navigate('/admin/dashboard');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('profile.logout'),
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

  // Debug: Log current profile data
  console.log('OwnerSpaceProfileHeader - currentProfile:', currentProfile);
  console.log('OwnerSpaceProfileHeader - userType:', userType);
  console.log('OwnerSpaceProfileHeader - isAuthorizedAdmin:', isAuthorizedAdmin);

  // Determine display name and email - prioritize admin profile
  const displayName = currentProfile?.name || t('profile.owner');
  const displayEmail = currentProfile?.email || 'Non spécifié';
  
  // Display role - ensure admin shows correctly
  const getRoleTranslation = (role: string, type: string) => {
    // Si c'est un admin autorisé, toujours afficher "Administrateur"
    if (isAuthorizedAdmin || type === 'admin' || role === 'admin') {
      return t('profile.administrator');
    }
    if (role === 'employee' || role === 'owner') return t('profile.owner');
    if (role === 'tenant' || role === 'locataire') return t('profile.tenant');
    if (role === 'roommate' || role === 'colocataire') return t('profile.roommate');
    return t('profile.owner'); // default to owner
  };
  
  const displayRole = getRoleTranslation(currentProfile?.role || 'admin', currentProfile?.type || userType);

  // Afficher un badge spécial pour les admins avec pleins droits
  const getAdminBadge = () => {
    if (isAuthorizedAdmin || userType === 'admin') {
      return (
        <p className="text-xs text-green-600 mt-1 font-semibold">
          {i18n.language === 'fr' ? '• Pleins droits administrateur' : '• Full admin rights'}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="bg-white px-4 sm:px-6 py-4 flex-shrink-0 border-b">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            {displayName}
          </h2>
          <p className="text-sm text-gray-500 truncate">
            {displayEmail}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {displayRole}
          </p>
          {getAdminBadge()}
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Sélecteur de langue */}
          <LanguageSelector />

          {/* Bouton de retour pour les admins */}
          {(userType === 'admin' || isAuthorizedAdmin) && (
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
            <span className="hidden sm:inline">{t('profile.logout')}</span>
            <span className="sm:hidden">{i18n.language === 'fr' ? 'Sortir' : 'Out'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OwnerSpaceProfileHeader;
