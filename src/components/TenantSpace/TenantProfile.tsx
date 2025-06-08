
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit,
  Save,
  X,
  Contact
} from 'lucide-react';

interface TenantProfileProps {
  tenantData: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    leaseStart: string;
    leaseEnd: string;
    status: string;
    emergencyContact: {
      name: string;
      phone: string;
      relation: string;
    };
  };
}

const TenantProfile: React.FC<TenantProfileProps> = ({ tenantData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: tenantData.phone,
    emergencyName: tenantData.emergencyContact.name,
    emergencyPhone: tenantData.emergencyContact.phone,
    emergencyRelation: tenantData.emergencyContact.relation
  });

  const handleSave = () => {
    console.log('Mise à jour du profil:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      phone: tenantData.phone,
      emergencyName: tenantData.emergencyContact.name,
      emergencyPhone: tenantData.emergencyContact.phone,
      emergencyRelation: tenantData.emergencyContact.relation
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Informations principales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informations personnelles
          </CardTitle>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button 
                size="sm"
                onClick={handleSave}
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Nom complet</p>
                  <p className="font-medium">{tenantData.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{tenantData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Téléphone</p>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium">{tenantData.phone}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Adresse du logement</p>
                  <p className="font-medium">{tenantData.address}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Période de bail</p>
                  <p className="font-medium">
                    Du {new Date(tenantData.leaseStart).toLocaleDateString('fr-FR')} au {new Date(tenantData.leaseEnd).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <Badge 
                    variant={tenantData.status === 'À jour' ? 'default' : 'destructive'}
                    className={tenantData.status === 'À jour' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {tenantData.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Statut du compte</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact d'urgence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Contact className="h-5 w-5" />
            Contact d'urgence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Nom</Label>
              {isEditing ? (
                <Input
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({...formData, emergencyName: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium mt-1">{tenantData.emergencyContact.name}</p>
              )}
            </div>
            
            <div>
              <Label>Téléphone</Label>
              {isEditing ? (
                <Input
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium mt-1">{tenantData.emergencyContact.phone}</p>
              )}
            </div>
            
            <div>
              <Label>Relation</Label>
              {isEditing ? (
                <Input
                  value={formData.emergencyRelation}
                  onChange={(e) => setFormData({...formData, emergencyRelation: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <p className="font-medium mt-1">{tenantData.emergencyContact.relation}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantProfile;
