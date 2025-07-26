// Reusable Components// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Add Supplier Product Form Component
const AddSupplierProductForm = ({ onSubmit, onCancel, existingSuppliers }) => {
  const [formData, setFormData] = React.useState({
    supplierName: "",
    fishType: "",
    suppliedKg: "",
    pricePerKg: "",
    supplyDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = React.useState({});
  const [isNewSupplier, setIsNewSupplier] = React.useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "اسم المورد مطلوب";
    }
    if (!formData.fishType.trim()) {
      newErrors.fishType = "نوع السمك مطلوب";
    }
    if (!formData.suppliedKg || formData.suppliedKg <= 0) {
      newErrors.suppliedKg = "الكمية يجب أن تكون أكبر من صفر";
    }
    if (!formData.pricePerKg || formData.pricePerKg <= 0) {
      newErrors.pricePerKg = "السعر يجب أن يكون أكبر من صفر";
    }
    if (!formData.supplyDate) {
      newErrors.supplyDate = "تاريخ التوريد مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newProduct = {
        id: Date.now(),
        supplierName: formData.supplierName,
        fishType: formData.fishType,
        suppliedKg: parseFloat(formData.suppliedKg),
        supplyDate: formData.supplyDate,
        amountSold: 0,
        pricePerKg: parseFloat(formData.pricePerKg),
      };
      onSubmit(newProduct);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSupplierChange = (supplierName) => {
    setFormData((prev) => ({ ...prev, supplierName }));
    setIsNewSupplier(!existingSuppliers.includes(supplierName));
    if (errors.supplierName) {
      setErrors((prev) => ({ ...prev, supplierName: "" }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Supplier Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          المورد
        </label>
        <SearchableDropdown
          options={existingSuppliers}
          value={formData.supplierName}
          onChange={handleSupplierChange}
          placeholder="اختر مورد موجود أو أدخل اسم جديد..."
          allowCustomInput={true}
        />
        {isNewSupplier && formData.supplierName && (
          <p className="text-sm text-blue-600">
            سيتم إضافة مورد جديد: "{formData.supplierName}"
          </p>
        )}
        {errors.supplierName && (
          <p className="text-sm text-red-600">{errors.supplierName}</p>
        )}
      </div>

      <Input
        label="نوع السمك"
        value={formData.fishType}
        onChange={(e) => handleInputChange("fishType", e.target.value)}
        placeholder="أدخل نوع السمك"
        error={errors.fishType}
      />

      <Input
        label="الكمية (كجم)"
        type="number"
        step="0.1"
        min="0"
        value={formData.suppliedKg}
        onChange={(e) => handleInputChange("suppliedKg", e.target.value)}
        placeholder="أدخل الكمية"
        error={errors.suppliedKg}
      />

      <Input
        label="السعر لكل كيلو (ج.م)"
        type="number"
        step="0.01"
        min="0"
        value={formData.pricePerKg}
        onChange={(e) => handleInputChange("pricePerKg", e.target.value)}
        placeholder="أدخل السعر"
        error={errors.pricePerKg}
      />

      <Input
        label="تاريخ التوريد"
        type="date"
        value={formData.supplyDate}
        onChange={(e) => handleInputChange("supplyDate", e.target.value)}
        error={errors.supplyDate}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button onClick={handleSubmit}>إضافة المنتج</Button>
      </div>
    </div>
  );
};
import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Filter,
  Eye,
  RefreshCw,
  Download,
  ChevronDown,
  X,
  Plus,
} from "lucide-react";

// Sample data - replace with your actual data source
let suppliersData = [
  {
    id: 1,
    supplierName: "شركة المحيط الطازج المحدودة",
    fishType: "سلمون",
    suppliedKg: 50,
    supplyDate: "2025-07-25",
    amountSold: 35,
    pricePerKg: 15.5,
  },
  {
    id: 2,
    supplierName: "شركة صيد البحار",
    fishType: "تونة",
    suppliedKg: 30,
    supplyDate: "2025-07-24",
    amountSold: 28,
    pricePerKg: 22.0,
  },
  {
    id: 3,
    supplierName: "شركة المحيط الطازج المحدودة",
    fishType: "كود",
    suppliedKg: 40,
    supplyDate: "2025-07-25",
    amountSold: 20,
    pricePerKg: 18.75,
  },
  {
    id: 4,
    supplierName: "مصايد الساحل",
    fishType: "ماكريل",
    suppliedKg: 25,
    supplyDate: "2025-07-23",
    amountSold: 25,
    pricePerKg: 12.3,
  },
  {
    id: 5,
    supplierName: "موردو أعماق البحار",
    fishType: "هادوك",
    suppliedKg: 35,
    supplyDate: "2025-07-25",
    amountSold: 15,
    pricePerKg: 16.8,
  },
  {
    id: 6,
    supplierName: "شركة صيد البحار",
    fishType: "قاروص البحر",
    suppliedKg: 20,
    supplyDate: "2025-07-22",
    amountSold: 18,
    pricePerKg: 25.5,
  },
  {
    id: 7,
    supplierName: "شركة المحيط الطازج المحدودة",
    fishType: "سلمون",
    suppliedKg: 45,
    supplyDate: "2025-07-21",
    amountSold: 45,
    pricePerKg: 15.5,
  },
  {
    id: 8,
    supplierName: "مصايد الساحل",
    fishType: "سردين",
    suppliedKg: 60,
    supplyDate: "2025-07-24",
    amountSold: 45,
    pricePerKg: 8.9,
  },
];

// Utility functions
const cn = (...classes) => classes.filter(Boolean).join(" ");

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isToday = (dateString) => {
  const today = new Date().toDateString();
  const date = new Date(dateString).toDateString();
  return today === date;
};

// Custom Searchable Dropdown Component
const SearchableDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  className = "",
  allowCustomInput = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleCustomInput = () => {
    if (
      allowCustomInput &&
      searchTerm.trim() &&
      !options.includes(searchTerm.trim())
    ) {
      onChange(searchTerm.trim());
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && allowCustomInput) {
      handleCustomInput();
    }
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value || placeholder}
          </span>
          <div className="flex items-center space-x-2">
            {value && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
            <ChevronDown
              size={16}
              className={cn(
                "text-gray-400 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-hidden">
            <div className="p-2 border-b">
              <div className="relative">
                <Search
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder={
                    allowCustomInput ? "البحث أو إضافة جديد..." : "البحث..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {!allowCustomInput && (
                <div
                  className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-right text-blue-600 font-medium"
                  onClick={handleClear}
                >
                  جميع الموردين
                </div>
              )}
              {filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-right"
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </div>
              ))}
              {allowCustomInput &&
                searchTerm.trim() &&
                !options.includes(searchTerm.trim()) && (
                  <div
                    className="px-3 py-2 hover:bg-green-50 cursor-pointer text-right text-green-600 font-medium"
                    onClick={handleCustomInput}
                  >
                    إضافة "{searchTerm.trim()}" كمورد جديد
                  </div>
                )}
              {filteredOptions.length === 0 &&
                searchTerm &&
                !allowCustomInput && (
                  <div className="px-3 py-2 text-gray-500 text-right">
                    لا يوجد نتائج
                  </div>
                )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
const Input = ({ label, className = "", ...props }) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">{label}</label>
    )}
    <input
      className={cn(
        "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
        className
      )}
      {...props}
    />
  </div>
);

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={cn(
        "inline-flex px-2 py-1 text-xs font-medium rounded-full",
        variants[variant]
      )}
    >
      {children}
    </span>
  );
};

