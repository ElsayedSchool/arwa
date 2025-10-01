import React from "react";
import { Package, Fish, Users, BarChart3 } from "lucide-react";

interface AnalyticsData {
  totalOrders: number;
  totalFishAmount: number;
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
              <Fish className="h-6 w-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">
                إجمالي كمية السمك
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalFishAmount.toFixed(1)} كجم
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

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">أنواع السمك</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(analytics.fishTypeBreakdown).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fish Type Breakdown */}
      {Object.keys(analytics.fishTypeBreakdown).length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            تفصيل أنواع السمك
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(analytics.fishTypeBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([fishType, amount]) => (
                <div
                  key={fishType}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{fishType}</span>
                  <span className="text-lg font-bold text-blue-600">
                    {amount.toFixed(1)} كجم
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};
