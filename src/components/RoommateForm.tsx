
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, User, Mail, Phone, Home, Key, Euro, Calendar } from 'lucide-react';
import { useRoommateRegistration } from '@/hooks/useRoommateRegistration';
import PropertyRoomFields from './RoommateForm/PropertyRoomFields';

interface RoommateFormProps {
  onClose: () => void;
  onSubmit?: (data: any) => void;
  roommate?: any;
  buttonConfig?: {
    submitText: string;
    loadingText: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  };
}

const RoommateForm: React.FC<RoommateFormProps> = ({ 
  onClose, 
  onSubmit, 
  roommate, 
  buttonConfig 
}) => {
  const { t } = useTranslation();
  const { registerRoommate, isSubmitting } = useRoommateRegistration();
  const isEditing = Boolean(roommate);

  const [formData, setFormData] = useState({
    name: roommate?.name || '',
    email: roommate?.email || '',
    phone: roommate?.phone || '',
    property: roommate?.property || '',
    roomNumber: roommate?.roomNumber || '',
    rentAmount: roommate?.rentAmount || '',
    status: roommate?.status || 'Actif',
    primaryTenant: roommate?.primaryTenant || '',
    moveInDate: roommate?.moveInDate || '',
    password: '' // Nouveau champ pour le mot de passe
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.rentAmount) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!isEditing && !formData.password) {
      alert('Veuillez saisir un mot de passe pour le nouveau colocataire');
      return;
    }

    if (!isEditing && formData.password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const roommateData = {
      id: roommate?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      property: formData.property,
      roomNumber: formData.roomNumber,
      rentAmount: formData.rentAmount,
      status: formData.status,
      primaryTenant: formData.primaryTenant,
      moveInDate: formData.moveInDate,
      image: null
    };

    try {
      if (isEditing) {
        // Mode édition - utiliser la fonction onSubmit existante
        if (onSubmit) {
          await onSubmit(roommateData);
        }
      } else {
        // Mode création - utiliser le hook d'enregistrement
        const result = await registerRoommate(roommateData, formData.password);
        if (result.success) {
          onClose();
        }
      }
    } catch (error) {
      console.error('Error submitting roommate form:', error);
    }
  };

  const config = buttonConfig || {
    submitText: isEditing ? t('roommateForm.saveChanges') : t('roommateForm.addRoommate'),
    loadingText: isEditing ? t('roommateForm.saving') : t('roommateForm.creating'),
    variant: 'default' as const
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>{isEditing ? t('roommateForm.editTitle') : t('roommateForm.title')}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t('roommateForm.fullName')} *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Jean Dupont"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t('roommateForm.email')} *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="jean.dupont@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {t('roommateForm.phone')}
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="01 23 45 67 89"
              />
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  {t('roommateForm.password')} *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={t('roommateForm.passwordMinLength')}
                  required={!isEditing}
                  minLength={6}
                />
                <p className="text-sm text-gray-500">
                  {t('roommateForm.passwordMinLength')}
                </p>
              </div>
            )}

            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  {t('roommateForm.newPassword')}
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={t('roommateForm.passwordMinLength')}
                  minLength={6}
                />
                <p className="text-sm text-gray-500">
                  {t('roommateForm.passwordNote')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informations du logement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Home className="h-5 w-5" />
              Informations du logement
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PropertyRoomFields
              formData={formData}
              onInputChange={handleInputChange}
            />

            <div className="space-y-2">
              <Label htmlFor="primaryTenant">{t('roommateForm.primaryTenant')}</Label>
              <Input
                id="primaryTenant"
                value={formData.primaryTenant}
                onChange={(e) => handleInputChange('primaryTenant', e.target.value)}
                placeholder="Marie Martin"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moveInDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('roommateForm.moveInDate')}
              </Label>
              <Input
                id="moveInDate"
                type="date"
                value={formData.moveInDate}
                onChange={(e) => handleInputChange('moveInDate', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Informations financières */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Euro className="h-5 w-5" />
              Informations financières
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rentAmount">{t('roommateForm.rentAmount')} *</Label>
              <Input
                id="rentAmount"
                value={formData.rentAmount}
                onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                placeholder={t('roommateForm.rentPlaceholder')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">{t('roommateForm.status')}</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">{t('roommates.status.active')}</SelectItem>
                  <SelectItem value="Inactif">{t('roommates.status.inactive')}</SelectItem>
                  <SelectItem value="En recherche">{t('roommates.status.searching')}</SelectItem>
                  <SelectItem value="En attente">{t('roommates.status.pending')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            {t('roommateForm.cancel')}
          </Button>
          <Button 
            type="submit" 
            variant={config.variant}
            disabled={isSubmitting}
          >
            {isSubmitting ? config.loadingText : config.submitText}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default RoommateForm;
