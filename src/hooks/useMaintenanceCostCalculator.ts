
import { useEffect } from 'react';

interface MaintenanceRequest {
  id: string;
  responsibility: string;
}

interface MaintenanceIntervention {
  id: string;
  requestId: string;
  property: string;
  status: string;
  scheduledDate: string;
  actualCost: number | null;
  estimatedCost: number;
}

interface UseMaintenanceCostCalculatorProps {
  selectedProperty: string;
  month: string;
  selectedPropertyName?: string;
  interventions: MaintenanceIntervention[];
  requests: MaintenanceRequest[];
  onCostCalculated: (cost: string) => void;
}

export const useMaintenanceCostCalculator = ({
  selectedProperty,
  month,
  selectedPropertyName,
  interventions,
  requests,
  onCostCalculated
}: UseMaintenanceCostCalculatorProps) => {
  useEffect(() => {
    if (selectedProperty && month && selectedPropertyName) {
      // Filtrer les interventions terminées pour ce bien et ce mois
      const monthStart = new Date(month + '-01');
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      const propertyMaintenanceCosts = interventions
        .filter(intervention => 
          intervention.property === selectedPropertyName &&
          intervention.status === 'Terminée' &&
          intervention.scheduledDate
        )
        .filter(intervention => {
          const interventionDate = new Date(intervention.scheduledDate);
          return interventionDate >= monthStart && interventionDate <= monthEnd;
        })
        .filter(intervention => {
          // Trouver la demande correspondante pour vérifier la responsabilité
          const request = requests.find(req => req.id === intervention.requestId);
          return request && request.responsibility === 'Propriétaire';
        })
        .reduce((total, intervention) => total + (intervention.actualCost || intervention.estimatedCost || 0), 0);

      onCostCalculated(propertyMaintenanceCosts.toString());
    }
  }, [selectedProperty, month, interventions, requests, selectedPropertyName, onCostCalculated]);

  return {};
};
