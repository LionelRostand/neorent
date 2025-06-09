
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface HelpSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const HelpSearch: React.FC<HelpSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Rechercher dans l'aide..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 text-sm md:text-base"
      />
    </div>
  );
};

export default HelpSearch;
