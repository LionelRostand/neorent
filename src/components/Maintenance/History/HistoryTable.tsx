
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Euro } from 'lucide-react';

interface MaintenanceIntervention {
  id: string;
  requestId: string;
  property: string;
  description: string;
  status: string;
  priority: string;
  technicianName: string;
  technicianPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedCost: number;
  actualCost: number | null;
  completionNotes: string;
}

interface HistoryTableProps {
  filteredHistory: MaintenanceIntervention[];
}

const HistoryTable = ({ filteredHistory }: HistoryTableProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('maintenanceHistory.detailedHistory')}</CardTitle>
        <CardDescription>
          {filteredHistory.length} {t('maintenanceHistory.interventionsFound')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('maintenanceHistory.date')}</TableHead>
              <TableHead>{t('maintenanceHistory.property')}</TableHead>
              <TableHead>{t('maintenanceHistory.priority')}</TableHead>
              <TableHead>{t('maintenanceHistory.description')}</TableHead>
              <TableHead>{t('maintenanceHistory.technician')}</TableHead>
              <TableHead>{t('maintenanceHistory.cost')}</TableHead>
              <TableHead>{t('maintenanceHistory.status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {item.scheduledDate || 'Not defined'}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.property}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.priority}</Badge>
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.technicianName || 'Not assigned'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    {item.actualCost || item.estimatedCost || 0}€
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default HistoryTable;
