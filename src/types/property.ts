
export interface Property {
  id: string;
  name: string;
  address: string;
  rent: string;
  charges?: Record<string, any>;
}
