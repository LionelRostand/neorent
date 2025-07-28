import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { useFirebaseOwners } from '@/hooks/useFirebaseOwners';

interface Property {
  id: string;
  title: string;
  address: string;
  streetNumber?: string;
  street?: string;
  city?: string;
  postalCode?: string;
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
  owner?: string;
  floor?: string;
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
  const { t } = useTranslation();
  const { owners, loading: ownersLoading } = useFirebaseOwners();
  const [formData, setFormData] = useState<Partial<Property>>({});

  console.log('🔧 PropertyEditModal - Reçu property:', property);
  console.log('🔧 PropertyEditModal - isOpen:', isOpen);
  console.log('🔧 PropertyEditModal - formData actuel:', formData);
  console.log('🔧 PropertyEditModal - owners loaded:', owners);
  console.log('🔧 PropertyEditModal - loading:', ownersLoading);

  useEffect(() => {
    if (property) {
      console.log('🏠 Propriété reçue:', property);
      
      // Si les champs séparés n'existent pas, tenter de décomposer l'adresse
      let streetNumber = property.streetNumber || '';
      let street = property.street || '';
      let city = property.city || '';
      let postalCode = property.postalCode || '';
      
      // Si aucun champ séparé n'existe mais qu'on a une adresse
      if (!streetNumber && !street && !city && !postalCode && property.address) {
        console.log('📍 Décomposition de l\'adresse:', property.address);
        // Exemple: "721 RESIDENCE DE L'AQUITAINE 77190 DAMMARIE LES LYS"
        const addressParts = property.address.trim().split(' ');
        if (addressParts.length >= 4) {
          // Premier élément = numéro
          streetNumber = addressParts[0];
          // Chercher le code postal (5 chiffres)
          const postalIndex = addressParts.findIndex(part => /^\d{5}$/.test(part));
          if (postalIndex > 0) {
            postalCode = addressParts[postalIndex];
            street = addressParts.slice(1, postalIndex).join(' ');
            city = addressParts.slice(postalIndex + 1).join(' ');
          }
        }
        console.log('📍 Adresse décomposée:', { streetNumber, street, city, postalCode });
      }
      
      const initialData = {
        ...property,
        streetNumber,
        street,
        city,
        postalCode,
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
      };
      
      console.log('📝 FormData initial:', initialData);
      setFormData(initialData);
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
    
    const total = Object.values(formData.charges).reduce((sum, value) => {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
      return sum + numValue;
    }, 0);
    
    return isNaN(total) ? 0 : total;
  };

  const calculateTotalCost = () => {
    const creditAmount = parseFloat(formData.creditImmobilier || '0') || 0;
    const totalCharges = calculateTotalCharges();
    return creditAmount + totalCharges;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (property && formData) {
      // Construire l'adresse complète à partir des champs séparés
      const fullAddress = `${formData.streetNumber || ''} ${formData.street || ''} ${formData.postalCode || ''} ${formData.city || ''}`.trim();
      
      const updatedData = {
        ...formData,
        address: fullAddress
      };
      
      onSave(property.id, updatedData);
      onClose();
    }
  };

  if (!property) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('properties.editProperty')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">{t('propertyForm.titleRequired')}</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="owner">{t('propertyForm.owner')}</Label>
              <Select 
                value={formData.owner || ''} 
                onValueChange={(value) => setFormData({...formData, owner: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder={ownersLoading ? "Chargement..." : "Sélectionner un propriétaire"} />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    // Créer une liste unique de propriétaires par email
                    const uniqueOwners = [...owners];
                    
                    // Ajouter admin@neotech-consulting.com s'il n'existe pas
                    if (!uniqueOwners.some(owner => owner.email === 'admin@neotech-consulting.com')) {
                      uniqueOwners.push({
                        id: 'admin-neotech',
                        email: 'admin@neotech-consulting.com',
                        name: 'admin@neotech-consulting.com',
                        role: 'admin'
                      });
                    }
                    
                    // Filtrer les doublons par email
                    const filteredOwners = uniqueOwners.filter((owner, index, self) => 
                      index === self.findIndex(o => o.email === owner.email)
                    );
                    
                    return filteredOwners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.email}>
                        {owner.name || owner.email} {owner.role === 'admin' ? '(Admin)' : ''}
                      </SelectItem>
                    ));
                  })()}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Champs d'adresse séparés */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="streetNumber">Numéro *</Label>
              <Input
                id="streetNumber"
                value={formData.streetNumber || ''}
                onChange={(e) => setFormData({...formData, streetNumber: e.target.value})}
                placeholder="Ex: 721"
                required
              />
            </div>
            <div>
              <Label htmlFor="street">Rue *</Label>
              <Input
                id="street"
                value={formData.street || ''}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
                placeholder="Ex: Résidence de l'Aquitaine"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                placeholder="Ex: Dammarie-les-Lys"
                required
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode || ''}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                placeholder="Ex: 77190"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type">{t('propertyForm.typeRequired')}</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Appartement">{t('propertyForm.propertyTypes.appartement')}</SelectItem>
                  <SelectItem value="Maison">{t('propertyForm.propertyTypes.maison')}</SelectItem>
                  <SelectItem value="Studio">{t('propertyForm.propertyTypes.studio')}</SelectItem>
                  <SelectItem value="Loft">{t('propertyForm.propertyTypes.loft')}</SelectItem>
                  <SelectItem value="Duplex">{t('propertyForm.propertyTypes.duplex')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="surface">{t('propertyForm.surfaceRequired')}</Label>
              <Input
                id="surface"
                value={formData.surface || ''}
                onChange={(e) => setFormData({...formData, surface: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="floor">{t('propertyForm.floor')}</Label>
              <Input
                id="floor"
                value={formData.floor || ''}
                onChange={(e) => setFormData({...formData, floor: e.target.value})}
                placeholder={t('propertyForm.floorPlaceholder')}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="creditImmobilier">{t('propertyForm.creditImmobilierRequired')}</Label>
              <Input
                id="creditImmobilier"
                value={formData.creditImmobilier || ''}
                onChange={(e) => setFormData({...formData, creditImmobilier: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">{t('properties.status')}</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Libre">{t('properties.vacant')}</SelectItem>
                  <SelectItem value="Occupé">{t('properties.occupied')}</SelectItem>
                  <SelectItem value="En travaux">{t('properties.underRenovation')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="locationType">{t('propertyForm.locationTypeRequired')}</Label>
            <Select value={formData.locationType} onValueChange={(value) => setFormData({...formData, locationType: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Location">{t('propertyForm.locationTypes.location')}</SelectItem>
                <SelectItem value="Colocation">{t('propertyForm.locationTypes.colocation')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.locationType === 'Colocation' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalRooms">{t('propertyForm.roomCountRequired')}</Label>
                <Input
                  id="totalRooms"
                  type="number"
                  value={formData.totalRooms || ''}
                  onChange={(e) => setFormData({...formData, totalRooms: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="availableRooms">{t('properties.availableRooms')}</Label>
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
                {t('propertyForm.charges.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="electricity">{t('propertyForm.charges.electricityUnit')}</Label>
                  <Input
                    id="electricity"
                    type="number"
                    value={formData.charges?.electricity || ''}
                    onChange={(e) => handleChargeChange('electricity', e.target.value)}
                    placeholder={t('propertyForm.charges.electricityPlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="water">{t('propertyForm.charges.waterUnit')}</Label>
                  <Input
                    id="water"
                    type="number"
                    value={formData.charges?.water || ''}
                    onChange={(e) => handleChargeChange('water', e.target.value)}
                    placeholder={t('propertyForm.charges.waterPlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heating">{t('propertyForm.charges.heatingUnit')}</Label>
                  <Input
                    id="heating"
                    type="number"
                    value={formData.charges?.heating || ''}
                    onChange={(e) => handleChargeChange('heating', e.target.value)}
                    placeholder={t('propertyForm.charges.heatingPlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maintenance">{t('propertyForm.charges.maintenanceUnit')}</Label>
                  <Input
                    id="maintenance"
                    type="number"
                    value={formData.charges?.maintenance || ''}
                    onChange={(e) => handleChargeChange('maintenance', e.target.value)}
                    placeholder={t('propertyForm.charges.maintenancePlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insurance">{t('propertyForm.charges.insuranceUnit')}</Label>
                  <Input
                    id="insurance"
                    type="number"
                    value={formData.charges?.insurance || ''}
                    onChange={(e) => handleChargeChange('insurance', e.target.value)}
                    placeholder={t('propertyForm.charges.insurancePlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="garbage">{t('propertyForm.charges.garbageUnit')}</Label>
                  <Input
                    id="garbage"
                    type="number"
                    value={formData.charges?.garbage || ''}
                    onChange={(e) => handleChargeChange('garbage', e.target.value)}
                    placeholder={t('propertyForm.charges.garbagePlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="internet">{t('propertyForm.charges.internetUnit')}</Label>
                  <Input
                    id="internet"
                    type="number"
                    value={formData.charges?.internet || ''}
                    onChange={(e) => handleChargeChange('internet', e.target.value)}
                    placeholder={t('propertyForm.charges.internetPlaceholder')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxes">{t('propertyForm.charges.taxesUnit')}</Label>
                  <Input
                    id="taxes"
                    type="number"
                    value={formData.charges?.taxes || ''}
                    onChange={(e) => handleChargeChange('taxes', e.target.value)}
                    placeholder={t('propertyForm.charges.taxesPlaceholder')}
                  />
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>{t('propertyForm.charges.totalCharges')}</span>
                  <span className="text-blue-600">{calculateTotalCharges().toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-green-600">
                  <span>{t('propertyForm.charges.totalCost')}</span>
                  <span>{calculateTotalCost().toFixed(2)}€</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('propertyForm.cancel')}
            </Button>
            <Button type="submit">
              {t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyEditModal;
