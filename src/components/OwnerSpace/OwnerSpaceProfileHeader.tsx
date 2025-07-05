
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
  const { userType, logout, user } = useAuth();
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

  // Déterminer si c'est un admin qui accède à l'espace propriétaire
  const isAdminAccessingOwnerSpace = isAuthorizedAdmin || userType === 'admin';
  const isAdmin = user?.email === 'admin@neotech-consulting.com';
  
  // Nom de l'admin connecté
  const adminName = isAdmin ? 'Lionel DJOSSA' : (user?.displayName || user?.email || 'Administrateur');
  
  // Nom du propriétaire de l'espace
  const ownerName = currentProfile?.name || t('profile.owner');
  
  // Affichage du nom principal - Corriger la logique pour éviter la répétition
  const displayName = isAdminAccessingOwnerSpace && currentProfile ? 
    (adminName !== ownerName ? `${adminName} → ${ownerName}` : adminName) : 
    ownerName;
  
  // Email à afficher
  const displayEmail = isAdminAccessingOwnerSpace ? 
    user?.email || 'admin@neotech-consulting.com' : 
    (currentProfile?.email || 'Non spécifié');
  
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

  // Afficher les informations du propriétaire si l'admin accède à l'espace
  const getOwnerInfo = () => {
    if (isAdminAccessingOwnerSpace && currentProfile && adminName !== ownerName) {
      return (
        <div className="mt-2 p-2 sm:p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
          <p className="text-xs sm:text-sm text-blue-800 font-medium mb-1">
            {i18n.language === 'fr' ? 'Espace propriétaire :' : 'Owner space:'}
          </p>
          <p className="text-xs sm:text-sm text-blue-700 font-medium break-words">
            {currentProfile.name}
          </p>
          <p className="text-xs text-blue-600 break-all">
            {currentProfile.email}
          </p>
          {currentProfile.type && (
            <p className="text-xs text-blue-600 mt-1">
              {i18n.language === 'fr' ? 'Type :' : 'Type:'} {currentProfile.type}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white px-2 sm:px-4 lg:px-6 py-2 sm:py-4 flex-shrink-0 border-b">
      <div className="flex flex-col gap-2 sm:gap-3">
        {/* Profile Information - Stack on mobile, side by side on larger screens */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
          {/* Main profile info */}
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 break-words leading-tight">
              {displayName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 break-all mt-0.5 sm:mt-1">
              {displayEmail}
            </p>
            {/* Role badge - mobile friendly */}
            <div className="mt-1 sm:mt-2">
              <span className="inline-block text-xs sm:text-sm text-blue-600 font-medium px-2 py-1 bg-blue-50 rounded-md">
                {displayRole}
              </span>
            </div>
            {getAdminBadge()}
          </div>
          
          {/* Action Buttons - Stack on mobile */}
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3 w-full xs:w-auto">
            {/* Language Selector - full width on mobile */}
            <div className="w-full xs:w-auto">
              <LanguageSelector />
            </div>

            {/* Buttons row */}
            <div className="flex gap-2 w-full xs:w-auto">
              {/* Bouton de retour pour les admins */}
              {(userType === 'admin' || isAuthorizedAdmin) && (
                <Button
                  variant="outline"
                  onClick={handleBackToAdmin}
                  className="flex-1 xs:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 min-w-0"
                >
                  <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">Admin</span>
                  <span className="sm:hidden truncate">Admin</span>
                </Button>
              )}

              {/* Bouton de déconnexion */}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex-1 xs:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border-red-200 text-red-600 hover:bg-red-50 min-w-0"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">{t('profile.logout')}</span>
                <span className="sm:hidden truncate">{i18n.language === 'fr' ? 'Sortir' : 'Out'}</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Owner info section */}
        {getOwnerInfo()}
      </div>
    </div>
  );
};

export default OwnerSpaceProfileHeader;
