
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    console.log('=== TenantSpace Debug ===');
    console.log('Current profile:', currentProfile);
    console.log('Current type:', currentType);
    console.log('Is impersonating:', isImpersonating);
    console.log('Is admin:', isAuthorizedAdmin);
    console.log('User profile:', userProfile);
    console.log('User type:', userType);
    console.log('========================');
  }, [currentProfile, currentType, isImpersonating, isAuthorizedAdmin, userProfile, userType]);

  const handleBackToAdmin = () => {
    console.log('Returning to admin settings');
    switchBackToAdmin();
    navigate('/admin/settings');
  };

  const tabs = [
    { id: 'overview', label: t('tenantSpace.tabs.overview'), icon: Home },
    { id: 'payment', label: t('tenantSpace.tabs.payment'), icon: CreditCard },
    { id: 'history', label: t('tenantSpace.tabs.history'), icon: FileText },
    { id: 'documents', label: t('tenantSpace.tabs.documents'), icon: FileText },
    { id: 'upload', label: t('tenantSpace.tabs.upload'), icon: Upload },
    { id: 'profile', label: t('tenantSpace.tabs.profile'), icon: User }
  ];

  if (!currentProfile) {
    console.error('No current profile found');
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

  console.log('Rendered data:', { mockPropertyData, mockTenantData });

  const typeKey = currentType === 'colocataire' ? 'roommate' : 'tenant';

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Admin Impersonation Banner */}
        {isImpersonating && isAuthorizedAdmin && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-blue-900 text-sm sm:text-base break-words leading-tight">
                      Mode Administrateur - Consultation de l'espace de {currentProfile.name}
                    </p>
                    <p className="text-xs sm:text-sm text-blue-700 mt-1">
                      Vous consultez l'espace en tant qu'administrateur
                    </p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-blue-600">
                        <span className="font-medium">Type:</span> {currentType}
                      </p>
                      <p className="text-xs text-blue-600 break-all">
                        <span className="font-medium">Email:</span> {currentProfile.email}
                      </p>
                      <p className="text-xs text-blue-600 break-words">
                        <span className="font-medium">Adresse:</span> {currentProfile.address}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end sm:justify-start">
                  <Button 
                    onClick={handleBackToAdmin}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 text-xs px-2 py-1 h-8 sm:h-9 flex-shrink-0"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span className="hidden xs:inline">Retour Admin</span>
                    <span className="xs:hidden">Retour</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {t('tenantSpace.title', { type: t(`tenantSpace.${typeKey}`) })}
              </h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base break-words">
                {t('tenantSpace.welcome', { name: currentProfile.name })}
              </p>
              {currentType === 'colocataire' && currentProfile.roomNumber && (
                <p className="text-gray-500 mt-1 text-sm">
                  {t('tenantSpace.room', { number: currentProfile.roomNumber })}
                </p>
              )}
            </div>
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm flex-shrink-0"
            >
              {t(`tenantSpace.${typeKey}`)}
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
