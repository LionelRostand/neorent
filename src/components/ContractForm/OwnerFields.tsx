
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Owner } from '@/hooks/useFirebaseOwners';

interface OwnerFieldsProps {
  formData: any;
  handleInputChange: (field: string, value: string) => void;
  owners: Owner[];
  isDataLoading: boolean;
}

const OwnerFields = ({
  formData,
  handleInputChange,
  owners,
  isDataLoading
}: OwnerFieldsProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <Label htmlFor="owner">{t('contractForm.owner')}</Label>
      <Select value={formData.owner} onValueChange={(value) => handleInputChange('owner', value)}>
        <SelectTrigger>
          <SelectValue placeholder={isDataLoading ? t('common.loading') : t('contractForm.selectOwner')} />
        </SelectTrigger>
        <SelectContent>
          {owners.map((owner) => (
            <SelectItem key={owner.id} value={owner.name}>
              {owner.name} - {owner.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OwnerFields;
