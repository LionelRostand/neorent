
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  CreditCard, 
  FileText, 
  User, 
  Upload,
  Shield,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdminTenantAccess } from '@/hooks/useAdminTenantAccess';
import { useNavigate } from 'react-router-dom';

import TenantProfile from '@/components/TenantSpace/TenantProfile';
import PropertyInfo from '@/components/TenantSpace/PropertyInfo';
import RentPayment from '@/components/TenantSpace/RentPayment';
import RentHistory from '@/components/TenantSpace/RentHistory';
import TenantDocuments from '@/components/TenantSpace/TenantDocuments';
import DocumentUpload from '@/components/TenantSpace/DocumentUpload';

const TenantSpace = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { userProfile, userType } = useAuth();
  const { 
    isAuthorizedAdmin, 
    getCurrentProfile, 
    getCurrentUserType,
    switchBackToAdmin,
    isImpersonating 
  } = useAdminTenantAccess();
  const navigate = useNavigate();

  const currentProfile = getCurrentProfile();
  const currentType = getCurrentUserType();

  // Debug logs
  useEffect(() => {
    console.log('TenantSpace - Current profile:', currentProfile);
    console.log('TenantSpace - Current type:', currentType);
    console.log('TenantSpace - Is impersonating:', isImpersonating);
    console.log('TenantSpace - Is admin:', isAuthorizedAdmin);
  }, [currentProfile, currentType, isImpersonating, isAuthorizedAdmin]);

  const handleBackToAdmin = () => {
    switchBackToAdmin();
    navigate('/admin/settings');
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'payment', label: 'Paiement', icon: CreditCard },
    { id: 'history', label: 'Historique', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'profile', label: 'Profil', icon: User }
  ];

  if (!currentProfile) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg text-gray-600">Aucun profil trouvé</p>
            <p className="text-gray-500">Contactez l'administrateur pour résoudre ce problème.</p>
            {isAuthorizedAdmin && (
              <Button onClick={() => navigate('/admin/settings')} className="mt-4">
                Retour à l'administration
              </Button>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

  // Construire les données du bien en utilisant les informations du profil actuel
  const mockPropertyData = {
    title: `${currentType === 'colocataire' ? 'Chambre' : 'Appartement'} ${currentProfile.property || currentProfile.roomNumber || 'T2'}`,
    address: currentProfile.address || currentProfile.property || "123 Rue de la Paix, 75001 Paris",
    type: currentType === 'colocataire' ? 'Chambre en colocation' : 'Appartement',
    surface: currentType === 'colocataire' ? '15 m²' : '45 m²',
    rooms: currentType === 'colocataire' ? '1 chambre' : '2 pièces',
    rent: currentProfile.rentAmount || 1200,
    charges: 150,
    deposit: (currentProfile.rentAmount || 1200) * 2,
    furnished: true,
    floor: "3ème étage",
    elevator: true,
    parking: false,
    features: currentType === 'colocataire' 
      ? ["Chambre meublée", "Cuisine partagée", "Salle de bain partagée", "Lumineux"]
      : ["Balcon", "Cuisine équipée", "Parquet", "Lumineux"]
  };

  // Données du locataire/colocataire pour les composants
  const mockTenantData = {
    id: currentProfile.id || 1,
    name: currentProfile.name,
    email: currentProfile.email,
    phone: currentProfile.phone || "0123456789",
    address: currentProfile.address || currentProfile.property || "123 Rue de la Paix, 75001 Paris",
    leaseStart: currentProfile.leaseStart || currentProfile.moveInDate || "2024-01-01",
    leaseEnd: currentProfile.leaseEnd || "2024-12-31",
    status: currentProfile.status || "À jour",
    type: (currentType === 'colocataire' ? 'Colocataire' : 'Locataire') as 'Colocataire' | 'Locataire',
    emergencyContact: {
      name: "Contact Urgence",
      phone: "0987654321",
      relation: "Famille"
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Admin Impersonation Banner */}
        {isImpersonating && isAuthorizedAdmin && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">
                      Mode Administrateur - Consultation de l'espace de {currentProfile.name}
                    </p>
                    <p className="text-sm text-blue-700">
                      Vous consultez l'espace en tant qu'administrateur
                    </p>
                    <p className="text-sm text-blue-600">
                      Type: {currentType} | Email: {currentProfile.email}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleBackToAdmin}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Espace {currentType === 'colocataire' ? 'Colocataire' : 'Locataire'}
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Bienvenue {currentProfile.name}
              </p>
              {currentType === 'colocataire' && currentProfile.roomNumber && (
                <p className="text-gray-500 mt-1 text-sm">
                  Chambre {currentProfile.roomNumber}
                </p>
              )}
            </div>
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-800 border-green-200"
            >
              {currentType === 'colocataire' ? 'Colocataire' : 'Locataire'}
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full min-w-[600px] grid-cols-6 mb-4 md:mb-6 mx-1">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3"
                >
                  <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="truncate text-[10px] sm:text-xs lg:text-sm">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            <PropertyInfo propertyData={mockPropertyData} />
          </TabsContent>

          <TabsContent value="payment" className="space-y-4 md:space-y-6">
            <RentPayment tenantData={mockTenantData} propertyData={mockPropertyData} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4 md:space-y-6">
            <RentHistory />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 md:space-y-6">
            <TenantDocuments />
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 md:space-y-6">
            <DocumentUpload />
          </TabsContent>

          <TabsContent value="profile" className="space-y-4 md:space-y-6">
            <TenantProfile tenantData={mockTenantData} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default TenantSpace;
