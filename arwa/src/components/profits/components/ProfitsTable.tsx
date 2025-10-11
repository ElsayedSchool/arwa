import React from "react";
import type { DailyProfit } from "../api/dailyProfitApi";

interface ProfitsTableProps {
  profitsData: DailyProfit[];
  loading?: boolean;
  onCalculateProfit?: (date: string) => void;
}

const ProfitsTable: React.FC<ProfitsTableProps> = ({
  profitsData,
  loading = false,
  onCalculateProfit,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-EG").format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          تفاصيل الأرباح اليومية
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التاريخ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رواتب
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                مصروفات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                إيرادات الأسماك
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                إيرادات الطلبات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                إجمالي الإيرادات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                إجمالي المصروفات
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                صافي الربح
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                هامش الربح
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {profitsData.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-6 text-center text-gray-500"
                >
                  لا توجد بيانات أرباح
                </td>
              </tr>
            ) : (
              profitsData.map((profit) => {
                const totalRevenue =
                  profit.totalSoldFishPrice + profit.totalOrdersSoldRevenue;
                const totalExpenses =
                  profit.totalSalaryExpenses + profit.totalNormalExpenses;
                const profitMargin =
                  totalRevenue > 0
                    ? ((profit.netProfit / totalRevenue) * 100).toFixed(1)
                    : "0.0";

                return (
                  <tr key={profit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(profit.profitDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(profit.totalSalaryExpenses)} ج.م
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(profit.totalNormalExpenses)} ج.م
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(profit.totalSoldFishPrice)} ج.م
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(profit.totalOrdersSoldRevenue)} ج.م
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {formatCurrency(totalRevenue)} ج.م
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      {formatCurrency(totalExpenses)} ج.م
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        profit.netProfit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(profit.netProfit)} ج.م
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {profitMargin}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {onCalculateProfit && (
                        <button
                          onClick={() => onCalculateProfit(profit.profitDate)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          إعادة الحساب
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitsTable;
