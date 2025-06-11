
import React from 'react';
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée': return 'success';
      case 'En attente': return 'secondary';
      case 'En retard': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Facture N°</TableHead>
            <TableHead className="min-w-[100px]">Date</TableHead>
            <TableHead className="min-w-[150px]">Bien</TableHead>
            <TableHead className="min-w-[200px]">Description</TableHead>
            <TableHead className="min-w-[100px]">Montant</TableHead>
            <TableHead className="min-w-[120px]">Responsabilité</TableHead>
            <TableHead className="min-w-[100px]">Statut</TableHead>
            <TableHead className="min-w-[100px]">Actions</TableHead>
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
                <Badge variant={invoice.responsibility === 'Propriétaire' ? 'default' : 'secondary'}>
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
