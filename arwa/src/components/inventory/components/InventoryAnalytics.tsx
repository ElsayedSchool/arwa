import React from "react";
import { Truck, Package, Users } from "lucide-react";

interface Analytics {
  totalReceivedFish: number;
  fishTypeBreakdown: Record<string, number>;
  totalDeliveries: number;
  uniqueSuppliers: number;
}

interface InventoryAnalyticsProps {
  analytics: Analytics;
}

export const InventoryAnalytics: React.FC<InventoryAnalyticsProps> = ({
  analytics,
}) => {
  return (
    <>
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">
                إجمالي التوصيلات
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalDeliveries}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-gray-600">
                إجمالي الأسماك المستلمة
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.totalReceivedFish.toFixed(1)} كجم
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
              <p className="text-sm font-medium text-gray-600">عدد الموردين</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.uniqueSuppliers}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fish Types Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          توزيع الأسماك حسب النوع
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(analytics.fishTypeBreakdown).map(
            ([fishType, weight]) => (
              <div key={fishType} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-600">{fishType}</p>
                <p className="text-xl font-bold text-gray-900">
                  {weight.toFixed(1)} كجم
                </p>
                <p className="text-xs text-gray-500">
                  {((weight / analytics.totalReceivedFish) * 100).toFixed(1)}%
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};
