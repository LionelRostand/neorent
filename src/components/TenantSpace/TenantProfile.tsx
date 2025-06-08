
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Edit2 } from 'lucide-react';

const TenantProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '06 12 34 56 78',
    address: '123 Rue des Fleurs, 75001 Paris',
    leaseStart: '2023-06-01',
    status: 'À jour',
    type: 'Locataire principal'
  });

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profil mis à jour:', profile);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mes Informations Personnelles
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {isEditing ? 'Annuler' : 'Modifier'}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={profile.status === 'À jour' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {profile.status}
                </Badge>
                <Badge variant="outline">
                  {profile.type}
                </Badge>
              </div>
            </div>
          </div>
          
          {isEditing && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave}>
                Sauvegarder
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Annuler
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informations de Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Adresse du logement</p>
                <p className="font-medium">{profile.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Date d'entrée</p>
                <p className="font-medium">{new Date(profile.leaseStart).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantProfile;
