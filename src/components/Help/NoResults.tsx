
import React from 'react';
import { Search } from 'lucide-react';

interface NoResultsProps {
  onClearFilters: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({ onClearFilters }) => {
  return (
    <div className="text-center py-8 md:py-12">
      <Search className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
        Aucun résultat trouvé
      </h3>
      <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base px-4">
        Aucune section ne correspond à vos critères de recherche.
      </p>
      <button
        onClick={onClearFilters}
        className="text-blue-600 hover:text-blue-800 underline text-sm md:text-base"
      >
        Effacer tous les filtres
      </button>
    </div>
  );
};

export default NoResults;
