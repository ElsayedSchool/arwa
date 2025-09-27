import { useState, useMemo } from "react";
import ExcelJS from "exceljs";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  Package,
  DollarSign,
  Users,
  CreditCard,
} from "lucide-react";
// @ts-expect-error: JS/JSX module without TypeScript types
import { SuppliersTable } from "../suppliers/components/SuppliersTable";
// @ts-expect-error: JS/JSX module without TypeScript types
import { AddSupplierProductForm } from "../suppliers/components/AddSupplierProductForm";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../common/Badge";
// @ts-expect-error: JS/JSX module without TypeScript types
import { EditPaymentModal } from "../suppliers/modals/EditPaymentModal";
// @ts-expect-error: JS/JSX module without TypeScript types
import { EditPriceModal } from "../suppliers/modals/EditPriceModal";

// Types
type PaymentStatus = "paid" | "partial" | "unpaid";

interface SupplierPaymentHistoryItem {
  amount: number;
  date: string; // ISO date string
  notes?: string;
}

interface SupplierItem {
  id: number;
  supplierName: string;
  fishType: string;
  suppliedKg: number;
  amountSold: number;
  supplyDate: string; // ISO date string
  pricePerKg: number;
  totalCost?: number;
  amountPaid?: number;
  paymentStatus?: PaymentStatus;
  dueDate?: string | null;
  lastPaymentDate?: string;
  paymentHistory?: SupplierPaymentHistoryItem[];
}

interface PaymentData {
  amountPaid: number;
  paymentStatus: PaymentStatus;
  dueDate: string | null;
}

interface PriceData {
  pricePerKg: number;
}

// Mock data for suppliers with payment tracking
const initialSuppliersData: SupplierItem[] = [
  {
    id: 1,
    supplierName: "أحمد محمد",
    fishType: "بلطي",
    suppliedKg: 150.5,
    amountSold: 120.0,
    supplyDate: "2024-01-15",
    pricePerKg: 45.5,
    totalCost: 6847.75, // suppliedKg * pricePerKg
    amountPaid: 5000,
    paymentStatus: "partial", // paid, unpaid, partial
    dueDate: "2024-02-15",
    lastPaymentDate: "2024-01-20",
    paymentHistory: [
      { amount: 3000, date: "2024-01-15", notes: "دفعة أولى" },
      { amount: 2000, date: "2024-01-20", notes: "دفعة ثانية" },
    ],
  },
  {
    id: 2,
    supplierName: "محمد علي",
    fishType: "مكرونة",
    suppliedKg: 200.0,
    amountSold: 180.5,
    supplyDate: "2024-01-14",
    pricePerKg: 55.0,
    totalCost: 11000,
    amountPaid: 11000,
    paymentStatus: "paid",
    dueDate: null,
    lastPaymentDate: "2024-01-14",
    paymentHistory: [{ amount: 11000, date: "2024-01-14", notes: "دفع كامل" }],
  },
  {
    id: 3,
    supplierName: "أحمد محمد",
    fishType: "دنيس",
    suppliedKg: 80.0,
    amountSold: 75.0,
    supplyDate: "2024-01-13",
    pricePerKg: 85.0,
  },
  {
    id: 4,
    supplierName: "فاطمة أحمد",
    fishType: "بوري",
    suppliedKg: 120.0,
    amountSold: 45.0,
    supplyDate: "2024-01-12",
    pricePerKg: 65.0,
  },
  {
    id: 5,
    supplierName: "محمد علي",
    fishType: "بلطي",
    suppliedKg: 300.0,
    amountSold: 280.0,
    supplyDate: "2024-01-11",
    pricePerKg: 42.0,
  },
];

