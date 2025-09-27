import { create } from "zustand";
import type {
  Supplier,
  CreateSupplierData,
  UpdateSupplierData,
} from "../components/suppliers/models/supplier";
import { supplierApi } from "../components/suppliers/api/supplierApi";

interface SupplierState {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  fetchSuppliers: () => Promise<void>;
  createSupplier: (data: CreateSupplierData) => Promise<Supplier>;
  updateSupplier: (data: UpdateSupplierData) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  clearError: () => void;

  filteredSuppliers: Supplier[];
  stats: {
    total: number;
    active: number;
    newThisMonth: number;
    totalWeight: number;
  };
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  suppliers: [],
  loading: false,
  error: null,
  searchTerm: "",

  fetchSuppliers: async () => {
    set({ loading: true, error: null });
    try {
      const suppliers = await supplierApi.getAll();
      set({ suppliers, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch suppliers",
        loading: false,
      });
    }
  },

  createSupplier: async (data: CreateSupplierData) => {
    set({ loading: true, error: null });
    try {
      const created = await supplierApi.create(data);
      const suppliers = await supplierApi.getAll();
      set({ suppliers, loading: false });
      return created;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create supplier";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  updateSupplier: async (data: UpdateSupplierData) => {
    set({ loading: true, error: null });
    try {
      const updated = await supplierApi.update(data);
      const suppliers = await supplierApi.getAll();
      set({ suppliers, loading: false });
      return updated;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update supplier";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  deleteSupplier: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await supplierApi.remove(id);
      const suppliers = await supplierApi.getAll();
      set({ suppliers, loading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete supplier";
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  clearError: () => set({ error: null }),

  get filteredSuppliers() {
    const { suppliers, searchTerm } = get();
    if (!searchTerm) return suppliers;
    const term = searchTerm.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        (s.nickName && s.nickName.toLowerCase().includes(term)) ||
        s.phone.includes(searchTerm)
    );
  },

  get stats() {
    const { suppliers } = get();
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      total: suppliers.length,
      active: suppliers.filter((s) => Number(s.totalDue) > 0).length,
      newThisMonth: suppliers.filter((s) => new Date(s.joinDate) >= thisMonth)
        .length,
      totalWeight: suppliers.reduce((sum, s) => sum + Number(s.totalWeight), 0),
    };
  },
}));
