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
  selectedFishType: string;
  onSelectedFishTypeChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  supplierNames: string[];
  typeNames: string[];
  onExportData: () => void;
  onClearFilters: () => void;
}

export const DeliveriesFilters: React.FC<DeliveriesFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  selectedSupplier,
  onSelectedSupplierChange,
  selectedFishType,
  onSelectedFishTypeChange,
  dateFilter,
  onDateFilterChange,
  dateRange,
  onDateRangeChange,
  supplierNames,
  typeNames,
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

        {/* Fish Type Filter */}
        <select
          value={selectedFishType}
          onChange={(e) => onSelectedFishTypeChange(e.target.value)}
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
        selectedFishType ||
        dateFilter !== "all" ||
        dateRange.from ||
        dateRange.to) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && <Badge variant="default">البحث: {searchTerm}</Badge>}
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
          {dateRange.to && <Badge variant="default">إلى: {dateRange.to}</Badge>}
        </div>
      )}
    </div>
  );
};
