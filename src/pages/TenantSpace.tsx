import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  User, 
  Home, 
  FileText, 
  CreditCard, 
  Settings,
  ArrowLeft,
  LogOut,
  UserCog,
  Menu
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import TenantProfile from '@/components/TenantSpace/TenantProfile';
import PropertyInfo from '@/components/TenantSpace/PropertyInfo';
import TenantDocuments from '@/components/TenantSpace/TenantDocuments';
import RentHistory from '@/components/TenantSpace/RentHistory';

const TenantSpace = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();

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

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="flex flex-col space-y-4 mt-8">
          <div className="text-sm text-gray-600 border-b pb-4">
            Connecté en tant que: {user.email}
          </div>
          <Button 
            variant="outline" 
            onClick={handleBackToSite}
            className="flex items-center gap-2 justify-start"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Button>
          <Button 
            variant="outline" 
            onClick={handleBackendAccess}
            className="flex items-center gap-2 justify-start border-green-600 text-green-600 hover:bg-green-50"
          >
            <UserCog className="h-4 w-4" />
            Interface Admin
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="flex items-center gap-2 justify-start"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              <span className="ml-2 text-lg md:text-xl font-bold text-gray-900">Neo Rent</span>
              <Badge className="ml-2 md:ml-3 bg-green-100 text-green-800 text-xs md:text-sm">
                Espace Locataire
              </Badge>
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
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
                className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
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

            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Bienvenue, {tenantData.name}
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Gérez votre location et consultez vos documents
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {isMobile ? (
            // Mobile: Dropdown/Select style tabs
            <div className="mb-6">
              <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900"
              >
                <option value="profile">👤 Mon Profil</option>
                <option value="property">🏠 Mon Logement</option>
                <option value="documents">📄 Documents</option>
                <option value="payments">💳 Mes Loyers</option>
              </select>
            </div>
          ) : (
            // Desktop: Regular tabs
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
          )}

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
