
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoFieldsProps {
  formData: {
    name: string;
    email: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailBlur: () => void;
  emailError: string;
  isLoading: boolean;
}

const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({
  formData,
  onChange,
  onEmailBlur,
  emailError,
  isLoading
}) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('publicSite.ownerRegistration.fullName')} *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">{t('publicSite.ownerRegistration.email')} *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          onBlur={onEmailBlur}
          required
          disabled={isLoading}
          className={emailError ? 'border-red-500 focus:border-red-500' : ''}
        />
        {emailError && (
          <p className="text-sm text-red-600 mt-1">{emailError}</p>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoFields;
