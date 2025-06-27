import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Eye, Edit, Trash2, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Inspection {
  id: string;
  title: string;
  type: string;
  property: string;
  tenant: string;
  date: string;
  inspector: string;
  status: string;
}

interface AdminInspectionsTableProps {
  inspections: Inspection[] | null;
  onViewInspection?: (inspection: Inspection) => void;
}

const AdminInspectionsTable: React.FC<AdminInspectionsTableProps> = ({ 
  inspections, 
  onViewInspection 
}) => {
  const { t } = useTranslation();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case t('inspections.completed'):
      case 'Completed':
      case 'Terminé':
        return 'default';
      case t('inspections.inProgress'):
      case 'In Progress':
      case 'En cours':
        return 'secondary';
      case t('inspections.planned'):
      case 'Planned':
      case 'Planifié':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case 'Terminé':
      case 'Completed':
        return t('inspections.completed');
      case 'En cours':
      case 'In Progress':
        return t('inspections.inProgress');
      case 'Planifié':
      case 'Planned':
        return t('inspections.planned');
      default:
        return status;
    }
  };

  const getTranslatedType = (type: string) => {
    switch (type) {
      case 'Entrée':
      case 'Entry':
        return t('inspections.entryInspection');
      case 'Sortie':
      case 'Exit':
        return t('inspections.exitInspection');
      case 'Intermédiaire':
      case 'Intermediate':
        return t('inspections.intermediateInspection');
      default:
        return type;
    }
  };

  const handleRowClick = (inspection: Inspection) => {
    if (onViewInspection) {
      onViewInspection(inspection);
    }
  };

  const handleViewClick = (e: React.MouseEvent, inspection: Inspection) => {
    e.stopPropagation();
    if (onViewInspection) {
      onViewInspection(inspection);
    }
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
        <CardTitle className="text-xl text-gray-800">{t('inspections.listTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {inspections && inspections.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('inspections.inspectionTitle')}</TableHead>
                <TableHead>{t('inspections.inspectionType')}</TableHead>
                <TableHead>{t('inspections.property')}</TableHead>
                <TableHead>{t('inspections.tenant')}</TableHead>
                <TableHead>{t('inspections.date')}</TableHead>
                <TableHead>{t('inspections.inspector')}</TableHead>
                <TableHead>{t('inspections.status')}</TableHead>
                <TableHead className="text-right">{t('inspections.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inspections.map((inspection) => (
                <TableRow 
                  key={inspection.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(inspection)}
                >
                  <TableCell className="font-medium">{inspection.title}</TableCell>
                  <TableCell>{getTranslatedType(inspection.type)}</TableCell>
                  <TableCell>{inspection.property}</TableCell>
                  <TableCell>{inspection.tenant}</TableCell>
                  <TableCell>{new Date(inspection.date).toLocaleDateString()}</TableCell>
                  <TableCell>{inspection.inspector}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(inspection.status)}>
                      {getTranslatedStatus(inspection.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => handleViewClick(e, inspection)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-dashed border-gray-200">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileCheck className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">{t('inspections.noInspections')}</h3>
            <p className="text-gray-500 mb-4">{t('inspections.noInspectionsDescription')}</p>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              {t('inspections.addInspection')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminInspectionsTable;
