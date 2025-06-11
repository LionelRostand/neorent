
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface CostSummaryProps {
  invoices: MaintenanceInvoice[];
}

const CostSummary = ({ invoices }: CostSummaryProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée': return 'success';
      case 'En attente': return 'secondary';
      case 'En retard': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Charges Propriétaire</CardTitle>
          <CardDescription>Réparations et entretien à votre charge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.filter(i => i.responsibility === 'Propriétaire').map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{invoice.description}</p>
                  <p className="text-xs text-muted-foreground">{invoice.property}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{invoice.amount}€</p>
                  <Badge variant={getStatusColor(invoice.status)} className="text-xs">
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Charges Locataire</CardTitle>
          <CardDescription>Réparations à facturer aux locataires</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.filter(i => i.responsibility === 'Locataire').map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">{invoice.description}</p>
                  <p className="text-xs text-muted-foreground">{invoice.property}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{invoice.amount}€</p>
                  <Badge variant={getStatusColor(invoice.status)} className="text-xs">
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostSummary;
