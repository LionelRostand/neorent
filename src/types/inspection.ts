
export interface InspectionFormData {
  title: string;
  type: string;
  contractType: string;
  tenant: string;
  property: string;
  propertyType: string;
  roomNumber: string;
  date: string;
  inspector: string;
  description: string;
  observations: string;
}

export interface Tenant {
  id: number;
  name: string;
  type: string;
}

export interface InspectionFormProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export interface Inspection {
  id: string;
  title: string;
  type: string;
  tenant: string;
  property: string;
  roomNumber?: string;
  date: string;
  inspector: string;
  status: string;
  contractType: string;
  description?: string;
  observations?: string;
}
