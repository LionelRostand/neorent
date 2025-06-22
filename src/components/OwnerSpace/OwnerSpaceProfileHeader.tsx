
import React from 'react';
import { useTranslation } from 'react-i18next';

interface OwnerSpaceProfileHeaderProps {
  currentProfile: any;
}

const OwnerSpaceProfileHeader: React.FC<OwnerSpaceProfileHeaderProps> = ({ currentProfile }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white shadow-sm border-b mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-base lg:text-lg font-bold">
                {currentProfile?.name?.charAt(0).toUpperCase() || 'O'}
              </span>
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Owner Space
              </h1>
              <p className="text-gray-600 text-sm">
                Welcome, {currentProfile?.name || 'Owner'}
              </p>
              <p className="text-xs text-gray-500">
                {currentProfile?.email}
              </p>
            </div>
          </div>
          <div className="mt-3 md:mt-0">
            <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-800 text-xs font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerSpaceProfileHeader;
