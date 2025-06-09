
import React from 'react';
import MaintenanceForm from './MaintenanceForm';
import MaintenanceRequestsList from './MaintenanceRequestsList';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';

const MaintenanceRequestForm = () => {
  const { requests, addRequest, getRecentRequests, loading } = useFirebaseMaintenances();

  const handleNewRequest = async (newRequest: any) => {
    try {
      await addRequest(newRequest);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la demande:', error);
    }
  };

  const recentRequests = getRecentRequests();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <MaintenanceForm onSubmit={handleNewRequest} />
      <MaintenanceRequestsList requests={recentRequests} />
    </div>
  );
};

export default MaintenanceRequestForm;
