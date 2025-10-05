import React from "react";
import { DollarSign, FileText } from "lucide-react";

interface ExpensesAnalyticsProps {
  analytics: {
    totalExpenses: number;
    numberOfExpenses: number;
  };
}

export const ExpensesAnalytics: React.FC<ExpensesAnalyticsProps> = ({
  analytics,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">
              إجمالي المصروفات
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.totalExpenses.toFixed(2)} ج.م
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">عدد المصروفات</p>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.numberOfExpenses}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
