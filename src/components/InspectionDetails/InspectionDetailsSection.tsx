
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface InspectionDetailsSectionProps {
  inspection: {
    description?: string;
    observations?: string;
  };
}

const InspectionDetailsSection = ({ inspection }: InspectionDetailsSectionProps) => {
  const { t } = useTranslation();

  if (!inspection.description && !inspection.observations) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="truncate">{t('inspections.inspectionDetails')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 pt-0">
        {inspection.description && (
          <div>
            <h4 className="font-medium mb-2 text-sm sm:text-base">{t('inspections.description')}</h4>
            <p className="text-gray-600 text-xs sm:text-sm bg-gray-50 p-3 sm:p-4 rounded-md break-words leading-relaxed">
              {inspection.description}
            </p>
          </div>
        )}
        {inspection.observations && (
          <div>
            <h4 className="font-medium mb-2 text-sm sm:text-base">{t('inspections.observations')}</h4>
            <p className="text-gray-600 text-xs sm:text-sm bg-gray-50 p-3 sm:p-4 rounded-md break-words leading-relaxed">
              {inspection.observations}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InspectionDetailsSection;
