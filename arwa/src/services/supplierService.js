// Business logic layer for suppliers
import { suppliersApi } from '../api/suppliers.js';

export const supplierService = {
  // Get all suppliers with analytics
  async getSuppliers() {
    try {
      return await suppliersApi.getSuppliers();
    } catch (error) {
      return this.getMockSuppliers();
    }
  },

  // Create new supplier
  async createSupplier(supplierData) {
    try {
      const newSupplier = {
        ...supplierData,
        createdAt: new Date().toISOString(),
        totalDeliveries: 0,
        totalWeight: 0,
        totalAmount: 0
      };
      return await suppliersApi.createSupplier(newSupplier);
    } catch (error) {
      throw new Error(`Failed to create supplier: ${error.message}`);
    }
  },

  // Update supplier
  async updateSupplier(supplierId, supplierData) {
    try {
      return await suppliersApi.updateSupplier(supplierId, supplierData);
    } catch (error) {
      throw new Error(`Failed to update supplier: ${error.message}`);
    }
  },

  // Delete supplier
  async deleteSupplier(supplierId) {
    try {
      return await suppliersApi.deleteSupplier(supplierId);
    } catch (error) {
      throw new Error(`Failed to delete supplier: ${error.message}`);
    }
  },

  // Filter suppliers
  filterSuppliers(suppliers, { searchTerm, selectedFishType, paymentFilter }) {
    return suppliers.filter(supplier => {
      const matchesSearch = searchTerm ? 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesFishType = selectedFishType ? 
        supplier.fishTypes?.includes(selectedFishType) : true;
      const matchesPayment = paymentFilter !== "all" ? 
        supplier.paymentStatus === paymentFilter : true;
      
      return matchesSearch && matchesFishType && matchesPayment;
    });
  },

  // Mock data for development
  getMockSuppliers() {
    return [
      {
        id: 1,
        name: "مورد الأسماك الطازجة",
        phone: "01234567890",
        email: "supplier1@example.com",
        fishTypes: ["بلطي", "مبروك", "قراميط"],
        totalDeliveries: 15,
        totalWeight: 450.5,
        totalAmount: 22500,
        paymentStatus: "paid",
        lastDelivery: "2024-01-15"
      }
    ];
  }
};