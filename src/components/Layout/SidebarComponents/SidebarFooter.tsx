
import React from 'react';

const SidebarFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="p-4 border-t border-green-400 flex-shrink-0">
      <div className="text-center">
        <div className="text-white text-sm font-medium animate-pulse">
          NEOTECH-CONSULTING
        </div>
        <div className="text-white/80 text-xs mt-1">
          Version 1.0 • {currentYear}
        </div>
      </div>
    </div>
  );
};

export default SidebarFooter;
