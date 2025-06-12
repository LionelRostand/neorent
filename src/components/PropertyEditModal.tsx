
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  status: string;
  tenant: string | null;
  image: string;
  locationType: string;
  totalRooms?: number | null;
  availableRooms?: number | null;
  creditImmobilier?: string;
  charges?: {
    electricity?: number;
    water?: number;
    heating?: number;
    maintenance?: number;
    insurance?: number;
    garbage?: number;
    internet?: number;
    taxes?: number;
  };
}

interface PropertyEditModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Property>) => void;
}

const PropertyEditModal: React.FC<PropertyEditModalProps> = ({ property, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Property>>({});

  useEffect(() => {
    if (property) {
      setFormData({
        ...property,
        charges: property.charges || {
          electricity: 0,
          water: 0,
          heating: 0,
          maintenance: 0,
          insurance: 0,
          garbage: 0,
          internet: 0,
          taxes: 0
        }
      });
    }
  }, [property]);

  const handleChargeChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      charges: {
        ...prev.charges,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const calculateTotalCharges = () => {
    if (!formData.charges) return 0;
    return Object.values(formData.charges).reduce((sum, value) => sum + (value || 0), 0);
  };

  const calculateTotalCost = () => {
    const creditAmount = parseFloat(formData.creditImmobilier || '0') || 0;
    const totalCharges = calculateTotalCharges();
    return creditAmount + totalCharges;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (property && formData) {
      onSave(property.id, formData);
      onClose();
    }
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le bien immobilier</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Textarea
              id="address"
              value={formData.address || ''}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Appartement">Appartement</SelectItem>
                  <SelectItem value="Maison">Maison</SelectItem>
                  <SelectItem value="Studio">Studio</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="surface">Surface (m²)</Label>
              <Input
                id="surface"
                value={formData.surface || ''}
                onChange={(e) => setFormData({...formData, surface: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="creditImmobilier">Crédit immobilier (€)</Label>
              <Input
                id="creditImmobilier"
                value={formData.creditImmobilier || ''}
                onChange={(e) => setFormData({...formData, creditImmobilier: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Libre">Libre</SelectItem>
                  <SelectItem value="Occupé">Occupé</SelectItem>
                  <SelectItem value="En travaux">En travaux</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="locationType">Type de location</Label>
            <Select value={formData.locationType} onValueChange={(value) => setFormData({...formData, locationType: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Location">Location</SelectItem>
                <SelectItem value="Colocation">Colocation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.locationType === 'Colocation' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalRooms">Nombre total de chambres</Label>
                <Input
                  id="totalRooms"
                  type="number"
                  value={formData.totalRooms || ''}
                  onChange={(e) => setFormData({...formData, totalRooms: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="availableRooms">Chambres disponibles</Label>
                <Input
                  id="availableRooms"
                  type="number"
                  value={formData.availableRooms || ''}
                  onChange={(e) => setFormData({...formData, availableRooms: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          )}

          {/* Section des charges */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Charges mensuelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="electricity">Électricité (€/mois)</Label>
                  <Input
                    id="electricity"
                    type="number"
                    value={formData.charges?.electricity || ''}
                    onChange={(e) => handleChargeChange('electricity', e.target.value)}
                    placeholder="Ex: 80"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="water">Eau (€/mois)</Label>
                  <Input
                    id="water"
                    type="number"
                    value={formData.charges?.water || ''}
                    onChange={(e) => handleChargeChange('water', e.target.value)}
                    placeholder="Ex: 45"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heating">Chauffage (€/mois)</Label>
                  <Input
                    id="heating"
                    type="number"
                    value={formData.charges?.heating || ''}
                    onChange={(e) => handleChargeChange('heating', e.target.value)}
                    placeholder="Ex: 120"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maintenance">Maintenance (€/mois)</Label>
                  <Input
                    id="maintenance"
                    type="number"
                    value={formData.charges?.maintenance || ''}
                    onChange={(e) => handleChargeChange('maintenance', e.target.value)}
                    placeholder="Ex: 50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insurance">Assurance (€/mois)</Label>
                  <Input
                    id="insurance"
                    type="number"
                    value={formData.charges?.insurance || ''}
                    onChange={(e) => handleChargeChange('insurance', e.target.value)}
                    placeholder="Ex: 30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="garbage">Ordures ménagères (€/mois)</Label>
                  <Input
                    id="garbage"
                    type="number"
                    value={formData.charges?.garbage || ''}
                    onChange={(e) => handleChargeChange('garbage', e.target.value)}
                    placeholder="Ex: 25"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="internet">Internet (€/mois)</Label>
                  <Input
                    id="internet"
                    type="number"
                    value={formData.charges?.internet || ''}
                    onChange={(e) => handleChargeChange('internet', e.target.value)}
                    placeholder="Ex: 35"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxes">Taxes foncières (€/mois)</Label>
                  <Input
                    id="taxes"
                    type="number"
                    value={formData.charges?.taxes || ''}
                    onChange={(e) => handleChargeChange('taxes', e.target.value)}
                    placeholder="Ex: 100"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total charges mensuelles:</span>
                  <span className="text-blue-600">{calculateTotalCharges().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-green-600">
                  <span>Coût total mensuel:</span>
                  <span>{calculateTotalCost().toFixed(2)}€</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Sauvegarder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyEditModal;
