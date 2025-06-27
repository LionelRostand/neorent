
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
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('inspections.title')}</h1>
          <p className="text-indigo-100 mt-2">{t('inspections.subtitle')}</p>
        </div>
        <Button 
          onClick={onNewInspection}
          className="bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('inspections.newInspection')}
        </Button>
      </div>
    </div>
  );
};

export default AdminInspectionsHeader;
