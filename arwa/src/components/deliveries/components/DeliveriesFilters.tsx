import React from "react";
import { Search, Download } from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Badge } from "../../common/Badge";

interface DateRange {
  from: string;
  to: string;
}

interface DeliveriesFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedSupplier: string;
  onSelectedSupplierChange: (value: string) => void;
  selectedBaseType: string;
  onSelectedBaseTypeChange: (value: string) => void;
  selectedSubtype: string;
  onSelectedSubtypeChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  supplierNames: string[];
  baseTypeNames: string[];
  subtypeNames: string[];
  onExportData: () => void;
  onClearFilters: () => void;
}

export const DeliveriesFilters: React.FC<DeliveriesFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  selectedSupplier,
  onSelectedSupplierChange,
  selectedBaseType,
  onSelectedBaseTypeChange,
  selectedSubtype,
  onSelectedSubtypeChange,
  dateFilter,
  onDateFilterChange,
  dateRange,
  onDateRangeChange,
  supplierNames,
  baseTypeNames,
  subtypeNames,
  onExportData,
  onClearFilters,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">البحث والتصفية</h3>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onExportData} size="sm">
            <Download size={16} className="ml-2" />
            تصدير البيانات
          </Button>
          <Button variant="outline" onClick={onClearFilters} size="sm">
            مسح الفلاتر
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            placeholder="البحث في المورد أو السائق..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Supplier Filter */}
        <select
          value={selectedSupplier}
          onChange={(e) => onSelectedSupplierChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">جميع الموردين</option>
          {supplierNames.map((supplier) => (
            <option key={supplier} value={supplier}>
              {supplier}
            </option>
          ))}
        </select>

        {/* Base Fish Type Filter */}
        <select
          value={selectedBaseType}
          onChange={(e) => onSelectedBaseTypeChange(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">جميع الأنواع الأساسية</option>
          {baseTypeNames.map((baseType) => (
            <option key={baseType} value={baseType}>
              {baseType}
            </option>
          ))}
        </select>

        {/* Subtype Filter */}
        <select
          value={selectedSubtype}
          onChange={(e) => onSelectedSubtypeChange(e.target.value)}
          disabled={!selectedBaseType}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {selectedBaseType ? "جميع الأنواع الفرعية" : "اختر نوع أساسي أولاً"}
          </option>
          {subtypeNames.map((subtype) => (
            <option key={subtype} value={subtype}>
              {subtype}
            </option>
          ))}
        </select>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
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
              onDateRangeChange({ ...dateRange, from: e.target.value })
            }
          />
          <Input
            label="إلى تاريخ"
            type="date"
            value={dateRange.to}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, to: e.target.value })
            }
          />
        </div>
      )}

      {/* Active Filters Display */}
      {(searchTerm ||
        selectedSupplier ||
        selectedBaseType ||
        selectedSubtype ||
        dateFilter !== "all" ||
        dateRange.from ||
        dateRange.to) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && <Badge variant="default">البحث: {searchTerm}</Badge>}
          {selectedSupplier && (
            <Badge variant="default">المورد: {selectedSupplier}</Badge>
          )}
          {selectedBaseType && (
            <Badge variant="default">النوع الأساسي: {selectedBaseType}</Badge>
          )}
          {selectedSubtype && (
            <Badge variant="default">النوع الفرعي: {selectedSubtype}</Badge>
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
          {dateRange.to && <Badge variant="default">إلى: {dateRange.to}</Badge>}
        </div>
      )}
    </div>
  );
};
