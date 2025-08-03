// Custom hook for clients management
import { useState, useEffect } from 'react';
import { clientService } from '../services/clientService.js';

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load clients on mount
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const clientsData = await clientService.getClients();
      setClients(clientsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new client
  const createClient = async (clientData) => {
    try {
      const newClient = await clientService.createClient(clientData);
      setClients(prev => [...prev, newClient]);
      return newClient;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Find client by phone
  const findClientByPhone = async (phone) => {
    try {
      return await clientService.findClientByPhone(phone);
    } catch (err) {
      return null;
    }
  };

  return {
    clients,
    loading,
    error,
    createClient,
    findClientByPhone,
    refreshClients: loadClients
  };
};