
import React from 'react';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique détaillé</CardTitle>
        <CardDescription>
          {filteredHistory.length} intervention{filteredHistory.length > 1 ? 's' : ''} trouvée{filteredHistory.length > 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Bien</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Technicien</TableHead>
              <TableHead>Coût</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {item.scheduledDate || 'Non définie'}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.property}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.priority}</Badge>
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.technicianName || 'Non assigné'}</TableCell>
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
