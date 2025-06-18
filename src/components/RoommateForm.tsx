
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Eye, EyeOff } from 'lucide-react';

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
  totalRooms: number;
  availableRooms: number;
  creditImmobilier?: string;
  charges?: any;
}

interface RoommateFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  onSubmit?: (data: any) => Promise<void>;
  properties?: Property[];
}

const RoommateForm = ({ onSuccess, onClose, onSubmit, properties }: RoommateFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    property: '',
    roomNumber: '',
    rentAmount: '',
    status: 'Actif',
    primaryTenant: '',
    moveInDate: '',
    image: null as string | null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { addRoommate } = useFirebaseRoommates();
  const { createUserAccount } = useFirebaseAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (onSubmit) {
        // Utiliser le onSubmit personnalisé si fourni
        await onSubmit(formData);
      } else {
        // Comportement par défaut avec gestion d'erreur email existant
        let emailAlreadyExists = false;
        
        if (formData.password && formData.password.trim().length >= 6) {
          try {
            const result = await createUserAccount(formData.email, formData.password);
            emailAlreadyExists = result.emailAlreadyExists;
          } catch (authError: any) {
            console.error('Erreur lors de la création du compte Auth:', authError);
            // Continuer même si la création du compte échoue
            emailAlreadyExists = true;
          }
        }
        
        const { password, ...roommateData } = formData;
        await addRoommate(roommateData);

        if (emailAlreadyExists) {
          toast({
            title: t('roommates.addSuccess'),
            description: t('roommates.emailExistsWarning'),
            variant: "default",
          });
        } else {
          toast({
            title: t('roommates.addSuccess'),
            description: t('roommates.addSuccessDescription'),
          });
        }
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        property: '',
        roomNumber: '',
        rentAmount: '',
        status: 'Actif',
        primaryTenant: '',
        moveInDate: '',
        image: null
      });

      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('roommates.addError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{t('roommates.addRoommate')}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">{t('profile.name')} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="email">{t('profile.email')} *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="password">{t('roommateForm.password')} *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">{t('roommateForm.passwordMinLength')}</p>
          </div>
          
          <div>
            <Label htmlFor="phone">{t('profile.phone')}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="property">{t('roommateForm.property')}</Label>
            {properties ? (
              <Select 
                value={formData.property} 
                onValueChange={(value) => setFormData({ ...formData, property: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('roommateForm.selectProperty')} />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.title}>
                      {property.title} - {property.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="property"
                value={formData.property}
                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                disabled={loading}
              />
            )}
          </div>
          
          <div>
            <Label htmlFor="roomNumber">{t('roommateForm.roomNumber')}</Label>
            <Input
              id="roomNumber"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="rentAmount">{t('roommateForm.rentAmount')}</Label>
            <Input
              id="rentAmount"
              type="number"
              value={formData.rentAmount}
              onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
              disabled={loading}
              placeholder={t('roommateForm.rentPlaceholder')}
            />
            <p className="text-xs text-gray-500 mt-1">{t('roommateForm.rentIncludesCharges')}</p>
          </div>
          
          <div>
            <Label htmlFor="primaryTenant">{t('roommateForm.primaryTenant')}</Label>
            <Input
              id="primaryTenant"
              value={formData.primaryTenant}
              onChange={(e) => setFormData({ ...formData, primaryTenant: e.target.value })}
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="moveInDate">{t('roommateForm.moveInDate')}</Label>
            <Input
              id="moveInDate"
              type="date"
              value={formData.moveInDate}
              onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="status">{t('profile.status')}</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({ ...formData, status: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Actif">{t('tenants.status.active')}</SelectItem>
                <SelectItem value="Inactif">{t('tenants.status.inactive')}</SelectItem>
                <SelectItem value="En retard">{t('roommateForm.lateStatus')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('roommateForm.creating') : t('roommateForm.addRoommate')}
        </Button>
      </form>
    </DialogContent>
  );
};

export default RoommateForm;
