
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Mail, Phone, Home, Calendar, CheckCircle, Clock, XCircle, Users, User } from 'lucide-react';
import MetricCard from '@/components/MetricCard';
import TenantForm from '@/components/TenantForm';
import TenantDetailsModal from '@/components/TenantDetailsModal';

const Tenants = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [tenants, setTenants] = useState([
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '06 12 34 56 78',
      property: 'Appartement Rue des Fleurs',
      rentAmount: '1,200€',
      nextPayment: '2024-01-01',
      status: 'À jour',
      leaseStart: '2023-06-01',
      image: null
    },
    {
      id: 2,
      name: 'Jean Martin',
      email: 'jean.martin@email.com',
      phone: '06 98 76 54 32',
      property: 'Villa Montparnasse',
      rentAmount: '2,500€',
      nextPayment: '2024-01-01',
      status: 'À jour',
      leaseStart: '2023-03-15',
      image: null
    },
    {
      id: 3,
      name: 'Sophie Leroy',
      email: 'sophie.leroy@email.com',
      phone: '06 11 22 33 44',
      property: 'Appartement Boulevard Haussmann',
      rentAmount: '1,800€',
      nextPayment: '2023-12-28',
      status: 'En retard',
      leaseStart: '2023-01-10',
      image: null
    }
  ]);

  // Liste des biens immobiliers (simulée - normalement viendrait d'une API ou du state global)
  const [properties] = useState([
    {
      id: 1,
      title: 'Appartement Rue des Fleurs',
      address: '123 Rue des Fleurs, 75001 Paris',
      type: 'Appartement',
      surface: '65m²',
      rent: '1,200€',
      status: 'Occupé',
      tenant: 'Marie Dubois',
      image: '/placeholder.svg',
      locationType: 'Location'
    },
    {
      id: 2,
      title: 'Studio Centre-ville',
      address: '45 Avenue de la République, 75011 Paris',
      type: 'Studio',
      surface: '30m²',
      rent: '800€',
      status: 'Libre',
      tenant: null,
      image: '/placeholder.svg',
      locationType: 'Location'
    },
    {
      id: 3,
      title: 'Villa Montparnasse',
      address: '78 Boulevard Montparnasse, 75014 Paris',
      type: 'Maison',
      surface: '120m²',
      rent: '2,500€',
      status: 'Occupé',
      tenant: 'Jean Martin',
      image: '/placeholder.svg',
      locationType: 'Colocation'
    },
    {
      id: 4,
      title: 'Appartement Bastille',
      address: '12 Place de la Bastille, 75011 Paris',
      type: 'Appartement',
      surface: '45m²',
      rent: '1,000€',
      status: 'Libre',
      tenant: null,
      image: '/placeholder.svg',
      locationType: 'Location'
    }
  ]);

  const activeCount = tenants.filter(t => t.status === 'À jour').length;
  const lateCount = tenants.filter(t => t.status === 'En retard').length;
  const totalCount = tenants.length;

  const handleAddTenant = (data: any) => {
    // Simuler l'ajout à la collection rent_locataires
    const newTenant = {
      id: tenants.length + 1,
      name: data.name,
      email: data.email,
      phone: data.phone,
      property: data.property,
      rentAmount: data.rentAmount,
      status: 'À jour',
      leaseStart: data.leaseStart,
      nextPayment: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 jours
      image: data.imageBase64 ? `data:image/jpeg;base64,${data.imageBase64}` : null
    };

    setTenants(prev => [...prev, newTenant]);
    console.log('Locataire ajouté à la collection rent_locataires:', newTenant);
  };

  const handleViewDetails = (tenant: any) => {
    setSelectedTenant(tenant);
    setIsDetailsModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Locataires</h1>
            <p className="text-gray-600 mt-2">Gérez vos locataires et leurs informations</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un locataire
              </Button>
            </DialogTrigger>
            <TenantForm
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleAddTenant}
              properties={properties}
            />
          </Dialog>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Locataires actifs"
            value={activeCount}
            description={`${activeCount} locataire${activeCount > 1 ? 's' : ''} à jour`}
            icon={CheckCircle}
            iconBgColor="bg-green-500"
            borderColor="border-l-green-500"
          />
          <MetricCard
            title="En attente"
            value={0}
            description="0 locataire en attente"
            icon={Clock}
            iconBgColor="bg-yellow-500"
            borderColor="border-l-yellow-500"
          />
          <MetricCard
            title="En retard"
            value={lateCount}
            description={`${lateCount} locataire${lateCount > 1 ? 's' : ''} en retard`}
            icon={XCircle}
            iconBgColor="bg-red-500"
            borderColor="border-l-red-500"
          />
          <MetricCard
            title="Total"
            value={totalCount}
            description={`${totalCount} locataire${totalCount > 1 ? 's' : ''} au total`}
            icon={Users}
            iconBgColor="bg-blue-500"
            borderColor="border-l-blue-500"
          />
        </div>

        {/* Titre Liste */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste des Locataires</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {tenant.image ? (
                          <img 
                            src={tenant.image} 
                            alt={tenant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">{tenant.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">{tenant.property}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={tenant.status === 'À jour' ? 'default' : 'destructive'}
                      className={`${tenant.status === 'À jour' ? 'bg-green-100 text-green-800' : ''} flex-shrink-0 ml-2`}
                    >
                      {tenant.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{tenant.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Phone className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{tenant.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Home className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">Loyer: {tenant.rentAmount}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>Début bail: {new Date(tenant.leaseStart).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t mt-auto">
                    <p className="text-sm text-gray-600 mb-4">
                      Prochain paiement: {new Date(tenant.nextPayment).toLocaleDateString('fr-FR')}
                    </p>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewDetails(tenant)}
                      >
                        Voir détails
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Contacter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <TenantDetailsModal
          tenant={selectedTenant}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      </div>
    </MainLayout>
  );
};

export default Tenants;
