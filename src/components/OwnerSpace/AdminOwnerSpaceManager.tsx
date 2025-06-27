
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ArrowLeft, Users, Building } from 'lucide-react';
import { useFirebaseUserRoles } from '@/hooks/useFirebaseUserRoles';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';

const AdminOwnerSpaceManager: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userRoles, loading } = useFirebaseUserRoles();
  const { switchToTenantProfile } = useAdminTenantAccess();

  // Filtrer seulement les propriétaires
  const owners = userRoles.filter(user => 
    user.role === 'owner' || user.isOwner === true
  );

  const handleViewOwnerSpace = (ownerProfile: any) => {
    // Préparer le profil pour l'impersonation
    const enrichedProfile = {
      ...ownerProfile,
      type: 'owner',
      name: ownerProfile.name || ownerProfile.email,
      email: ownerProfile.email,
      role: 'owner',
      isOwner: true
    };

    // Basculer vers le profil du propriétaire
    if (switchToTenantProfile(enrichedProfile)) {
      navigate('/owner-space');
    }
  };

  const handleBackToAdmin = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des propriétaires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Administration des Espaces Propriétaires
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez et accédez aux espaces des propriétaires
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleBackToAdmin}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au Backend</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Propriétaires</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{owners.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {owners.filter(o => o.hasPassword).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {owners.filter(o => !o.hasPassword).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des propriétaires */}
      <Card>
        <CardHeader>
          <CardTitle>Espaces Propriétaires</CardTitle>
        </CardHeader>
        <CardContent>
          {owners.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun propriétaire trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {owners.map((owner) => (
                <div
                  key={owner.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {owner.name || owner.email}
                        </h3>
                        <p className="text-sm text-gray-600">{owner.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant={owner.hasPassword ? "default" : "secondary"}>
                          {owner.hasPassword ? "Actif" : "En attente"}
                        </Badge>
                        <Badge variant="outline">
                          {owner.role === 'owner' ? 'Propriétaire' : 'Admin'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewOwnerSpace(owner)}
                      className="flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Accéder à l'espace</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOwnerSpaceManager;
