
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

const CostManagement = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('2024');
  const [invoices, setInvoices] = useState([
    {
      id: '1',
      invoiceNumber: 'MAINT-2024-001',
      date: '2024-01-18',
      property: 'Maison 8 Avenue des Roses',
      description: 'Remplacement ampoule LED salon',
      technicianName: 'Marie Électricienne',
      amount: 20,
      responsibility: 'Locataire',
      status: 'Payée',
      tenantNotified: true
    },
    {
      id: '2',
      invoiceNumber: 'MAINT-2024-002',
      date: '2024-01-20',
      property: 'Appartement 15 Rue de la Paix',
      description: 'Réparation fuite salle de bain',
      technicianName: 'Jean Plombier',
      amount: 150,
      responsibility: 'Propriétaire',
      status: 'En attente',
      tenantNotified: false
    }
  ]);

  const totalCosts = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const proprietaireCosts = invoices.filter(i => i.responsibility === 'Propriétaire').reduce((sum, i) => sum + i.amount, 0);
  const locataireCosts = invoices.filter(i => i.responsibility === 'Locataire').reduce((sum, i) => sum + i.amount, 0);
  const pendingCosts = invoices.filter(i => i.status === 'En attente').reduce((sum, i) => sum + i.amount, 0);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id 
        ? { ...invoice, status: newStatus }
        : invoice
    ));
    
    toast({
      title: "Statut mis à jour",
      description: `La facture a été marquée comme ${newStatus.toLowerCase()}.`,
    });
  };

  const handleNotifyTenant = (id: string) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === id 
        ? { ...invoice, tenantNotified: true }
        : invoice
    ));
    
    toast({
      title: "Locataire notifié",
      description: "Le locataire a été informé de la facture.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Payée': return 'success';
      case 'En attente': return 'secondary';
      case 'En retard': return 'destructive';
      default: return 'default';
    }
  };

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
              {((proprietaireCosts / totalCosts) * 100).toFixed(1)}% du total
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
              {((locataireCosts / totalCosts) * 100).toFixed(1)}% du total
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

      {/* Filtres et actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestion des Coûts</CardTitle>
              <CardDescription>Facturation et suivi des paiements</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle facture
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer une nouvelle facture</DialogTitle>
                    <DialogDescription>
                      Enregistrer une nouvelle facture de maintenance
                    </DialogDescription>
                  </DialogHeader>
                  <InvoiceForm onSave={(invoice) => {
                    setInvoices([{ ...invoice, id: Date.now().toString() }, ...invoices]);
                    toast({
                      title: "Facture créée",
                      description: "La nouvelle facture a été enregistrée.",
                    });
                  }} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Facture N°</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Responsabilité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
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
                      {invoice.responsibility === 'Locataire' && !invoice.tenantNotified && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleNotifyTenant(invoice.id)}
                        >
                          <Receipt className="h-3 w-3" />
                        </Button>
                      )}
                      <Select 
                        value={invoice.status} 
                        onValueChange={(value) => handleStatusUpdate(invoice.id, value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="En attente">En attente</SelectItem>
                          <SelectItem value="Payée">Payée</SelectItem>
                          <SelectItem value="En retard">En retard</SelectItem>
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
                    {!invoice.tenantNotified && (
                      <Badge variant="outline" className="text-xs mt-1">
                        Non notifié
                      </Badge>
                    )}
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

const InvoiceForm = ({ onSave }: { onSave: (invoice: any) => void }) => {
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
    setFormData({
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
              <SelectItem value="Appartement 15 Rue de la Paix">Appartement 15 Rue de la Paix</SelectItem>
              <SelectItem value="Maison 8 Avenue des Roses">Maison 8 Avenue des Roses</SelectItem>
              <SelectItem value="Studio 22 Boulevard Victor Hugo">Studio 22 Boulevard Victor Hugo</SelectItem>
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
      
      <div className="flex justify-end">
        <Button type="submit">
          Créer la facture
        </Button>
      </div>
    </form>
  );
};

export default CostManagement;
