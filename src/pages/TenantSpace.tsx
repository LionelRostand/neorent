import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Users,
  ChevronLeft,
  ChevronRight
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
import { cn } from '@/lib/utils';

const TenantSpace = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [searchParams, setSearchParams] = useSearchParams();
  const [userType, setUserType] = useState<'locataire' | 'colocataire'>('locataire');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

  // Vérifier si l'utilisateur sélectionné existe dans Firebase
  useEffect(() => {
    if (selectedUserId && allUsers.length > 0) {
      const userExists = allUsers.some(u => u.id === selectedUserId);
      if (!userExists) {
        console.log('Utilisateur non trouvé dans Firebase, redirection...');
        setSearchParams({});
      }
    }
  }, [selectedUserId, allUsers, setSearchParams]);

  // Si un utilisateur est sélectionné mais n'existe pas, ne pas afficher de contenu
  if (selectedUserId && allUsers.length > 0 && !selectedUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Utilisateur non trouvé</h2>
          <p className="text-gray-600 mb-4">L'utilisateur sélectionné n'existe pas dans la base de données.</p>
          <button
            onClick={() => setSearchParams({})}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

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

  // Ne pas afficher le sidebar pour les utilisateurs normaux
  if (!isAdminOrEmployee) {
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
              
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={handleBackToSite}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour au site
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

  // Sidebar pour les admins
  const Sidebar = () => (
    <div className={cn(
      "flex h-screen flex-col bg-white shadow-lg border-r transition-all duration-300",
      sidebarCollapsed ? "w-16" : "w-80"
    )}>
      {/* Header du sidebar */}
      <div className="flex h-16 items-center justify-between px-4 border-b bg-green-50">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-green-600" />
            <span className="text-lg font-semibold text-gray-900">Utilisateurs</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-8 w-8"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!sidebarCollapsed && (
        <>
          {/* Sélecteur de type d'utilisateur */}
          <div className="p-4 border-b">
            <Select value={userType} onValueChange={(value: 'locataire' | 'colocataire') => setUserType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="locataire">Locataires</SelectItem>
                <SelectItem value="colocataire">Colocataires</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Liste des utilisateurs */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {userType === 'locataire' ? (
                tenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    onClick={() => handleUserSelection(tenant.id)}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                      selectedUserId === tenant.id ? "bg-green-50 border border-green-200" : ""
                    )}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={tenant.image || undefined} />
                      <AvatarFallback>
                        {tenant.name && tenant.name.length >= 2 
                          ? tenant.name.substring(0, 2).toUpperCase() 
                          : 'LO'
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {tenant.name || 'Nom non défini'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {tenant.email || 'Email non défini'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {tenant.property || 'Propriété non définie'}
                      </p>
                    </div>
                    <Badge 
                      variant={tenant.status === 'À jour' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {tenant.status || 'Statut inconnu'}
                    </Badge>
                  </div>
                ))
              ) : (
                roommates.map((roommate) => (
                  <div
                    key={roommate.id}
                    onClick={() => handleUserSelection(roommate.id)}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                      selectedUserId === roommate.id ? "bg-green-50 border border-green-200" : ""
                    )}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={roommate.image || undefined} />
                      <AvatarFallback>
                        {roommate.name && roommate.name.length >= 2 
                          ? roommate.name.substring(0, 2).toUpperCase() 
                          : 'CO'
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {roommate.name || 'Nom non défini'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {roommate.email || 'Email non défini'}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {roommate.property || 'Propriété non définie'}
                      </p>
                    </div>
                    <Badge 
                      variant={roommate.status === 'À jour' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {roommate.status || 'Statut inconnu'}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - seulement pour admin/employé */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
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
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 w-full">
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
    </div>
  );
};

export default TenantSpace;
