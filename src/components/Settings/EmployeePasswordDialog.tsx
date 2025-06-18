
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEmployeePassword } from '@/hooks/useEmployeePassword';

interface EmployeePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: {
    id: string;
    name: string;
    email: string;
    hasPassword?: boolean;
  };
  onPasswordSet: () => void;
}

const EmployeePasswordDialog: React.FC<EmployeePasswordDialogProps> = ({
  open,
  onOpenChange,
  employee,
  onPasswordSet
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { toast } = useToast();
  const { loading, setEmployeePassword, updateEmployeePassword } = useEmployeePassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast({
        title: t('employees.passwordTooShort'),
        description: t('employees.passwordMinLength'),
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: t('employees.passwordMismatch'),
        description: t('employees.passwordMismatchDescription'),
        variant: "destructive",
      });
      return;
    }

    const result = employee.hasPassword 
      ? await updateEmployeePassword(employee.id, password)
      : await setEmployeePassword(employee.id, employee.email, password);
    
    if (result.success) {
      toast({
        title: t('common.success'),
        description: result.message || t(employee.hasPassword ? 'employees.passwordUpdatedSuccess' : 'employees.passwordSetSuccess'),
      });
      onPasswordSet();
      onOpenChange(false);
      setPassword('');
      setConfirmPassword('');
    } else {
      toast({
        title: t('common.error'),
        description: result.error || t('employees.passwordError'),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {employee.hasPassword ? t('employees.updatePassword') : t('employees.setPasswordTitle')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t('employees.employeeLabel')}: {employee.name}</Label>
            <Label>{t('profile.email')}: {employee.email}</Label>
          </div>

          {/* Information sur l'email existant */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-blue-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{t('employees.information')}</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              {t('employees.emailExistsInfo')}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('employees.newPassword')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('employees.passwordPlaceholder')}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('employees.confirmPassword')}</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('employees.confirmPasswordPlaceholder')}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('employees.saving') : (employee.hasPassword ? t('employees.update') : t('employees.define'))}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeePasswordDialog;
