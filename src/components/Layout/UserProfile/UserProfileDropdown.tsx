
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

export const UserProfileDropdown = () => {
  const { user, logout, userProfile, userType } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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
                  {userType === 'admin' ? 'Administrateur' : 'Employé'}
                </p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {isAdminOrEmployee && (
            <>
              <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
                <UserCheck className="mr-2 h-4 w-4" />
                <span>Mon profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTenantSpaceAccess}>
                <Home className="mr-2 h-4 w-4" />
                <span>Espace locataire</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem onClick={() => setIsPasswordDialogOpen(true)}>
            <Lock className="mr-2 h-4 w-4" />
            <span>Changer le mot de passe</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
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
