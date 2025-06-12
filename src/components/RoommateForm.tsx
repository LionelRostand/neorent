
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Eye, EyeOff } from 'lucide-react';

interface RoommateFormProps {
  onSuccess?: () => void;
}

const RoommateForm = ({ onSuccess }: RoommateFormProps) => {
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
      // Créer le compte Firebase Auth
      await createUserAccount(formData.email, formData.password);

      // Créer le profil colocataire (sans le mot de passe)
      const { password, ...roommateData } = formData;
      await addRoommate(roommateData);

      toast({
        title: "Colocataire ajouté",
        description: "Le colocataire a été ajouté avec succès et peut maintenant se connecter.",
      });

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
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'ajout du colocataire.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajouter un nouveau colocataire</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email *</Label>
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
              <Label htmlFor="password">Mot de passe *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  minLength={6}
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
              <p className="text-xs text-gray-500 mt-1">Minimum 6 caractères</p>
            </div>
            
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="property">Propriété</Label>
              <Input
                id="property"
                value={formData.property}
                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="roomNumber">Numéro de chambre</Label>
              <Input
                id="roomNumber"
                value={formData.roomNumber}
                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="rentAmount">Montant du loyer (€)</Label>
              <Input
                id="rentAmount"
                type="number"
                value={formData.rentAmount}
                onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="primaryTenant">Locataire principal</Label>
              <Input
                id="primaryTenant"
                value={formData.primaryTenant}
                onChange={(e) => setFormData({ ...formData, primaryTenant: e.target.value })}
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="moveInDate">Date d'emménagement</Label>
              <Input
                id="moveInDate"
                type="date"
                value={formData.moveInDate}
                onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                disabled={loading}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                  <SelectItem value="En retard">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création en cours...' : 'Ajouter le colocataire'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoommateForm;
