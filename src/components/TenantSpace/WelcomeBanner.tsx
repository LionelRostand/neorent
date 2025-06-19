
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface WelcomeBannerProps {
  tenantData: any;
  isRoommate: boolean;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ tenantData, isRoommate }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Bienvenue, {tenantData.name}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base">
            {isRoommate ? `Chambre ${tenantData.roomNumber}` : 'Votre logement'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className="bg-white/20 text-white border-white/30 px-3 py-1"
          >
            {tenantData.status}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
