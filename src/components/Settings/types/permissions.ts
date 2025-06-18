
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
  properties: 'Properties',
  tenants: 'Tenants',
  roommates: 'Roommates',
  contracts: 'Contracts',
  inspections: 'Inspections',
  rentManagement: 'Rent Management',
  rentalCharges: 'Rental Charges',
  maintenance: 'Maintenance',
  messages: 'Messages',
  taxes: 'Tax Declarations',
  website: 'Website',
  settings: 'Settings',
};
