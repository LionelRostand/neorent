
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface HelpSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const HelpSearch: React.FC<HelpSearchProps> = ({ searchTerm, onSearchChange }) => {
  const { t } = useTranslation();
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={t('help.searchHelp')}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 text-sm md:text-base"
      />
    </div>
  );
};

export default HelpSearch;
