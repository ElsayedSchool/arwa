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
  async getAllCustomers(): Promise<Customer[]> {
    const response = await api.get("/customers");
    return response.data;
  }

  async getCustomerById(id: string): Promise<Customer> {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(data: CreateCustomerData): Promise<Customer> {
    const response = await api.post("/customers", data);
    return response.data;
  }

  async updateCustomer(data: UpdateCustomerData): Promise<Customer> {
    const response = await api.put("/customers", data);
    return response.data;
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
