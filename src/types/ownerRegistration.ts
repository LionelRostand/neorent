
export interface OwnerRegistrationRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  type: 'owner_registration';
}
