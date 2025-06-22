
import { FileText, Users, Home, Calculator, Wrench, Plus } from 'lucide-react';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  action: () => void;
  preview: string;
  navigationAction?: () => void;
}

export const createQuickActionsConfig = (
  navigate: (path: string) => void,
  setOpenDialog: (dialogId: string | null) => void,
  ownerProperties: any[],
  activeTenants: any[],
  expiringContracts: number,
  pendingPayments: number
): QuickAction[] => [
  {
    id: 'property',
    title: "Nouvelle propriété",
    description: "Ajouter un bien",
    icon: Plus,
    color: 'bg-blue-500',
    action: () => {
      console.log('Opening property dialog');
      setOpenDialog('property');
    },
    preview: `${ownerProperties.length} propriétés`,
    navigationAction: () => navigate('/admin/properties')
  },
  {
    id: 'contract',
    title: "Nouveau contrat",
    description: "Créer un bail",
    icon: FileText,
    color: 'bg-green-500',
    action: () => {
      console.log('Navigating to contracts');
      navigate('/admin/contracts');
    },
    preview: `${expiringContracts} contrats expirent bientôt`,
    navigationAction: () => navigate('/admin/contracts')
  },
  {
    id: 'tenant',
    title: "Ajouter locataire",
    description: "Enregistrer un locataire",
    icon: Users,
    color: 'bg-purple-500',
    action: () => {
      console.log('Opening tenant dialog');
      setOpenDialog('roommate');
    },
    preview: `${activeTenants.length} locataires actifs`,
    navigationAction: () => navigate('/admin/roommates')
  },
  {
    id: 'inspection',
    title: "État des lieux",
    description: "Programmer une visite",
    icon: Home,
    color: 'bg-orange-500',
    action: () => {
      console.log('Opening inspection dialog');
      setOpenDialog('inspection');
    },
    preview: '2 inspections programmées',
    navigationAction: () => navigate('/admin/inspections')
  },
  {
    id: 'charges',
    title: "Calculer charges",
    description: "Révision annuelle",
    icon: Calculator,
    color: 'bg-indigo-500',
    action: () => {
      console.log('Navigating to rental charges');
      navigate('/admin/rental-charges');
    },
    preview: `${pendingPayments} paiements en attente`,
    navigationAction: () => navigate('/admin/rental-charges')
  },
  {
    id: 'maintenance',
    title: "Maintenance",
    description: "Demande d'intervention",
    icon: Wrench,
    color: 'bg-red-500',
    action: () => {
      console.log('Navigating to maintenance');
      navigate('/admin/maintenance');
    },
    preview: '1 demande urgente',
    navigationAction: () => navigate('/admin/maintenance')
  }
];
