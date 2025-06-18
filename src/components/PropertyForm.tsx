
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PropertyFormData {
  title: string;
  address: string;
  type: string;
  surface: string;
  creditImmobilier: string;
  description: string;
  image: File | null;
  locationType: string;
  roomCount: string;
  owner: string;
  charges: {
    electricity: string;
    water: string;
    heating: string;
    maintenance: string;
    insurance: string;
    garbage: string;
    internet: string;
    taxes: string;
  };
}

interface PropertyFormProps {
  onClose: () => void;
  onSubmit: (data: PropertyFormData & { imageBase64?: string }) => void;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onClose, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    address: '',
    type: '',
    surface: '',
    creditImmobilier: '',
    description: '',
    image: null,
    locationType: '',
    roomCount: '',
    owner: '',
    charges: {
      electricity: '',
      water: '',
      heating: '',
      maintenance: '',
      insurance: '',
      garbage: '',
      internet: '',
      taxes: ''
    }
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChargeChange = (field: keyof PropertyFormData['charges'], value: string) => {
    setFormData(prev => ({
      ...prev,
      charges: {
        ...prev.charges,
        [field]: value
      }
    }));
  };

  const calculateTotalCharges = () => {
    return Object.values(formData.charges).reduce((sum, value) => {
      return sum + (parseFloat(value) || 0);
    }, 0);
  };

  const calculateTotalCost = () => {
    const creditAmount = parseFloat(formData.creditImmobilier) || 0;
    const totalCharges = calculateTotalCharges();
    return creditAmount + totalCharges;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un fichier image",
          variant: "destructive"
        });
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview('');
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.address || !formData.type || !formData.surface || !formData.creditImmobilier || !formData.locationType) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (formData.locationType === 'Colocation' && !formData.roomCount) {
        toast({
          title: "Erreur",
          description: "Veuillez indiquer le nombre de chambres pour une colocation",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      let imageBase64 = '';
      if (formData.image) {
        imageBase64 = await convertImageToBase64(formData.image);
      }

      console.log('Enregistrement du bien immobilier:', {
        ...formData,
        imageBase64
      });

      onSubmit({
        ...formData,
        imageBase64
      });

      toast({
        title: "Succès",
        description: "Le bien immobilier a été ajouté avec succès",
      });

      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Ajouter un bien immobilier</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Appartement Rue des Fleurs"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner">Propriétaire</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => handleInputChange('owner', e.target.value)}
              placeholder="Nom du propriétaire"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select onValueChange={(value) => handleInputChange('type', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Appartement">Appartement</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
                <SelectItem value="Maison">Maison</SelectItem>
                <SelectItem value="Loft">Loft</SelectItem>
                <SelectItem value="Duplex">Duplex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="surface">Surface *</Label>
            <Input
              id="surface"
              value={formData.surface}
              onChange={(e) => handleInputChange('surface', e.target.value)}
              placeholder="Ex: 65m²"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Adresse *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Ex: 123 Rue des Fleurs, 75001 Paris"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="creditImmobilier">Crédit immobilier *</Label>
            <Input
              id="creditImmobilier"
              value={formData.creditImmobilier}
              onChange={(e) => handleInputChange('creditImmobilier', e.target.value)}
              placeholder="Ex: 1200€"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationType">Type de location *</Label>
            <Select onValueChange={(value) => handleInputChange('locationType', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type de location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Location">Location</SelectItem>
                <SelectItem value="Colocation">Colocation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.locationType === 'Colocation' && (
          <div className="space-y-2">
            <Label htmlFor="roomCount">Nombre de chambres *</Label>
            <Input
              id="roomCount"
              type="number"
              min="1"
              value={formData.roomCount}
              onChange={(e) => handleInputChange('roomCount', e.target.value)}
              placeholder="Ex: 3"
              required
            />
          </div>
        )}

        {/* Section d'évaluation des charges */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Évaluation des coûts de charges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="electricity">Électricité (€/mois)</Label>
                <Input
                  id="electricity"
                  type="number"
                  value={formData.charges.electricity}
                  onChange={(e) => handleChargeChange('electricity', e.target.value)}
                  placeholder="Ex: 80"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="water">Eau (€/mois)</Label>
                <Input
                  id="water"
                  type="number"
                  value={formData.charges.water}
                  onChange={(e) => handleChargeChange('water', e.target.value)}
                  placeholder="Ex: 45"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heating">Chauffage (€/mois)</Label>
                <Input
                  id="heating"
                  type="number"
                  value={formData.charges.heating}
                  onChange={(e) => handleChargeChange('heating', e.target.value)}
                  placeholder="Ex: 120"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maintenance">Maintenance (€/mois)</Label>
                <Input
                  id="maintenance"
                  type="number"
                  value={formData.charges.maintenance}
                  onChange={(e) => handleChargeChange('maintenance', e.target.value)}
                  placeholder="Ex: 50"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insurance">Assurance (€/mois)</Label>
                <Input
                  id="insurance"
                  type="number"
                  value={formData.charges.insurance}
                  onChange={(e) => handleChargeChange('insurance', e.target.value)}
                  placeholder="Ex: 30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="garbage">Ordures ménagères (€/mois)</Label>
                <Input
                  id="garbage"
                  type="number"
                  value={formData.charges.garbage}
                  onChange={(e) => handleChargeChange('garbage', e.target.value)}
                  placeholder="Ex: 25"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="internet">Internet (€/mois)</Label>
                <Input
                  id="internet"
                  type="number"
                  value={formData.charges.internet}
                  onChange={(e) => handleChargeChange('internet', e.target.value)}
                  placeholder="Ex: 35"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxes">Taxes foncières (€/mois)</Label>
                <Input
                  id="taxes"
                  type="number"
                  value={formData.charges.taxes}
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

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Description du bien immobilier..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Photo du bien</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-500"
                  >
                    Cliquez pour sélectionner une image
                  </Label>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, GIF jusqu'à 5MB
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Enregistrement...' : 'Ajouter le bien'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default PropertyForm;
