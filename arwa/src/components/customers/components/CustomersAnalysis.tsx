import React from "react";
import { Users } from "lucide-react";

export interface CustomersStats {
  total: number;
  active: number;
  newThisMonth: number;
  inactive: number;
}

interface CustomersAnalysisProps {
  stats: CustomersStats;
}

export const CustomersAnalysis: React.FC<CustomersAnalysisProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">عملاء نشطين</p>
            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100">
            <Users className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">عملاء جدد هذا الشهر</p>
            <p className="text-2xl font-bold text-gray-900">{stats.newThisMonth}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100">
            <Users className="h-6 w-6 text-red-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">عملاء متوقفين</p>
            <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersAnalysis;
