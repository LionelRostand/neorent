
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Contact } from 'lucide-react';

interface EmergencyContactCardProps {
  tenantData: {
    emergencyContact: {
      name: string;
      phone: string;
      relation: string;
    };
  };
  formData: {
    emergencyName: string;
    emergencyPhone: string;
    emergencyRelation: string;
  };
  isEditing: boolean;
  isUpdating: boolean;
  onFormDataChange: (field: string, value: string) => void;
}

const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  tenantData,
  formData,
  isEditing,
  isUpdating,
  onFormDataChange
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Contact className="h-4 w-4 md:h-5 md:w-5" />
          {t('tenantSpace.profile.emergencyContact')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-xs md:text-sm">{t('tenantSpace.profile.emergencyName')}</Label>
            {isEditing ? (
              <Input
                value={formData.emergencyName}
                onChange={(e) => onFormDataChange('emergencyName', e.target.value)}
                className="mt-1 text-sm md:text-base"
                placeholder={t('tenantSpace.profile.emergencyName')}
                disabled={isUpdating}
              />
            ) : (
              <p className="font-medium mt-1 text-sm md:text-base">{tenantData.emergencyContact.name}</p>
            )}
          </div>
          
          <div>
            <Label className="text-xs md:text-sm">{t('tenantSpace.profile.emergencyPhone')}</Label>
            {isEditing ? (
              <Input
                value={formData.emergencyPhone}
                onChange={(e) => onFormDataChange('emergencyPhone', e.target.value)}
                className="mt-1 text-sm md:text-base"
                placeholder={t('tenantSpace.profile.emergencyPhone')}
                disabled={isUpdating}
              />
            ) : (
              <p className="font-medium mt-1 text-sm md:text-base">{tenantData.emergencyContact.phone}</p>
            )}
          </div>
          
          <div>
            <Label className="text-xs md:text-sm">{t('tenantSpace.profile.emergencyRelation')}</Label>
            {isEditing ? (
              <Input
                value={formData.emergencyRelation}
                onChange={(e) => onFormDataChange('emergencyRelation', e.target.value)}
                className="mt-1 text-sm md:text-base"
                placeholder={t('tenantSpace.profile.emergencyRelation')}
                disabled={isUpdating}
              />
            ) : (
              <p className="font-medium mt-1 text-sm md:text-base">{tenantData.emergencyContact.relation}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactCard;
