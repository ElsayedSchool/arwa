import React, { useState, useMemo, useEffect, useCallback } from "react";
import ExcelJS from "exceljs";
import { Plus, Search, Truck, Download, Package, Users } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../common/Badge";
import { TopNavigation } from "../common/TopNavigation";
// @ts-expect-error - JSX modules
import { DeliveriesTable } from "./components/DeliveriesTable";
// @ts-expect-error - JSX modules
import { AddDeliveryModal } from "./modals/AddDeliveryModal";
// @ts-expect-error - JSX modules
import { EditDeliveryModal } from "./modals/EditDeliveryModal";
// @ts-expect-error - JSX modules
import { DeliveryDetailsModal } from "./modals/DeliveryDetailsModal";
// @ts-expect-error - JSX modules
import { EnterCostModal } from "./modals/EnterCostModal";
import deliveriesApi, {
  type DeliveryUi,
  type TypeDto,
} from "./api/deliveriesApi";
import { useSupplierStore } from "../../stores/supplierStore";

// FishType interface now modeled in deliveriesApi.FishTypeUi

type Delivery = DeliveryUi;

interface DateRange {
  from: string;
  to: string;
}

interface Analytics {
  totalReceivedFish: number;
  fishTypeBreakdown: Record<string, number>;
  totalDeliveries: number;
  uniqueSuppliers: number;
}

const initialDeliveriesData: Delivery[] = [];

