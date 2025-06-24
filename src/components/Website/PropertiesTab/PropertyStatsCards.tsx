
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Eye, CheckCircle, Save } from 'lucide-react';

interface PropertyStatsCardsProps {
  totalProperties: number;
  visibleProperties: number;
  featuredProperties: number;
  onSave: () => void;
  isSaving: boolean;
}

export const PropertyStatsCards = ({
  totalProperties,
  visibleProperties,
  featuredProperties,
  onSave,
  isSaving
}: PropertyStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Propriétés</p>
              <p className="text-2xl font-bold">{totalProperties}</p>
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
              <p className="text-2xl font-bold text-green-600">{visibleProperties}</p>
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
              <p className="text-2xl font-bold text-orange-600">{featuredProperties}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                onClick={onSave} 
                disabled={isSaving}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
