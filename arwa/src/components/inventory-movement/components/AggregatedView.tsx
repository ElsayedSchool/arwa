import React from "react";
import { Package, Eye } from "lucide-react";
import { Button } from "../../ui/Button";
import type { AggregatedFishStock, StockDelivery } from "../types";

interface AggregatedViewProps {
  aggregatedStock: AggregatedFishStock[];
  stockDelivery: StockDelivery;
  onViewDetails: () => void;
}

export const AggregatedView: React.FC<AggregatedViewProps> = ({
  aggregatedStock,
  stockDelivery,
  onViewDetails,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            المخزون المجمع - {stockDelivery.supplierName}
          </h3>
          <Button onClick={onViewDetails} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            عرض التفاصيل
          </Button>
        </div>
      </div>

      {aggregatedStock.length === 0 ? (
        <div className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد بيانات مخزون لهذا التاريخ</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  نوع السمك
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  إجمالي الوزن
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الوزن المباع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الوزن المتبقي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  نسبة البيع
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {aggregatedStock.map((stock, index) => {
                const sellPercentage =
                  stock.totalWeight > 0
                    ? ((stock.soldWeight / stock.totalWeight) * 100).toFixed(1)
                    : "0.0";

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {stock.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {stock.totalWeight.toFixed(1)} {stock.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {stock.soldWeight.toFixed(1)} {stock.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {stock.remainingWeight.toFixed(1)} {stock.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sellPercentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
