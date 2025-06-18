
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface TenantInfoProps {
  tenantName: string;
  tenantType: string;
}

const TenantInfo: React.FC<TenantInfoProps> = ({ tenantName, tenantType }) => {
  return (
    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
        <User className="h-3 w-3 sm:h-5 sm:w-5 text-blue-600" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">{tenantName}</h3>
        <Badge variant="outline" className="text-xs mt-1">
          {tenantType}
        </Badge>
      </div>
    </div>
  );
};

export default TenantInfo;
