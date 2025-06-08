
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Building2, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockProperties = [
  { 
    id: 1, 
    name: 'Appartement Rue des Fleurs', 
    type: 'Location',
    tenant: 'Marie Dubois'
  },
  { 
    id: 2, 
    name: 'Villa Montparnasse', 
    type: 'Location',
    tenant: 'Jean Martin'
  },
  { 
    id: 3, 
    name: 'Appartement Bastille - Chambre 1', 
    type: 'Colocation',
    tenant: 'Sophie Leroy'
  },
  { 
    id: 4, 
    name: 'Appartement Bastille - Chambre 2', 
    type: 'Colocation',
    tenant: 'Pierre Durand'
  },
];

interface RentalChargeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const RentalChargeForm = ({ isOpen, onClose, onSubmit }: RentalChargeFormProps) => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [charges, setCharges] = useState({
    electricity: '',
    water: '',
    heating: '',
    maintenance: '',
    insurance: '',
    garbage: '',
    internet: ''
  });
  const { toast } = useToast();

  const selectedPropertyData = mockProperties.find(p => p.id.toString() === selectedProperty);

  const handleChargeChange = (field: string, value: string) => {
    setCharges(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    return Object.values(charges).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProperty) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un bien immobilier.",
        variant: "destructive",
      });
      return;
    }

    const property = mockProperties.find(p => p.id.toString() === selectedProperty);
    if (!property) return;

    const chargeData = {
      propertyName: property.name,
      propertyType: property.type,
      tenant: property.tenant,
      month,
      electricity: parseFloat(charges.electricity) || 0,
      water: parseFloat(charges.water) || 0,
      heating: parseFloat(charges.heating) || 0,
      maintenance: parseFloat(charges.maintenance) || 0,
      insurance: parseFloat(charges.insurance) || 0,
      garbage: parseFloat(charges.garbage) || 0,
      internet: parseFloat(charges.internet) || 0,
    };

    onSubmit(chargeData);
    
    toast({
      title: "Charges ajoutées",
      description: `Charges pour ${property.name} ajoutées avec succès.`,
    });

    // Reset form
    setSelectedProperty('');
    setCharges({
      electricity: '',
      water: '',
      heating: '',
      maintenance: '',
      insurance: '',
      garbage: '',
      internet: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Ajouter des Charges Locatives
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection du bien */}
          <div className="space-y-2">
            <Label htmlFor="property">Bien immobilier</Label>
            <Select value={selectedProperty} onValueChange={setSelectedProperty}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un bien" />
              </SelectTrigger>
              <SelectContent>
                {mockProperties.map((property) => (
                  <SelectItem key={property.id} value={property.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{property.name} - {property.type}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPropertyData && (
              <p className="text-sm text-gray-600">
                Locataire: {selectedPropertyData.tenant}
              </p>
            )}
          </div>

          {/* Sélection du mois */}
          <div className="space-y-2">
            <Label htmlFor="month">Mois</Label>
            <Input
              id="month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>

          {/* Charges détaillées */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détail des charges</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="electricity">Électricité (€)</Label>
                  <Input
                    id="electricity"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={charges.electricity}
                    onChange={(e) => handleChargeChange('electricity', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="water">Eau (€)</Label>
                  <Input
                    id="water"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={charges.water}
                    onChange={(e) => handleChargeChange('water', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heating">Chauffage (€)</Label>
                  <Input
                    id="heating"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={charges.heating}
                    onChange={(e) => handleChargeChange('heating', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance">Entretien (€)</Label>
                  <Input
                    id="maintenance"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={charges.maintenance}
                    onChange={(e) => handleChargeChange('maintenance', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Assurance (€)</Label>
                  <Input
                    id="insurance"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={charges.insurance}
                    onChange={(e) => handleChargeChange('insurance', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="garbage">Ordures ménagères (€)</Label>
                  <Input
                    id="garbage"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={charges.garbage}
                    onChange={(e) => handleChargeChange('garbage', e.target.value)}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="internet">Internet/TV (€)</Label>
                  <Input
                    id="internet"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={charges.internet}
                    onChange={(e) => handleChargeChange('internet', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total calculé */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-blue-800">Total des charges:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {calculateTotal().toFixed(2)}€
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <DollarSign className="mr-2 h-4 w-4" />
              Enregistrer les charges
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RentalChargeForm;
