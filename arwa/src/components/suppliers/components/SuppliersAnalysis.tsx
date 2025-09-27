import React from "react";
import { Users, DollarSign } from "lucide-react";

export interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
  totalDueMoney: number;
}

const formatNumber = (n: number) => new Intl.NumberFormat("ar-EG").format(n);

const SuppliersAnalysis: React.FC<{ stats: SupplierStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">إجمالي الموردين</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.total)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">موردين نشطين</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.active)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-gray-100">
            <Users className="h-6 w-6 text-gray-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">
              موردين غير نشطين
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.inactive)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100">
            <DollarSign className="h-6 w-6 text-red-600" />
          </div>
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">
              إجمالي المبالغ المستحقة
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.totalDueMoney)} ج.م
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuppliersAnalysis;
