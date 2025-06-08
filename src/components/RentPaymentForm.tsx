
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Home, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data - à remplacer par des données réelles
const mockTenants = [
  { id: 1, name: 'Marie Dubois', type: 'Locataire', property: 'Appartement Rue des Fleurs', rentAmount: 1200 },
  { id: 2, name: 'Jean Martin', type: 'Locataire', property: 'Villa Montparnasse', rentAmount: 2500 },
  { id: 3, name: 'Sophie Leroy', type: 'Colocataire', property: 'Appartement Bastille - Chambre 1', rentAmount: 800 },
  { id: 4, name: 'Pierre Durand', type: 'Colocataire', property: 'Appartement Bastille - Chambre 2', rentAmount: 850 },
];

const RentPaymentForm = () => {
  const [open, setOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTenant || !paymentDate || !amount || !paymentMethod) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // Simulation de l'enregistrement du règlement
    console.log('Nouveau règlement de loyer:', {
      tenantId: selectedTenant,
      paymentDate,
      amount: parseFloat(amount),
      paymentMethod,
      notes,
      createdAt: new Date().toISOString()
    });

    toast({
      title: "Règlement enregistré",
      description: "Le règlement de loyer a été enregistré avec succès.",
    });

    // Reset form
    setSelectedTenant('');
    setPaymentDate('');
    setAmount('');
    setPaymentMethod('');
    setNotes('');
    setOpen(false);
  };

  const selectedTenantData = mockTenants.find(t => t.id.toString() === selectedTenant);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Règlement Loyer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Nouveau Règlement de Loyer
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenant">Locataire/Colocataire *</Label>
              <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un locataire/colocataire" />
                </SelectTrigger>
                <SelectContent>
                  {mockTenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id.toString()}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-sm text-gray-500">{tenant.type} - {tenant.property}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Date de Règlement *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
              />
            </div>
          </div>

          {selectedTenantData && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Home className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Informations du bien</span>
              </div>
              <p className="text-sm text-gray-600">Propriété: {selectedTenantData.property}</p>
              <p className="text-sm text-gray-600">Loyer mensuel: {selectedTenantData.rentAmount}€</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (€) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder={selectedTenantData ? selectedTenantData.rentAmount.toString() : "0.00"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Mode de Paiement *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le mode de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virement">Virement bancaire</SelectItem>
                  <SelectItem value="cheque">Chèque</SelectItem>
                  <SelectItem value="especes">Espèces</SelectItem>
                  <SelectItem value="carte">Carte bancaire</SelectItem>
                  <SelectItem value="prelevement">Prélèvement automatique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Input
              id="notes"
              placeholder="Commentaires ou remarques sur ce règlement..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Enregistrer le Règlement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RentPaymentForm;
