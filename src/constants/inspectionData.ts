
import { Tenant } from '@/types/inspection';

export const tenants: Tenant[] = [
  { id: 1, name: 'Marie Dubois', type: 'Locataire' },
  { id: 2, name: 'Jean Martin', type: 'Locataire' },
  { id: 3, name: 'Sophie Leroy', type: 'Locataire' }
];

export const roommates: Tenant[] = [
  { id: 4, name: 'Pierre Durand', type: 'Colocataire' },
  { id: 5, name: 'Lisa Chen', type: 'Colocataire' }
];

export const locationProperties = [
  'Appartement Rue des Fleurs',
  'Studio Centre-ville',
  'Appartement Boulevard Haussmann'
];

export const colocationProperties = [
  'Villa Montparnasse',
  'Appartement République'
];

export const roomsByProperty: Record<string, string[]> = {
  'Villa Montparnasse': ['Chambre 1', 'Chambre 2', 'Chambre 3'],
  'Appartement République': ['Chambre A', 'Chambre B']
};

export const inspectionTypes = [
  'Entrée',
  'Sortie',
  'Périodique',
  'Maintenance'
];

export const contractTypes = [
  'Bail locatif',
  'Bail colocatif'
];
