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
    roomNumber: '',
    startDate: '',
    endDate: '',
    amount: '',
    tenant: '',
    jurisdiction: '',
    description: ''
  });

  // Données simulées pour les locataires
  const tenants = [
    { id: 1, name: 'Marie Dubois', type: 'Locataire' },
    { id: 2, name: 'Jean Martin', type: 'Locataire' },
    { id: 3, name: 'Sophie Leroy', type: 'Locataire' }
  ];

  // Données simulées pour les colocataires
  const roommates = [
    { id: 4, name: 'Pierre Durand', type: 'Colocataire', property: 'Villa Montparnasse' },
    { id: 5, name: 'Lisa Chen', type: 'Colocataire', property: 'Appartement République' }
  ];

  // Données simulées pour les biens
  const locationProperties = [
    'Appartement Rue des Fleurs',
    'Studio Centre-ville',
    'Appartement Boulevard Haussmann'
  ];

  const colocationProperties = [
    'Villa Montparnasse',
    'Appartement République'
  ];

  // Chambres par bien en colocation
  const roomsByProperty = {
    'Villa Montparnasse': ['Chambre 1', 'Chambre 2', 'Chambre 3'],
    'Appartement République': ['Chambre A', 'Chambre B']
  };

  const contractTypes = [
    'Bail locatif',
    'Bail colocatif'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when type changes
      if (field === 'type') {
        newData.property = '';
        newData.tenant = '';
        newData.roomNumber = '';
      }
      
      // Reset room when property changes
      if (field === 'property') {
        newData.roomNumber = '';
      }
      
      return newData;
    });
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
    
    // Simuler la génération et le stockage du PDF
    const pdfDocument = {
      id: Date.now(),
      name: `Contrat_${formData.type.replace(' ', '_')}_${formData.tenant.split(' ')[0]}.pdf`,
      type: 'contrat_bail',
      uploadDate: new Date().toISOString(),
      contractId: contractData.id
    };
    
    console.log('Document PDF généré et stocké:', pdfDocument);
    
    onSubmit(contractData);
    onClose();
  };

  // Determine which properties and tenants to show based on contract type
  const getAvailableProperties = () => {
    if (formData.type === 'Bail locatif') return locationProperties;
    if (formData.type === 'Bail colocatif') return colocationProperties;
    return [];
  };

  const getAvailableTenants = () => {
    if (formData.type === 'Bail locatif') return tenants;
    if (formData.type === 'Bail colocatif') return roommates;
    return [];
  };

  const getAvailableRooms = () => {
    if (formData.type === 'Bail colocatif' && formData.property) {
      return roomsByProperty[formData.property] || [];
    }
    return [];
  };

  const isBailContract = formData.type === 'Bail locatif' || formData.type === 'Bail colocatif';
  const isColocatifContract = formData.type === 'Bail colocatif';

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

          {isBailContract && (
            <div>
              <Label htmlFor="property">Bien immobilier</Label>
              <Select value={formData.property} onValueChange={(value) => handleInputChange('property', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bien" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableProperties().map((property) => (
                    <SelectItem key={property} value={property}>
                      {property}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!isBailContract && (
            <div>
              <Label htmlFor="property">Bien immobilier</Label>
              <Select value={formData.property} onValueChange={(value) => handleInputChange('property', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un bien" />
                </SelectTrigger>
                <SelectContent>
                  {[...locationProperties, ...colocationProperties].map((property) => (
                    <SelectItem key={property} value={property}>
                      {property}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isBailContract && (
            <div>
              <Label htmlFor="tenant">
                {formData.type === 'Bail locatif' ? 'Locataire *' : 'Colocataire *'}
              </Label>
              <Select value={formData.tenant} onValueChange={(value) => handleInputChange('tenant', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={`Sélectionner un ${formData.type === 'Bail locatif' ? 'locataire' : 'colocataire'}`} />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTenants().map((tenant) => (
                    <SelectItem key={tenant.id} value={`${tenant.name} (${tenant.type})`}>
                      {tenant.name} ({tenant.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!isBailContract && (
            <div>
              <Label htmlFor="tenant">Locataire/Colocataire *</Label>
              <Select value={formData.tenant} onValueChange={(value) => handleInputChange('tenant', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un locataire" />
                </SelectTrigger>
                <SelectContent>
                  {[...tenants, ...roommates].map((tenant) => (
                    <SelectItem key={tenant.id} value={`${tenant.name} (${tenant.type})`}>
                      {tenant.name} ({tenant.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isColocatifContract && formData.property && (
            <div>
              <Label htmlFor="roomNumber">Chambre</Label>
              <Select value={formData.roomNumber} onValueChange={(value) => handleInputChange('roomNumber', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une chambre" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRooms().map((room) => (
                    <SelectItem key={room} value={room}>
                      {room}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
