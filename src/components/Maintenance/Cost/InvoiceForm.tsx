
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
    status: t('maintenanceCosts.pendingCosts'),
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
          <Label htmlFor="invoiceNumber">{t('maintenanceCosts.invoiceNumber')}</Label>
          <Input
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">{t('maintenanceCosts.date')}</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="property">{t('maintenanceCosts.propertyColumn')}</Label>
          <Select value={formData.property} onValueChange={(value) => setFormData({...formData, property: value})}>
            <SelectTrigger>
              <SelectValue placeholder={t('maintenance.selectProperty')} />
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
          <Label htmlFor="description">{t('maintenanceCosts.descriptionColumn')}</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder={t('maintenance.descriptionPlaceholder')}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="technicianName">{t('maintenance.categories.technician')}</Label>
          <Input
            id="technicianName"
            value={formData.technicianName}
            onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
            placeholder={t('maintenanceCosts.technicianPlaceholder')}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">{t('maintenanceCosts.amount')}</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder={t('maintenanceCosts.amountPlaceholder')}
            required
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="responsibility">{t('maintenanceCosts.responsibilityColumn')}</Label>
          <Select value={formData.responsibility} onValueChange={(value) => setFormData({...formData, responsibility: value})}>
            <SelectTrigger>
              <SelectValue placeholder={t('maintenanceCosts.responsibilityPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={t('maintenanceCosts.owner')}>{t('maintenanceCosts.owner')}</SelectItem>
              <SelectItem value={t('maintenanceCosts.tenant')}>{t('maintenanceCosts.tenant')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          {t('maintenance.cancel')}
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          {t('maintenanceCosts.createNewInvoice')}
        </Button>
      </div>
    </form>
  );
};

export default InvoiceForm;
