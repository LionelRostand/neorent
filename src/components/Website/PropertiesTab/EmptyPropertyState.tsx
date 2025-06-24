
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';

interface EmptyPropertyStateProps {
  loadingProperties: boolean;
  onAddProperty: () => void;
}

export const EmptyPropertyState = ({
  loadingProperties,
  onAddProperty
}: EmptyPropertyStateProps) => {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        Aucune propriété affichée sur le site
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Sélectionnez des propriétés depuis votre base de données pour les afficher sur votre site web public
      </p>
      <Button 
        variant="outline" 
        onClick={onAddProperty}
        disabled={loadingProperties}
      >
        <Building className="h-4 w-4 mr-2" />
        {loadingProperties ? 'Chargement...' : 'Sélectionner des propriétés'}
      </Button>
    </div>
  );
};
