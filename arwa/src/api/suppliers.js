// API layer for suppliers
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const suppliersApi = {
  // Get all suppliers
  async getSuppliers() {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`);
      if (!response.ok) throw new Error("Failed to fetch suppliers");
      return await response.json();
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      throw error;
    }
  },

  // Create new supplier
  async createSupplier(supplierData) {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierData),
      });
      if (!response.ok) throw new Error("Failed to create supplier");
      return await response.json();
    } catch (error) {
      console.error("Error creating supplier:", error);
      throw error;
    }
  },

  // Update supplier
  async updateSupplier(supplierId, supplierData) {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierData),
      });
      if (!response.ok) throw new Error("Failed to update supplier");
      return await response.json();
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }
  },

  // Delete supplier
  async deleteSupplier(supplierId) {
    try {
      const response = await fetch(`${API_BASE_URL}/suppliers/${supplierId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete supplier");
      return await response.json();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw error;
    }
  },
};
