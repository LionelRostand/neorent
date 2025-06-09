
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
  MessageCircle
} from 'lucide-react';

export const helpSections = [
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
