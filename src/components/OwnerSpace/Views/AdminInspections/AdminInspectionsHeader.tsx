
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminInspectionsHeaderProps {
  onNewInspection: () => void;
}

const AdminInspectionsHeader: React.FC<AdminInspectionsHeaderProps> = ({ onNewInspection }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-4 sm:p-6 text-white shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">{t('inspections.title')}</h1>
          <p className="text-indigo-100 mt-1 sm:mt-2 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
            {t('inspections.subtitle')}
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button 
            onClick={onNewInspection}
            className="bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-md w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('inspections.newInspection')}</span>
            <span className="sm:hidden">Nouvelle</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminInspectionsHeader;
