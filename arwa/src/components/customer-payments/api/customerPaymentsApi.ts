// Customer Payments API utilities and types
export interface CustomerPayment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  date: string;
  paymentType: "initial" | "additional";
  notes?: string;
  totalDebt: number;
  totalPrice: number;
  paid: number;
  discount: number;
  updatedDebt: number;
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

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customer: Customer | null;
  customerName?: string;
  customerPhone?: string;
  totalPrice: number;
  totalDebt: number;
  paid: number;
  discount: number;
  updatedDebt: number;
  createAt?: string;
  date?: string;
  orderItems: OrderItem[];
  deletedBy: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// API functions
export const customerPaymentsApi = {
  getCustomerPayments: async (filters?: {
    customerId?: string;
    dateFilter?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<CustomerPayment[]> => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.dateFilter) params.append("dateFilter", filters.dateFilter);
      if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters?.dateTo) params.append("dateTo", filters.dateTo);
      if (filters?.customerId) params.append("customerId", filters.customerId);

      const queryString = params.toString();
      const url = `${API_BASE_URL}/order${
        queryString ? `?${queryString}` : ""
      }`;

      // Get orders with the specified filters
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch orders for payments");
      }
      const orders: Order[] = await response.json();

      // Flatten customer data for easier filtering
      const ordersWithFlattenedData = orders.map((order: Order) => ({
        ...order,
        customerName: order.customer?.name || "",
        customerPhone: order.customer?.phoneNumber || "",
      }));

      // Extract payment information from orders
      const payments: CustomerPayment[] = [];

      ordersWithFlattenedData.forEach((order) => {
        if (order.paid > 0) {
          // Create a payment record for the initial payment
          payments.push({
            id: `${order.id}-initial`,
            customerId: order.customerId || "",
            customerName:
              order.customerName || order.customer?.name || "عميل غير محدد",
            customerPhone:
              order.customerPhone || order.customer?.phoneNumber || "",
            orderId: order.id,
            orderNumber: order.orderNumber || order.id,
            amount:
              typeof order.paid === "number"
                ? order.paid
                : parseFloat(order.paid) || 0,
            date: order.createAt || order.date || new Date().toISOString(),
            paymentType: "initial",
            notes: `دفعة أولية لطلب رقم ${order.orderNumber || order.id}`,
            totalDebt: order.totalDebt || 0,
            totalPrice: order.totalPrice || 0,
            paid: order.paid || 0,
            discount: order.discount || 0,
            updatedDebt: order.updatedDebt || 0,
          });
        }

        // Note: Additional payments would need to be tracked separately
        // For now, we're only showing the initial paid amount from orders
      });

      // Sort by date (newest first)
      return payments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error("Error fetching customer payments:", error);
      throw error;
    }
  },

  getCustomers: async (): Promise<Customer[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/customers`);
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  },
};
