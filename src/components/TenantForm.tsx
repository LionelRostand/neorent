import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';
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
  owner?: string;
}

interface TenantFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  onSubmit?: (data: any) => Promise<void>;
  properties?: Property[];
  currentProfile?: any;
}

const TenantForm = ({ onSuccess, onClose, onSubmit, properties, currentProfile }: TenantFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    property: '',
    rentAmount: '',
    nextPayment: '',
    status: 'Actif',
    leaseStart: '',
    image: null as string | null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { addTenant } = useFirebaseTenants();
  const { createUserAccount } = useFirebaseAuth();
  const { properties: allProperties } = useFirebaseProperties();

  // Utiliser les propriétés passées en props ou récupérer toutes les propriétés
  const availableProperties = properties || allProperties;

  // Filtrer les propriétés du propriétaire connecté et de type "Location" (location classique)
  const ownerProperties = availableProperties?.filter(property => 
    property.locationType === 'Location' &&
    currentProfile && (property.owner === currentProfile.name || property.owner === currentProfile.email)
  ) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (onSubmit) {
        // Utiliser le onSubmit personnalisé si fourni
        await onSubmit(formData);
      } else {
        // Comportement par défaut avec gestion d'erreur email existant
        try {
          await createUserAccount(formData.email, formData.password);
        } catch (authError: any) {
          // Si l'email existe déjà, continuer quand même avec l'ajout du locataire
          if (authError.message?.includes('déjà utilisé')) {
            console.warn('Email déjà utilisé, mais continuation de l\'ajout du locataire');
            toast({
              title: "Attention",
              description: "L'email est déjà utilisé, mais le locataire a été ajouté avec succès.",
              variant: "default",
            });
          } else {
            throw authError;
          }
        }
        
        const { password, ...tenantData } = formData;
        await addTenant(tenantData);

        toast({
          title: "Locataire ajouté",
          description: t('tenants.addSuccess'),
        });
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        property: '',
        rentAmount: '',
        nextPayment: '',
        status: 'Actif',
        leaseStart: '',
        image: null
      });

      onSuccess?.();
      onClose?.();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('tenants.addError'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{t('forms.addTenant')}</DialogTitle>
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
            <Label htmlFor="password">{t('tenantForm.password')} *</Label>
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
            <p className="text-xs text-gray-500 mt-1">{t('tenantForm.passwordMinLength')}</p>
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
            <Label htmlFor="property">{t('tenantForm.property')}</Label>
            <Select 
              value={formData.property} 
              onValueChange={(value) => setFormData({ ...formData, property: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('tenantForm.selectProperty')} />
              </SelectTrigger>
              <SelectContent>
                {ownerProperties.length > 0 ? (
                  ownerProperties.map((property) => (
                    <SelectItem key={property.id} value={property.title}>
                      {property.title} - {property.address}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-properties" disabled>
                    Aucune propriété de type location disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="rentAmount">{t('tenantForm.rentAmount')}</Label>
            <Input
              id="rentAmount"
              type="number"
              value={formData.rentAmount}
              onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="nextPayment">{t('tenantForm.nextPayment')}</Label>
            <Input
              id="nextPayment"
              type="date"
              value={formData.nextPayment}
              onChange={(e) => setFormData({ ...formData, nextPayment: e.target.value })}
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="leaseStart">{t('profile.leaseStart')}</Label>
            <Input
              id="leaseStart"
              type="date"
              value={formData.leaseStart}
              onChange={(e) => setFormData({ ...formData, leaseStart: e.target.value })}
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
                <SelectItem value="En retard">{t('tenantForm.lateStatus')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('tenantForm.creating') : t('forms.addTenant')}
        </Button>
      </form>
    </DialogContent>
  );
};

export default TenantForm;
