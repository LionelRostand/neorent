
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Home, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebasePayments } from '@/hooks/useFirebasePayments';

const RentPaymentForm = () => {
  const [open, setOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();
  const { addPayment } = useFirebasePayments();

  // Combiner les locataires et colocataires avec leur type
  const allTenants = [
    ...tenants.filter(tenant => tenant.status === 'Actif').map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      type: 'Locataire',
      property: tenant.property,
      rentAmount: parseFloat(tenant.rentAmount) || 0
    })),
    ...roommates.filter(roommate => roommate.status === 'Actif').map(roommate => ({
      id: roommate.id,
      name: roommate.name,
      type: 'Colocataire',
      property: `${roommate.property} - Chambre ${roommate.roomNumber}`,
      rentAmount: parseFloat(roommate.rentAmount) || 0
    }))
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTenant || !paymentDate || !amount || !paymentMethod) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const selectedTenantData = allTenants.find(t => t.id === selectedTenant);
    if (!selectedTenantData) {
      toast({
        title: "Erreur",
        description: "Locataire/Colocataire non trouvé.",
        variant: "destructive",
      });
      return;
    }

    try {
      const paymentData = {
        tenantName: selectedTenantData.name,
        tenantType: selectedTenantData.type,
        property: selectedTenantData.property,
        rentAmount: parseFloat(amount),
        dueDate: paymentDate,
        status: 'Payé',
        paymentDate: paymentDate,
        paymentMethod,
        notes: notes || null
      };

      await addPayment(paymentData);

      toast({
        title: "Règlement enregistré",
        description: "Le règlement de loyer a été enregistré avec succès.",
      });

      console.log('Nouveau règlement de loyer ajouté à Rent_Payments:', paymentData);

      // Reset form
      setSelectedTenant('');
      setPaymentDate('');
      setAmount('');
      setPaymentMethod('');
      setNotes('');
      setOpen(false);
    } catch (err) {
      console.error('Erreur lors de l\'ajout du paiement:', err);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'enregistrement du règlement.",
        variant: "destructive",
      });
    }
  };

  const selectedTenantData = allTenants.find(t => t.id === selectedTenant);

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
              <Label htmlFor="tenant">
                {selectedTenantData?.type === 'Colocataire' ? 'Colocataire' : 'Locataire'} *
              </Label>
              <Select value={selectedTenant} onValueChange={(value) => {
                setSelectedTenant(value);
                const tenant = allTenants.find(t => t.id === value);
                if (tenant) {
                  setAmount(tenant.rentAmount.toString());
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un locataire/colocataire" />
                </SelectTrigger>
                <SelectContent>
                  {allTenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
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
              <p className="text-sm text-gray-600">
                Type: {selectedTenantData.type}
              </p>
              <p className="text-sm text-gray-600">
                Propriété: {selectedTenantData.property}
              </p>
              <p className="text-sm text-gray-600">
                Loyer mensuel: {selectedTenantData.rentAmount}€
              </p>
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
