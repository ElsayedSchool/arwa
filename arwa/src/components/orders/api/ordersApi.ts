// Orders API utilities and types
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customer: Customer | null;
  // Flattened customer data for easier filtering
  customerName?: string;
  customerPhone?: string;
  totalPrice: number;
  totalDebt: number;
  paid: number;
  discount: number;
  updatedDebt: number;
  // Backend entity uses createAt (CreateDateColumn)
  createAt?: string;
  date?: string;
  orderItems: OrderItem[];
  deletedBy: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string | null;
  fishTypeId?: string;
  fishTypeName?: string;
  SupplierId?: string;
  SupplierName?: string;
  amount: number;
  pricePerKilo: number;
  totalAmount?: number;
  totalPrice?: number;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  nickname: string | null;
  phoneNumber: string;
  totalTransaction: number;
  totalPaid: number;
  totalDue: number;
  viewOrder: number;
  lastUpdated: string;
  createdAt: string;
  orders: Order[];
  deletedBy: string | null;
}

export interface FishItem {
  supplier: string;
  baseType: string;
  type: string;
  quantity: string;
}

export interface FormData {
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  fishItems: FishItem[];
  totalDebt?: number;
  paid?: number;
  discount?: number;
  updatedDebt?: number;
}

// Payloads matching backend DTOs (UpsertOrderDto and OrderItemDto)
export interface OrderItemDtoPayload {
  id?: string;
  fishTypeId?: string;
  fishTypeName: string;
  SupplierId?: string;
  SupplierName: string;
  amount: number;
}

export interface UpsertOrderDtoPayload {
  id?: string | null;
  customerId: string;
  customerName: string;
  orderItems: OrderItemDtoPayload[];
  totalDebt?: number;
  paid?: number;
  discount?: number;
  updatedDebt?: number;
}

export interface UpdateOrderItemsPayload {
  id: string; // order id
  orderItems: Array<{
    fishTypeName: string;
    SupplierName: string;
    amount: number;
  }>;
}

export interface AnalyticsData {
  totalOrders: number;
  totalPaid: number;
  totalUpdatedDebt: number;
  fishTypeBreakdown: Record<string, number>;
  uniqueCustomers: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// API functions
export const ordersApi = {
  getOrders: async (filters?: {
    dateFilter?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Order[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.dateFilter) params.append("dateFilter", filters.dateFilter);
      if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters?.dateTo) params.append("dateTo", filters.dateTo);

      const queryString = params.toString();
      const url = `${API_BASE_URL}/order${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const ordersData = await response.json();

      // Flatten customer data for easier filtering
      return ordersData.map((order: Order) => ({
        ...order,
        customerName: order.customer?.name || "",
        customerPhone: order.customer?.phoneNumber || "",
      }));
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getClients: async (): Promise<Customer[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  },

  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  createOrder: async (orderData: UpsertOrderDtoPayload): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  updateOrder: async (
    id: string,
    orderData: UpsertOrderDtoPayload
  ): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...orderData, id }),
      });
      if (!response.ok) {
        throw new Error("Failed to update order");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  updateOrderFinancial: async (
    id: string,
    financialData: {
      totalDebt?: number;
      paid?: number;
      discount?: number;
      updatedDebt?: number;
    }
  ): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${id}/financial`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(financialData),
      });
      if (!response.ok) {
        throw new Error("Failed to update order financial data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating order financial data:", error);
      throw error;
    }
  },

  updateOrderPrice: async (
    id: string,
    priceData: {
      totalPrice: number;
    }
  ): Promise<Order> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${id}/price`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(priceData),
      });
      if (!response.ok) {
        throw new Error("Failed to update order price");
      }
      return await response.json();
    } catch (error) {
      console.error("Error updating order price:", error);
      throw error;
    }
  },

  createOrderList: async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/create-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to create order list");
      }
    } catch (error) {
      console.error("Error creating order list:", error);
      throw error;
    }
  },

  deleteOrder: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/order/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },

  deleteOrderItem: async (itemId: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orderItem/${itemId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete order item");
      }
    } catch (error) {
      console.error("Error deleting order item:", error);
      throw error;
    }
  },
};
