// Custom hook for orders management
import { useState, useEffect, useMemo } from 'react';
import { orderService } from '../services/orderService.js';

export const useOrders = (userRole) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");

  // Load orders on mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersData = await orderService.getTodayOrders();
      setOrders(ordersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtered orders based on current filters
  const filteredOrders = useMemo(() => {
    return orderService.filterOrders(orders, { selectedClient, phoneFilter });
  }, [orders, selectedClient, phoneFilter]);

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update order
  const updateOrder = async (orderId, orderData) => {
    try {
      const updatedOrder = await orderService.updateOrder(orderId, orderData);
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? updatedOrder : order
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      await orderService.deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Create new order
  const createOrder = async (orderData) => {
    try {
      const newOrder = await orderService.createOrder(orderData, userRole);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get client orders
  const getClientOrders = (clientName) => {
    return orderService.getClientOrders(orders, clientName);
  };

  return {
    orders: filteredOrders,
    loading,
    error,
    selectedClient,
    setSelectedClient,
    phoneFilter,
    setPhoneFilter,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    createOrder,
    getClientOrders,
    refreshOrders: loadOrders
  };
};