const SupplierAnalysisPage = ({
  userRole = "admin",
}: {
  userRole?: string;
}) => {
  const [suppliersData, setSuppliersData] =
    useState<SupplierItem[]>(initialSuppliersData);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedFishType, setSelectedFishType] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    PaymentStatus | ""
  >("");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);
  const [selectedSupplierForPayment, setSelectedSupplierForPayment] =
    useState<SupplierItem | null>(null);
  const [selectedSupplierForPrice, setSelectedSupplierForPrice] =
    useState<SupplierItem | null>(null);
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "specific" | "range"
  >("all");
  const [specificDate, setSpecificDate] = useState("");
  // Get unique suppliers and fish types for filters
  const uniqueSuppliers = [
    ...new Set(suppliersData.map((item) => item.supplierName)),
  ];
  const uniqueFishTypes = [
    ...new Set(suppliersData.map((item) => item.fishType)),
  ];

  // Filter data based on search and filters
  const filteredData = useMemo<SupplierItem[]>(() => {
    return suppliersData.filter((item) => {
      const matchesSearch =
        item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fishType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSupplier =
        !selectedSupplier || item.supplierName === selectedSupplier;
      const matchesFishType =
        !selectedFishType || item.fishType === selectedFishType;
      const matchesPaymentStatus =
        !paymentStatusFilter || item.paymentStatus === paymentStatusFilter;

      // Enhanced date filtering
      let matchesDateFilter = true;
      const today = new Date().toISOString().split("T")[0];

      if (dateFilter === "today") {
        matchesDateFilter = item.supplyDate === today;
      } else if (dateFilter === "specific" && specificDate) {
        matchesDateFilter = item.supplyDate === specificDate;
      } else if (dateFilter === "range") {
        matchesDateFilter =
          (!dateRange.from || item.supplyDate >= dateRange.from) &&
          (!dateRange.to || item.supplyDate <= dateRange.to);
      }

      return (
        matchesSearch &&
        matchesSupplier &&
        matchesFishType &&
        matchesPaymentStatus &&
        matchesDateFilter
      );
    });
  }, [
    suppliersData,
    searchTerm,
    selectedSupplier,
    selectedFishType,
    paymentStatusFilter,
    dateFilter,
    specificDate,
    dateRange,
  ]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const uniqueSuppliersCount = new Set(
      filteredData.map((item) => item.supplierName)
    ).size;

    const totalSupplied = filteredData.reduce(
      (sum, item) => sum + (item.suppliedKg || 0),
      0
    );

    const totalSold = filteredData.reduce(
      (sum, item) => sum + (item.amountSold || 0),
      0
    );

    const totalPaidToSuppliers = filteredData.reduce(
      (sum, item) => sum + (item.amountPaid || 0),
      0
    );

    const totalCostToSuppliers = filteredData.reduce(
      (sum, item) =>
        sum +
        (item.totalCost || (item.suppliedKg || 0) * (item.pricePerKg || 0)),
      0
    );

    const totalRemainingToSuppliers =
      totalCostToSuppliers - totalPaidToSuppliers;

    const totalRevenue = filteredData.reduce(
      (sum, item) => sum + (item.amountSold || 0) * (item.pricePerKg || 0),
      0
    );

    const netProfit = totalRevenue - totalCostToSuppliers;

    return {
      uniqueSuppliersCount: uniqueSuppliersCount || 0,
      totalSupplied: totalSupplied || 0,
      totalSold: totalSold || 0,
      totalPaidToSuppliers: totalPaidToSuppliers || 0,
      totalRemainingToSuppliers: totalRemainingToSuppliers || 0,
      netProfit: netProfit || 0,
    };
  }, [filteredData]);

  const getStockStatus = (
    supplied: number,
    sold: number
  ): { status: string; variant: "success" | "warning" | "danger" } => {
    const remaining = supplied - sold;
    const percentage = (remaining / supplied) * 100;

    if (percentage > 50) return { status: "مخزون جيد", variant: "success" };
    if (percentage > 20) return { status: "مخزون متوسط", variant: "warning" };
    if (percentage > 0) return { status: "مخزون منخفض", variant: "danger" };
    return { status: "نفد المخزون", variant: "danger" };
  };

  const handleAddSupplier = (newSupplier: SupplierItem) => {
    setSuppliersData((prev) => [...prev, newSupplier]);
    setShowAddForm(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSupplier("");
    setSelectedFishType("");
    setPaymentStatusFilter("");
    setDateFilter("all");
    setSpecificDate("");
    setDateRange({ from: "", to: "" });
  };

  const exportTableData = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("بيانات الموردين");

    // Set RTL direction for the worksheet
    worksheet.views = [{ rightToLeft: true }];

    // Set RTL direction for the worksheet
    worksheet.views = [{ rightToLeft: true }];

    // Add filter information
    const filterInfo = [
      ["تقرير بيانات الموردين - الجدول المفلتر"],
      ["تاريخ التصدير:", new Date().toLocaleDateString("ar-EG")],
      [""],
      ["الفلاتر المطبقة:"],
      ["البحث:", searchTerm || "غير محدد"],
      ["المورد:", selectedSupplier || "جميع الموردين"],
      ["نوع السمك:", selectedFishType || "جميع الأنواع"],
      [
        "حالة الدفع:",
        paymentStatusFilter
          ? getPaymentStatusText(paymentStatusFilter)
          : "جميع الحالات",
      ],
      [
        "التاريخ:",
        dateFilter === "all"
          ? "جميع التواريخ"
          : dateFilter === "today"
          ? "اليوم"
          : dateFilter === "specific"
          ? specificDate
          : `من ${dateRange.from} إلى ${dateRange.to}`,
      ],
      [""],
      ["عدد السجلات المعروضة:", filteredData.length],
      [""],
    ];

    // Add filter info to worksheet
    filterInfo.forEach((row) => {
      worksheet.addRow(row);
    });

    // Add headers
    const headers = [
      "المورد",
      "نوع السمك",
      "تاريخ التوريد",
      "الكمية المورّدة (كجم)",
      "الكمية المباعة (كجم)",
      "الكمية المتبقية (كجم)",
      "السعر/كجم (ج.م)",
      "التكلفة الإجمالية (ج.م)",
      "المبلغ المدفوع (ج.م)",
      "المبلغ المتبقي (ج.م)",
      "حالة الدفع",
      "تاريخ الاستحقاق",
    ];
    worksheet.addRow(headers);

    // Add data
    filteredData.forEach((item) => {
      const totalCost =
        item.totalCost || item.suppliedKg * item.pricePerKg || 0;
      const remainingAmount = totalCost - (item.amountPaid || 0);

      worksheet.addRow([
        item.supplierName,
        item.fishType,
        item.supplyDate,
        item.suppliedKg,
        item.amountSold,
        item.suppliedKg - item.amountSold,
        item.pricePerKg,
        totalCost,
        item.amountPaid || 0,
        remainingAmount,
        getPaymentStatusText(item.paymentStatus || "unpaid"),
        item.dueDate || "-",
      ]);
    });

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suppliers_table_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // CSV export function was removed because it was unused; re-add when needed.

  const exportFullPageData = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("تقرير شامل");

    // Set RTL direction for the worksheet
    worksheet.views = [{ rightToLeft: true }];

    // Add summary data
    const summary = [
      ["تقرير شامل - صفحة تحليل الموردين"],
      ["تاريخ التصدير:", new Date().toLocaleDateString("ar-EG")],
      [""],
      ["الفلاتر المطبقة:"],
      ["البحث:", searchTerm || "غير محدد"],
      ["المورد:", selectedSupplier || "جميع الموردين"],
      ["نوع السمك:", selectedFishType || "جميع الأنواع"],
      [
        "حالة الدفع:",
        paymentStatusFilter
          ? getPaymentStatusText(paymentStatusFilter)
          : "جميع الحالات",
      ],
      [
        "التاريخ:",
        dateFilter === "all"
          ? "جميع التواريخ"
          : dateFilter === "today"
          ? "اليوم"
          : dateFilter === "specific"
          ? specificDate
          : `من ${dateRange.from} إلى ${dateRange.to}`,
      ],
      [""],
      ["التحليلات:"],
      ["عدد الموردين:", analytics?.uniqueSuppliersCount || 0],
      ["إجمالي المستلم (كجم):", (analytics?.totalSupplied || 0).toFixed(1)],
      ["إجمالي المباع (كجم):", (analytics?.totalSold || 0).toFixed(1)],
      [
        "معدل البيع (%):",
        (
          ((analytics?.totalSold || 0) / (analytics?.totalSupplied || 1)) *
          100
        ).toFixed(1),
      ],
      [
        "إجمالي المدفوع للموردين (ج.م):",
        (analytics?.totalPaidToSuppliers || 0).toFixed(2),
      ],
      [
        "المتبقي للموردين (ج.م):",
        (analytics?.totalRemainingToSuppliers || 0).toFixed(2),
      ],
      ["صافي الربح (ج.م):", (analytics?.netProfit || 0).toFixed(2)],
      [""],
      ["بيانات الجدول:"],
    ];

    // Add summary to worksheet
    summary.forEach((row) => {
      worksheet.addRow(row);
    });

    // Add headers and data (same as table export)
    const headers = [
      "المورد",
      "نوع السمك",
      "تاريخ التوريد",
      "الكمية المورّدة (كجم)",
      "الكمية المباعة (كجم)",
      "الكمية المتبقية (كجم)",
      "السعر/كجم (ج.م)",
      "التكلفة الإجمالية (ج.م)",
      "المبلغ المدفوع (ج.م)",
      "المبلغ المتبقي (ج.م)",
      "حالة الدفع",
      "تاريخ الاستحقاق",
    ];
    worksheet.addRow(headers);

    filteredData.forEach((item) => {
      const totalCost =
        item.totalCost || item.suppliedKg * item.pricePerKg || 0;
      const remainingAmount = totalCost - (item.amountPaid || 0);

      worksheet.addRow([
        item.supplierName,
        item.fishType,
        item.supplyDate,
        item.suppliedKg,
        item.amountSold,
        item.suppliedKg - item.amountSold,
        item.pricePerKg,
        totalCost,
        item.amountPaid || 0,
        remainingAmount,
        getPaymentStatusText(item.paymentStatus || "unpaid"),
        item.dueDate || "-",
      ]);
    });

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suppliers_full_report_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpdatePayment = (
    supplierId: number,
    paymentData: PaymentData
  ): void => {
    setSuppliersData(
      (prev) =>
        prev.map((supplier) =>
          supplier.id === supplierId
            ? {
                ...supplier,
                amountPaid: paymentData.amountPaid,
                paymentStatus: paymentData.paymentStatus,
                dueDate: paymentData.dueDate,
                lastPaymentDate: new Date().toISOString().split("T")[0],
                paymentHistory: [
                  ...(supplier.paymentHistory || []),
                  {
                    amount: paymentData.amountPaid - (supplier.amountPaid || 0),
                    date: new Date().toISOString().split("T")[0],
                    notes: "تعديل الدفع",
                  },
                ].filter((payment) => payment.amount > 0),
              }
            : supplier
        ) as SupplierItem[]
    );
    setShowEditPaymentModal(false);
    setSelectedSupplierForPayment(null);
  };

  const handleEditPayment = (supplier: SupplierItem) => {
    setSelectedSupplierForPayment(supplier);
    setShowEditPaymentModal(true);
  };

  const getPaymentStatusText = (status: PaymentStatus | undefined | string) => {
    switch (status) {
      case "paid":
        return "مدفوع بالكامل";
      case "partial":
        return "مدفوع جزئياً";
      case "unpaid":
        return "غير مدفوع";
      default:
        return "غير محدد";
    }
  };

  const getPaymentStatusVariant = (
    status: PaymentStatus | undefined | string
  ): "success" | "warning" | "danger" | "secondary" => {
    switch (status) {
      case "paid":
        return "success";
      case "partial":
        return "warning";
      case "unpaid":
        return "danger";
      default:
        return "secondary";
    }
  };

  const handleEditPrice = (supplier: SupplierItem) => {
    setSelectedSupplierForPrice(supplier);
    setShowEditPriceModal(true);
  };

  const handleUpdatePrice = (
    supplierId: number,
    priceData: PriceData
  ): void => {
    setSuppliersData((prev) =>
      prev.map((supplier) =>
        supplier.id === supplierId
          ? {
              ...supplier,
              pricePerKg: priceData.pricePerKg,
              totalCost: supplier.suppliedKg * priceData.pricePerKg,
            }
          : supplier
      )
    );
    setShowEditPriceModal(false);
    setSelectedSupplierForPrice(null);
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
            >
              <ArrowLeft size={20} className="ml-2" />
              العودة إلى تحليل الموردين
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              إضافة منتج جديد
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <AddSupplierProductForm
              onSubmit={handleAddSupplier}
              onCancel={() => setShowAddForm(false)}
              existingSuppliers={uniqueSuppliers}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                تحليل الموردين
              </h1>
              <p className="text-gray-600 mt-2">
                تحليل شامل لأداء الموردين وإدارة المخزون والمدفوعات
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportFullPageData} size="sm">
                <Download size={16} className="ml-2" />
                تصدير التقرير الشامل
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  عدد الموردين
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics?.uniqueSuppliersCount || 0}
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
                  إجمالي المستلم
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(analytics?.totalSupplied || 0).toFixed(1)} كجم
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي المباع
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(analytics?.totalSold || 0).toFixed(1)} كجم
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
                  إجمالي المدفوع للموردين
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(analytics?.totalPaidToSuppliers || 0).toFixed(2)} ج.م
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  المتبقي للموردين
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(analytics?.totalRemainingToSuppliers || 0).toFixed(2)} ج.م
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div
                className={`p-3 rounded-full ${
                  (analytics?.netProfit || 0) >= 0
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                <DollarSign
                  className={`h-6 w-6 ${
                    (analytics?.netProfit || 0) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">صافي الربح</p>
                <p
                  className={`text-2xl font-bold ${
                    (analytics?.netProfit || 0) >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {(analytics?.netProfit || 0).toFixed(2)} ج.م
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">معدل البيع</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(
                    ((analytics?.totalSold || 0) /
                      (analytics?.totalSupplied || 1)) *
                    100
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <div className="p-3 rounded-full bg-indigo-100">
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  عدد الموردين النشطين
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {analytics?.uniqueSuppliersCount || 0}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              البحث والتصفية
            </h3>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={exportTableData} size="sm">
                <Download size={16} className="ml-2" />
                تصدير الجدول
              </Button>
              <Button variant="outline" onClick={clearFilters} size="sm">
                مسح الفلاتر
              </Button>
            </div>
          </div>

          {/* First row - Search and basic filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <Input
              placeholder="البحث في الموردين أو نوع السمك..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />

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

            <select
              value={selectedFishType}
              onChange={(e) => setSelectedFishType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع أنواع السمك</option>
              {uniqueFishTypes.map((fishType) => (
                <option key={fishType} value={fishType}>
                  {fishType}
                </option>
              ))}
            </select>

            <select
              value={paymentStatusFilter}
              onChange={(e) =>
                setPaymentStatusFilter(e.target.value as PaymentStatus | "")
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">جميع حالات الدفع</option>
              <option value="paid">مدفوع بالكامل</option>
              <option value="partial">مدفوع جزئي</option>
              <option value="unpaid">غير مدفوع</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(
                  e.target.value as "all" | "today" | "specific" | "range"
                )
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">جميع التواريخ</option>
              <option value="today">اليوم</option>
              <option value="specific">يوم محدد</option>
              <option value="range">فترة زمنية</option>
            </select>
          </div>

          {/* Second row - Date filters */}
          {(dateFilter === "specific" || dateFilter === "range") && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dateFilter === "specific" && (
                <Input
                  type="date"
                  placeholder="اختر التاريخ"
                  value={specificDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                />
              )}

              {dateFilter === "range" && (
                <>
                  <Input
                    type="date"
                    placeholder="من تاريخ"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="date"
                    placeholder="إلى تاريخ"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, to: e.target.value }))
                    }
                  />
                </>
              )}
            </div>
          )}

          {(searchTerm ||
            selectedSupplier ||
            selectedFishType ||
            paymentStatusFilter ||
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
              {paymentStatusFilter && (
                <Badge variant="default">
                  حالة الدفع: {getPaymentStatusText(paymentStatusFilter)}
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

        {/* Results Summary */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <p className="text-sm text-gray-600">
            عرض {filteredData.length} من أصل {suppliersData.length} منتج
            {filteredData.length !== suppliersData.length && (
              <span className="text-blue-600 mr-2">(مفلتر)</span>
            )}
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              بيانات الموردين
            </h3>
          </div>
          <SuppliersTable
            data={filteredData}
            getStockStatus={getStockStatus}
            onEditPayment={handleEditPayment}
            onEditPrice={handleEditPrice}
            userRole={userRole}
            getPaymentStatusText={getPaymentStatusText}
            getPaymentStatusVariant={getPaymentStatusVariant}
          />
        </div>
      </div>
      <EditPaymentModal
        isOpen={showEditPaymentModal}
        onClose={() => setShowEditPaymentModal(false)}
        onSave={handleUpdatePayment}
        supplier={selectedSupplierForPayment}
      />
      <EditPriceModal
        isOpen={showEditPriceModal}
        onClose={() => setShowEditPriceModal(false)}
        onSave={handleUpdatePrice}
        supplier={selectedSupplierForPrice}
      />
    </div>
  );
};

export default SupplierAnalysisPage;
