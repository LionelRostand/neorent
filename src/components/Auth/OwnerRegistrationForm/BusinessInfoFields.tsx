
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BusinessInfoFieldsProps {
  formData: {
    company: string;
    address: string;
    message: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isLoading: boolean;
}

const BusinessInfoFields: React.FC<BusinessInfoFieldsProps> = ({
  formData,
  onChange,
  isLoading
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="company">{t('publicSite.ownerRegistration.company')}</Label>
        <Input
          id="company"
          name="company"
          value={formData.company}
          onChange={onChange}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t('publicSite.ownerRegistration.address')}</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={onChange}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t('publicSite.ownerRegistration.messageOptional')}</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={onChange}
          placeholder={t('publicSite.ownerRegistration.messagePlaceholder')}
          disabled={isLoading}
        />
      </div>
    </>
  );
};

export default BusinessInfoFields;
