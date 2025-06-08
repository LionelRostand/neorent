
import React from 'react';
import MaintenanceRequestCard from './MaintenanceRequestCard';

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

interface MaintenanceRequestsListProps {
  requests: MaintenanceRequest[];
}

const MaintenanceRequestsList = ({ requests }: MaintenanceRequestsListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Demandes récentes</h3>
      {requests.map((request) => (
        <MaintenanceRequestCard key={request.id} request={request} />
      ))}
    </div>
  );
};

export default MaintenanceRequestsList;
