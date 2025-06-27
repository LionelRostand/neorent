
import React from 'react';
import { useTranslation } from 'react-i18next';

interface OwnerSpaceProfileHeaderProps {
  currentProfile: any;
}

const OwnerSpaceProfileHeader: React.FC<OwnerSpaceProfileHeaderProps> = ({ currentProfile }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white px-4 sm:px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            {currentProfile?.name || t('ownerSpace.owner')}
          </h2>
          <p className="text-sm text-gray-500 truncate">
            {currentProfile?.email || t('ownerSpace.ownerSpace')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerSpaceProfileHeader;