const DeliveriesPage: React.FC = () => {
  const [deliveriesData, setDeliveriesData] = useState<Delivery[]>(
    initialDeliveriesData
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [selectedFishType, setSelectedFishType] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [typeNames, setTypeNames] = useState<string[]>([]);
  const [types, setTypes] = useState<TypeDto[]>([]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [showCostModal, setShowCostModal] = useState<boolean>(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );

  // Suppliers list from global store for dropdowns (decoupled from existing trucks)
  const { suppliers: supplierList, fetchSuppliers } = useSupplierStore();
  const supplierNames = supplierList.map((s) => s.name);
  // Filter options are sourced from global suppliers and backend types

  // Enhanced filtering logic
  const filteredData = useMemo(() => {
    return deliveriesData.filter((delivery) => {
      // Search filter
      if (
        searchTerm &&
        !delivery.supplierName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        !delivery.driverName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Supplier filter
      if (selectedSupplier && delivery.supplierName !== selectedSupplier) {
        return false;
      }

      // Fish type filter
      if (
        selectedFishType &&
        !delivery.fishTypes?.some((fish) => fish.type === selectedFishType)
      ) {
        return false;
      }

      // Date filter
      const deliveryDate = new Date(delivery.deliveryDate);
      const today = new Date();

      if (dateFilter === "today") {
        return deliveryDate.toDateString() === today.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return deliveryDate >= weekAgo;
      } else if (dateFilter === "month") {
        return (
          deliveryDate.getMonth() === today.getMonth() &&
          deliveryDate.getFullYear() === today.getFullYear()
        );
      } else if (dateFilter === "range") {
        if (dateRange.from && deliveryDate < new Date(dateRange.from))
          return false;
        if (dateRange.to && deliveryDate > new Date(dateRange.to)) return false;
      }

      return true;
    });
  }, [
    deliveriesData,
    searchTerm,
    selectedSupplier,
    selectedFishType,
    dateFilter,
    dateRange,
  ]);

  // Calculate analytics based on filtered data
  const analytics: Analytics = useMemo(() => {
    const totalReceivedFish = filteredData.reduce(
      (sum, delivery) => sum + (delivery.totalWeight || 0),
      0
    );

    const fishTypeBreakdown = filteredData.reduce((acc, delivery) => {
      delivery.fishTypes?.forEach((fish) => {
        acc[fish.type] = (acc[fish.type] || 0) + fish.weight;
      });
      return acc;
    }, {} as Record<string, number>);

    const totalDeliveries = filteredData.length;
    const uniqueSuppliers = new Set(filteredData.map((d) => d.supplierName))
      .size;

    return {
      totalReceivedFish,
      fishTypeBreakdown,
      totalDeliveries,
      uniqueSuppliers,
    };
  }, [filteredData]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowDetailsModal(true);
  };

  const handleEdit = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowEditModal(true);
  };

  const handleAddDelivery = async (
    newDelivery: Omit<Delivery, "id" | "lastEditTime">
  ) => {
    // Create truck then items using backend APIs
    try {
      const selectedSupplier = supplierList.find(
        (s) => s.name === newDelivery.supplierName
      );
      const truck = await deliveriesApi.createDelivery({
        supplierId: selectedSupplier?.id,
        supplierName: newDelivery.supplierName,
        driverName: newDelivery.driverName,
        // deliveryDate handled by DB @CreateDateColumn; keep now
      });

      // Ensure type IDs for each fish type then create items
      const types = await deliveriesApi.getTypes();
      const typeMap = new Map(types.map((t) => [t.id, t] as const));
      // for faster lookup by name too
      const byName = new Map(types.map((t) => [t.name, t] as const));

      for (const f of newDelivery.fishTypes) {
        // find or create type
        let type = byName.get(f.type) || null;
        if (!type) {
          // pass baseType as category when creating subtype
          const baseName = (f as unknown as { baseType?: string }).baseType;
          type = await deliveriesApi.ensureTypeByName(
            f.type,
            typeMap,
            baseName || undefined
          );
          byName.set(type.name, type);
        }
        await deliveriesApi.createDeliveryItem({
          truckId: truck.id,
          typeId: type.id,
          amount: f.weight,
          classification: null,
        });
      }

      // Refresh list from backend
      await fetchDeliveries();
      setShowAddModal(false);
    } catch (err) {
      console.error("Failed to add delivery", err);
      alert("حدث خطأ أثناء إضافة التوصيل. يرجى المحاولة مرة أخرى.");
    }
  };

  const handleUpdateDelivery = (updatedDelivery: Delivery) => {
    setDeliveriesData((prev) =>
      prev.map((delivery) =>
        delivery.id === updatedDelivery.id
          ? { ...updatedDelivery, lastEditTime: new Date().toISOString() }
          : delivery
      )
    );
    setShowEditModal(false);
    setSelectedDelivery(null);
  };

  const handleUpdateCost = async (
    deliveryId: string,
    costData: { totalCost: number; amountPaid: number }
  ) => {
    try {
      await deliveriesApi.updateDeliveryTotals(
        deliveryId,
        costData.totalCost,
        costData.amountPaid
      );
      await fetchDeliveries();
    } catch (e) {
      console.error(e);
      alert("تعذر حفظ التكلفة. الرجاء المحاولة لاحقاً.");
    } finally {
      setShowCostModal(false);
      setSelectedDelivery(null);
    }
  };

  const handleDelete = async (delivery: Delivery) => {
    if (
      window.confirm(
        `هل أنت متأكد من حذف توصيل ${delivery.supplierName}؟\nهذا الإجراء لا يمكن التراجع عنه.`
      )
    ) {
      try {
        await deliveriesApi.deleteDelivery(delivery.id);
        await fetchDeliveries();
      } catch (e) {
        console.error(e);
        alert("تعذر حذف التوصيل.");
      }
    }
  };

  // Ensure types exist before opening Add modal
  const openAddModal = useCallback(async () => {
    try {
      if (!types || types.length === 0) {
        const latest = await deliveriesApi.getTypes();
        setTypes(latest);
        setTypeNames(latest.map((t) => t.name));
      }
    } catch (e) {
      console.error("Failed to load types before opening modal", e);
    } finally {
      setShowAddModal(true);
    }
  }, [types]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSupplier("");
    setSelectedFishType("");
    setDateFilter("all");
    setDateRange({ from: "", to: "" });
  };

  const fetchDeliveries = useCallback(async () => {
    const filters: Record<string, string> = {};
    if (selectedSupplier) filters.supplierName = selectedSupplier;
    if (selectedFishType) filters.fishType = selectedFishType;
    if (dateFilter && dateFilter !== "all") {
      filters.dateFilter = dateFilter;
      if (dateFilter === "range") {
        if (dateRange.from) filters.from = dateRange.from;
        if (dateRange.to) filters.to = dateRange.to;
      }
    }

    const [trucks, items, types] = await Promise.all([
      deliveriesApi.getDeliveries(filters),
      deliveriesApi.getDeliveryItems(),
      deliveriesApi.getTypes(),
    ]);
    // Debug: log types returned from API to verify shape and presence (temporary)
    console.debug("deliveries.fetchDeliveries: types=", types);
    const assembled = deliveriesApi.assembleDeliveries(trucks, items, types);
    setDeliveriesData(assembled);
    setTypeNames(types.map((t) => t.name));
    setTypes(types);
  }, [selectedSupplier, selectedFishType, dateFilter, dateRange]);

  useEffect(() => {
    // initial data load: suppliers for modal, and current deliveries list
    const init = async () => {
      try {
        await Promise.all([fetchSuppliers(), fetchDeliveries()]);
      } catch (e) {
        console.error(e);
      }
    };
    void init();
  }, [fetchSuppliers, fetchDeliveries]);

  const exportDeliveriesData = async () => {
    const workbook = new ExcelJS.Workbook();

    // Main data sheet
    const worksheet = workbook.addWorksheet("بيانات التوصيلات");
    worksheet.views = [{ rightToLeft: true }];

    // Add filter information
    const filterInfo = [
      ["تقرير بيانات التوصيلات - الجدول المفلتر"],
      ["تاريخ التصدير:", new Date().toLocaleDateString("ar-EG")],
      [""],
      ["الفلاتر المطبقة:"],
      ["البحث:", searchTerm || "غير محدد"],
      ["المورد:", selectedSupplier || "جميع الموردين"],
      ["نوع السمك:", selectedFishType || "جميع الأنواع"],
      [
        "التاريخ:",
        dateFilter === "all"
          ? "جميع التواريخ"
          : dateFilter === "today"
          ? "اليوم"
          : dateFilter === "week"
          ? "هذا الأسبوع"
          : dateFilter === "month"
          ? "هذا الشهر"
          : `من ${dateRange.from} إلى ${dateRange.to}`,
      ],
      [""],
      ["عدد السجلات المعروضة:", filteredData.length],
      [""],
      ["بيانات الجدول:"],
    ];

    filterInfo.forEach((row, index) => {
      const excelRow = worksheet.addRow(row);
      if (index === 0) {
        excelRow.font = { bold: true, size: 14 };
      } else if (row[0] && typeof row[0] === "string" && row[0].includes(":")) {
        excelRow.font = { bold: true };
      }
    });

    // Add table headers
    const headers = [
      "المورد",
      "السائق",
      "تاريخ التوصيل",
      "وقت التوصيل",
      "أنواع الأسماك",
      "إجمالي الوزن (كجم)",
      "آخر تعديل",
    ];

    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6E6E6" },
    };

    // Add data
    filteredData.forEach((delivery) => {
      worksheet.addRow([
        delivery.supplierName,
        delivery.driverName,
        delivery.deliveryDate,
        delivery.deliveryTime,
        delivery.fishTypes
          ?.map((f) => `${f.type}: ${f.weight}كجم`)
          .join(", ") || "",
        delivery.totalWeight,
        delivery.lastEditTime
          ? new Date(delivery.lastEditTime).toLocaleString("ar-EG")
          : "-",
      ]);
    });

    // Auto-fit columns for main sheet
    worksheet.columns?.forEach((column) => {
      if (!column) return;
      let maxLength = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      if (column.width !== undefined) {
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      }
    });

    // Create analytics sheet
    const analyticsSheet = workbook.addWorksheet("التحليلات");
    analyticsSheet.views = [{ rightToLeft: true }];

    // Add analytics title
    const analyticsTitle = analyticsSheet.addRow(["تحليلات بيانات التوصيلات"]);
    analyticsTitle.font = { bold: true, size: 16 };
    analyticsSheet.addRow([""]);

    // Add summary analytics
    const summaryTitle = analyticsSheet.addRow(["الملخص العام:"]);
    summaryTitle.font = { bold: true, size: 14 };

    analyticsSheet.addRow(["إجمالي التوصيلات:", analytics.totalDeliveries]);
    analyticsSheet.addRow([
      "إجمالي الأسماك المستلمة (كجم):",
      analytics.totalReceivedFish.toFixed(1),
    ]);
    analyticsSheet.addRow(["عدد الموردين:", analytics.uniqueSuppliers]);
    analyticsSheet.addRow([""]);

    // Add fish type breakdown
    const fishBreakdownTitle = analyticsSheet.addRow([
      "توزيع الأسماك حسب النوع:",
    ]);
    fishBreakdownTitle.font = { bold: true, size: 14 };
    analyticsSheet.addRow([""]);

    // Headers for fish breakdown
    const fishHeaders = analyticsSheet.addRow([
      "نوع السمك",
      "الكمية (كجم)",
      "النسبة المئوية",
    ]);
    fishHeaders.font = { bold: true };

    Object.entries(analytics.fishTypeBreakdown).forEach(
      ([fishType, weight]) => {
        const percentage = (
          (weight / analytics.totalReceivedFish) *
          100
        ).toFixed(1);
        analyticsSheet.addRow([fishType, weight.toFixed(1), `${percentage}%`]);
      }
    );

    // Auto-fit columns for analytics sheet
    analyticsSheet.columns?.forEach((column) => {
      if (!column) return;
      let maxLength = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      if (column.width !== undefined) {
        column.width = maxLength < 10 ? 10 : maxLength + 2;
      }
    });

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `deliveries_${new Date().toISOString().split("T")[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "success";
      case "partial":
        return "warning";
      case "unpaid":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "مدفوع";
      case "partial":
        return "مدفوع جزئي";
      case "unpaid":
        return "غير مدفوع";
      default:
        return "غير محدد";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <TopNavigation currentPage="deliveries" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Truck className="ml-3" size={32} />
                إدارة المخزون
              </h1>
              <p className="text-gray-600 mt-2">
                إدارة ومتابعة جميع توصيلات الأسماك اليومية
              </p>
            </div>
            <Button
              onClick={() => void openAddModal()}
              className="inline-flex items-center"
            >
              <Plus size={20} className="ml-2" />
              إضافة توصيل جديد
            </Button>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              البحث والتصفية
            </h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={exportDeliveriesData}
                size="sm"
              >
                <Download size={16} className="ml-2" />
                تصدير البيانات
              </Button>
              <Button variant="outline" onClick={clearFilters} size="sm">
                مسح الفلاتر
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="البحث في المورد أو السائق..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Supplier Filter */}
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع الموردين</option>
              {supplierNames.map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>

            {/* Fish Type Filter */}
            <select
              value={selectedFishType}
              onChange={(e) => setSelectedFishType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع أنواع الأسماك</option>
              {typeNames.map((fishType) => (
                <option key={fishType} value={fishType}>
                  {fishType}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع التواريخ</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="range">فترة محددة</option>
            </select>
          </div>

          {/* Date Range Inputs */}
          {dateFilter === "range" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="من تاريخ"
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, from: e.target.value }))
                }
              />
              <Input
                label="إلى تاريخ"
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, to: e.target.value }))
                }
              />
            </div>
          )}

          {/* Active Filters Display */}
          {(searchTerm ||
            selectedSupplier ||
            selectedFishType ||
            dateFilter !== "all" ||
            dateRange.from ||
            dateRange.to) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="default">البحث: {searchTerm}</Badge>
              )}
              {selectedSupplier && (
                <Badge variant="default">المورد: {selectedSupplier}</Badge>
              )}
              {selectedFishType && (
                <Badge variant="default">نوع السمك: {selectedFishType}</Badge>
              )}
              {dateFilter !== "all" && (
                <Badge variant="default">
                  التاريخ:{" "}
                  {dateFilter === "today"
                    ? "اليوم"
                    : dateFilter === "week"
                    ? "هذا الأسبوع"
                    : dateFilter === "month"
                    ? "هذا الشهر"
                    : "فترة محددة"}
                </Badge>
              )}
              {dateRange.from && (
                <Badge variant="default">من: {dateRange.from}</Badge>
              )}
              {dateRange.to && (
                <Badge variant="default">إلى: {dateRange.to}</Badge>
              )}
            </div>
          )}
        </div>

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
                <p className="text-sm font-medium text-gray-600">
                  عدد الموردين
                </p>
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
                  <p className="text-sm font-medium text-gray-600">
                    {fishType}
                  </p>
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

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <DeliveriesTable
            data={paginatedData}
            userRole="admin"
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                صفحة {currentPage} من {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  التالي
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <AddDeliveryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddDelivery}
          suppliers={supplierNames}
          types={types}
        />

        <EditDeliveryModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateDelivery}
          delivery={selectedDelivery}
          suppliers={supplierNames}
          types={types}
        />

        <DeliveryDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          delivery={selectedDelivery}
          userRole="admin"
          getPaymentStatusText={getPaymentStatusText}
          getPaymentStatusVariant={getPaymentStatusVariant}
        />

        <EnterCostModal
          isOpen={showCostModal}
          onClose={() => setShowCostModal(false)}
          onSave={handleUpdateCost}
          delivery={selectedDelivery}
        />
      </div>
    </div>
  );
};

export { DeliveriesPage };
