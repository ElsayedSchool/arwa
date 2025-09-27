export interface Supplier {
  id: string;
  name: string;
  nickName?: string;
  phone: string;
  whatsApp?: string;
  totalTrucks: number;
  totalWeight: number;
  totalMoney: number;
  totalPaid: number;
  totalDue: number;
  lastUpdated: string; // ISO string
  joinDate: string; // ISO string (maps from backend JoinDate)
  deletedBy: string | null;
}

export interface CreateSupplierData {
  name: string;
  nickName?: string;
  phone: string;
  whatsApp?: string;
}

export interface UpdateSupplierData extends CreateSupplierData {
  id: string;
}
