
import React from 'react';
import { User } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  userProfile: any | null;
  userType: 'locataire' | 'colocataire' | 'admin' | 'owner' | null;
}

export const ProfileDialog = ({ 
  open, 
  onOpenChange, 
  user, 
  userProfile, 
  userType 
}: ProfileDialogProps) => {
  const { t, i18n } = useTranslation();

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      myProfile: {
        fr: 'Mon profil',
        en: 'My Profile'
      },
      name: {
        fr: 'Nom',
        en: 'Name'
      },
      email: {
        fr: 'Email',
        en: 'Email'
      },
      role: {
        fr: 'Rôle',
        en: 'Role'
      },
      permissions: {
        fr: 'Permissions',
        en: 'Permissions'
      },
      close: {
        fr: 'Fermer',
        en: 'Close'
      },
      notDefined: {
        fr: 'Non défini',
        en: 'Not defined'
      },
      administrator: {
        fr: 'Administrateur',
        en: 'Administrator'
      },
      owner: {
        fr: 'Propriétaire',
        en: 'Owner'
      },
      allPermissions: {
        fr: 'Tous',
        en: 'All'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  // Déterminer le nom à afficher - correction pour l'admin
  const isAdmin = user.email === 'admin@neotech-consulting.com';
  const displayName = isAdmin ? 'Lionel DJOSSA' : (userProfile?.name || getLocalizedText('notDefined'));
  
  // Déterminer le rôle à afficher
  const displayRole = isAdmin ? getLocalizedText('administrator') : 
                     userType === 'owner' ? getLocalizedText('owner') : 
                     userProfile?.role || getLocalizedText('notDefined');

  // Déterminer les permissions à afficher
  const getDisplayPermissions = () => {
    // Si c'est l'admin, afficher "All" ou "Tous"
    if (isAdmin || userType === 'admin') {
      return [getLocalizedText('allPermissions')];
    }
    
    // Pour les autres utilisateurs, afficher leurs permissions spécifiques
    if (userProfile?.permissions && Array.isArray(userProfile.permissions) && userProfile.permissions.length > 0) {
      return userProfile.permissions;
    }
    
    return [];
  };

  const displayPermissions = getDisplayPermissions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{getLocalizedText('myProfile')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{getLocalizedText('name')}</Label>
            <Input
              value={displayName}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>{getLocalizedText('email')}</Label>
            <Input
              value={user.email || getLocalizedText('notDefined')}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>{getLocalizedText('role')}</Label>
            <Input
              value={displayRole}
              readOnly
              className="bg-gray-50"
            />
          </div>
          {displayPermissions.length > 0 && (
            <div className="space-y-2">
              <Label>{getLocalizedText('permissions')}</Label>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex flex-wrap gap-1">
                  {displayPermissions.map((permission: string, index: number) => (
                    <span
                      key={`${permission}-${index}`}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {getLocalizedText('close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
