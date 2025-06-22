
import React from 'react';
import { Building } from 'lucide-react';

const SidebarHeader: React.FC = () => {
  return (
    <div className="p-6 flex-shrink-0">
      <div className="flex items-center">
        <Building className="h-6 w-6 text-white mr-2" />
        <h1 className="text-xl font-bold text-white">NeoRent</h1>
      </div>
    </div>
  );
};

export default SidebarHeader;
