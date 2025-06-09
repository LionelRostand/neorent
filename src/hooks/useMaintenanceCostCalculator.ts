
import { useEffect } from 'react';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';

interface UseMaintenanceCostCalculatorProps {
  selectedProperty: string;
  month: string;
  selectedPropertyName?: string;
  onCostCalculated: (cost: string) => void;
}

export const useMaintenanceCostCalculator = ({
  selectedProperty,
  month,
  selectedPropertyName,
  onCostCalculated
}: UseMaintenanceCostCalculatorProps) => {
  const { interventions, loading: maintenanceLoading } = useFirebaseMaintenances();

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
        .reduce((total, intervention) => total + (intervention.actualCost || intervention.estimatedCost || 0), 0);

      onCostCalculated(propertyMaintenanceCosts.toString());
    }
  }, [selectedProperty, month, interventions, selectedPropertyName, onCostCalculated]);

  return { maintenanceLoading };
};
