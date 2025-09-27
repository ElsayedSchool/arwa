import api from "./api";

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

class CustomerService {
  private normalizeCustomer(raw: unknown): Customer {
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
  }

  async getAllCustomers(): Promise<Customer[]> {
    const response = await api.get("/customers");
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map((c) => this.normalizeCustomer(c));
  }

  async getCustomerById(id: string): Promise<Customer> {
    const response = await api.get(`/customers/${id}`);
    return this.normalizeCustomer(response.data);
  }

  async createCustomer(data: CreateCustomerData): Promise<Customer> {
    const response = await api.post("/customers", data);
    return this.normalizeCustomer(response.data);
  }

  async updateCustomer(data: UpdateCustomerData): Promise<Customer> {
    const response = await api.put("/customers", data);
    return this.normalizeCustomer(response.data);
  }

  async deleteCustomer(
    id: string,
    deletedById?: string,
    deletedByName?: string
  ): Promise<void> {
    await api.delete(`/customers/${id}`, {
      data: { deletedById, deletedByName },
    });
  }

  async getCustomerOrders(
    id: string,
    startDate?: string,
    endDate?: string,
    exactDate?: string
  ): Promise<Order[]> {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (exactDate) params.append("exactDate", exactDate);

    const response = await api.get(
      `/customers/${id}/orders?${params.toString()}`
    );
    return response.data;
  }
}

export const customerService = new CustomerService();
