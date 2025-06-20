
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building, User } from 'lucide-react';

interface OwnerSpaceHeaderProps {
  ownerProfile: any;
}

const OwnerSpaceHeader: React.FC<OwnerSpaceHeaderProps> = ({ ownerProfile }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Building className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Espace Propriétaire
              </h1>
              <p className="text-white/90 mt-1">
                Bienvenue, {ownerProfile?.name || 'Propriétaire'}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-lg">
            <User className="h-5 w-5" />
            <span className="font-medium">{ownerProfile?.role || 'Propriétaire'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerSpaceHeader;
