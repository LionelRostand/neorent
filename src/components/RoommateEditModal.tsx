
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
import { useFirebaseRoommateAuth } from '@/hooks/useFirebaseRoommateAuth';
import { useToast } from '@/hooks/use-toast';

interface Roommate {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  roomNumber: string;
  rentAmount: string;
  status: string;
  primaryTenant: string;
  moveInDate: string;
  image: string | null;
  password?: string;
}

interface Property {
  id: string;
  title: string;
}

interface RoommateEditModalProps {
  roommate: Roommate | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Roommate>) => void;
  properties: Property[];
}

const RoommateEditModal: React.FC<RoommateEditModalProps> = ({ roommate, isOpen, onClose, onSave, properties }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Roommate>>({});
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createRoommateAuthAccount } = useFirebaseRoommateAuth();

  useEffect(() => {
    if (roommate) {
      setFormData(roommate);
      setPassword('');
    }
  }, [roommate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roommate || !formData) return;

    setIsSubmitting(true);
    
    try {
      const updates = { ...formData };
      
      // Si un mot de passe est fourni, créer/mettre à jour le compte Firebase Auth
      if (password.trim().length >= 6) {
        console.log('Creating/updating Firebase Auth account for roommate:', roommate.email);
        
        const authResult = await createRoommateAuthAccount({
          id: roommate.id,
          name: formData.name || roommate.name,
          email: formData.email || roommate.email,
          phone: formData.phone || roommate.phone,
          property: formData.property || roommate.property,
          roomNumber: formData.roomNumber || roommate.roomNumber,
          rentAmount: formData.rentAmount || roommate.rentAmount,
          status: formData.status || roommate.status,
          primaryTenant: formData.primaryTenant || roommate.primaryTenant,
          moveInDate: formData.moveInDate || roommate.moveInDate
        }, password);

        if (authResult.success) {
          if (authResult.emailAlreadyExists) {
            toast({
              title: "Compte mis à jour",
              description: "Les informations du colocataire ont été mises à jour. L'email existe déjà dans Firebase Auth.",
              variant: "default",
            });
          } else {
            toast({
              title: "Compte créé",
              description: "Le compte Firebase Auth a été créé avec succès. Le colocataire peut maintenant se connecter.",
              variant: "default",
            });
          }
        } else {
          toast({
            title: "Attention",
            description: "Les informations ont été mises à jour mais il y a eu un problème avec la création du compte d'authentification.",
            variant: "destructive",
          });
        }
      }

      // Sauvegarder les modifications du colocataire
      onSave(roommate.id, updates);
      onClose();
      
    } catch (error) {
      console.error('Error updating roommate with auth:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du colocataire.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!roommate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('roommateForm.editTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{t('roommateForm.fullName')}</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">{t('roommateForm.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">{t('roommateForm.phone')}</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="property">{t('roommateForm.property')}</Label>
              <Select value={formData.property} onValueChange={(value) => setFormData({...formData, property: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.title}>
                      {property.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* LIGNE avec numéro de chambre et mot de passe */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomNumber">{t('roommateForm.roomNumber')}</Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber || ''}
                onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Nouveau mot de passe (laisser vide pour ne pas changer)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  placeholder="Nouveau mot de passe"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 caractères. Laissera créer/mettre à jour le compte Firebase Auth.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rentAmount">{t('roommateForm.rentAmount')} (€)</Label>
              <Input
                id="rentAmount"
                value={formData.rentAmount || ''}
                onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="primaryTenant">{t('roommateForm.primaryTenant')}</Label>
              <Input
                id="primaryTenant"
                value={formData.primaryTenant || ''}
                onChange={(e) => setFormData({...formData, primaryTenant: e.target.value})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">{t('roommateForm.status')}</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">{t('roommates.status.active')}</SelectItem>
                  <SelectItem value="Inactif">{t('roommates.status.inactive')}</SelectItem>
                  <SelectItem value="En attente">{t('roommates.status.pending')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Place vide pour alignement */}
            <div></div>
          </div>
          <div>
            <Label htmlFor="moveInDate">{t('roommateForm.moveInDate')}</Label>
            <Input
              id="moveInDate"
              type="date"
              value={formData.moveInDate || ''}
              onChange={(e) => setFormData({...formData, moveInDate: e.target.value})}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              {t('roommateForm.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sauvegarde...' : t('roommateForm.saveChanges')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoommateEditModal;
