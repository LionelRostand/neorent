
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';
import FilterSection from './History/FilterSection';
import StatsCards from './History/StatsCards';
import CategoryStats from './History/CategoryStats';
import HistoryTable from './History/HistoryTable';

const MaintenanceHistory = () => {
  const { t } = useTranslation();
  const { interventions, loading } = useFirebaseMaintenances();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2025');

  // Generate years starting from 2025
  const currentYear = new Date().getFullYear();
  const startYear = 2025;
  const years = [];
  for (let year = Math.max(startYear, currentYear); year >= startYear; year--) {
    years.push(year.toString());
  }
  // Add future years if necessary
  if (currentYear < startYear) {
    for (let year = startYear; year <= startYear + 5; year++) {
      years.push(year.toString());
    }
  }

  // Filter only completed interventions for history
  const completedInterventions = interventions.filter(intervention => 
    intervention.status === 'Terminée'
  );

  const filteredHistory = completedInterventions.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.technicianName && item.technicianName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProperty = selectedProperty === 'all' || item.property === selectedProperty;
    const matchesCategory = selectedCategory === 'all' || item.priority === selectedCategory;
    
    // Filter by year based on scheduled date or default date
    const itemYear = item.scheduledDate ? new Date(item.scheduledDate).getFullYear().toString() : selectedYear;
    const matchesYear = itemYear === selectedYear;
    
    return matchesSearch && matchesProperty && matchesCategory && matchesYear;
  });

  const totalCost = filteredHistory.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
  const proprietaireCost = filteredHistory.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
  const locataireCost = 0; // To implement according to responsibility logic

  const categoryStats = filteredHistory.reduce((acc, item) => {
    const category = item.priority || 'Non défini';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const propertyStats = filteredHistory.reduce((acc, item) => {
    acc[item.property] = (acc[item.property] || 0) + (item.actualCost || item.estimatedCost || 0);
    return acc;
  }, {} as Record<string, number>);

  // Get unique list of properties
  const uniqueProperties = [...new Set(completedInterventions.map(item => item.property))];

  if (loading) {
    return <div>{t('maintenanceHistory.loadingHistory')}</div>;
  }

  return (
    <div className="space-y-6">
      <FilterSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        uniqueProperties={uniqueProperties}
        years={years}
      />

      <StatsCards
        totalInterventions={filteredHistory.length}
        totalCost={totalCost}
        proprietaireCost={proprietaireCost}
        locataireCost={locataireCost}
      />

      <CategoryStats
        categoryStats={categoryStats}
        propertyStats={propertyStats}
      />

      <HistoryTable filteredHistory={filteredHistory} />
    </div>
  );
};

export default MaintenanceHistory;
