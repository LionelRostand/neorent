import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Home, 
  FileText, 
  CreditCard, 
  Settings,
  ArrowLeft,
  LogOut,
  UserCog
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import TenantProfile from '@/components/TenantSpace/TenantProfile';
import PropertyInfo from '@/components/TenantSpace/PropertyInfo';
import TenantDocuments from '@/components/TenantSpace/TenantDocuments';
import RentHistory from '@/components/TenantSpace/RentHistory';

const TenantSpace = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Données simulées du locataire connecté
  const tenantData = {
    id: 1,
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '06 12 34 56 78',
    address: '45 Rue de la Paix, 75001 Paris',
    leaseStart: '2023-06-01',
    leaseEnd: '2024-05-31',
    status: 'À jour',
    emergencyContact: {
      name: 'Pierre Dubois',
      phone: '06 98 76 54 32',
      relation: 'Conjoint'
    }
  };

  const propertyData = {
    title: 'Appartement Rue de la Paix',
    address: '45 Rue de la Paix, 75001 Paris',
    type: 'Appartement',
    surface: '65m²',
    rooms: '3 pièces',
    rent: 1200,
    charges: 150,
    deposit: 2400,
    furnished: true,
    floor: '3ème étage',
    elevator: true,
    parking: false,
    features: ['Balcon', 'Cave', 'Interphone', 'Fibre optique']
  };

  const handleBackendAccess = () => {
    navigate('/admin');
  };

  const handleBackToSite = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Rediriger si l'utilisateur n'est pas connecté
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Neo Rent</span>
              <Badge className="ml-3 bg-blue-100 text-blue-800">Espace Locataire</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Connecté en tant que: {user.email}
              </span>
              <Button 
                variant="outline" 
                onClick={handleBackToSite}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour au site
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBackendAccess}
                className="flex items-center gap-2"
              >
                <UserCog className="h-4 w-4" />
                Interface Admin
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenue, {tenantData.name}
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez votre location et consultez vos documents
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger 
              value="profile" 
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Mon Profil
            </TabsTrigger>
            <TabsTrigger 
              value="property" 
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Mon Logement
            </TabsTrigger>
            <TabsTrigger 
              value="documents" 
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="payments" 
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Mes Loyers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <TenantProfile tenantData={tenantData} />
          </TabsContent>

          <TabsContent value="property">
            <PropertyInfo propertyData={propertyData} />
          </TabsContent>

          <TabsContent value="documents">
            <TenantDocuments />
          </TabsContent>

          <TabsContent value="payments">
            <RentHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TenantSpace;
