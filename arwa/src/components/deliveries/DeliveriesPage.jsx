import React, { useState, useMemo } from "react";
import ExcelJS from "exceljs";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  DollarSign,
  Calendar,
  Truck,
  Download,
  Package,
  Users,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../common/Badge";
import { DeliveriesTable } from "./DeliveriesTable";
import { AddDeliveryModal } from "./AddDeliveryModal";
import { EditDeliveryModal } from "./EditDeliveryModal";
import { DeliveryDetailsModal } from "./DeliveryDetailsModal";
import { EnterCostModal } from "./EnterCostModal";

const initialDeliveriesData = [
  {
    id: 1,
    supplierName: "مزرعة النيل للأسماك",
    driverName: "أحمد محمد",
    deliveryDate: "2024-01-15",
    deliveryTime: "08:30",
    lastEditTime: "2024-01-15T10:15:00",
    totalWeight: 150.5,
    paymentStatus: "paid",
    totalCost: 6750,
    amountPaid: 6750,
    remainingAmount: 0,
    fishTypes: [
      { type: "بلطي", weight: 80, pricePerKg: 45 },
      { type: "مبروك", weight: 70.5, pricePerKg: 50 },
    ],
  },
  {
    id: 2,
    supplierName: "شركة البحر الأحمر",
    driverName: "محمود علي",
    deliveryDate: "2024-01-15",
    deliveryTime: "14:20",
    lastEditTime: null,
    totalWeight: 200,
    paymentStatus: "unpaid",
    totalCost: 11000,
    amountPaid: 5000,
    remainingAmount: 6000,
    fishTypes: [
      { type: "دنيس", weight: 120, pricePerKg: 85 },
      { type: "لوت", weight: 80, pricePerKg: 75 },
    ],
  },
  {
    id: 3,
    supplierName: "مزرعة الدلتا",
    driverName: "عبد الرحمن سعد",
    deliveryDate: "2024-01-14",
    deliveryTime: "09:45",
    lastEditTime: "2024-01-14T16:30:00",
    totalWeight: 95.5,
    paymentStatus: "partial",
    totalCost: 4300,
    amountPaid: 2000,
    remainingAmount: 2300,
    fishTypes: [{ type: "قراميط", weight: 95.5, pricePerKg: 45 }],
  },
];

export const DeliveriesPage = ({ onBack, userRole = "admin" }) => {
  const [deliveriesData, setDeliveriesData] = useState(initialDeliveriesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedFishType, setSelectedFishType] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // Get unique values for filters
  const uniqueSuppliers = [
    ...new Set(deliveriesData.map((d) => d.supplierName)),
  ];
  const uniqueFishTypes = [
    ...new Set(
      deliveriesData.flatMap((d) => d.fishTypes?.map((f) => f.type) || [])
    ),
  ];

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
  const analytics = useMemo(() => {
    const totalReceivedFish = filteredData.reduce(
      (sum, delivery) => sum + (delivery.totalWeight || 0),
      0
    );

    const fishTypeBreakdown = filteredData.reduce((acc, delivery) => {
      delivery.fishTypes?.forEach((fish) => {
        acc[fish.type] = (acc[fish.type] || 0) + fish.weight;
      });
      return acc;
    }, {});

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

  const handleViewDetails = (delivery) => {
    setSelectedDelivery(delivery);
    setShowDetailsModal(true);
  };

  const handleEdit = (delivery) => {
    setSelectedDelivery(delivery);
    setShowEditModal(true);
  };

  const handleEnterCost = (delivery) => {
    setSelectedDelivery(delivery);
    setShowCostModal(true);
  };

  const handleAddDelivery = (newDelivery) => {
    const delivery = {
      ...newDelivery,
      id: Date.now(),
      lastEditTime: null,
    };
    setDeliveriesData((prev) => [delivery, ...prev]);
    setShowAddModal(false);
  };

  const handleUpdateDelivery = (updatedDelivery) => {
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

  const handleUpdateCost = (deliveryId, costData) => {
    setDeliveriesData((prev) =>
      prev.map((delivery) =>
        delivery.id === deliveryId
          ? {
              ...delivery,
              totalCost: costData.totalCost,
              amountPaid: costData.amountPaid,
              remainingAmount: costData.totalCost - costData.amountPaid,
              paymentStatus:
                costData.amountPaid === 0
                  ? "unpaid"
                  : costData.amountPaid >= costData.totalCost
                  ? "paid"
                  : "partial",
              lastEditTime: new Date().toISOString(),
            }
          : delivery
      )
    );
    setShowCostModal(false);
    setSelectedDelivery(null);
  };

  const handleDelete = (delivery) => {
    if (
      window.confirm(
        `هل أنت متأكد من حذف توصيل ${delivery.supplierName}؟\nهذا الإجراء لا يمكن التراجع عنه.`
      )
    ) {
      setDeliveriesData((prev) => prev.filter((d) => d.id !== delivery.id));
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSupplier("");
    setSelectedFishType("");
    setDateFilter("all");
    setDateRange({ from: "", to: "" });
  };

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
      } else if (row[0] && row[0].includes(":")) {
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
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
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
    fishHeaders.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE6E6E6" },
    };

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
    analyticsSheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
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

  const getPaymentStatusVariant = (status) => {
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

  const getPaymentStatusText = (status) => {
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
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft size={20} className="ml-2" />
            العودة إلى الصفحة الرئيسية
          </button>
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
              onClick={() => setShowAddModal(true)}
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
              {uniqueSuppliers.map((supplier) => (
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
              {uniqueFishTypes.map((fishType) => (
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
                <Badge variant="secondary">البحث: {searchTerm}</Badge>
              )}
              {selectedSupplier && (
                <Badge variant="secondary">المورد: {selectedSupplier}</Badge>
              )}
              {selectedFishType && (
                <Badge variant="secondary">نوع السمك: {selectedFishType}</Badge>
              )}
              {dateFilter !== "all" && (
                <Badge variant="secondary">
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
                <Badge variant="secondary">من: {dateRange.from}</Badge>
              )}
              {dateRange.to && (
                <Badge variant="secondary">إلى: {dateRange.to}</Badge>
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
            userRole={userRole}
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
          suppliers={uniqueSuppliers}
        />

        <EditDeliveryModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateDelivery}
          delivery={selectedDelivery}
          suppliers={uniqueSuppliers}
        />

        <DeliveryDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          delivery={selectedDelivery}
          userRole={userRole}
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
