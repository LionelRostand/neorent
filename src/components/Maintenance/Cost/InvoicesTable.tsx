
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Euro, FileText, Download } from 'lucide-react';

interface MaintenanceInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  property: string;
  description: string;
  technicianName: string;
  amount: number;
  responsibility: string;
  status: string;
  tenantNotified: boolean;
}

interface InvoicesTableProps {
  invoices: MaintenanceInvoice[];
}

const InvoicesTable = ({ invoices }: InvoicesTableProps) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée': 
      case t('maintenanceCosts.paid'): return 'success';
      case 'En attente': 
      case t('maintenanceCosts.pendingCosts'): return 'secondary';
      case 'En retard': 
      case t('maintenanceCosts.overdue'): return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">{t('maintenanceCosts.invoiceNumberColumn')}</TableHead>
            <TableHead className="min-w-[100px]">{t('maintenanceCosts.dateColumn')}</TableHead>
            <TableHead className="min-w-[150px]">{t('maintenanceCosts.propertyColumn')}</TableHead>
            <TableHead className="min-w-[200px]">{t('maintenanceCosts.descriptionColumn')}</TableHead>
            <TableHead className="min-w-[100px]">{t('maintenanceCosts.amountColumn')}</TableHead>
            <TableHead className="min-w-[120px]">{t('maintenanceCosts.responsibilityColumn')}</TableHead>
            <TableHead className="min-w-[100px]">{t('maintenanceCosts.statusColumn')}</TableHead>
            <TableHead className="min-w-[100px]">{t('maintenanceCosts.actionsColumn')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-mono text-sm">
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell className="max-w-xs truncate">
                {invoice.property}
              </TableCell>
              <TableCell>{invoice.description}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1 font-semibold">
                  <Euro className="h-3 w-3" />
                  {invoice.amount}€
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={invoice.responsibility === t('maintenanceCosts.owner') ? 'default' : 'secondary'}>
                  {invoice.responsibility}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <FileText className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvoicesTable;
