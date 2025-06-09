
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Euro, Search, Filter } from 'lucide-react';
import { useFirebaseMaintenances } from '@/hooks/useFirebaseMaintenances';

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
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property">Bien immobilier</Label>
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les biens</SelectItem>
                  {uniqueProperties.map((property) => (
                    <SelectItem key={property} value={property}>{property}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Priorité</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="faible">Faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredHistory.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Coût total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCost}€</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Charge propriétaire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{proprietaireCost}€</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Charge locataire</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{locataireCost}€</div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par catégorie et par bien */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par priorité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category}</span>
                  <Badge variant="secondary">{count} intervention{count > 1 ? 's' : ''}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Coûts par bien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(propertyStats).map(([property, cost]) => (
                <div key={property} className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate">{property}</span>
                  <div className="flex items-center gap-1">
                    <Euro className="h-3 w-3" />
                    <span className="font-semibold">{cost}€</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Historique détaillé</CardTitle>
          <CardDescription>
            {filteredHistory.length} intervention{filteredHistory.length > 1 ? 's' : ''} trouvée{filteredHistory.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead>Coût</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.scheduledDate || 'Non définie'}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.property}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.priority}</Badge>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.technicianName || 'Non assigné'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Euro className="h-3 w-3" />
                      {item.actualCost || item.estimatedCost || 0}€
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceHistory;
