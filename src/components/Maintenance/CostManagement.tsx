
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
import CostStats from './Cost/CostStats';
import InvoiceForm from './Cost/InvoiceForm';
import InvoicesTable from './Cost/InvoicesTable';
import CostSummary from './Cost/CostSummary';

const CostManagement = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { invoices, addInvoice, loading } = useFirebaseMaintenances();
  const { properties } = useFirebaseProperties();
  
  // Générer les années à partir de 2025
  const currentYear = new Date().getFullYear();
  const startYear = Math.max(2025, currentYear);
  const years = Array.from({ length: 5 }, (_, index) => startYear + index);
  
  const [selectedPeriod, setSelectedPeriod] = useState(startYear.toString());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalCosts = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const proprietaireCosts = invoices.filter(i => i.responsibility === t('maintenance.costManagement.owner')).reduce((sum, i) => sum + i.amount, 0);
  const locataireCosts = invoices.filter(i => i.responsibility === t('maintenance.costManagement.tenant')).reduce((sum, i) => sum + i.amount, 0);
  const pendingCosts = invoices.filter(i => i.status === t('maintenance.costManagement.pending')).reduce((sum, i) => sum + i.amount, 0);

  const handleNewInvoice = async (invoice: any) => {
    try {
      await addInvoice(invoice);
      setIsDialogOpen(false);
      toast({
        title: t('maintenance.interventionTracking.invoiceCreated'),
        description: t('maintenance.interventionTracking.invoiceDescription'),
      });
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
    }
  };

  if (loading) {
    return <div>{t('maintenance.interventionTracking.loadingData')}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <CostStats 
        totalCosts={totalCosts}
        proprietaireCosts={proprietaireCosts}
        locataireCosts={locataireCosts}
        pendingCosts={pendingCosts}
      />

      {/* Gestion des factures */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>{t('maintenance.costManagement.title')}</CardTitle>
              <CardDescription>{t('maintenance.costManagement.subtitle')}</CardDescription>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('maintenance.costManagement.newInvoice')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t('maintenance.costManagement.createNewInvoice')}</DialogTitle>
                    <DialogDescription>
                      {t('maintenance.costManagement.recordNewInvoice')}
                    </DialogDescription>
                  </DialogHeader>
                  <InvoiceForm 
                    onSave={handleNewInvoice} 
                    properties={properties}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <InvoicesTable invoices={invoices} />
        </CardContent>
      </Card>

      {/* Récapitulatif par responsabilité */}
      <CostSummary invoices={invoices} />
    </div>
  );
};

export default CostManagement;
