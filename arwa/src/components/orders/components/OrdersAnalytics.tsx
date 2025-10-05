import React from "react";
import { Package, DollarSign, Users } from "lucide-react";

interface AnalyticsData {
  totalOrders: number;
  totalPaid: number;
  totalUpdatedDebt: number;
  fishTypeBreakdown: Record<string, number>;
  uniqueCustomers: number;
}

interface OrdersAnalyticsProps {
  analytics: AnalyticsData;
}

export const OrdersAnalytics: React.FC<OrdersAnalyticsProps> = ({
  analytics,
}) => {
  return (
    <>
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">عدد الطلبات</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">
                إجمالي المبالغ المدفوعة
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalPaid.toFixed(2)} ج.م
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">
                إجمالي الديون المحدثة
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalUpdatedDebt.toFixed(2)} ج.م
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">عدد العملاء</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.uniqueCustomers}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
