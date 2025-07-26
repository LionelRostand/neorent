
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OwnerFields from './OwnerFields';
import { Owner } from '@/hooks/useFirebaseOwners';

interface BasicContractFieldsProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  contractTypes: { value: string; label: string; }[];
  owners: Owner[];
  isDataLoading: boolean;
}

const BasicContractFields = ({ 
  formData, 
  handleInputChange, 
  contractTypes, 
  owners, 
  isDataLoading 
}: BasicContractFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="title">{t('contractForm.title')}</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder={t('contractForm.titlePlaceholder')}
        />
      </div>

      <div>
        <Label htmlFor="type">{t('contractForm.type')}</Label>
        <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('contractForm.selectType')} />
          </SelectTrigger>
          <SelectContent>
            {contractTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <OwnerFields
        formData={formData}
        handleInputChange={handleInputChange}
        owners={owners}
        isDataLoading={isDataLoading}
      />

      <div>
        <Label htmlFor="jurisdiction">{t('contractForm.jurisdiction')}</Label>
        <Select value={formData.jurisdiction} onValueChange={(value) => handleInputChange('jurisdiction', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('contractForm.selectJurisdiction')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="french">{t('contractForm.french')}</SelectItem>
            <SelectItem value="cameroonian">{t('contractForm.cameroonian')}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-1">{t('contractForm.jurisdictionInfo')}</p>
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="description">{t('contractForm.description')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder={t('contractForm.descriptionPlaceholder')}
          rows={3}
        />
      </div>
    </>
  );
};

export default BasicContractFields;
