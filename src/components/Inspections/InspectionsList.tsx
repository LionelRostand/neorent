
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building2, ClipboardList, Eye, Edit } from 'lucide-react';

interface Inspection {
  id: string;
  title: string;
  type: string;
  tenant: string;
  property: string;
  date: string;
  inspector: string;
  status: string;
}

interface InspectionsListProps {
  inspections: Inspection[];
  onViewDetails: (inspection: Inspection) => void;
  onEditInspection: (inspection: Inspection) => void;
  onDeleteInspection: (id: string) => void;
}

const InspectionsList = ({ 
  inspections, 
  onViewDetails, 
  onEditInspection, 
  onDeleteInspection 
}: InspectionsListProps) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('completed') || lowerStatus.includes('terminé')) {
      return 'bg-green-100 text-green-800';
    } else if (lowerStatus.includes('progress') || lowerStatus.includes('cours')) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusVariant = (status: string) => {
    if (!status) return 'outline';
    
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('completed') || lowerStatus.includes('terminé')) {
      return 'default';
    } else if (lowerStatus.includes('progress') || lowerStatus.includes('cours')) {
      return 'secondary';
    } else {
      return 'outline';
    }
  };

  console.log('InspectionsList received inspections:', inspections);
  
  return (
    <>
      <div className="pt-2 sm:pt-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{t('inspections.listTitle')}</h2>
      </div>

      {inspections.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <ClipboardList className="h-12 w-12" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{t('inspections.noInspections')}</h3>
            <p className="mt-2 text-sm text-gray-600">{t('inspections.noInspectionsDescription')}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {inspections.map((inspection) => (
            <Card key={inspection.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">{inspection.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{inspection.type}</p>
                    </div>
                    <Badge 
                      variant={getStatusVariant(inspection.status)}
                      className={`text-xs ${getStatusColor(inspection.status)}`}
                    >
                      {inspection.status || t('inspections.planned')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{inspection.tenant}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <Building2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{inspection.property}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <Calendar className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span>{new Date(inspection.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <ClipboardList className="mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{t('inspections.inspector')}: {inspection.inspector}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(inspection)}
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Voir détails
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditInspection(inspection)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
};

export default InspectionsList;
