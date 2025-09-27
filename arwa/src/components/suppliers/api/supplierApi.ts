import api from "../../../services/api";
import type {
  Supplier,
  CreateSupplierData,
  UpdateSupplierData,
} from "../models/supplier";

const normalizeSupplier = (raw: unknown): Supplier => {
  const r = raw as Record<string, unknown>;
  return {
    id: String(r.id as string),
    name: String((r.name as string) ?? ""),
    nickName: (r.nickName as string) ?? undefined,
    phone: String((r.phone as string) ?? ""),
    whatsApp: (r.whatsApp as string) ?? undefined,
    totalTrucks: Number((r.totalTrucks as number) ?? 0),
    totalWeight: Number((r.totalWeight as number) ?? 0),
    totalMoney: Number((r.totalMoney as number) ?? 0),
    totalPaid: Number((r.totalPaid as number) ?? 0),
    totalDue: Number((r.totalDue as number) ?? 0),
    lastUpdated: (r.lastUpdated as string)
      ? new Date(r.lastUpdated as string).toISOString()
      : new Date().toISOString(),
    joinDate: (r.JoinDate as string)
      ? new Date(r.JoinDate as string).toISOString()
      : new Date().toISOString(),
    deletedBy: (r.deletedBy as string) ?? null,
  };
};

export const supplierApi = {
  async getAll(): Promise<Supplier[]> {
    // Backend controller is under /supplier; global prefix /api handled by api instance
    const res = await api.get("/supplier");
    const data = Array.isArray(res.data) ? res.data : [];
    return data.map(normalizeSupplier);
  },
  async getById(id: string): Promise<Supplier> {
    const res = await api.get(`/supplier/${id}`);
    return normalizeSupplier(res.data);
  },
  async create(data: CreateSupplierData): Promise<Supplier> {
    const res = await api.post("/supplier", data);
    return normalizeSupplier(res.data);
  },
  async update(data: UpdateSupplierData): Promise<Supplier> {
    const res = await api.post("/supplier", data); // upsert pattern on backend
    return normalizeSupplier(res.data);
  },
  async remove(id: string) {
    await api.delete(`/supplier/${id}`);
  },
};
