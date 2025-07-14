
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, LogOut, KeyRound } from 'lucide-react';
import { ProfileDialog } from './ProfileDialog';
import { PasswordChangeDialog } from './PasswordChangeDialog';

export const UserProfileDropdown = () => {
  const { t } = useTranslation();
  const { user, logout, userProfile, userType } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const names = name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Utiliser le nom du profil géré ou définir explicitement pour l'admin
  const isAdmin = user.email === 'admin@neotech-consulting.com';
  const displayName = isAdmin ? 'Lionel DJOSSA' : (userProfile?.name || user.displayName || user.email || t('profile.unknownUser'));

  // Vérifier si l'utilisateur peut changer son mot de passe
  const canChangePassword = userType === 'owner' || userType === 'admin';

  // Déterminer le type d'utilisateur à afficher avec traduction
  const getRoleTranslation = (role: string) => {
    if (role === 'admin') return t('profile.administrator');
    if (role === 'owner' || role === 'employee') return t('profile.owner');
    if (role === 'tenant' || role === 'locataire') return t('profile.tenant');
    if (role === 'roommate' || role === 'colocataire') return t('profile.roommate');
    return t('profile.owner');
  };

  const displayUserType = getRoleTranslation(isAdmin ? 'admin' : userType);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                {getInitials(displayName, user.email)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium text-sm">{displayName}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              {displayUserType && (
                <p className="text-xs text-blue-600">
                  {displayUserType}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowProfile(true)}>
            <User className="mr-2 h-4 w-4" />
            {t('profile.viewProfile')}
          </DropdownMenuItem>
          {canChangePassword && (
            <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
              <KeyRound className="mr-2 h-4 w-4" />
              {t('profile.changePassword')}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('profile.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {user && (
        <ProfileDialog
          open={showProfile}
          onOpenChange={setShowProfile}
          user={user}
          userProfile={userProfile}
          userType={userType}
        />
      )}

      {canChangePassword && user && (
        <PasswordChangeDialog
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
          user={user}
        />
      )}
    </>
  );
};
