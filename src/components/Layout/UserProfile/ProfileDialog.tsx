
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
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

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
              value={userProfile?.name || getLocalizedText('notDefined')}
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
              value={userType === 'admin' ? getLocalizedText('administrator') : getLocalizedText('owner')}
              readOnly
              className="bg-gray-50"
            />
          </div>
          {userProfile?.permissions && Array.isArray(userProfile.permissions) && userProfile.permissions.length > 0 && (
            <div className="space-y-2">
              <Label>{getLocalizedText('permissions')}</Label>
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex flex-wrap gap-1">
                  {userProfile.permissions.map((permission: string) => (
                    <span
                      key={permission}
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
