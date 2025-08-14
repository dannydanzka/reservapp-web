export interface BusinessAccountPageProps {}

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'BUSINESS';
  clabe?: string;
  isDefault?: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessAccountData {
  id: string;
  businessName: string;
  taxId?: string;
  businessGiros: string[];
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  bankAccounts: BankAccount[];
}
