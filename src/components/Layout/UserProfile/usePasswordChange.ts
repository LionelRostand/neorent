
import { useState } from 'react';
import { User, updatePassword } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

export const usePasswordChange = (user: User, onClose: (open: boolean) => void) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: t('common.error'),
        description: "The passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: t('common.error'), 
        description: "Password must contain at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (user) {
        await updatePassword(user, newPassword);
        toast({
          title: t('common.success'),
          description: "Password changed successfully.",
        });
        onClose(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: "Unable to change password. Please log in again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
