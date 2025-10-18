import React, { useState, useEffect, useMemo } from "react";
import {
  Package,
  Plus,
  BarChart3,
  Eye,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { TopNavigation } from "../common/TopNavigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { AggregatedView, DetailView } from "./components";
import {
  inventoryApi,
  inventoryMovementApi,
  type InventoryDeliveryUi,
} from "./api/inventoryMovementApi";
import type { AggregatedFishStock, StockDelivery } from "./types";

const InventoryMovementPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [deliveries, setDeliveries] = useState<InventoryDeliveryUi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [updatingStock, setUpdatingStock] = useState(false);

  // Load deliveries data
  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryApi.getInventory();
      setDeliveries(data);
    } catch (err) {
      setError("فشل في تحميل بيانات التوصيلات");
      console.error("Error loading deliveries:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter deliveries by selected date
  const filteredDeliveries = useMemo(() => {
    return deliveries.filter(
      (delivery) => delivery.deliveryDate === selectedDate
    );
  }, [deliveries, selectedDate]);

  // Calculate aggregated stock for the selected date
  const aggregatedStock = useMemo(() => {
    const stockMap = new Map<string, AggregatedFishStock>();

    filteredDeliveries.forEach((delivery) => {
      delivery.fishTypes?.forEach((fish) => {
        const key = fish.type;
        const existing = stockMap.get(key);

        if (existing) {
          existing.totalWeight += fish.weight || 0;
          existing.remainingWeight += fish.quantity || 0;
          existing.soldWeight += (fish.weight || 0) - (fish.quantity || 0);
        } else {
          stockMap.set(key, {
            type: fish.type,
            totalWeight: fish.weight || 0,
            remainingWeight: fish.quantity || 0,
            soldWeight: (fish.weight || 0) - (fish.quantity || 0),
            unit: fish.unit || "كجم",
          });
        }
      });
    });

    return Array.from(stockMap.values()).sort((a, b) =>
      a.type.localeCompare(b.type)
    );
  }, [filteredDeliveries]);

  // Create virtual "isStock" delivery
  const stockDelivery: StockDelivery = useMemo(() => {
    return {
      id: `stock-${selectedDate}`,
      date: selectedDate,
      supplierName: "المخزون الحالي",
      driverName: "نظام المخزون",
      fishTypes: aggregatedStock.map((stock) => ({
        id: `stock-${stock.type}`,
        type: stock.type,
        quantity: stock.remainingWeight,
        unit: stock.unit,
        weight: stock.totalWeight,
      })),
      totalWeight: aggregatedStock.reduce(
        (sum, stock) => sum + stock.totalWeight,
        0
      ),
      remainingWeight: aggregatedStock.reduce(
        (sum, stock) => sum + stock.remainingWeight,
        0
      ),
    };
  }, [aggregatedStock, selectedDate]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalImported = aggregatedStock.reduce(
      (sum, stock) => sum + stock.totalWeight,
      0
    );
    const totalSold = aggregatedStock.reduce(
      (sum, stock) => sum + stock.soldWeight,
      0
    );
    const totalRemaining = aggregatedStock.reduce(
      (sum, stock) => sum + stock.remainingWeight,
      0
    );
    const netChange = totalImported - totalSold;
    const totalMovements = filteredDeliveries.length;

    return {
      totalImported,
      totalSold,
      netChange,
      totalRemaining,
      totalMovements,
    };
  }, [aggregatedStock, filteredDeliveries]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleUpdateAggregatedStock = async () => {
    try {
      setUpdatingStock(true);
      setError(null);

      // Update the aggregated stock (creates tomorrow's delivery)
      const result = await inventoryMovementApi.updateAggregatedStock();

      if (result.success && result.data) {
        // Refresh the deliveries data to show the new aggregated delivery
        await loadDeliveries();

        // Show success message with details
        alert(
          `تم تحديث المخزون المجمع بنجاح\nتم إنشاء توصيلة مخزون جديدة بتاريخ ${new Date(
            result.data.deliveryDate
          ).toLocaleDateString("ar-EG")}`
        );
      } else {
        alert(result.message || "تم تحديث المخزون المجمع بنجاح");
        await loadDeliveries();
      }
    } catch (err) {
      setError("فشل في تحديث المخزون المجمع");
      console.error("Error updating aggregated stock:", err);
    } finally {
      setUpdatingStock(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={loadDeliveries}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TopNavigation currentPage="inventory-movement" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">حركة المخزون</h1>
              <p className="text-gray-600 mt-2">تتبع حركة المخزون والمبيعات</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDetailView(!showDetailView)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                {showDetailView ? "عرض الموجز" : "عرض التفاصيل"}
              </Button>
              <Button
                variant="outline"
                onClick={handleUpdateAggregatedStock}
                disabled={updatingStock}
                className="flex items-center gap-2"
              >
                {updatingStock ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {updatingStock ? "جاري التحديث..." : "تحديث المخزون المجمع"}
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                إضافة حركة جديدة
              </Button>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                تاريخ المخزون:
              </label>
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-48"
            />
            <div className="text-sm text-gray-600">
              عدد التوصيلات: {filteredDeliveries.length}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الواردات
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalImported.toFixed(1)} كجم
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
                  إجمالي المبيعات
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSold.toFixed(1)} كجم
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  صافي التغيير
                </p>
                <p
                  className={`text-2xl font-bold ${
                    stats.netChange >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stats.netChange >= 0 ? "+" : ""}
                  {stats.netChange.toFixed(1)} كجم
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  المخزون المتبقي
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRemaining.toFixed(1)} كجم
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">عدد الحركات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalMovements}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {showDetailView ? (
          <DetailView
            stockDelivery={stockDelivery}
            deliveries={filteredDeliveries}
            onBack={() => setShowDetailView(false)}
          />
        ) : (
          <AggregatedView
            aggregatedStock={aggregatedStock}
            stockDelivery={stockDelivery}
            onViewDetails={() => setShowDetailView(true)}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryMovementPage;
