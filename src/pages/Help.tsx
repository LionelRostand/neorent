
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MainLayout from '@/components/Layout/MainLayout';
import HelpSearch from '@/components/Help/HelpSearch';
import CategoryFilters from '@/components/Help/CategoryFilters';
import HelpCard from '@/components/Help/HelpCard';
import NoResults from '@/components/Help/NoResults';
import { helpSectionsData } from '@/components/Help/helpData';

const Help = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Transform data with translations
  const helpSections = helpSectionsData.map(section => ({
    icon: section.icon,
    title: t(section.titleKey),
    category: t(section.categoryKey),
    description: t(section.descriptionKey),
    technical: t(section.technicalKey),
    functional: t(section.functionalKey)
  }));

  const filteredSections = helpSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? section.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(helpSections.map(section => section.category))];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
  };

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="px-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{t('help.title')}</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            {t('help.subtitle')}
          </p>
        </div>

        <HelpSearch 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <CategoryFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
          onClearFilters={clearFilters}
        />

        {/* Help sections - Responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredSections.map((section, index) => (
            <HelpCard key={index} section={section} />
          ))}
        </div>

        {/* No results message */}
        {filteredSections.length === 0 && (
          <NoResults onClearFilters={clearFilters} />
        )}
      </div>
    </MainLayout>
  );
};

export default Help;
