import { create } from "zustand";
import { employeeApi } from "../components/employees/api/employeeApi";
import type {
  Employee,
  CreateEmployeeData,
  UpdateEmployeeData,
} from "../components/employees/models/employee";

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  fetchEmployees: () => Promise<void>;
  createEmployee: (data: CreateEmployeeData) => Promise<boolean>;
  updateEmployee: (data: UpdateEmployeeData) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  deactivateEmployee: (id: string, isActive: boolean) => Promise<boolean>;
  resetPassword: (id: string, newPassword: string) => Promise<boolean>;
  setSearchTerm: (term: string) => void;
  clearError: () => void;

  filteredEmployees: Employee[];
  stats: {
    total: number;
    active: number;
    totalMonthlySalary: number;
    averageSalary: number;
  };
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  loading: false,
  error: null,
  searchTerm: "",

  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const employees = await employeeApi.getAll();
      set({ employees, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch employees",
        loading: false,
      });
    }
  },

  createEmployee: async (data: CreateEmployeeData) => {
    set({ loading: true, error: null });
    try {
      const ok = await employeeApi.create(data);
      if (ok) {
        const employees = await employeeApi.getAll();
        set({ employees, loading: false });
      } else {
        set({ loading: false });
      }
      return ok;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create employee",
        loading: false,
      });
      return false;
    }
  },

  updateEmployee: async (data: UpdateEmployeeData) => {
    set({ loading: true, error: null });
    try {
      const ok = await employeeApi.update(data);
      if (ok) {
        const employees = await employeeApi.getAll();
        set({ employees, loading: false });
      } else {
        set({ loading: false });
      }
      return ok;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update employee",
        loading: false,
      });
      return false;
    }
  },

  deleteEmployee: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const ok = await employeeApi.remove(id);
      if (ok) {
        const employees = await employeeApi.getAll();
        set({ employees, loading: false });
      } else {
        set({ loading: false });
      }
      return ok;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete employee",
        loading: false,
      });
      return false;
    }
  },

  deactivateEmployee: async (id: string, isActive: boolean) => {
    set({ loading: true, error: null });
    try {
      const ok = await employeeApi.deactivate(id, isActive);
      if (ok) {
        const employees = await employeeApi.getAll();
        set({ employees, loading: false });
      } else {
        set({ loading: false });
      }
      return ok;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update employee status",
        loading: false,
      });
      return false;
    }
  },

  resetPassword: async (id: string, newPassword: string) => {
    set({ loading: true, error: null });
    try {
      const ok = await employeeApi.resetPassword(id, newPassword);
      set({ loading: false });
      return ok;
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to reset password",
        loading: false,
      });
      return false;
    }
  },

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  clearError: () => set({ error: null }),

  get filteredEmployees() {
    const { employees, searchTerm } = get();
    if (!searchTerm) return employees;
    const term = searchTerm.toLowerCase();
    return employees.filter(
      (e) => e.name.toLowerCase().includes(term) || e.phone.includes(searchTerm)
    );
  },

  get stats() {
    const { employees } = get();
    const total = employees.length;
    const active = employees.filter((e) => e.isActive).length;
    const totalMonthlySalary = employees.reduce(
      (sum, e) => sum + (e.salary || 0),
      0
    );
    const averageSalary = total ? Math.round(totalMonthlySalary / total) : 0;
    return { total, active, totalMonthlySalary, averageSalary };
  },
}));
