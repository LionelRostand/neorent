import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Home, Calendar, DollarSign, CreditCard } from 'lucide-react';
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
        <Button className="bg-green-600 hover:bg-green-700 shadow-lg">
          <Plus className="mr-2 h-4 w-4" />
          Règlement Loyer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            Nouveau Règlement de Loyer
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section Sélection du locataire/colocataire */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="tenant" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  {selectedTenantData?.type === 'Colocataire' ? 'Colocataire' : 'Locataire'} 
                  <span className="text-red-500">*</span>
                </Label>
                <Select value={selectedTenant} onValueChange={(value) => {
                  setSelectedTenant(value);
                  const tenant = allTenants.find(t => t.id === value);
                  if (tenant) {
                    setAmount(tenant.rentAmount.toString());
                  }
                }}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Sélectionner un locataire/colocataire" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {allTenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id} className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-blue-100 rounded-full">
                            <User className="h-3 w-3 text-blue-600" />
                          </div>
                          <div className="font-medium text-gray-900">{tenant.name}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="paymentDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Date de Règlement 
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Section Informations du bien */}
            {selectedTenantData && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Home className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-800 text-lg">Informations du bien</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Type</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedTenantData.type}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Propriété</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedTenantData.property}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-blue-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Loyer mensuel</p>
                    <p className="text-sm font-semibold text-green-600">{selectedTenantData.rentAmount}€</p>
                  </div>
                </div>
              </div>
            )}

            {/* Section Montant et Mode de paiement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="amount" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Montant (€) 
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder={selectedTenantData ? selectedTenantData.rentAmount.toString() : "0.00"}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-12 border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors pl-4 pr-8 text-lg font-semibold"
                    required
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 font-medium">€</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="paymentMethod" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  Mode de Paiement 
                  <span className="text-red-500">*</span>
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Sélectionner le mode de paiement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virement" className="py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        Virement bancaire
                      </div>
                    </SelectItem>
                    <SelectItem value="cheque" className="py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        Chèque
                      </div>
                    </SelectItem>
                    <SelectItem value="especes" className="py-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                        Espèces
                      </div>
                    </SelectItem>
                    <SelectItem value="carte" className="py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                        Carte bancaire
                      </div>
                    </SelectItem>
                    <SelectItem value="prelevement" className="py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-indigo-600" />
                        Prélèvement automatique
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section Notes */}
            <div className="space-y-3">
              <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                Notes (optionnel)
              </Label>
              <Input
                id="notes"
                placeholder="Commentaires ou remarques sur ce règlement..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="h-12 border-2 border-gray-200 hover:border-gray-300 focus:border-gray-400 transition-colors"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="px-6 py-3 text-gray-600 border-gray-300 hover:bg-gray-50"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Enregistrer le Règlement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RentPaymentForm;
