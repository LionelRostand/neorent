
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicContractFieldsProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  contractTypes: string[];
}

const BasicContractFields = ({ formData, handleInputChange, contractTypes }: BasicContractFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="title">{t('contractForm.title')} *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder={t('contractForm.titlePlaceholder')}
          required
        />
      </div>

      <div>
        <Label htmlFor="type">{t('contractForm.type')} *</Label>
        <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('contractForm.selectType')} />
          </SelectTrigger>
          <SelectContent>
            {contractTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="provider">{t('contractForm.provider')}</Label>
        <Input
          id="provider"
          value={formData.provider}
          onChange={(e) => handleInputChange('provider', e.target.value)}
          placeholder={t('contractForm.providerPlaceholder')}
        />
      </div>

      <div>
        <Label htmlFor="jurisdiction">{t('contractForm.jurisdiction')} *</Label>
        <Select value={formData.jurisdiction} onValueChange={(value) => handleInputChange('jurisdiction', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('contractForm.selectJurisdiction')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="francaise">{t('contractForm.french')}</SelectItem>
            <SelectItem value="camerounaise">{t('contractForm.cameroonian')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default BasicContractFields;
