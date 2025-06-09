
export interface MenuPermission {
  read: boolean;
  write: boolean;
  view: boolean;
  delete: boolean;
}

export interface EmployeePermissions {
  dashboard: MenuPermission;
  properties: MenuPermission;
  tenants: MenuPermission;
  roommates: MenuPermission;
  contracts: MenuPermission;
  inspections: MenuPermission;
  rentManagement: MenuPermission;
  rentalCharges: MenuPermission;
  maintenance: MenuPermission;
  messages: MenuPermission;
  taxes: MenuPermission;
  website: MenuPermission;
  settings: MenuPermission;
}

export const defaultPermission: MenuPermission = {
  read: false,
  write: false,
  view: false,
  delete: false,
};

export const defaultEmployeePermissions: EmployeePermissions = {
  dashboard: { ...defaultPermission },
  properties: { ...defaultPermission },
  tenants: { ...defaultPermission },
  roommates: { ...defaultPermission },
  contracts: { ...defaultPermission },
  inspections: { ...defaultPermission },
  rentManagement: { ...defaultPermission },
  rentalCharges: { ...defaultPermission },
  maintenance: { ...defaultPermission },
  messages: { ...defaultPermission },
  taxes: { ...defaultPermission },
  website: { ...defaultPermission },
  settings: { ...defaultPermission },
};

export const menuLabels = {
  dashboard: 'Dashboard',
  properties: 'Propriétés',
  tenants: 'Locataires',
  roommates: 'Colocataires',
  contracts: 'Contrats',
  inspections: 'États des lieux',
  rentManagement: 'Gestion des loyers',
  rentalCharges: 'Charges locatives',
  maintenance: 'Maintenance',
  messages: 'Messages',
  taxes: 'Déclarations fiscales',
  website: 'Site Web',
  settings: 'Paramètres',
};
