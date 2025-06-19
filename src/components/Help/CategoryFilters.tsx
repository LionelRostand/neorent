
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryClick: (category: string) => void;
  onClearFilters: () => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryClick,
  onClearFilters
}) => {
  const { t } = useTranslation();

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      onClearFilters();
    } else {
      onCategoryClick(category);
    }
  };

  return (
    <>
      {/* Badges des catégories - Responsive */}
      <div className="flex flex-wrap gap-1 md:gap-2">
        <Badge 
          variant="outline" 
          className={`cursor-pointer hover:bg-gray-100 transition-colors text-xs md:text-sm px-2 md:px-3 py-1 ${
            selectedCategory === null ? 'bg-blue-100 border-blue-300' : ''
          }`}
          onClick={onClearFilters}
        >
          <span className="hidden sm:inline">{t('help.categories')}</span>
          <span className="sm:hidden">{t('help.categories')}</span>
        </Badge>
        {categories.map(category => (
          <Badge 
            key={category} 
            variant={selectedCategory === category ? "default" : "outline"}
            className={`cursor-pointer transition-colors text-xs md:text-sm px-2 md:px-3 py-1 ${
              selectedCategory === category 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <span className="truncate max-w-[120px] sm:max-w-none">
              {category}
            </span>
          </Badge>
        ))}
      </div>

      {/* Indicateur de filtre actif */}
      {selectedCategory && (
        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600 px-1">
          <span>{t('help.categories')} :</span>
          <Badge variant="secondary" className="text-xs">{selectedCategory}</Badge>
          <button
            onClick={onClearFilters}
            className="text-blue-600 hover:text-blue-800 underline text-xs md:text-sm"
          >
            {t('help.noResultsDescription')}
          </button>
        </div>
      )}
    </>
  );
};

export default CategoryFilters;
