
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, Key } from 'lucide-react';

interface PersonalInfoCardProps {
  tenantData: any;
  isRoommate: boolean;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ tenantData, isRoommate }) => {
  const { t } = useTranslation();

  if (!tenantData) {
    return null;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-5 w-5 text-green-600" />
          {t('tenantSpace.profile.personalInfo')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Full Name */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">{t('tenantSpace.profile.name')}</p>
            <p className="font-medium">{tenantData.name}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">{t('tenantSpace.profile.email')}</p>
            <p className="font-medium">{tenantData.email || 'entrepreneurpro19@gmail.com'}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">{t('tenantSpace.profile.phone')}</p>
            <p className="font-medium">{tenantData.phone || '+33 7 53 42 53 53'}</p>
          </div>
        </div>

        {/* Lease Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">{t('tenantSpace.profile.leaseStart')}</p>
              <p className="font-medium text-blue-600">06/01/2025</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">{t('tenantSpace.profile.leaseEnd')}</p>
              <p className="font-medium text-orange-600">05/01/2026</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-500">{t('tenantSpace.profile.status')}</span>
          </div>
          <Badge className="bg-red-100 text-red-800 border-red-200">
            {t('common.active')}
          </Badge>
        </div>

        {/* Room Number for Roommates */}
        {isRoommate && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Key className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">{t('tenantSpace.overview.roomNumber')}</p>
              <p className="font-medium text-blue-600">{t('tenantSpace.room', { number: '2' })}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfoCard;
