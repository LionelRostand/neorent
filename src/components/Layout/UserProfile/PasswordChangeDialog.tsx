
import React from 'react';
import { User } from 'firebase/auth';
import { Eye, EyeOff } from 'lucide-react';
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
import { usePasswordChange } from './usePasswordChange';

interface PasswordChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export const PasswordChangeDialog = ({ 
  open, 
  onOpenChange, 
  user 
}: PasswordChangeDialogProps) => {
  const { i18n } = useTranslation();
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handlePasswordChange,
  } = usePasswordChange(user, onOpenChange);

  // Get texts based on current language
  const getLocalizedText = (key: string) => {
    const currentLang = i18n.language;
    
    const texts: Record<string, Record<string, string>> = {
      changePassword: {
        fr: 'Changer le mot de passe',
        en: 'Change Password'
      },
      currentPassword: {
        fr: 'Mot de passe actuel',
        en: 'Current Password'
      },
      enterCurrentPassword: {
        fr: 'Entrez le mot de passe actuel',
        en: 'Enter current password'
      },
      newPassword: {
        fr: 'Nouveau mot de passe',
        en: 'New Password'
      },
      minimum6Characters: {
        fr: 'Minimum 6 caractères',
        en: 'Minimum 6 characters'
      },
      confirmPassword: {
        fr: 'Confirmer le mot de passe',
        en: 'Confirm Password'
      },
      confirmNewPassword: {
        fr: 'Confirmez le nouveau mot de passe',
        en: 'Confirm new password'
      },
      cancel: {
        fr: 'Annuler',
        en: 'Cancel'
      },
      modify: {
        fr: 'Modifier',
        en: 'Modify'
      },
      modifying: {
        fr: 'Modification...',
        en: 'Modifying...'
      }
    };

    return texts[key]?.[currentLang] || texts[key]?.['fr'] || key;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{getLocalizedText('changePassword')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{getLocalizedText('currentPassword')}</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder={getLocalizedText('enterCurrentPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{getLocalizedText('newPassword')}</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder={getLocalizedText('minimum6Characters')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{getLocalizedText('confirmPassword')}</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder={getLocalizedText('confirmNewPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {getLocalizedText('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? getLocalizedText('modifying') : getLocalizedText('modify')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
