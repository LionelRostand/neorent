
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import OwnerRegistrationForm from '@/components/Auth/OwnerRegistrationForm';

interface LoginFormActionsProps {
  isLoading: boolean;
  showRegistration: boolean;
  setShowRegistration: (show: boolean) => void;
}

const LoginFormActions: React.FC<LoginFormActionsProps> = ({
  isLoading,
  showRegistration,
  setShowRegistration
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
        {isLoading ? t('publicSite.login.form.signingIn') : t('publicSite.login.form.signIn')}
      </Button>
      
      <div className="text-center space-y-2">
        <a href="#" className="text-sm text-green-600 hover:underline block">
          {t('publicSite.login.form.forgotPassword')}
        </a>
        
        <Dialog open={showRegistration} onOpenChange={setShowRegistration}>
          <DialogTrigger asChild>
            <button type="button" className="text-sm text-blue-600 hover:underline">
              {t('publicSite.ownerRegistration.createAccountLink')}
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('publicSite.ownerRegistration.dialogTitle')}</DialogTitle>
            </DialogHeader>
            <OwnerRegistrationForm onSuccess={() => setShowRegistration(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default LoginFormActions;
