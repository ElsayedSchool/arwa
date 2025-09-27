import api from "../../../services/api";
import type {
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
  Order,
} from "../models/customer";

const normalizeCustomer = (raw: unknown): Customer => {
  const r = raw as Record<string, unknown>;
  return {
    id: String(r.id as string),
    name: String((r.name as string) ?? ""),
    nickname: (r.nickname as string) ?? undefined,
    phoneNumber: String((r.phoneNumber as string) ?? ""),
    totalTransaction: Number((r.totalTransaction as number) ?? 0),
    totalPaid: Number((r.totalPaid as number) ?? 0),
    totalDue: Number((r.totalDue as number) ?? 0),
    viewOrder: Number((r.viewOrder as number) ?? 0),
    lastUpdated: (r.lastUpdated as string)
      ? new Date(r.lastUpdated as string).toISOString()
      : new Date().toISOString(),
    createdAt: (r.createdAt as string)
      ? new Date(r.createdAt as string).toISOString()
      : new Date().toISOString(),
    orders: Array.isArray(r.orders)
      ? (r.orders as unknown[]).map((o) => {
          const oo = o as Record<string, unknown>;
          const base: Order = {
            id: String(oo.id as string),
            createdAt: oo.createdAt
              ? new Date(oo.createdAt as string).toISOString()
              : undefined,
          };
          return { ...oo, ...base } as Order;
        })
      : undefined,
    deletedBy: (r.deletedBy as string) ?? null,
  };
};

export const customerApi = {
  async getAll(): Promise<Customer[]> {
    const res = await api.get("/customers");
    const data = Array.isArray(res.data) ? res.data : [];
    return data.map(normalizeCustomer);
  },
  async getById(id: string): Promise<Customer> {
    const res = await api.get(`/customers/${id}`);
    return normalizeCustomer(res.data);
  },
  async create(data: CreateCustomerData): Promise<Customer> {
    const res = await api.post("/customers", data);
    return normalizeCustomer(res.data);
  },
  async update(data: UpdateCustomerData): Promise<Customer> {
    const res = await api.put("/customers", data);
    return normalizeCustomer(res.data);
  },
  async remove(id: string, deletedById?: string, deletedByName?: string) {
    await api.delete(`/customers/${id}`, {
      data: { deletedById, deletedByName },
    });
  },
  async getOrders(
    id: string,
    startDate?: string,
    endDate?: string,
    exactDate?: string
  ): Promise<Order[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (exactDate) params.append("exactDate", exactDate);
    const res = await api.get(`/customers/${id}/orders?${params.toString()}`);
    const list = Array.isArray(res.data) ? res.data : [];
    return list.map((o) => {
      const oo = o as Record<string, unknown>;
      const base: Order = {
        id: String(oo.id as string),
        createdAt: oo.createdAt
          ? new Date(oo.createdAt as string).toISOString()
          : undefined,
      };
      return { ...oo, ...base } as Order;
    });
  },
};