// Main Component
export default function SuppliersManagement() {
  const [suppliers, setSuppliers] = React.useState(suppliersData);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    supplierName: "",
    dateFilter: "all", // 'all', 'today', 'dateRange'
    fromDate: "",
    toDate: "",
    fishType: "",
  });

  // Get unique suppliers and fish types for filter dropdowns
  const uniqueSuppliers = [
    ...new Set(suppliers.map((item) => item.supplierName)),
  ];
  const uniqueFishTypes = [...new Set(suppliers.map((item) => item.fishType))];

  // Filtered data based on current filters
  const filteredData = React.useMemo(() => {
    return suppliers.filter((item) => {
      // Supplier name filter - exact match or empty means show all
      if (filters.supplierName && item.supplierName !== filters.supplierName) {
        return false;
      }

      // Fish type filter
      if (filters.fishType && item.fishType !== filters.fishType) {
        return false;
      }

      // Date filters
      if (filters.dateFilter === "today") {
        return isToday(item.supplyDate);
      }

      if (filters.dateFilter === "dateRange") {
        const itemDate = new Date(item.supplyDate);
        const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
        const toDate = filters.toDate ? new Date(filters.toDate) : null;

        if (fromDate && itemDate < fromDate) return false;
        if (toDate && itemDate > toDate) return false;
      }

      return true;
    });
  }, [suppliers, filters]);

  // Calculate summary statistics
  const summary = React.useMemo(() => {
    const totalSupplied = filteredData.reduce(
      (sum, item) => sum + item.suppliedKg,
      0
    );
    const totalSold = filteredData.reduce(
      (sum, item) => sum + item.amountSold,
      0
    );
    const totalRevenue = filteredData.reduce(
      (sum, item) => sum + item.amountSold * item.pricePerKg,
      0
    );
    const remainingStock = totalSupplied - totalSold;

    return { totalSupplied, totalSold, totalRevenue, remainingStock };
  }, [filteredData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      supplierName: "",
      dateFilter: "all",
      fromDate: "",
      toDate: "",
      fishType: "",
    });
  };

  const handleAddProduct = (newProduct) => {
    setSuppliers((prev) => [...prev, newProduct]);
    setAddModalOpen(false);
  };

  const getStockStatus = (supplied, sold) => {
    const remaining = supplied - sold;
    const percentage = (remaining / supplied) * 100;

    if (percentage === 0) return { status: "نفد المخزون", variant: "danger" };
    if (percentage <= 20) return { status: "مخزون منخفض", variant: "warning" };
    return { status: "متوفر", variant: "success" };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 rtl" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                إدارة موردي الأسماك
              </h1>
              <p className="text-gray-600 mt-1">
                تتبع الموردين ومخزون الأسماك والمبيعات
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download size={16} className="ml-2" />
                تصدير
              </Button>
              <Button>
                <RefreshCw size={16} className="ml-2" />
                تحديث
              </Button>
              <Button
                onClick={() => setAddModalOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus size={16} className="ml-2" />
                إضافة منتج مورد
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg border shadow-sm">
            <div className="text-xs lg:text-sm font-medium text-gray-500">
              إجمالي الموردة
            </div>
            <div className="text-lg lg:text-2xl font-bold text-gray-900">
              {summary.totalSupplied.toFixed(1)} كجم
            </div>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg border shadow-sm">
            <div className="text-xs lg:text-sm font-medium text-gray-500">
              إجمالي المباعة
            </div>
            <div className="text-lg lg:text-2xl font-bold text-green-600">
              {summary.totalSold.toFixed(1)} كجم
            </div>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg border shadow-sm">
            <div className="text-xs lg:text-sm font-medium text-gray-500">
              المخزون المتبقي
            </div>
            <div className="text-lg lg:text-2xl font-bold text-orange-600">
              {summary.remainingStock.toFixed(1)} كجم
            </div>
          </div>
          <div className="bg-white p-4 lg:p-6 rounded-lg border shadow-sm">
            <div className="text-xs lg:text-sm font-medium text-gray-500">
              إجمالي الإيرادات
            </div>
            <div className="text-lg lg:text-2xl font-bold text-blue-600">
              {summary.totalRevenue.toFixed(2)} ج.م
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">المرشحات</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                مسح الكل
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Supplier Name Searchable Dropdown */}
              <SearchableDropdown
                options={uniqueSuppliers}
                value={filters.supplierName}
                onChange={(value) => handleFilterChange("supplierName", value)}
                placeholder="اختر مورد..."
              />

              {/* Fish Type Filter */}
              <select
                value={filters.fishType}
                onChange={(e) => handleFilterChange("fishType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">جميع أنواع الأسماك</option>
                {uniqueFishTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              {/* Date Filter Type */}
              <select
                value={filters.dateFilter}
                onChange={(e) =>
                  handleFilterChange("dateFilter", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع التواريخ</option>
                <option value="today">اليوم فقط</option>
                <option value="dateRange">نطاق زمني</option>
              </select>

              {/* From Date */}
              {filters.dateFilter === "dateRange" && (
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) =>
                    handleFilterChange("fromDate", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {/* To Date */}
              {filters.dateFilter === "dateRange" && (
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange("toDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </div>

          {/* Results Info */}
          <div className="px-6 py-3 bg-gray-50 border-b">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>عرض {filteredData.length} مورد</span>
              <span>
                {filters.dateFilter === "today" && "توريدات اليوم"}
                {filters.dateFilter === "dateRange" &&
                  filters.fromDate &&
                  filters.toDate &&
                  `${formatDate(filters.fromDate)} - ${formatDate(
                    filters.toDate
                  )}`}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المورد
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نوع السمك
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ التوريد
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الكمية الموردة (كجم)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الكمية المباعة (كجم)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الكمية المتبقية
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    السعر/كجم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإيرادات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => {
                  const remaining = item.suppliedKg - item.amountSold;
                  const revenue = item.amountSold * item.pricePerKg;
                  const stockStatus = getStockStatus(
                    item.suppliedKg,
                    item.amountSold
                  );

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="font-medium text-gray-900">
                          {item.supplierName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-right">
                        {item.fishType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-right">
                        <div>{formatDate(item.supplyDate)}</div>
                        {isToday(item.supplyDate) && (
                          <Badge variant="success">اليوم</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 text-right">
                        {item.suppliedKg} كجم
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium text-right">
                        {item.amountSold} كجم
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-orange-600 font-medium text-right">
                        {remaining} كجم
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 text-right">
                        {item.pricePerKg.toFixed(2)} ج.م
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600 text-right">
                        {revenue.toFixed(2)} ج.م
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  لم يتم العثور على موردين يطابقون المرشحات
                </div>
                <Button variant="ghost" className="mt-2" onClick={clearFilters}>
                  مسح المرشحات لعرض جميع الموردين
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="إضافة منتج مورد جديد"
      >
        <AddSupplierProductForm
          onSubmit={handleAddProduct}
          onCancel={() => setAddModalOpen(false)}
          existingSuppliers={uniqueSuppliers}
        />
      </Modal>
    </div>
  );
}
