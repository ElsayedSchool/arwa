import { create } from "zustand";
import type {
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
} from "../services/customerService";
import { customerService } from "../services/customerService";

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  // Actions
  fetchCustomers: () => Promise<void>;
  createCustomer: (data: CreateCustomerData) => Promise<Customer>;
  updateCustomer: (data: UpdateCustomerData) => Promise<Customer>;
  deleteCustomer: (id: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  clearError: () => void;

  // Computed
  filteredCustomers: Customer[];
  stats: {
    total: number;
    active: number;
    newThisMonth: number;
    inactive: number;
  };
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  loading: false,
  error: null,
  searchTerm: "",

  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const customers = await customerService.getAllCustomers();
      set({ customers, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch customers",
        loading: false,
      });
    }
  },

  createCustomer: async (data: CreateCustomerData) => {
    set({ loading: true, error: null });
    try {
      const newCustomer = await customerService.createCustomer(data);
      // Refresh list to reflect server-calculated fields (e.g., dates, totals)
      const customers = await customerService.getAllCustomers();
      set({ customers, loading: false });
      return newCustomer;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create customer";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  updateCustomer: async (data: UpdateCustomerData) => {
    set({ loading: true, error: null });
    try {
      const updatedCustomer = await customerService.updateCustomer(data);
      // Refresh list to ensure we have latest values from DB
      const customers = await customerService.getAllCustomers();
      set({ customers, loading: false });
      return updatedCustomer;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update customer";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  deleteCustomer: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await customerService.deleteCustomer(id);
      // Refresh list to reflect deletion
      const customers = await customerService.getAllCustomers();
      set({ customers, loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete customer";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
  },

  clearError: () => {
    set({ error: null });
  },

  get filteredCustomers() {
    const { customers, searchTerm } = get();
    if (!searchTerm) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.includes(searchTerm) ||
        (customer.nickname &&
          customer.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  },

  get stats() {
    const { customers } = get();
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: customers.length,
      active: customers.filter((c) => c.totalDue > 0).length,
      newThisMonth: customers.filter((c) => new Date(c.createdAt) >= thisMonth)
        .length,
      inactive: customers.filter((c) => c.totalDue === 0).length,
    };
  },
}));
