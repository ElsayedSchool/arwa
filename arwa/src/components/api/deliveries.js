const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const deliveriesApi = {
  // Get all deliveries
  async getDeliveries() {
    try {
      const response = await fetch(`${API_BASE_URL}/deliveries`);
      if (!response.ok) throw new Error("Failed to fetch deliveries");
      return await response.json();
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      throw error;
    }
  },

  // Create new delivery
  async createDelivery(deliveryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/deliveries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliveryData),
      });
      if (!response.ok) throw new Error("Failed to create delivery");
      return await response.json();
    } catch (error) {
      console.error("Error creating delivery:", error);
      throw error;
    }
  },

  // Update delivery
  async updateDelivery(deliveryId, deliveryData) {
    try {
      const response = await fetch(`${API_BASE_URL}/deliveries/${deliveryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliveryData),
      });
      if (!response.ok) throw new Error("Failed to update delivery");
      return await response.json();
    } catch (error) {
      console.error("Error updating delivery:", error);
      throw error;
    }
  },

  // Delete delivery
  async deleteDelivery(deliveryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/deliveries/${deliveryId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete delivery");
      return await response.json();
    } catch (error) {
      console.error("Error deleting delivery:", error);
      throw error;
    }
  },
};
