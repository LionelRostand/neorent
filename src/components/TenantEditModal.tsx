
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  property: string;
  rentAmount: string;
  nextPayment: string;
  status: string;
  leaseStart: string;
  image: string | null;
  password?: string; // Ajout du mot de passe (optionnel pour ne pas casser)
}

interface Property {
  id: string;
  title: string;
}

interface TenantEditModalProps {
  tenant: Tenant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Tenant>) => void;
  properties: Property[];
}

const TenantEditModal: React.FC<TenantEditModalProps> = ({
  tenant, isOpen, onClose, onSave, properties,
}) => {
  const [formData, setFormData] = useState<Partial<Tenant>>({});
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (tenant) {
      setFormData(tenant);
      setPassword(''); // Toujours vide à l'ouverture pour la sécurité
    }
  }, [tenant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tenant && formData) {
      // On passe le mot de passe seulement s'il est rempli
      const updates = { ...formData } as Partial<Tenant>;
      if (password.trim().length > 0) {
        updates.password = password;
      }
      onSave(tenant.id, updates);
      onClose();
    }
  };

  if (!tenant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le colocataire</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="property">Propriété</Label>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rentAmount">Montant du loyer (€)</Label>
              <Input
                id="rentAmount"
                value={formData.rentAmount || ''}
                onChange={(e) => setFormData({...formData, rentAmount: e.target.value})}
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
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* --- Ajout du champ mot de passe comme sur la maquette RoommateForm --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">Mot de passe {tenant ? "(laisser vide pour ne pas changer)" : "*"}</Label>
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
              <p className="text-xs text-gray-500 mt-1">Min. 6 caractères. Laisser vide pour garder le mot de passe actuel.</p>
            </div>
            <div></div>
          </div>
          {/* --- Fin ajout mot de passe --- */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="leaseStart">Début du bail</Label>
              <Input
                id="leaseStart"
                type="date"
                value={formData.leaseStart || ''}
                onChange={(e) => setFormData({...formData, leaseStart: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="nextPayment">Prochain paiement</Label>
              <Input
                id="nextPayment"
                type="date"
                value={formData.nextPayment || ''}
                onChange={(e) => setFormData({...formData, nextPayment: e.target.value})}
                required
              />
            </div>
          </div>
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

export default TenantEditModal;
