
import React, { useState } from 'react';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';
import FilterSection from './History/FilterSection';
import StatsCards from './History/StatsCards';
import CategoryStats from './History/CategoryStats';
import HistoryTable from './History/HistoryTable';

const MaintenanceHistory = () => {
  const { interventions, loading } = useFirebaseMaintenances();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2025');

  // Générer les années à partir de 2025
  const currentYear = new Date().getFullYear();
  const startYear = 2025;
  const years = [];
  for (let year = Math.max(startYear, currentYear); year >= startYear; year--) {
    years.push(year.toString());
  }
  // Ajouter les années futures si nécessaire
  if (currentYear < startYear) {
    for (let year = startYear; year <= startYear + 5; year++) {
      years.push(year.toString());
    }
  }

  // Filtrer seulement les interventions terminées pour l'historique
  const completedInterventions = interventions.filter(intervention => 
    intervention.status === 'Terminée'
  );

  const filteredHistory = completedInterventions.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.technicianName && item.technicianName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProperty = selectedProperty === 'all' || item.property === selectedProperty;
    const matchesCategory = selectedCategory === 'all' || item.priority === selectedCategory;
    
    // Filtrer par année basé sur la date programmée ou une date par défaut
    const itemYear = item.scheduledDate ? new Date(item.scheduledDate).getFullYear().toString() : selectedYear;
    const matchesYear = itemYear === selectedYear;
    
    return matchesSearch && matchesProperty && matchesCategory && matchesYear;
  });

  const totalCost = filteredHistory.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
  const proprietaireCost = filteredHistory.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);
  const locataireCost = 0; // À implémenter selon la logique de responsabilité

  const categoryStats = filteredHistory.reduce((acc, item) => {
    const category = item.priority || 'Non défini';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const propertyStats = filteredHistory.reduce((acc, item) => {
    acc[item.property] = (acc[item.property] || 0) + (item.actualCost || item.estimatedCost || 0);
    return acc;
  }, {} as Record<string, number>);

  // Obtenir la liste unique des propriétés
  const uniqueProperties = [...new Set(completedInterventions.map(item => item.property))];

  if (loading) {
    return <div>Chargement...</div>;
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
