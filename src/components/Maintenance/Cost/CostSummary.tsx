
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const { t } = useTranslation();

  const ownerInvoices = invoices.filter(invoice => invoice.responsibility === t('maintenanceCosts.owner'));
  const tenantInvoices = invoices.filter(invoice => invoice.responsibility === t('maintenanceCosts.tenant'));

  const ownerTotal = ownerInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const tenantTotal = tenantInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('maintenanceCosts.ownerCosts')}</span>
            <Badge variant="default">{ownerInvoices.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 mb-4">{ownerTotal}€</div>
          <div className="space-y-2">
            {ownerInvoices.slice(0, 3).map((invoice) => (
              <div key={invoice.id} className="flex justify-between text-sm">
                <span className="truncate">{invoice.description}</span>
                <span className="font-medium">{invoice.amount}€</span>
              </div>
            ))}
            {ownerInvoices.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{ownerInvoices.length - 3} autres factures
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('maintenanceCosts.tenantCosts')}</span>
            <Badge variant="secondary">{tenantInvoices.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 mb-4">{tenantTotal}€</div>
          <div className="space-y-2">
            {tenantInvoices.slice(0, 3).map((invoice) => (
              <div key={invoice.id} className="flex justify-between text-sm">
                <span className="truncate">{invoice.description}</span>
                <span className="font-medium">{invoice.amount}€</span>
              </div>
            ))}
            {tenantInvoices.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{tenantInvoices.length - 3} autres factures
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostSummary;
