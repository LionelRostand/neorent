
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, User, Phone, Euro, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';

const InterventionTracking = () => {
  const { toast } = useToast();
  const { requests, interventions, updateIntervention, addIntervention, loading } = useFirebaseMaintenances();
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planifiée': return 'default';
      case 'En cours': return 'secondary';
      case 'Terminée': return 'success';
      case 'Annulée': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Planifiée': return <Clock className="h-4 w-4" />;
      case 'En cours': return <AlertCircle className="h-4 w-4" />;
      case 'Terminée': return <CheckCircle className="h-4 w-4" />;
      case 'Annulée': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateIntervention(id, { status: newStatus });
      toast({
        title: "Statut mis à jour",
        description: `L'intervention a été marquée comme ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleInterventionUpdate = async (updatedIntervention: any) => {
    try {
      await updateIntervention(updatedIntervention.id, updatedIntervention);
      setIsDialogOpen(false);
      toast({
        title: "Intervention mise à jour",
        description: "Les informations ont été sauvegardées avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  // Créer des interventions depuis les demandes qui n'en ont pas encore
  const createInterventionsFromRequests = () => {
    requests.forEach(async (request) => {
      const existingIntervention = interventions.find(i => i.requestId === request.id);
      if (!existingIntervention && request.status === 'En attente') {
        try {
          await addIntervention({
            requestId: request.id,
            property: request.propertyId,
            description: request.description,
            status: 'Planifiée',
            priority: request.priority,
            technicianName: '',
            technicianPhone: '',
            scheduledDate: '',
            scheduledTime: '',
            estimatedCost: 0,
            actualCost: null,
            completionNotes: ''
          });
        } catch (error) {
          console.error('Erreur lors de la création de l\'intervention:', error);
        }
      }
    });
  };

  React.useEffect(() => {
    if (requests.length > 0 && !loading) {
      createInterventionsFromRequests();
    }
  }, [requests, loading]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Planifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {interventions.filter(i => i.status === 'Planifiée').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {interventions.filter(i => i.status === 'En cours').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {interventions.filter(i => i.status === 'Terminée').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Coût total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {interventions.reduce((sum, i) => sum + (i.actualCost || i.estimatedCost), 0)}€
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interventions en cours</CardTitle>
          <CardDescription>
            Suivi et gestion des interventions de maintenance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bien</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead>Date prévue</TableHead>
                <TableHead>Coût</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {interventions.map((intervention) => (
                <TableRow key={intervention.id}>
                  <TableCell className="font-medium">
                    {intervention.property}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{intervention.description}</p>
                      <Badge variant="outline" className="mt-1">
                        {intervention.priority}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3" />
                        {intervention.technicianName || 'Non assigné'}
                      </span>
                      {intervention.technicianPhone && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {intervention.technicianPhone}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {intervention.scheduledDate && (
                        <span className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {intervention.scheduledDate}
                        </span>
                      )}
                      {intervention.scheduledTime && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {intervention.scheduledTime}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Euro className="h-3 w-3" />
                      <span className="text-sm">
                        {intervention.actualCost || intervention.estimatedCost}€
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(intervention.status)} className="flex items-center gap-1">
                      {getStatusIcon(intervention.status)}
                      {intervention.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedIntervention(intervention)}
                          >
                            Modifier
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Modifier l'intervention</DialogTitle>
                            <DialogDescription>
                              Mettre à jour les informations de l'intervention
                            </DialogDescription>
                          </DialogHeader>
                          {selectedIntervention && (
                            <InterventionEditForm 
                              intervention={selectedIntervention}
                              onSave={handleInterventionUpdate}
                              onCancel={() => setIsDialogOpen(false)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Select 
                        value={intervention.status} 
                        onValueChange={(value) => handleStatusUpdate(intervention.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planifiée">Planifiée</SelectItem>
                          <SelectItem value="En cours">En cours</SelectItem>
                          <SelectItem value="Terminée">Terminée</SelectItem>
                          <SelectItem value="Annulée">Annulée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const InterventionEditForm = ({ intervention, onSave, onCancel }: any) => {
  const [formData, setFormData] = useState(intervention);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="technicianName">Nom du technicien</Label>
          <Input
            id="technicianName"
            value={formData.technicianName}
            onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
            placeholder="Nom du technicien"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="technicianPhone">Téléphone du technicien</Label>
          <Input
            id="technicianPhone"
            value={formData.technicianPhone}
            onChange={(e) => setFormData({...formData, technicianPhone: e.target.value})}
            placeholder="06.12.34.56.78"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scheduledDate">Date prévue</Label>
          <Input
            id="scheduledDate"
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="scheduledTime">Heure prévue</Label>
          <Input
            id="scheduledTime"
            type="time"
            value={formData.scheduledTime}
            onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estimatedCost">Coût estimé (€)</Label>
          <Input
            id="estimatedCost"
            type="number"
            value={formData.estimatedCost}
            onChange={(e) => setFormData({...formData, estimatedCost: Number(e.target.value)})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="actualCost">Coût réel (€)</Label>
          <Input
            id="actualCost"
            type="number"
            value={formData.actualCost || ''}
            onChange={(e) => setFormData({...formData, actualCost: e.target.value ? Number(e.target.value) : null})}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="completionNotes">Notes de fin d'intervention</Label>
        <Textarea
          id="completionNotes"
          value={formData.completionNotes}
          onChange={(e) => setFormData({...formData, completionNotes: e.target.value})}
          placeholder="Détails sur l'intervention réalisée..."
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Sauvegarder
        </Button>
      </div>
    </form>
  );
};

export default InterventionTracking;
