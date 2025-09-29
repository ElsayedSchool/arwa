import React from "react";
import { Users, DollarSign } from "lucide-react";

interface EmployeesStatsProps {
  stats: {
    total: number;
    active: number;
    totalMonthlySalary: number;
    averageSalary: number;
  };
}

export const EmployeesStats: React.FC<EmployeesStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">إجمالي الموظفين</p>
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
            <p className="text-sm font-medium text-gray-600">موظفين نشطين</p>
            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">
              إجمالي الرواتب الشهرية
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalMonthlySalary.toLocaleString()} ج.م
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">متوسط الراتب</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.averageSalary.toLocaleString()} ج.م
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
