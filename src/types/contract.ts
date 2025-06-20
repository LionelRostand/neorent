
export interface Contract {
  id: string;
  title: string;
  type: string;
  provider: string;
  property: string;
  startDate: string;
  endDate: string;
  amount: string;
  status: string;
  tenant: string;
  jurisdiction: string;
  owner?: string;
  signatures?: {
    owner?: {
      signatureDataUrl: string;
      signerInfo: {
        name: string;
        role: string;
        date: string;
      };
    };
    tenant?: {
      signatureDataUrl: string;
      signerInfo: {
        name: string;
        role: string;
        date: string;
      };
    };
  };
  signedDate?: string;
}
