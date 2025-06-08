
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Building2, Users, DollarSign, Receipt, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data des biens et locataires
const mockProperties = [
  { 
    id: 1, 
    name: 'Appartement Rue des Fleurs', 
    type: 'location', 
    monthlyRent: 1200,
    tenant: 'Marie Dubois',
    startDate: '2023-01-01'
  },
  { 
    id: 2, 
    name: 'Villa Montparnasse', 
    type: 'location', 
    monthlyRent: 2500,
    tenant: 'Jean Martin',
    startDate: '2023-03-01'
  },
  { 
    id: 3, 
    name: 'Appartement Bastille - Chambre 1', 
    type: 'colocation', 
    monthlyRent: 800,
    tenant: 'Sophie Leroy',
    startDate: '2023-02-01'
  },
  { 
    id: 4, 
    name: 'Appartement Bastille - Chambre 2', 
    type: 'colocation', 
    monthlyRent: 850,
    tenant: 'Pierre Durand',
    startDate: '2023-06-01'
  },
];

interface TaxDeclarationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const TaxDeclarationForm = ({ isOpen, onClose, onSubmit }: TaxDeclarationFormProps) => {
  const [declarationYear, setDeclarationYear] = useState(new Date().getFullYear() - 1);
  const [taxBracket, setTaxBracket] = useState('');
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [charges, setCharges] = useState('');
  const { toast } = useToast();

  // Calcul des revenus locatifs pour l'année sélectionnée
  const calculateRentalIncome = () => {
    let totalIncome = 0;
    
    selectedProperties.forEach(propertyId => {
      const property = mockProperties.find(p => p.id === propertyId);
      if (property) {
        const startDate = new Date(property.startDate);
        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth();
        
        // Calcul du nombre de mois de location dans l'année
        let monthsInYear = 12;
        if (startYear === declarationYear) {
          monthsInYear = 12 - startMonth;
        }
        
        totalIncome += property.monthlyRent * monthsInYear;
      }
    });
    
    return totalIncome;
  };

  // Estimation de l'impôt (calcul simplifié)
  const calculateEstimatedTax = (income: number, bracket: string) => {
    const netIncome = income - (parseFloat(charges) || 0);
    
    switch (bracket) {
      case '11':
        return netIncome * 0.11;
      case '30':
        return netIncome * 0.30;
      case '41':
        return netIncome * 0.41;
      case '45':
        return netIncome * 0.45;
      default:
        return 0;
    }
  };

  const totalRentalIncome = calculateRentalIncome();
  const estimatedTax = calculateEstimatedTax(totalRentalIncome, taxBracket);
  const netIncome = totalRentalIncome - (parseFloat(charges) || 0);

  const handlePropertyToggle = (propertyId: number) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedProperties.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un bien immobilier.",
        variant: "destructive",
      });
      return;
    }

    if (!taxBracket) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner votre tranche d'imposition.",
        variant: "destructive",
      });
      return;
    }

    const declarationData = {
      year: declarationYear,
      selectedProperties,
      totalRentalIncome,
      charges: parseFloat(charges) || 0,
      netIncome,
      taxBracket,
      estimatedTax,
      createdAt: new Date().toISOString()
    };

    onSubmit(declarationData);
    
    toast({
      title: "Déclaration créée",
      description: `Déclaration fiscale pour ${declarationYear} créée avec succès.`,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Nouvelle Déclaration Fiscale - {declarationYear}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sélection de l'année */}
          <div className="space-y-2">
            <Label htmlFor="year">Année de déclaration</Label>
            <Select value={declarationYear.toString()} onValueChange={(value) => setDeclarationYear(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={(new Date().getFullYear() - 1).toString()}>{new Date().getFullYear() - 1}</SelectItem>
                <SelectItem value={(new Date().getFullYear() - 2).toString()}>{new Date().getFullYear() - 2}</SelectItem>
                <SelectItem value={(new Date().getFullYear() - 3).toString()}>{new Date().getFullYear() - 3}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sélection des biens */}
          <div className="space-y-4">
            <Label>Sélection des biens immobiliers</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProperties.map((property) => (
                <Card 
                  key={property.id} 
                  className={`cursor-pointer border-2 transition-colors ${
                    selectedProperties.includes(property.id) 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handlePropertyToggle(property.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {property.type === 'colocation' ? <Users className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                          <h4 className="font-medium text-sm">{property.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600">Locataire: {property.tenant}</p>
                        <p className="text-sm font-semibold text-blue-600">{property.monthlyRent}€/mois</p>
                        <p className="text-xs text-gray-500">Depuis: {new Date(property.startDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={selectedProperties.includes(property.id)}
                        onChange={() => handlePropertyToggle(property.id)}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Charges déductibles */}
          <div className="space-y-2">
            <Label htmlFor="charges">Charges déductibles (€)</Label>
            <Input
              id="charges"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={charges}
              onChange={(e) => setCharges(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Frais de gestion, travaux, assurances, etc.
            </p>
          </div>

          {/* Tranche d'imposition */}
          <div className="space-y-2">
            <Label htmlFor="taxBracket">Votre tranche marginale d'imposition</Label>
            <Select value={taxBracket} onValueChange={setTaxBracket}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner votre tranche d'imposition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="11">11% (jusqu'à 10 777€)</SelectItem>
                <SelectItem value="30">30% (de 10 778€ à 27 478€)</SelectItem>
                <SelectItem value="41">41% (de 27 479€ à 78 570€)</SelectItem>
                <SelectItem value="45">45% (plus de 78 570€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Résumé des calculs */}
          {selectedProperties.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Receipt className="h-5 w-5" />
                  Résumé Fiscal {declarationYear}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Revenus Locatifs Bruts</p>
                    <p className="text-xl font-bold text-green-600">{totalRentalIncome.toLocaleString('fr-FR')}€</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Revenus Nets</p>
                    <p className="text-xl font-bold text-blue-600">{netIncome.toLocaleString('fr-FR')}€</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Impôt Estimé</p>
                    <p className="text-xl font-bold text-red-600">{estimatedTax.toLocaleString('fr-FR')}€</p>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-yellow-800 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Cette estimation est indicative et basée sur votre tranche marginale. 
                      Le calcul réel peut varier selon votre situation fiscale globale.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <DollarSign className="mr-2 h-4 w-4" />
              Créer la Déclaration
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaxDeclarationForm;
