
import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface InspectionFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const InspectionForm = ({ onClose, onSubmit }: InspectionFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    contractType: '',
    tenant: '',
    property: '',
    propertyType: '',
    roomNumber: '',
    date: '',
    inspector: '',
    description: '',
    observations: ''
  });

  // Données simulées pour les locataires
  const tenants = [
    { id: 1, name: 'Marie Dubois', type: 'Locataire' },
    { id: 2, name: 'Jean Martin', type: 'Locataire' },
    { id: 3, name: 'Sophie Leroy', type: 'Locataire' }
  ];

  // Données simulées pour les colocataires
  const roommates = [
    { id: 4, name: 'Pierre Durand', type: 'Colocataire' },
    { id: 5, name: 'Lisa Chen', type: 'Colocataire' }
  ];

  // Données simulées pour les biens en location
  const locationProperties = [
    'Appartement Rue des Fleurs',
    'Studio Centre-ville',
    'Appartement Boulevard Haussmann'
  ];

  // Données simulées pour les biens en colocation
  const colocationProperties = [
    'Villa Montparnasse',
    'Appartement République'
  ];

  // Chambres par bien en colocation
  const roomsByProperty = {
    'Villa Montparnasse': ['Chambre 1', 'Chambre 2', 'Chambre 3'],
    'Appartement République': ['Chambre A', 'Chambre B']
  };

  const inspectionTypes = [
    'Entrée',
    'Sortie',
    'Périodique',
    'Maintenance'
  ];

  const contractTypes = [
    'Bail locatif',
    'Bail colocatif'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields when contract type changes
      if (field === 'contractType') {
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
    
    if (!formData.title || !formData.type || !formData.contractType || !formData.tenant || !formData.property) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const inspectionData = {
      ...formData,
      id: Date.now(),
      status: 'Planifié'
    };

    console.log('État des lieux ajouté à la collection rent_etat:', inspectionData);
    
    // Simuler la génération et le stockage du PDF
    const pdfDocument = {
      id: Date.now(),
      name: `Etat_lieux_${formData.type}_${formData.tenant.split(' ')[0]}.pdf`,
      type: 'etat_lieux',
      uploadDate: new Date().toISOString(),
      inspectionId: inspectionData.id
    };
    
    console.log('Document PDF généré et stocké:', pdfDocument);
    
    onSubmit(inspectionData);
    onClose();
  };

  // Determine which properties and tenants to show based on contract type
  const getAvailableProperties = () => {
    if (formData.contractType === 'Bail locatif') return locationProperties;
    if (formData.contractType === 'Bail colocatif') return colocationProperties;
    return [];
  };

  const getAvailableTenants = () => {
    if (formData.contractType === 'Bail locatif') return tenants;
    if (formData.contractType === 'Bail colocatif') return roommates;
    return [];
  };

  const getAvailableRooms = () => {
    if (formData.contractType === 'Bail colocatif' && formData.property) {
      return roomsByProperty[formData.property] || [];
    }
    return [];
  };

  const isColocatifContract = formData.contractType === 'Bail colocatif';

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Nouvel État des Lieux</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Titre de l'état des lieux *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: État des lieux d'entrée - Marie Dubois..."
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Type d'état des lieux *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {inspectionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="contractType">Type de contrat *</Label>
            <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de contrat" />
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

          {formData.contractType && (
            <div>
              <Label htmlFor="property">Bien immobilier *</Label>
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

          {formData.contractType && (
            <div>
              <Label htmlFor="tenant">
                {formData.contractType === 'Bail locatif' ? 'Locataire *' : 'Colocataire *'}
              </Label>
              <Select value={formData.tenant} onValueChange={(value) => handleInputChange('tenant', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={`Sélectionner un ${formData.contractType === 'Bail locatif' ? 'locataire' : 'colocataire'}`} />
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
            <Label htmlFor="date">Date de l'état des lieux *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="inspector">Inspecteur</Label>
            <Input
              id="inspector"
              value={formData.inspector}
              onChange={(e) => handleInputChange('inspector', e.target.value)}
              placeholder="Nom de l'inspecteur"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Description générale de l'état des lieux..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="observations">Observations</Label>
          <Textarea
            id="observations"
            value={formData.observations}
            onChange={(e) => handleInputChange('observations', e.target.value)}
            placeholder="Observations particulières, défauts constatés..."
            className="min-h-[100px]"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Créer l'état des lieux
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default InspectionForm;
