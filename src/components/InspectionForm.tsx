
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
    tenant: '',
    property: '',
    propertyType: '',
    date: '',
    inspector: '',
    description: '',
    observations: ''
  });

  // Données simulées pour les locataires/colocataires
  const tenants = [
    { id: 1, name: 'Marie Dubois', type: 'Locataire' },
    { id: 2, name: 'Jean Martin', type: 'Locataire' },
    { id: 3, name: 'Sophie Leroy', type: 'Locataire' },
    { id: 4, name: 'Pierre Durand', type: 'Colocataire' },
    { id: 5, name: 'Lisa Chen', type: 'Colocataire' }
  ];

  // Données simulées pour les biens immobiliers
  const properties = [
    { id: 1, name: 'Villa Montparnasse', type: 'Maison' },
    { id: 2, name: 'Appartement Rue des Fleurs', type: 'Appartement' },
    { id: 3, name: 'Studio Centre-ville', type: 'Appartement' },
    { id: 4, name: 'Appartement Boulevard Haussmann', type: 'Appartement' },
    { id: 5, name: 'Chambre A - Résidence Les Jardins', type: 'Chambre' },
    { id: 6, name: 'Chambre B - Résidence Les Jardins', type: 'Chambre' }
  ];

  const inspectionTypes = [
    'Entrée',
    'Sortie',
    'Périodique',
    'Maintenance'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.tenant || !formData.property) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const inspectionData = {
      ...formData,
      id: Date.now(),
      status: 'Planifié'
    };

    console.log('État des lieux ajouté à la collection rent_etat:', inspectionData);
    onSubmit(inspectionData);
    onClose();
  };

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
            <Label htmlFor="property">Bien immobilier *</Label>
            <Select value={formData.property} onValueChange={(value) => {
              const selectedProperty = properties.find(p => p.name === value);
              handleInputChange('property', value);
              if (selectedProperty) {
                handleInputChange('propertyType', selectedProperty.type);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un bien" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.name}>
                    {property.name} ({property.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
