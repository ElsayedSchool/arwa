export interface Customer {
  id: string;
  name: string;
  nickname?: string;
  phoneNumber: string;
  totalTransaction: number;
  totalPaid: number;
  totalDue: number;
  viewOrder: number;
  lastUpdated: string;
  createdAt: string;
  orders?: Order[];
  deletedBy?: string | null;
}

export interface Order {
  id: string;
  createdAt?: string;
  // Allow other fields without breaking strict typing
  [key: string]: unknown;
}

export interface CreateCustomerData {
  name: string;
  nickname?: string;
  phoneNumber: string;
}

export interface UpdateCustomerData extends CreateCustomerData {
  id: string;
}
