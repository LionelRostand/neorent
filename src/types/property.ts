
export interface Property {
  id: string;
  title: string;
  address: string;
  type: string;
  surface: string;
  rent: string;
  status: string;
  tenant: string | null;
  image: string;
  images?: string[]; // Support for multiple images (max 3)
  locationType: string;
  totalRooms: number;
  availableRooms: number;
  creditImmobilier?: string;
  owner?: string;
  charges?: any;
  floor?: string;
}
