
import React, { useState } from 'react';
import { User, Settings, LogOut, Lock, UserCheck, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ProfileDialog } from './ProfileDialog';
import { PasswordChangeDialog } from './PasswordChangeDialog';
import { useTranslation } from 'react-i18next';

export const UserProfileDropdown = () => {
  const { user, logout, userProfile, userType } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Déconnexion",
        description: "Vous avez été déconnecté avec succès.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  const handleTenantSpaceAccess = () => {
    navigate('/tenant-space');
  };

  const isAdminOrEmployee = userType === 'admin' || userType === 'employee';

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      myProfile: {
        fr: 'Mon profil',
        en: 'My Profile'
      },
      changePassword: {
        fr: 'Changer mot de passe',
        en: 'Change Password'
      },
      tenantSpace: {
        fr: 'Espace locataire',
        en: 'Tenant Space'
      },
      logout: {
        fr: 'Déconnexion',
        en: 'Logout'
      },
      administrator: {
        fr: 'Administrateur',
        en: 'Administrator'
      },
      employee: {
        fr: 'Employé',
        en: 'Employee'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {userProfile?.name || user.displayName || 'Utilisateur'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              {isAdminOrEmployee && (
                <p className="text-xs leading-none text-blue-600 font-medium">
                  {userType === 'admin' ? getLocalizedText('administrator') : getLocalizedText('employee')}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {isAdminOrEmployee && (
            <>
              <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
                <UserCheck className="mr-2 h-4 w-4" />
                <span>{getLocalizedText('myProfile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsPasswordDialogOpen(true)}>
                <Lock className="mr-2 h-4 w-4" />
                <span>{getLocalizedText('changePassword')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTenantSpaceAccess}>
                <Home className="mr-2 h-4 w-4" />
                <span>{getLocalizedText('tenantSpace')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{getLocalizedText('logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        user={user}
        userProfile={userProfile}
        userType={userType}
      />

      <PasswordChangeDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        user={user}
      />
    </>
  );
};
