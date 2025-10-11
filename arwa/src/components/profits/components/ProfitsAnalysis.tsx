import React from "react";
import { DollarSign, TrendingUp, TrendingDown, Calculator } from "lucide-react";
import type { DailyProfit } from "../api/dailyProfitApi";

interface ProfitsAnalysisProps {
  profitsData: DailyProfit[];
}

const ProfitsAnalysis: React.FC<ProfitsAnalysisProps> = ({ profitsData }) => {
  const totals = React.useMemo(() => {
    const totalSalaryExpenses = profitsData.reduce(
      (sum, p) => sum + p.totalSalaryExpenses,
      0
    );
    const totalNormalExpenses = profitsData.reduce(
      (sum, p) => sum + p.totalNormalExpenses,
      0
    );
    const totalSoldFishPrice = profitsData.reduce(
      (sum, p) => sum + p.totalSoldFishPrice,
      0
    );
    const totalOrdersRevenue = profitsData.reduce(
      (sum, p) => sum + p.totalOrdersSoldRevenue,
      0
    );
    const totalNetProfit = profitsData.reduce((sum, p) => sum + p.netProfit, 0);
    const totalExpenses = totalSalaryExpenses + totalNormalExpenses;

    return {
      totalSalaryExpenses,
      totalNormalExpenses,
      totalSoldFishPrice,
      totalOrdersRevenue,
      totalNetProfit,
      totalExpenses,
      avgDailyProfit:
        profitsData.length > 0 ? totalNetProfit / profitsData.length : 0,
    };
  }, [profitsData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG").format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Expenses */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">
              إجمالي المصروفات
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totals.totalExpenses)} ج.م
            </p>
            <div className="text-xs text-gray-500 mt-1">
              رواتب: {formatCurrency(totals.totalSalaryExpenses)} ج.م
            </div>
            <div className="text-xs text-gray-500">
              مصروفات: {formatCurrency(totals.totalNormalExpenses)} ج.م
            </div>
          </div>
        </div>
      </div>

      {/* Total Sold Fish Price */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">
              إيرادات الأسماك المباعة
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totals.totalSoldFishPrice)} ج.م
            </p>
          </div>
        </div>
      </div>

      {/* Total Orders Revenue */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">إيرادات الطلبات</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totals.totalOrdersRevenue)} ج.م
            </p>
          </div>
        </div>
      </div>

      {/* Net Profit */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <Calculator className="h-6 w-6 text-purple-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">صافي الربح</p>
            <p
              className={`text-2xl font-bold ${
                totals.totalNetProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(totals.totalNetProfit)} ج.م
            </p>
            <div className="text-xs text-gray-500 mt-1">
              متوسط يومي: {formatCurrency(totals.avgDailyProfit)} ج.م
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitsAnalysis;
