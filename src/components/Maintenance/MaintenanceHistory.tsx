
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Euro, Search, Filter } from 'lucide-react';

const MaintenanceHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2024');

  const historyData = [
    {
      id: '1',
      date: '2024-01-18',
      property: 'Maison 8 Avenue des Roses',
      category: 'Électricité',
      description: 'Remplacement ampoule LED salon',
      technicianName: 'Marie Électricienne',
      cost: 20,
      responsibility: 'Locataire',
      status: 'Terminée'
    },
    {
      id: '2',
      date: '2024-01-10',
      property: 'Appartement 15 Rue de la Paix',
      category: 'Plomberie',
      description: 'Réparation robinet cuisine',
      technicianName: 'Jean Plombier',
      cost: 75,
      responsibility: 'Propriétaire',
      status: 'Terminée'
    },
    {
      id: '3',
      date: '2023-12-15',
      property: 'Studio 22 Boulevard Victor Hugo',
      category: 'Chauffage',
      description: 'Entretien chaudière annuel',
      technicianName: 'Pierre Chauffagiste',
      cost: 120,
      responsibility: 'Propriétaire',
      status: 'Terminée'
    },
    {
      id: '4',
      date: '2023-11-28',
      property: 'Appartement 15 Rue de la Paix',
      category: 'Peinture',
      description: 'Retouche peinture chambre',
      technicianName: 'Sophie Peintre',
      cost: 150,
      responsibility: 'Locataire',
      status: 'Terminée'
    },
    {
      id: '5',
      date: '2023-10-05',
      property: 'Maison 8 Avenue des Roses',
      category: 'Serrurerie',
      description: 'Remplacement serrure porte d\'entrée',
      technicianName: 'Marc Serrurier',
      cost: 180,
      responsibility: 'Propriétaire',
      status: 'Terminée'
    }
  ];

  const filteredHistory = historyData.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.technicianName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProperty = selectedProperty === 'all' || item.property === selectedProperty;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesYear = item.date.startsWith(selectedYear);
    
    return matchesSearch && matchesProperty && matchesCategory && matchesYear;
  });

  const totalCost = filteredHistory.reduce((sum, item) => sum + item.cost, 0);
  const proprietaireCost = filteredHistory.filter(item => item.responsibility === 'Propriétaire').reduce((sum, item) => sum + item.cost, 0);
  const locataireCost = filteredHistory.filter(item => item.responsibility === 'Locataire').reduce((sum, item) => sum + item.cost, 0);

  const categoryStats = filteredHistory.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const propertyStats = filteredHistory.reduce((acc, item) => {
    acc[item.property] = (acc[item.property] || 0) + item.cost;
    return acc;
  }, {} as Record<string, number>);

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
                  <SelectItem value="Appartement 15 Rue de la Paix">Appartement 15 Rue de la Paix</SelectItem>
                  <SelectItem value="Maison 8 Avenue des Roses">Maison 8 Avenue des Roses</SelectItem>
                  <SelectItem value="Studio 22 Boulevard Victor Hugo">Studio 22 Boulevard Victor Hugo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="Plomberie">Plomberie</SelectItem>
                  <SelectItem value="Électricité">Électricité</SelectItem>
                  <SelectItem value="Chauffage">Chauffage</SelectItem>
                  <SelectItem value="Peinture">Peinture</SelectItem>
                  <SelectItem value="Serrurerie">Serrurerie</SelectItem>
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
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
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
            <CardTitle>Répartition par catégorie</CardTitle>
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
                <TableHead>Catégorie</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead>Coût</TableHead>
                <TableHead>Responsabilité</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.property}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.technicianName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Euro className="h-3 w-3" />
                      {item.cost}€
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.responsibility === 'Propriétaire' ? 'default' : 'secondary'}>
                      {item.responsibility}
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
