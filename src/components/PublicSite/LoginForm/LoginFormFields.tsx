
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

interface LoginFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isLoading: boolean;
}

const LoginFormFields: React.FC<LoginFormFieldsProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">{t('publicSite.login.email')}</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder={t('publicSite.login.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
            required
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">{t('publicSite.login.password')}</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t('publicSite.login.passwordPlaceholder')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginFormFields;
