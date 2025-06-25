
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';

export const EmptyPropertyState = () => {
  const navigate = useNavigate();

  const handleAddProperty = () => {
    navigate('/properties');
  };

  return (
    <div className="text-center py-12 bg-gray-50 rounded-lg">
      <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        Aucune propriété trouvée
      </h3>
      <p className="text-gray-500 text-sm mb-4">
        Ajoutez des propriétés depuis la section Propriétés pour les afficher sur votre site web
      </p>
      <Button onClick={handleAddProperty}>
        <Building className="h-4 w-4 mr-2" />
        Ajouter une propriété
      </Button>
    </div>
  );
};
