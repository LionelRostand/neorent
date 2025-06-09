
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Home, 
  FileText, 
  CreditCard, 
  Settings,
  ArrowLeft,
  LogOut,
  UserCog,
  Menu,
  Users
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFirebaseTenants } from '@/hooks/useFirebaseTenants';
import { useFirebaseRoommates } from '@/hooks/useFirebaseRoommates';
import TenantProfile from '@/components/TenantSpace/TenantProfile';
import PropertyInfo from '@/components/TenantSpace/PropertyInfo';
import TenantDocuments from '@/components/TenantSpace/TenantDocuments';
import RentHistory from '@/components/TenantSpace/RentHistory';

const TenantSpace = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const { tenants } = useFirebaseTenants();
  const { roommates } = useFirebaseRoommates();

  // Vérifier si c'est un admin qui consulte l'espace d'un autre utilisateur
  const selectedUserId = searchParams.get('userId');
  const isAdminView = !!selectedUserId;

  // Vérifier si l'utilisateur est admin/employé - utiliser l'email comme indicateur
  // TODO: Adapter cette logique selon votre système d'authentification
  const isAdminOrEmployee = user?.email === 'admin@example.com' || user?.email?.includes('admin') || user?.email?.includes('employee');

  // Combiner les locataires et colocataires pour le sélecteur admin
  const allUsers = [
    ...tenants.map(t => ({ ...t, type: 'Locataire' })),
    ...roommates.map(r => ({ ...r, type: 'Colocataire' }))
  ];

  // Trouver l'utilisateur sélectionné ou utiliser les données par défaut
  const selectedUser = selectedUserId 
    ? allUsers.find(u => u.id === selectedUserId)
    : null;

  // Données du locataire (réelles ou simulées selon le contexte)
  const tenantData = selectedUser ? {
    id: 1, // Convertir en number pour la compatibilité
    name: selectedUser.name || 'Utilisateur',
    email: selectedUser.email || 'email@example.com',
    phone: selectedUser.phone || 'Non défini',
    address: selectedUser.property || 'Adresse non définie',
    leaseStart: selectedUser.type === 'Locataire' ? (selectedUser as any).leaseStart || '2023-06-01' : (selectedUser as any).moveInDate || '2023-06-01',
    leaseEnd: '2024-05-31',
    status: selectedUser.status || 'À jour',
    emergencyContact: {
      name: 'Contact d\'urgence',
      phone: '06 98 76 54 32',
      relation: 'Famille'
    }
  } : {
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
    title: selectedUser?.property || 'Appartement Rue de la Paix',
    address: selectedUser?.property || '45 Rue de la Paix, 75001 Paris',
    type: 'Appartement',
    surface: '65m²',
    rooms: '3 pièces',
    rent: typeof selectedUser?.rentAmount === 'string' ? parseInt(selectedUser.rentAmount.replace(/[^0-9]/g, '')) || 1200 : selectedUser?.rentAmount || 1200,
    charges: 150,
    deposit: 2400,
    furnished: true,
    floor: '3ème étage',
    elevator: true,
    parking: false,
    features: ['Balcon', 'Cave', 'Interphone', 'Fibre optique']
  };

  const handleUserSelection = (userId: string) => {
    if (userId === 'self') {
      setSearchParams({});
    } else {
      setSearchParams({ userId });
    }
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
          {/* Sélecteur d'utilisateur pour mobile - seulement pour admin/employé */}
          {isAdminOrEmployee && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Voir l'espace de:</label>
              <Select value={selectedUserId || 'self'} onValueChange={handleUserSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Mon espace</SelectItem>
                  {allUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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
              {isAdminView && (
                <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs md:text-sm">
                  Vue Admin
                </Badge>
              )}
            </div>
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Connecté en tant que: {user.email}
              </span>
              
              {/* Sélecteur d'utilisateur pour desktop - seulement pour admin/employé */}
              {isAdminOrEmployee && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <Select value={selectedUserId || 'self'} onValueChange={handleUserSelection}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sélectionner un utilisateur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Mon espace</SelectItem>
                      {allUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
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
            {isAdminView ? `Espace de ${tenantData.name}` : `Bienvenue, ${tenantData.name}`}
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            {isAdminView ? 'Consultation en mode administrateur' : 'Gérez votre location et consultez vos documents'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {isMobile ? (
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
