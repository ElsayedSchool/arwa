import api from "../../../services/api";

export interface DailyProfit {
  id: string;
  profitDate: string;
  totalSalaryExpenses: number;
  totalNormalExpenses: number;
  totalSoldFishPrice: number;
  totalOrdersSoldRevenue: number;
  netProfit: number;
  lastUpdated: string;
  createdAt: string;
}

export const dailyProfitApi = {
  getAll: async (): Promise<DailyProfit[]> => {
    const response = await api.get("/daily-profit");
    return response.data;
  },

  getByDateRange: async (
    startDate: string,
    endDate: string
  ): Promise<DailyProfit[]> => {
    const response = await api.get(
      `/daily-profit?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  getByDate: async (date: string): Promise<DailyProfit | null> => {
    try {
      const response = await api.get(`/daily-profit/${date}`);
      return response.data;
    } catch {
      return null;
    }
  },

  calculateForDate: async (date: string): Promise<DailyProfit> => {
    const response = await api.post(`/daily-profit/calculate/${date}`);
    return response.data;
  },

  calculateToday: async (): Promise<DailyProfit> => {
    const response = await api.get("/daily-profit/today/calculate");
    return response.data;
  },
};
