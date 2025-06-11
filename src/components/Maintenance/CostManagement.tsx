import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Euro, FileText, Download, Plus, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

const CostManagement = () => {
  const { toast } = useToast();
  const { invoices, addInvoice, loading } = useFirebaseMaintenances();
  const { properties } = useFirebaseProperties();
  
  // Générer les années à partir de 2025
  const currentYear = new Date().getFullYear();
  const startYear = Math.max(2025, currentYear);
  const years = Array.from({ length: 5 }, (_, index) => startYear + index);
  
  const [selectedPeriod, setSelectedPeriod] = useState(startYear.toString());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const totalCosts = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const proprietaireCosts = invoices.filter(i => i.responsibility === 'Propriétaire').reduce((sum, i) => sum + i.amount, 0);
  const locataireCosts = invoices.filter(i => i.responsibility === 'Locataire').reduce((sum, i) => sum + i.amount, 0);
  const pendingCosts = invoices.filter(i => i.status === 'En attente').reduce((sum, i) => sum + i.amount, 0);

  const handleNewInvoice = async (invoice: any) => {
    try {
      await addInvoice(invoice);
      setIsDialogOpen(false);
      toast({
        title: "Facture créée",
        description: "La nouvelle facture a été enregistrée.",
      });
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée': return 'success';
      case 'En attente': return 'secondary';
      case 'En retard': return 'destructive';
      default: return 'default';
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Coût total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCosts}€</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Charge propriétaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{proprietaireCosts}€</div>
            <p className="text-xs text-muted-foreground">
              {totalCosts > 0 ? ((proprietaireCosts / totalCosts) * 100).toFixed(1) : 0}% du total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Charge locataire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{locataireCosts}€</div>
            <p className="text-xs text-muted-foreground">
              {totalCosts > 0 ? ((locataireCosts / totalCosts) * 100).toFixed(1) : 0}% du total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">En attente de paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingCosts}€</div>
          </CardContent>
        </Card>
      </div>

      {/* Gestion des factures */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Gestion des Coûts</CardTitle>
              <CardDescription>Facturation et suivi des paiements</CardDescription>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle facture
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle facture</DialogTitle>
                    <DialogDescription>
                      Enregistrer une nouvelle facture de maintenance
                    </DialogDescription>
                  </DialogHeader>
                  <InvoiceForm 
                    onSave={handleNewInvoice} 
                    properties={properties}
                    onCancel={() => setIsDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">Facture N°</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[150px]">Bien</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  <TableHead className="min-w-[100px]">Montant</TableHead>
                  <TableHead className="min-w-[120px]">Responsabilité</TableHead>
                  <TableHead className="min-w-[100px]">Statut</TableHead>
                  <TableHead className="min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono text-sm">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {invoice.property}
                    </TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 font-semibold">
                        <Euro className="h-3 w-3" />
                        {invoice.amount}€
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={invoice.responsibility === 'Propriétaire' ? 'default' : 'secondary'}>
                        {invoice.responsibility}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <FileText className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Récapitulatif par responsabilité */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Charges Propriétaire</CardTitle>
            <CardDescription>Réparations et entretien à votre charge</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.filter(i => i.responsibility === 'Propriétaire').map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{invoice.description}</p>
                    <p className="text-xs text-muted-foreground">{invoice.property}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{invoice.amount}€</p>
                    <Badge variant={getStatusColor(invoice.status)} className="text-xs">
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Charges Locataire</CardTitle>
            <CardDescription>Réparations à facturer aux locataires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.filter(i => i.responsibility === 'Locataire').map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{invoice.description}</p>
                    <p className="text-xs text-muted-foreground">{invoice.property}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{invoice.amount}€</p>
                    <Badge variant={getStatusColor(invoice.status)} className="text-xs">
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const InvoiceForm = ({ onSave, properties, onCancel }: { onSave: (invoice: any) => void, properties: any[], onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: `MAINT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
    date: new Date().toISOString().split('T')[0],
    property: '',
    description: '',
    technicianName: '',
    amount: '',
    responsibility: '',
    status: 'En attente',
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
          <Label htmlFor="invoiceNumber">Numéro de facture</Label>
          <Input
            id="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            required
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="property">Bien immobilier</Label>
          <Select value={formData.property} onValueChange={(value) => setFormData({...formData, property: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un bien" />
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
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Description de l'intervention"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="technicianName">Technicien</Label>
          <Input
            id="technicianName"
            value={formData.technicianName}
            onChange={(e) => setFormData({...formData, technicianName: e.target.value})}
            placeholder="Nom du technicien"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Montant (€)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            placeholder="0.00"
            required
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label htmlFor="responsibility">Responsabilité</Label>
          <Select value={formData.responsibility} onValueChange={(value) => setFormData({...formData, responsibility: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Qui paie cette facture ?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Propriétaire">Propriétaire</SelectItem>
              <SelectItem value="Locataire">Locataire</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Annuler
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          Créer la facture
        </Button>
      </div>
    </form>
  );
};

export default CostManagement;
