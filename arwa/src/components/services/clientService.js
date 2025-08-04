// Business logic layer for clients
import { clientsApi } from '../api/clients.js';

export const clientService = {
  // Get all clients
  async getClients() {
    try {
      return await clientsApi.getClients();
    } catch (error) {
      // Fallback to mock data for development
      return this.getMockClients();
    }
  },

  // Create new client
  async createClient(clientData) {
    try {
      return await clientsApi.createClient(clientData);
    } catch (error) {
      throw new Error(`Failed to create client: ${error.message}`);
    }
  },

  // Check if client exists by phone
  async findClientByPhone(phone) {
    try {
      return await clientsApi.getClientByPhone(phone);
    } catch (error) {
      return null;
    }
  },

  // Mock data for development
  getMockClients() {
    return [
      {
        id: 1,
        name: "محمد أحمد",
        phone: "01234567890",
        email: "mohamed@example.com",
      },
      {
        id: 2,
        name: "فاطمة علي",
        phone: "01987654321",
        email: "fatma@example.com",
      },
      {
        id: 3,
        name: "أحمد سعد",
        phone: "01122334455",
        email: "ahmed@example.com",
      },
    ];
  }
};