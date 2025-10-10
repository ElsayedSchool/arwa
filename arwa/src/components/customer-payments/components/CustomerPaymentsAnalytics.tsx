import React from "react";
import { DollarSign, CreditCard } from "lucide-react";

interface CustomerPaymentsAnalyticsProps {
  stats: {
    totalPaid: number;
    transactionCount: number;
    averagePayment: number;
    pendingAmount: number;
  };
}

export const CustomerPaymentsAnalytics: React.FC<
  CustomerPaymentsAnalyticsProps
> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    const numAmount =
      typeof amount === "number"
        ? amount
        : typeof amount === "string"
        ? parseFloat(amount)
        : 0;
    return `${numAmount.toFixed(2)} ج.م`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">
              إجمالي المدفوعات
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.totalPaid)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">عدد المعاملات</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.transactionCount}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">متوسط الدفعة</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.averagePayment)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">
              المدفوعات المعلقة
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.pendingAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
