import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface PropertyFormData {
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  description: string;
  image: File | null;
  locationType: string;
  roomCount: string;
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
    rent: '',
    description: '',
    image: null,
    locationType: '',
    roomCount: ''
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive"
        });
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un fichier image",
          variant: "destructive"
        });
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      
      // Créer l'aperçu
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
        // Enlever le préfixe data:image/...;base64,
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
      // Validation
      if (!formData.title || !formData.address || !formData.type || !formData.surface || !formData.rent || !formData.locationType) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Validation spécifique pour la colocation
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

      // Simuler l'enregistrement dans la collection rent_immo
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
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
            <Label htmlFor="surface">Surface *</Label>
            <Input
              id="surface"
              value={formData.surface}
              onChange={(e) => handleInputChange('surface', e.target.value)}
              placeholder="Ex: 65m²"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rent">Loyer mensuel *</Label>
            <Input
              id="rent"
              value={formData.rent}
              onChange={(e) => handleInputChange('rent', e.target.value)}
              placeholder="Ex: 1200€"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

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
