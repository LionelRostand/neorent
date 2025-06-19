
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InvoiceFormProps {
  onSave: (invoice: any) => void;
  properties: any[];
  onCancel: () => void;
}

const InvoiceForm = ({ onSave, properties, onCancel }: InvoiceFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    invoiceNumber: `MAINT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    date: new Date().toISOString().split('T')[0],
    property: '',
    description: '',
    technicianName: '',
    amount: '',
    responsibility: '',
    status: t('maintenance.costManagement.pending'),
    tenantNotified: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: Number(formData.amount)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">{t('maintenance.costManagement.invoiceNumber')}</Label>
          <Input
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">{t('maintenance.costManagement.date')}</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="property">{t('maintenance.costManagement.property')}</Label>
          <Select value={formData.property} onValueChange={(value) => setFormData({...formData, property: value})}>
            <SelectTrigger>
              <SelectValue placeholder={t('maintenance.costManagement.selectProperty')} />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.title}>
                  {property.title} - {property.address}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="description">{t('maintenance.costManagement.description')}</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder={t('maintenance.costManagement.descriptionPlaceholder')}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="technicianName">{t('maintenance.costManagement.technician')}</Label>
          <Input
            id="technicianName"
            value={formData.technicianName}
            onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
            placeholder={t('maintenance.costManagement.technicianPlaceholder')}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">{t('maintenance.costManagement.amount')}</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder={t('maintenance.costManagement.amountPlaceholder')}
            required
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="responsibility">{t('maintenance.costManagement.responsibility')}</Label>
          <Select value={formData.responsibility} onValueChange={(value) => setFormData({...formData, responsibility: value})}>
            <SelectTrigger>
              <SelectValue placeholder={t('maintenance.costManagement.responsibilityPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={t('maintenance.costManagement.owner')}>{t('maintenance.costManagement.owner')}</SelectItem>
              <SelectItem value={t('maintenance.costManagement.tenant')}>{t('maintenance.costManagement.tenant')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          {t('maintenance.costManagement.cancel')}
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          {t('maintenance.costManagement.createInvoice')}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
