// Business logic layer for deliveries
import { deliveriesApi } from '../api/deliveries.js';

export const deliveryService = {
  // Get all deliveries
  async getDeliveries() {
    try {
      return await deliveriesApi.getDeliveries();
    } catch (error) {
      return this.getMockDeliveries();
    }
  },

  // Create new delivery
  async createDelivery(deliveryData) {
    try {
      const newDelivery = {
        ...deliveryData,
        id: Date.now(),
        deliveryDate: new Date().toISOString().split('T')[0],
        totalWeight: this.calculateTotalWeight(deliveryData.fishTypes),
        lastEditTime: null
      };
      return await deliveriesApi.createDelivery(newDelivery);
    } catch (error) {
      throw new Error(`Failed to create delivery: ${error.message}`);
    }
  },

  // Update delivery
  async updateDelivery(deliveryId, deliveryData) {
    try {
      const updatedDelivery = {
        ...deliveryData,
        totalWeight: this.calculateTotalWeight(deliveryData.fishTypes),
        lastEditTime: new Date().toISOString()
      };
      return await deliveriesApi.updateDelivery(deliveryId, updatedDelivery);
    } catch (error) {
      throw new Error(`Failed to update delivery: ${error.message}`);
    }
  },

  // Delete delivery
  async deleteDelivery(deliveryId) {
    try {
      return await deliveriesApi.deleteDelivery(deliveryId);
    } catch (error) {
      throw new Error(`Failed to delete delivery: ${error.message}`);
    }
  },

  // Filter deliveries
  filterDeliveries(deliveries, filters) {
    const { searchTerm, selectedSupplier, selectedFishType, dateFilter, dateRange, paymentFilter } = filters;
    
    return deliveries.filter(delivery => {
      const matchesSearch = searchTerm ? 
        delivery.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesSupplier = selectedSupplier ? 
        delivery.supplierName === selectedSupplier : true;
      const matchesFishType = selectedFishType ? 
        delivery.fishTypes?.some(fish => fish.type === selectedFishType) : true;
      const matchesPayment = paymentFilter !== "all" ? 
        delivery.paymentStatus === paymentFilter : true;
      
      return matchesSearch && matchesSupplier && matchesFishType && matchesPayment;
    });
  },

  // Calculate total weight
  calculateTotalWeight(fishTypes) {
    return fishTypes?.reduce((sum, fish) => sum + (fish.weight || 0), 0) || 0;
  },

  // Mock data for development
  getMockDeliveries() {
    return [
      {
        id: 1,
        supplierName: "مورد الأسماك الطازجة",
        supplierPhone: "01234567890",
        deliveryDate: new Date().toISOString().split('T')[0],
        fishTypes: [
          { type: "بلطي", weight: 25.5, pricePerKg: 45 },
          { type: "مبروك", weight: 15.0, pricePerKg: 50 }
        ],
        totalWeight: 40.5,
        totalCost: 1897.5,
        amountPaid: 1000,
        remainingAmount: 897.5,
        paymentStatus: "partial",
        notes: ""
      }
    ];
  }
};