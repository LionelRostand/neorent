
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFirebaseOwners } from '@/hooks/useFirebaseOwners';

interface ContractEditModalProps {
  contract: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: any) => void;
}

const ContractEditModal: React.FC<ContractEditModalProps> = ({
  contract,
  isOpen,
  onClose,
  onSave
}) => {
  const { owners, loading: ownersLoading } = useFirebaseOwners();
  
  // Debug: Log owners data
  useEffect(() => {
    console.log('ContractEditModal - Owners data:', owners);
    console.log('ContractEditModal - Loading state:', ownersLoading);
  }, [owners, ownersLoading]);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    provider: '',
    property: '',
    tenant: '',
    startDate: '',
    endDate: '',
    amount: '',
    status: '',
    jurisdiction: ''
  });

  useEffect(() => {
    if (contract) {
      setFormData({
        title: contract.title || '',
        type: contract.type || '',
        provider: contract.provider || '',
        property: contract.property || '',
        tenant: contract.tenant || '',
        startDate: contract.startDate || '',
        endDate: contract.endDate || '',
        amount: contract.amount || '',
        status: contract.status || '',
        jurisdiction: contract.jurisdiction || ''
      });
    }
  }, [contract]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contract) {
      onSave(contract.id, formData);
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!contract) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le Contrat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bail résidentiel">Bail résidentiel</SelectItem>
                  <SelectItem value="Bail commercial">Bail commercial</SelectItem>
                  <SelectItem value="Colocation">Colocation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="provider">Propriétaire</Label>
              <Select value={formData.provider} onValueChange={(value) => handleChange('provider', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={ownersLoading ? "Chargement..." : "Sélectionner un propriétaire"} />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner) => (
                    <SelectItem key={owner.id} value={owner.name}>
                      {owner.name} - {owner.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="property">Propriété</Label>
              <Input
                id="property"
                value={formData.property}
                onChange={(e) => handleChange('property', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tenant">Locataire</Label>
              <Input
                id="tenant"
                value={formData.tenant}
                onChange={(e) => handleChange('tenant', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Montant mensuel</Label>
              <Input
                id="amount"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Signé">Signé</SelectItem>
                  <SelectItem value="Expiré">Expiré</SelectItem>
                  <SelectItem value="Résilié">Résilié</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="jurisdiction">Juridiction</Label>
              <Input
                id="jurisdiction"
                value={formData.jurisdiction}
                onChange={(e) => handleChange('jurisdiction', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Sauvegarder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContractEditModal;
