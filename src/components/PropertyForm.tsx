import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  floor: string;
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
  initialType?: string;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onClose, onSubmit, initialType }) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    address: '',
    type: initialType || '',
    surface: '',
    creditImmobilier: '',
    description: '',
    image: null,
    locationType: '',
    roomCount: '',
    owner: '',
    floor: '',
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

  // Mettre à jour le type quand initialType change
  useEffect(() => {
    if (initialType) {
      setFormData(prev => ({ ...prev, type: initialType }));
    }
  }, [initialType]);

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
          title: t('propertyForm.error'),
          description: t('propertyForm.photoSizeError'),
          variant: "destructive"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: t('propertyForm.error'),
          description: t('propertyForm.photoTypeError'),
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
          title: t('propertyForm.error'),
          description: t('propertyForm.requiredFieldsError'),
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      if (formData.locationType === 'Colocation' && !formData.roomCount) {
        toast({
          title: t('propertyForm.error'),
          description: t('propertyForm.roomCountError'),
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
        title: t('propertyForm.success'),
        description: t('propertyForm.addSuccessMessage'),
      });

      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast({
        title: t('propertyForm.error'),
        description: t('propertyForm.addErrorMessage'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{t('propertyForm.addTitle')}</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('propertyForm.titleRequired')}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder={t('propertyForm.titlePlaceholder')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="owner">{t('propertyForm.owner')}</Label>
            <Input
              id="owner"
              value={formData.owner}
              onChange={(e) => handleInputChange('owner', e.target.value)}
              placeholder={t('propertyForm.ownerPlaceholder')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">{t('propertyForm.typeRequired')}</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)} required>
              <SelectTrigger>
                <SelectValue placeholder={t('propertyForm.typeSelect')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Appartement">{t('propertyForm.propertyTypes.appartement')}</SelectItem>
                <SelectItem value="Studio">{t('propertyForm.propertyTypes.studio')}</SelectItem>
                <SelectItem value="Maison">{t('propertyForm.propertyTypes.maison')}</SelectItem>
                <SelectItem value="Loft">{t('propertyForm.propertyTypes.loft')}</SelectItem>
                <SelectItem value="Duplex">{t('propertyForm.propertyTypes.duplex')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="surface">{t('propertyForm.surfaceRequired')}</Label>
            <Input
              id="surface"
              value={formData.surface}
              onChange={(e) => handleInputChange('surface', e.target.value)}
              placeholder={t('propertyForm.surfacePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floor">{t('propertyForm.floor')}</Label>
            <Input
              id="floor"
              value={formData.floor}
              onChange={(e) => handleInputChange('floor', e.target.value)}
              placeholder={t('propertyForm.floorPlaceholder')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t('propertyForm.addressRequired')}</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder={t('propertyForm.addressPlaceholder')}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="creditImmobilier">{t('propertyForm.creditImmobilierRequired')}</Label>
            <Input
              id="creditImmobilier"
              value={formData.creditImmobilier}
              onChange={(e) => handleInputChange('creditImmobilier', e.target.value)}
              placeholder={t('propertyForm.creditImmobilierPlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="locationType">{t('propertyForm.locationTypeRequired')}</Label>
            <Select onValueChange={(value) => handleInputChange('locationType', value)} required>
              <SelectTrigger>
                <SelectValue placeholder={t('propertyForm.locationTypeSelect')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Location">{t('propertyForm.locationTypes.location')}</SelectItem>
                <SelectItem value="Colocation">{t('propertyForm.locationTypes.colocation')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {formData.locationType === 'Colocation' && (
          <div className="space-y-2">
            <Label htmlFor="roomCount">{t('propertyForm.roomCountRequired')}</Label>
            <Input
              id="roomCount"
              type="number"
              min="1"
              value={formData.roomCount}
              onChange={(e) => handleInputChange('roomCount', e.target.value)}
              placeholder={t('propertyForm.roomCountPlaceholder')}
              required
            />
          </div>
        )}

        {/* Section d'évaluation des charges */}
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
                  value={formData.charges.electricity}
                  onChange={(e) => handleChargeChange('electricity', e.target.value)}
                  placeholder={t('propertyForm.charges.electricityPlaceholder')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="water">{t('propertyForm.charges.waterUnit')}</Label>
                <Input
                  id="water"
                  type="number"
                  value={formData.charges.water}
                  onChange={(e) => handleChargeChange('water', e.target.value)}
                  placeholder={t('propertyForm.charges.waterPlaceholder')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heating">{t('propertyForm.charges.heatingUnit')}</Label>
                <Input
                  id="heating"
                  type="number"
                  value={formData.charges.heating}
                  onChange={(e) => handleChargeChange('heating', e.target.value)}
                  placeholder={t('propertyForm.charges.heatingPlaceholder')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maintenance">{t('propertyForm.charges.maintenanceUnit')}</Label>
                <Input
                  id="maintenance"
                  type="number"
                  value={formData.charges.maintenance}
                  onChange={(e) => handleChargeChange('maintenance', e.target.value)}
                  placeholder={t('propertyForm.charges.maintenancePlaceholder')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insurance">{t('propertyForm.charges.insuranceUnit')}</Label>
                <Input
                  id="insurance"
                  type="number"
                  value={formData.charges.insurance}
                  onChange={(e) => handleChargeChange('insurance', e.target.value)}
                  placeholder={t('propertyForm.charges.insurancePlaceholder')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="garbage">{t('propertyForm.charges.garbageUnit')}</Label>
                <Input
                  id="garbage"
                  type="number"
                  value={formData.charges.garbage}
                  onChange={(e) => handleChargeChange('garbage', e.target.value)}
                  placeholder={t('propertyForm.charges.garbagePlaceholder')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="internet">{t('propertyForm.charges.internetUnit')}</Label>
                <Input
                  id="internet"
                  type="number"
                  value={formData.charges.internet}
                  onChange={(e) => handleChargeChange('internet', e.target.value)}
                  placeholder={t('propertyForm.charges.internetPlaceholder')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="taxes">{t('propertyForm.charges.taxesUnit')}</Label>
                <Input
                  id="taxes"
                  type="number"
                  value={formData.charges.taxes}
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

        <div className="space-y-2">
          <Label htmlFor="description">{t('propertyForm.description')}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder={t('propertyForm.descriptionPlaceholder')}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('propertyForm.photo')}</Label>
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
                    {t('propertyForm.photoSelect')}
                  </Label>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {t('propertyForm.photoFormat')}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('propertyForm.cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t('propertyForm.adding') : t('propertyForm.add')}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default PropertyForm;
