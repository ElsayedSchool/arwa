// Custom hook for deliveries management
import { useState, useEffect, useMemo } from 'react';
import { deliveryService } from '../services/deliveryService.js';

export const useDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedFishType, setSelectedFishType] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Load deliveries on mount
  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const deliveriesData = await deliveryService.getDeliveries();
      setDeliveries(deliveriesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered deliveries
  const filteredDeliveries = useMemo(() => {
    return deliveryService.filterDeliveries(deliveries, {
      searchTerm,
      selectedSupplier,
      selectedFishType,
      dateFilter,
      dateRange,
      paymentFilter
    });
  }, [deliveries, searchTerm, selectedSupplier, selectedFishType, dateFilter, dateRange, paymentFilter]);

  // Create delivery
  const createDelivery = async (deliveryData) => {
    try {
      const newDelivery = await deliveryService.createDelivery(deliveryData);
      setDeliveries(prev => [newDelivery, ...prev]);
      return newDelivery;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update delivery
  const updateDelivery = async (deliveryId, deliveryData) => {
    try {
      const updatedDelivery = await deliveryService.updateDelivery(deliveryId, deliveryData);
      setDeliveries(prev => 
        prev.map(delivery => 
          delivery.id === deliveryId ? updatedDelivery : delivery
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete delivery
  const deleteDelivery = async (deliveryId) => {
    try {
      await deliveryService.deleteDelivery(deliveryId);
      setDeliveries(prev => prev.filter(delivery => delivery.id !== deliveryId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    deliveries: filteredDeliveries,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedSupplier,
    setSelectedSupplier,
    selectedFishType,
    setSelectedFishType,
    dateFilter,
    setDateFilter,
    dateRange,
    setDateRange,
    paymentFilter,
    setPaymentFilter,
    createDelivery,
    updateDelivery,
    deleteDelivery,
    refreshDeliveries: loadDeliveries
  };
};