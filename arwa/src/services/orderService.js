// Business logic layer for orders
import { ordersApi } from '../api/orders.js';
import { clientsApi } from '../api/clients.js';

export const orderService = {
  // Get today's orders with filtering
  async getTodayOrders(filters = {}) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const orders = await ordersApi.getOrdersByDate(today);
      
      return this.filterOrders(orders, filters);
    } catch (error) {
      // Fallback to mock data for development
      return this.getMockOrders(filters);
    }
  },

  // Filter orders based on criteria
  filterOrders(orders, { selectedClient, phoneFilter }) {
    return orders.filter(order => {
      const matchesClient = selectedClient ? order.clientName === selectedClient : true;
      const matchesPhone = phoneFilter ? order.clientPhone.includes(phoneFilter) : true;
      return matchesClient && matchesPhone;
    });
  },

  // Get orders for specific client
  getClientOrders(orders, clientName) {
    return orders.filter(order => order.clientName === clientName);
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      return await ordersApi.updateOrderStatus(orderId, status);
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  },

  // Update order
  async updateOrder(orderId, orderData) {
    try {
      // Calculate total if admin and price provided
      if (orderData.price && orderData.quantity) {
        orderData.totalAmount = orderData.price * orderData.quantity;
      }
      
      return await ordersApi.updateOrder(orderId, orderData);
    } catch (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }
  },

  // Delete order
  async deleteOrder(orderId) {
    try {
      return await ordersApi.deleteOrder(orderId);
    } catch (error) {
      throw new Error(`Failed to delete order: ${error.message}`);
    }
  },

  // Create new order
  async createOrder(orderData, userRole) {
    try {
      const price = userRole === "admin" ? parseFloat(orderData.price) : null;
      const quantity = parseFloat(orderData.quantity);
      const totalAmount = userRole === "admin" && price ? price * quantity : null;

      const newOrder = {
        ...orderData,
        quantity,
        price,
        totalAmount,
        orderDate: new Date().toISOString().split('T')[0],
        status: "قيد المراجعة"
      };

      return await ordersApi.createOrder(newOrder);
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  },

  // Mock data for development
  getMockOrders(filters = {}) {
    const mockOrders = [
      {
        id: 1,
        orderNumber: "ORD-001",
        clientName: "محمد أحمد",
        clientPhone: "01234567890",
        clientEmail: "mohamed@example.com",
        fishType: "بلطي",
        quantity: 5,
        supplier: "مورد الأسماك الطازجة",
        notes: "",
        orderDate: new Date().toISOString().split("T")[0],
        status: "قيد المراجعة",
        price: 45.5,
        totalAmount: 227.5,
      },
      // ... other mock orders
    ];

    return this.filterOrders(mockOrders, filters);
  }
};