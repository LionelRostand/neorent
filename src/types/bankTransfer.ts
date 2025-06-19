
export interface BankAccount {
  id: string;
  iban: string;
  bic: string;
  accountHolder: string;
  bankName?: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface BeneficiaryUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bankAccount: BankAccount;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  currency: string;
  balance: number; // en centimes
  status: 'active' | 'frozen' | 'closed';
  createdAt: string;
}

export interface BankTransfer {
  id: string;
  walletId: string;
  amount: number; // en centimes
  bankAccountId: string;
  tag: string;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
}
