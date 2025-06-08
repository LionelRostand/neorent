
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { determineResponsibility } from './utils/responsibilityUtils';

interface MaintenanceFormData {
  propertyId: string;
  tenantName: string;
  category: string;
  priority: string;
  description: string;
  location: string;
  requestDate: string;
}

interface MaintenanceFormProps {
  onSubmit: (formData: MaintenanceFormData) => void;
}

const MaintenanceForm = ({ onSubmit }: MaintenanceFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<MaintenanceFormData>({
    propertyId: '',
    tenantName: '',
    category: '',
    priority: '',
    description: '',
    location: '',
    requestDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest = {
      id: Date.now().toString(),
      ...formData,
      status: 'En attente',
      responsibility: determineResponsibility(formData.category)
    };

    onSubmit(newRequest);
    setFormData({
      propertyId: '',
      tenantName: '',
      category: '',
      priority: '',
      description: '',
      location: '',
      requestDate: new Date().toISOString().split('T')[0]
    });

    toast({
      title: "Demande enregistrée",
      description: "La demande de maintenance a été créée avec succès.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="propertyId">Bien Immobilier</Label>
          <Select value={formData.propertyId} onValueChange={(value) => setFormData({...formData, propertyId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un bien" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Appartement 15 Rue de la Paix">Appartement 15 Rue de la Paix</SelectItem>
              <SelectItem value="Maison 8 Avenue des Roses">Maison 8 Avenue des Roses</SelectItem>
              <SelectItem value="Studio 22 Boulevard Victor Hugo">Studio 22 Boulevard Victor Hugo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenantName">Nom du Locataire</Label>
          <Input
            id="tenantName"
            value={formData.tenantName}
            onChange={(e) => setFormData({...formData, tenantName: e.target.value})}
            placeholder="Nom du locataire"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Type de maintenance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Plomberie">Plomberie</SelectItem>
              <SelectItem value="Électricité">Électricité</SelectItem>
              <SelectItem value="Chauffage">Chauffage</SelectItem>
              <SelectItem value="Peinture">Peinture</SelectItem>
              <SelectItem value="Serrurerie">Serrurerie</SelectItem>
              <SelectItem value="Ménage">Ménage</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priorité</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Niveau de priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="faible">Faible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Localisation</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            placeholder="Ex: Cuisine, Salon, Salle de bain..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requestDate">Date de la demande</Label>
          <Input
            id="requestDate"
            type="date"
            value={formData.requestDate}
            onChange={(e) => setFormData({...formData, requestDate: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Décrivez le problème en détail..."
          className="min-h-[100px]"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Enregistrer la demande
      </Button>
    </form>
  );
};

export default MaintenanceForm;
