import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Users, User, Home } from 'lucide-react';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import { useFirebaseOwners } from '@/hooks/useFirebaseOwners';
import { useFirebaseProperties } from '@/hooks/useFirebaseProperties';

interface TenantContactsProps {
  currentProfile: any;
}

const TenantContacts: React.FC<TenantContactsProps> = ({ currentProfile }) => {
  const { t } = useTranslation();
  const { roommates, loading: roommatesLoading } = useFirebaseRoommates();
  const { owners, loading: ownersLoading } = useFirebaseOwners();
  const { properties, loading: propertiesLoading } = useFirebaseProperties();

  // Filtrer les colocataires du même appartement (excluant l'utilisateur actuel)
  const samePropertyRoommates = roommates.filter(roommate => 
    roommate.property === currentProfile?.property && 
    roommate.email !== currentProfile?.email &&
    roommate.status === 'Actif'
  );

  // Trouver la propriété actuelle pour obtenir le propriétaire
  const currentProperty = properties.find(prop => 
    prop.title === currentProfile?.property || 
    prop.address === currentProfile?.property
  );

  // Trouver le propriétaire de la propriété
  const propertyOwner = owners.find(owner => 
    owner.email === currentProperty?.owner || 
    owner.name === currentProperty?.owner
  ) || owners.find(owner => owner.role === 'admin'); // Fallback sur admin si pas trouvé

  const isLoading = roommatesLoading || ownersLoading || propertiesLoading;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Chargement des contacts...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Contacts
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Vos colocataires et le propriétaire de votre logement
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section Propriétaire */}
          {propertyOwner && (
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
                <Home className="h-4 w-4" />
                Propriétaire
              </h3>
              <Card className="border border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" alt={propertyOwner.name} />
                      <AvatarFallback className="bg-orange-100 text-orange-700">
                        {getInitials(propertyOwner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{propertyOwner.name}</h4>
                      <p className="text-sm text-gray-600">Propriétaire du logement</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          {propertyOwner.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`mailto:${propertyOwner.email}`, '_blank')}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Section Colocataires */}
          <div>
            <h3 className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
              <User className="h-4 w-4" />
              Colocataires ({samePropertyRoommates.length})
            </h3>
            
            {samePropertyRoommates.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Aucun colocataire</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Vous êtes le seul occupant de ce logement
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {samePropertyRoommates.map((roommate) => (
                  <Card key={roommate.id} className="border border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={roommate.image || ""} alt={roommate.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {getInitials(roommate.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{roommate.name}</h4>
                          <p className="text-sm text-gray-600">{roommate.roomNumber}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="h-3 w-3" />
                              {roommate.email}
                            </span>
                            {roommate.phone && (
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />
                                {roommate.phone}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`mailto:${roommate.email}`, '_blank')}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          {roommate.phone && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`tel:${roommate.phone}`, '_blank')}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantContacts;