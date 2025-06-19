
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building2, ClipboardList, Edit, Trash2 } from 'lucide-react';

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

  return (
    <>
      <div className="pt-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('inspections.listTitle')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inspections.map((inspection) => (
          <Card key={inspection.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{inspection.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{inspection.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={inspection.status === 'Terminé' || inspection.status === 'Completed' ? 'default' : 
                             inspection.status === 'En cours' || inspection.status === 'In Progress' ? 'secondary' : 'outline'}
                      className={
                        inspection.status === 'Terminé' || inspection.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        inspection.status === 'En cours' || inspection.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }
                    >
                      {inspection.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditInspection(inspection)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteInspection(inspection.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600 text-sm">
                    <User className="mr-2 h-4 w-4" />
                    {inspection.tenant}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Building2 className="mr-2 h-4 w-4" />
                    {inspection.property}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(inspection.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    {t('inspections.inspector')}: {inspection.inspector}
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onViewDetails(inspection)}
                  >
                    {t('inspections.viewDetails')}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onEditInspection(inspection)}
                  >
                    {t('inspections.editInspection')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default InspectionsList;
