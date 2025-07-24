
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Owner } from '@/hooks/useFirebaseOwners';

interface InspectionDetailsFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
  owners: Owner[];
}

const InspectionDetailsFields = ({ formData, onInputChange, owners }: InspectionDetailsFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="date">{t('inspections.date')}</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => onInputChange('date', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="inspector">{t('inspections.inspectorField')}</Label>
        <Select
          value={formData.inspector}
          onValueChange={(value) => onInputChange('inspector', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('inspections.inspectorPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {owners.map((owner) => (
              <SelectItem key={owner.id} value={owner.name}>
                {owner.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">{t('inspections.description')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder={t('inspections.descriptionPlaceholder')}
          className="min-h-[80px]"
        />
      </div>

      <div>
        <Label htmlFor="observations">{t('inspections.observations')}</Label>
        <Textarea
          id="observations"
          value={formData.observations}
          onChange={(e) => onInputChange('observations', e.target.value)}
          placeholder={t('inspections.observationsPlaceholder')}
          className="min-h-[80px]"
        />
      </div>
    </>
  );
};

export default InspectionDetailsFields;
