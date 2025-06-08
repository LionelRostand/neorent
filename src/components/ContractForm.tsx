import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

interface ContractFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ContractForm = ({ onClose, onSubmit }: ContractFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    provider: '',
    property: '',
    startDate: '',
    endDate: '',
    amount: '',
    tenant: '',
    jurisdiction: '',
    description: ''
  });

  // Données simulées pour les locataires/colocataires
  const tenants = [
    { id: 1, name: 'Marie Dubois', type: 'Locataire' },
    { id: 2, name: 'Jean Martin', type: 'Locataire' },
    { id: 3, name: 'Sophie Leroy', type: 'Locataire' },
    { id: 4, name: 'Pierre Durand', type: 'Colocataire' },
    { id: 5, name: 'Lisa Chen', type: 'Colocataire' }
  ];

  const properties = [
    'Villa Montparnasse',
    'Appartement Rue des Fleurs',
    'Studio Centre-ville',
    'Appartement Boulevard Haussmann',
    'Résidence Les Jardins'
  ];

  const contractTypes = [
    'Maintenance',
    'Assurance',
    'Syndic',
    'Bail locatif',
    'Prestations'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.tenant || !formData.jurisdiction) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const contractData = {
      ...formData,
      id: Date.now(),
      status: 'Actif'
    };

    console.log('Contrat de bail ajouté à la collection rent_contrats:', contractData);
    onSubmit(contractData);
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Nouveau Contrat de Bail</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Titre du contrat de bail *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Contrat de bail - Villa Montparnasse..."
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type de contrat *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="provider">Prestataire</Label>
            <Input
              id="provider"
              value={formData.provider}
              onChange={(e) => handleInputChange('provider', e.target.value)}
              placeholder="Nom du prestataire"
            />
          </div>

          <div>
            <Label htmlFor="property">Bien immobilier</Label>
            <Select value={formData.property} onValueChange={(value) => handleInputChange('property', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un bien" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property} value={property}>
                    {property}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tenant">Locataire/Colocataire *</Label>
            <Select value={formData.tenant} onValueChange={(value) => handleInputChange('tenant', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un locataire" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={`${tenant.name} (${tenant.type})`}>
                    {tenant.name} ({tenant.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="jurisdiction">Juridiction *</Label>
            <Select value={formData.jurisdiction} onValueChange={(value) => handleInputChange('jurisdiction', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir la juridiction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="francaise">Française</SelectItem>
                <SelectItem value="camerounaise">Camerounaise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="endDate">Date de fin</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="Ex: 1,200€"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Description détaillée du contrat..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Créer le contrat de bail
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default ContractForm;
