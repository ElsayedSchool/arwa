// Custom hook for suppliers management
import { useState, useEffect, useMemo } from 'react';
import { supplierService } from '../services/supplierService.js';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFishType, setSelectedFishType] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Load suppliers on mount
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const suppliersData = await supplierService.getSuppliers();
      setSuppliers(suppliersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return supplierService.filterSuppliers(suppliers, {
      searchTerm,
      selectedFishType,
      paymentFilter
    });
  }, [suppliers, searchTerm, selectedFishType, paymentFilter]);

  // Create supplier
  const createSupplier = async (supplierData) => {
    try {
      const newSupplier = await supplierService.createSupplier(supplierData);
      setSuppliers(prev => [newSupplier, ...prev]);
      return newSupplier;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update supplier
  const updateSupplier = async (supplierId, supplierData) => {
    try {
      const updatedSupplier = await supplierService.updateSupplier(supplierId, supplierData);
      setSuppliers(prev => 
        prev.map(supplier => 
          supplier.id === supplierId ? updatedSupplier : supplier
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete supplier
  const deleteSupplier = async (supplierId) => {
    try {
      await supplierService.deleteSupplier(supplierId);
      setSuppliers(prev => prev.filter(supplier => supplier.id !== supplierId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    suppliers: filteredSuppliers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedFishType,
    setSelectedFishType,
    paymentFilter,
    setPaymentFilter,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    refreshSuppliers: loadSuppliers
  };
};