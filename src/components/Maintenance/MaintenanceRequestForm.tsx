
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Building, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MaintenanceRequestForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    propertyId: '',
    tenantName: '',
    category: '',
    priority: '',
    description: '',
    location: '',
    requestDate: new Date().toISOString().split('T')[0]
  });

  const [requests, setRequests] = useState([
    {
      id: '1',
      propertyId: 'Appartement 15 Rue de la Paix',
      tenantName: 'Marie Dupont',
      category: 'Plomberie',
      priority: 'urgent',
      description: 'Fuite d\'eau dans la salle de bain',
      location: 'Salle de bain',
      status: 'En attente',
      requestDate: '2024-01-15',
      responsibility: 'Propriétaire'
    },
    {
      id: '2',
      propertyId: 'Maison 8 Avenue des Roses',
      tenantName: 'Pierre Martin',
      category: 'Électricité',
      priority: 'normal',
      description: 'Ampoule grillée dans le salon',
      location: 'Salon',
      status: 'En cours',
      requestDate: '2024-01-14',
      responsibility: 'Locataire'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest = {
      id: Date.now().toString(),
      ...formData,
      status: 'En attente',
      responsibility: determineResponsibility(formData.category)
    };

    setRequests([newRequest, ...requests]);
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

  const determineResponsibility = (category: string) => {
    const proprietaireCategories = ['Plomberie', 'Électricité', 'Chauffage', 'Structure'];
    return proprietaireCategories.includes(category) ? 'Propriétaire' : 'Locataire';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'normal': return 'default';
      case 'faible': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Demandes récentes</h3>
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {request.category} - {request.location}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                  <Badge variant="outline">
                    {request.responsibility}
                  </Badge>
                </div>
              </div>
              <CardDescription className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {request.propertyId}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {request.tenantName}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {request.requestDate}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
              <Badge variant="secondary">{request.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceRequestForm;
