const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const clientsApi = {
  // Get all clients
  async getClients() {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`);
      if (!response.ok) throw new Error("Failed to fetch clients");
      return await response.json();
    } catch (error) {
      console.error("Error fetching clients:", error);
      throw error;
    }
  },

  // Create new client
  async createClient(clientData) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) throw new Error("Failed to create client");
      return await response.json();
    } catch (error) {
      console.error("Error creating client:", error);
      throw error;
    }
  },

  // Get client by phone
  async getClientByPhone(phone) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients?phone=${phone}`);
      if (!response.ok) throw new Error("Failed to fetch client");
      return await response.json();
    } catch (error) {
      console.error("Error fetching client by phone:", error);
      throw error;
    }
  },
};
