
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();
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
    <div className="space-y-4 md:space-y-6">
      {/* Informations principales */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <User className="h-4 w-4 md:h-5 md:w-5" />
            Informations personnelles
          </CardTitle>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "sm"}
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto"
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "sm"}
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button 
                size={isMobile ? "sm" : "sm"}
                onClick={handleSave}
                className="w-full sm:w-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium text-sm md:text-base truncate">{tenantData.name}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-600">Email</p>
                    <p className="font-medium text-sm md:text-base truncate">{tenantData.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-3 flex-1">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-gray-600">Téléphone</p>
                    {isEditing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="mt-1 text-sm md:text-base"
                        placeholder="Numéro de téléphone"
                      />
                    ) : (
                      <p className="font-medium text-sm md:text-base">{tenantData.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-600">Adresse du logement</p>
                    <p className="font-medium text-sm md:text-base">{tenantData.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0 mt-1" />
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm text-gray-600">Période de bail</p>
                    <p className="font-medium text-sm md:text-base">
                      Du {new Date(tenantData.leaseStart).toLocaleDateString('fr-FR')} au {new Date(tenantData.leaseEnd).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                    <Badge 
                      variant={tenantData.status === 'À jour' ? 'default' : 'destructive'}
                      className={`${tenantData.status === 'À jour' ? 'bg-green-100 text-green-800' : ''} text-xs`}
                    >
                      {tenantData.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Statut du compte</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact d'urgence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Contact className="h-4 w-4 md:h-5 md:w-5" />
            Contact d'urgence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs md:text-sm">Nom</Label>
              {isEditing ? (
                <Input
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({...formData, emergencyName: e.target.value})}
                  className="mt-1 text-sm md:text-base"
                  placeholder="Nom du contact"
                />
              ) : (
                <p className="font-medium mt-1 text-sm md:text-base">{tenantData.emergencyContact.name}</p>
              )}
            </div>
            
            <div>
              <Label className="text-xs md:text-sm">Téléphone</Label>
              {isEditing ? (
                <Input
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                  className="mt-1 text-sm md:text-base"
                  placeholder="Numéro de téléphone"
                />
              ) : (
                <p className="font-medium mt-1 text-sm md:text-base">{tenantData.emergencyContact.phone}</p>
              )}
            </div>
            
            <div>
              <Label className="text-xs md:text-sm">Relation</Label>
              {isEditing ? (
                <Input
                  value={formData.emergencyRelation}
                  onChange={(e) => setFormData({...formData, emergencyRelation: e.target.value})}
                  className="mt-1 text-sm md:text-base"
                  placeholder="Relation (ex: Conjoint)"
                />
              ) : (
                <p className="font-medium mt-1 text-sm md:text-base">{tenantData.emergencyContact.relation}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantProfile;
