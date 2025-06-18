
export interface Payment {
  id: string;
  tenantName: string;
  tenantType: string;
  property: string;
  rentAmount: number;
  contractRentAmount?: number;
  paidAmount?: number;
  dueDate: string;
  status: string;
  paymentDate: string | null;
  paymentMethod: string | null;
  notes?: string | null;
}

export interface Contract {
  id: string;
  tenant: string;
  property: string;
  amount: string;
  status: string;
  type: string;
}
