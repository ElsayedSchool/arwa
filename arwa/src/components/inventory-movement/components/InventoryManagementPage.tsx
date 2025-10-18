import React, { useState, useEffect, useCallback } from "react";
import { Calendar, RefreshCw, Package } from "lucide-react";
import { TopNavigation } from "../../common/TopNavigation";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { inventoryMovementApi } from "../api/inventoryMovementApi";
import type { DeliveryItem } from "../types";

const InventoryManagementPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [stockItems, setStockItems] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load stock for selected date
  const loadStockOfDay = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryMovementApi.getStockOfDay(selectedDate);
      setStockItems(data);
    } catch (err) {
      setError("فشل في تحميل مخزون اليوم");
      console.error("Error loading stock:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  // Update stock (create tomorrow's delivery)
  const updateStock = async () => {
    try {
      setUpdating(true);
      setError(null);
      await inventoryMovementApi.updateAggregatedStock();
      // Reload stock after update
      await loadStockOfDay();
    } catch (err) {
      setError("فشل في تحديث المخزون");
      console.error("Error updating stock:", err);
    } finally {
      setUpdating(false);
    }
  };

  // Load stock when date changes
  useEffect(() => {
    loadStockOfDay();
  }, [selectedDate]);

  const totalStock = stockItems.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    إدارة المخزون
                  </h1>
                  <p className="text-sm text-gray-600">
                    عرض وتحديث مخزون الأسماك لليوم المحدد
                  </p>
                </div>
              </div>
              <Button
                onClick={updateStock}
                disabled={updating}
                className="flex items-center space-x-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${updating ? "animate-spin" : ""}`}
                />
                <span>{updating ? "جاري التحديث..." : "تحديث المخزون"}</span>
              </Button>
            </div>
          </div>

          {/* Date Selector */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <label className="text-sm font-medium text-gray-700">
                  تاريخ المخزون:
                </label>
              </div>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-48"
              />
              <Button
                onClick={loadStockOfDay}
                disabled={loading}
                variant="outline"
              >
                {loading ? "جاري التحميل..." : "تحديث العرض"}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-6 py-4">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Stock Summary */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {stockItems.length}
                </div>
                <div className="text-sm text-blue-600">أنواع الأسماك</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  {totalStock.toFixed(2)}
                </div>
                <div className="text-sm text-green-600">
                  إجمالي الكمية (كجم)
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedDate}
                </div>
                <div className="text-sm text-purple-600">تاريخ المخزون</div>
              </div>
            </div>
          </div>

          {/* Stock Items Table */}
          <div className="px-6 py-4">
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  جاري تحميل المخزون...
                </p>
              </div>
            ) : stockItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  لا يوجد مخزون لهذا اليوم
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نوع السمك
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الكمية المتاحة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        السعر للكيلو
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        إجمالي السعر
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المتبقي
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المخزون
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stockItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.fishTypeName ||
                            item.type?.name ||
                            `نوع ${item.fishTypeId}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Number(item.amount).toFixed(2)} كجم
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Number(item.pricePerKilo).toFixed(2)} جنيه
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Number(item.totalPrice).toFixed(2)} جنيه
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Number(item.restAmount).toFixed(2)} كجم
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {Number(item.stock).toFixed(2)} كجم
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagementPage;
