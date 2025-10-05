import api from "../../../services/api";

export interface ExpenseUi {
  id: string;
  name: string;
  description: string | null;
  price: number;
  createdAt: string;
}

export const expensesApi = {
  async getExpenses(filters?: {
    dateFilter?: string;
    from?: string;
    to?: string;
    name?: string;
    description?: string;
  }): Promise<ExpenseUi[]> {
    const { data } = await api.get("/expense", { params: filters });
    return Array.isArray(data) ? data : data?.items ?? [];
  },

  async upsertExpense(payload: {
    id?: string;
    name: string;
    description?: string;
    price: number;
  }): Promise<ExpenseUi> {
    const { data } = await api.post("/expense", payload);
    return data;
  },

  async deleteExpense(id: string): Promise<void> {
    await api.delete(`/expense/${id}`);
  },
};

export default expensesApi;
