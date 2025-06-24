
import React from 'react';
import { Button } from '@/components/ui/button';
import { Building, ExternalLink } from 'lucide-react';

interface PropertyListActionsProps {
  loadingProperties: boolean;
  onAddProperty: () => void;
  onPreviewSite: () => void;
}

export const PropertyListActions = ({
  loadingProperties,
  onAddProperty,
  onPreviewSite
}: PropertyListActionsProps) => {
  return (
    <>
      {/* Header actions */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="sm" onClick={onPreviewSite}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Aperçu site
        </Button>
      </div>

      {/* Add more properties button */}
      <div className="pt-4 border-t border-gray-200">
        <Button 
          variant="outline" 
          onClick={onAddProperty}
          disabled={loadingProperties}
          className="w-full"
        >
          <Building className="h-4 w-4 mr-2" />
          {loadingProperties ? 'Chargement...' : 'Parcourir toutes les propriétés'}
        </Button>
      </div>
    </>
  );
};
