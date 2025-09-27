import React, { useState } from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { TopNavigation } from "../common/TopNavigation";

interface DailyProfit {
  date: string;
  revenue: number;
  costs: number;
  profit: number;
}

const ProfitsPage: React.FC = () => {
  const [dailyProfits] = useState<DailyProfit[]>([
    { date: "2024-01-15", revenue: 2450, costs: 1800, profit: 650 },
    { date: "2024-01-14", revenue: 3200, costs: 2100, profit: 1100 },
    { date: "2024-01-13", revenue: 1800, costs: 1200, profit: 600 },
    { date: "2024-01-12", revenue: 2900, costs: 2000, profit: 900 },
    { date: "2024-01-11", revenue: 3500, costs: 2300, profit: 1200 },
  ]);

  const totalProfit = dailyProfits.reduce((sum, day) => sum + day.profit, 0);
  const avgDailyProfit = totalProfit / dailyProfits.length;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TopNavigation currentPage="profits" />
          <h1 className="text-3xl font-bold text-gray-900">الأرباح اليومية</h1>
          <p className="text-gray-600 mt-2">
            متابعة الأرباح والإيرادات اليومية
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الأرباح
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalProfit.toLocaleString()} ج.م
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  متوسط الربح اليومي
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {avgDailyProfit.toFixed(0)} ج.م
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">عدد الأيام</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dailyProfits.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Profits Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الإيرادات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  التكاليف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  صافي الربح
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  هامش الربح
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dailyProfits.map((day, index) => {
                const profitMargin = ((day.profit / day.revenue) * 100).toFixed(
                  1
                );
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(day.date).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.revenue.toLocaleString()} ج.م
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.costs.toLocaleString()} ج.م
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {day.profit.toLocaleString()} ج.م
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profitMargin}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { ProfitsPage };
