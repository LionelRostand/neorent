
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ClipboardList } from 'lucide-react';

interface GeneralInfoSectionProps {
  inspection: {
    title: string;
    type: string;
    status: string;
    date: string;
    inspector: string;
  };
}

const GeneralInfoSection = ({ inspection }: GeneralInfoSectionProps) => {
  const { t } = useTranslation();

  const getBadgeVariant = (status: string) => {
    if (status === 'Terminé' || status === 'Completed' || status === t('inspections.completed')) {
      return 'default';
    } else if (status === 'En cours' || status === 'In Progress' || status === t('inspections.inProgress')) {
      return 'secondary';
    } else {
      return 'outline';
    }
  };

  const getBadgeClassName = (status: string) => {
    if (status === 'Terminé' || status === 'Completed' || status === t('inspections.completed')) {
      return 'bg-green-100 text-green-800';
    } else if (status === 'En cours' || status === 'In Progress' || status === t('inspections.inProgress')) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="truncate">{t('inspections.generalInformation')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 pt-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-base sm:text-lg text-gray-900 break-words">
              {inspection.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
              {inspection.type}
            </p>
          </div>
          <div className="flex-shrink-0 self-start sm:self-auto">
            <Badge 
              variant={getBadgeVariant(inspection.status)}
              className={`text-xs sm:text-sm whitespace-nowrap ${getBadgeClassName(inspection.status)}`}
            >
              {inspection.status}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div className="flex items-center text-gray-600 text-sm sm:text-base">
            <Calendar className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">
              <span className="font-medium">{t('inspections.date')}: </span>
              {new Date(inspection.date).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex items-center text-gray-600 text-sm sm:text-base">
            <User className="mr-2 sm:mr-3 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">
              <span className="font-medium">{t('inspections.inspector')}: </span>
              {inspection.inspector}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralInfoSection;
