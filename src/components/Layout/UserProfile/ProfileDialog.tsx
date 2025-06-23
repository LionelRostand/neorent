
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
  userType: 'locataire' | 'colocataire' | 'admin' | 'employee' | null;
}

export const ProfileDialog = ({ 
  open, 
  onOpenChange, 
  user, 
  userProfile, 
  userType 
}: ProfileDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Mon profil</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t('common.name')}</Label>
            <Input
              value={userProfile?.name || t('common.notDefined')}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>{t('common.email')}</Label>
            <Input
              value={user.email || t('common.notDefined')}
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <Label>{t('common.role')}</Label>
            <Input
              value={userType === 'admin' ? t('common.administrator') : t('common.employee')}
              readOnly
              className="bg-gray-50"
            />
          </div>
          {userProfile?.permissions && Array.isArray(userProfile.permissions) && userProfile.permissions.length > 0 && (
            <div className="space-y-2">
              <Label>{t('common.permissions')}</Label>
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
              {t('common.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
