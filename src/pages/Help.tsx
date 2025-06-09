
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Building, 
  Users, 
  FileText, 
  DollarSign, 
  ClipboardList, 
  Wrench, 
  Settings, 
  UserCheck,
  Globe,
  Calculator,
  MessageCircle,
  Search
} from 'lucide-react';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const helpSections = [
    {
      icon: Home,
      title: 'Dashboard',
      category: 'Vue d\'ensemble',
      description: 'Tableau de bord principal avec métriques et activités récentes',
      technical: 'Interface de synthèse utilisant des composants de métriques et graphiques en temps réel',
      functional: 'Permet de visualiser rapidement l\'état général de votre parc immobilier, les revenus, les tâches en attente et les alertes importantes'
    },
    {
      icon: Building,
      title: 'Propriétés',
      category: 'Gestion immobilière',
      description: 'Gestion complète de votre parc immobilier',
      technical: 'CRUD complet avec upload de documents, géolocalisation et historique des modifications',
      functional: 'Créer, modifier et suivre vos biens immobiliers : appartements, maisons, locaux commerciaux. Gérer les caractéristiques, photos, documents et localisation'
    },
    {
      icon: Users,
      title: 'Locataires',
      category: 'Gestion locative',
      description: 'Base de données et suivi des locataires',
      technical: 'Système de gestion des profils avec historique des paiements et documents associés',
      functional: 'Gérer les informations personnelles des locataires, leur historique de location, documents d\'identité et suivi des relations contractuelles'
    },
    {
      icon: UserCheck,
      title: 'Colocataires',
      category: 'Gestion locative',
      description: 'Gestion spécialisée pour la colocation',
      technical: 'Extension du système locataires avec gestion des relations multiples et répartition des charges',
      functional: 'Suivre les colocataires, gérer la répartition des loyers et charges, coordonner les responsabilités partagées'
    },
    {
      icon: FileText,
      title: 'Contrats',
      category: 'Documentation',
      description: 'Création et gestion des baux et contrats',
      technical: 'Générateur de contrats avec templates personnalisables et signature électronique',
      functional: 'Créer des baux de location, gérer les renouvellements, suivre les échéances et conditions contractuelles'
    },
    {
      icon: ClipboardList,
      title: 'États des lieux',
      category: 'Documentation',
      description: 'Documentation détaillée de l\'état des biens',
      technical: 'Formulaires dynamiques avec upload de photos et génération automatique de rapports PDF',
      functional: 'Réaliser des états des lieux d\'entrée et de sortie, documenter l\'état des biens avec photos et observations détaillées'
    },
    {
      icon: DollarSign,
      title: 'Gestion des loyers',
      category: 'Finance',
      description: 'Suivi des paiements et relances',
      technical: 'Système de facturation automatique avec intégration aux passerelles de paiement',
      functional: 'Générer les quittances, suivre les paiements, gérer les retards et relances automatiques'
    },
    {
      icon: Calculator,
      title: 'Charges locatives',
      category: 'Finance',
      description: 'Calcul et répartition des charges',
      technical: 'Moteur de calcul avec règles de répartition personnalisables et historique des variations',
      functional: 'Calculer et répartir les charges communes, gérer les provisions et régularisations annuelles'
    },
    {
      icon: Wrench,
      title: 'Maintenance',
      category: 'Technique',
      description: 'Gestion des interventions et réparations',
      technical: 'Système de tickets avec workflow d\'approbation et suivi des prestataires',
      functional: 'Planifier et suivre les interventions de maintenance, gérer les demandes locataires et coordonner les prestataires'
    },
    {
      icon: MessageCircle,
      title: 'Messages',
      category: 'Communication',
      description: 'Communication centralisée avec les locataires',
      technical: 'Système de messagerie en temps réel avec notifications push et historique',
      functional: 'Communiquer avec vos locataires, envoyer des notifications importantes et maintenir un historique des échanges'
    },
    {
      icon: FileText,
      title: 'Déclarations fiscales',
      category: 'Administration',
      description: 'Préparation des déclarations et reporting fiscal',
      technical: 'Générateur de rapports fiscaux avec export comptable et archivage sécurisé',
      functional: 'Préparer vos déclarations fiscales, générer les états de revenus fonciers et exporter les données comptables'
    },
    {
      icon: Globe,
      title: 'Site Web',
      category: 'Marketing',
      description: 'Gestion de votre présence en ligne',
      technical: 'CMS intégré avec optimisation SEO et analytics de performance',
      functional: 'Créer et gérer votre site web vitrine, publier vos annonces et analyser le trafic et les performances'
    },
    {
      icon: Settings,
      title: 'Paramètres',
      category: 'Configuration',
      description: 'Configuration générale de l\'application',
      technical: 'Interface d\'administration avec gestion des permissions et configuration système',
      functional: 'Configurer votre entreprise, gérer les utilisateurs et permissions, paramétrer les intégrations et sauvegardes'
    }
  ];

  const filteredSections = helpSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? section.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(helpSections.map(section => section.category))];

  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchTerm('');
  };

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="px-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Centre d'aide</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Guide complet des fonctionnalités techniques et fonctionnelles de NeoRent
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher dans l'aide..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm md:text-base"
          />
        </div>

        {/* Badges des catégories - Responsive */}
        <div className="flex flex-wrap gap-1 md:gap-2">
          <Badge 
            variant="outline" 
            className={`cursor-pointer hover:bg-gray-100 transition-colors text-xs md:text-sm px-2 md:px-3 py-1 ${
              selectedCategory === null ? 'bg-blue-100 border-blue-300' : ''
            }`}
            onClick={clearFilters}
          >
            <span className="hidden sm:inline">Toutes les catégories</span>
            <span className="sm:hidden">Toutes</span>
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
            <span>Filtré par :</span>
            <Badge variant="secondary" className="text-xs">{selectedCategory}</Badge>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 underline text-xs md:text-sm"
            >
              Effacer les filtres
            </button>
          </div>
        )}

        {/* Sections d'aide - Grid responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow h-full">
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle className="flex items-start gap-2 md:gap-3 text-base md:text-lg">
                    <Icon className="h-5 w-5 md:h-6 md:w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <span className="font-semibold truncate">{section.title}</span>
                        <Badge variant="secondary" className="text-xs w-fit">
                          {section.category}
                        </Badge>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 pt-0">
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {section.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-xs md:text-sm text-blue-700 mb-1">
                        Aspect technique
                      </h4>
                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                        {section.technical}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-xs md:text-sm text-green-700 mb-1">
                        Utilisation fonctionnelle
                      </h4>
                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                        {section.functional}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Message quand aucun résultat */}
        {filteredSections.length === 0 && (
          <div className="text-center py-8 md:py-12">
            <Search className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              Aucun résultat trouvé
            </h3>
            <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base px-4">
              Aucune section ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 underline text-sm md:text-base"
            >
              Effacer tous les filtres
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Help;
