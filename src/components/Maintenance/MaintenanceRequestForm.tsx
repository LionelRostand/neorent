
import React, { useState } from 'react';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceRequestsList from './MaintenanceRequestsList';

interface MaintenanceRequest {
  id: string;
  propertyId: string;
  tenantName: string;
  category: string;
  priority: string;
  description: string;
  location: string;
  status: string;
  requestDate: string;
  responsibility: string;
}

const MaintenanceRequestForm = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([
    {
      id: '1',
      propertyId: 'Appartement 15 Rue de la Paix',
      tenantName: 'Marie Dupont',
      category: 'Plomberie',
      priority: 'urgent',
      description: 'Fuite d\'eau dans la salle de bain',
      location: 'Salle de bain',
      status: 'En attente',
      requestDate: '2024-01-15',
      responsibility: 'Propriétaire'
    },
    {
      id: '2',
      propertyId: 'Maison 8 Avenue des Roses',
      tenantName: 'Pierre Martin',
      category: 'Électricité',
      priority: 'normal',
      description: 'Ampoule grillée dans le salon',
      location: 'Salon',
      status: 'En cours',
      requestDate: '2024-01-14',
      responsibility: 'Locataire'
    }
  ]);

  const handleNewRequest = (newRequest: any) => {
    setRequests([newRequest, ...requests]);
  };

  return (
    <div className="space-y-6">
      <MaintenanceForm onSubmit={handleNewRequest} />
      <MaintenanceRequestsList requests={requests} />
    </div>
  );
};

export default MaintenanceRequestForm;
