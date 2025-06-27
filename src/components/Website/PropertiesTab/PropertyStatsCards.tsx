
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Eye, Star, Save } from 'lucide-react';

interface PropertyStatsCardsProps {
  uniqueProperties: any[];
  ownerProperties: any[];
  allAdminProperties: any[];
  visibleProperties: any[];
  featuredProperties: any[];
  isSaving: boolean;
  onSave: () => void;
}

export const PropertyStatsCards = ({
  uniqueProperties,
  ownerProperties,
  allAdminProperties,
  visibleProperties,
  featuredProperties,
  isSaving,
  onSave
}: PropertyStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Propriétés</p>
              <p className="text-2xl font-bold">{uniqueProperties?.length || 0}</p>
            </div>
            <Building className="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Visibles sur le site</p>
              <p className="text-2xl font-bold text-green-600">{visibleProperties?.length || 0}</p>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Mises en avant</p>
              <p className="text-2xl font-bold text-orange-600">{featuredProperties?.length || 0}</p>
            </div>
            <Star className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-full">
            <Button 
              onClick={onSave} 
              disabled={isSaving}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
