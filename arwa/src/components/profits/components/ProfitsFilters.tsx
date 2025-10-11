import React from "react";
import { Search, Download } from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

interface DateRange {
  from: string;
  to: string;
}

interface ProfitsFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onExportData: () => void;
  onClearFilters: () => void;
}

export const ProfitsFilters: React.FC<ProfitsFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  dateFilter,
  onDateFilterChange,
  dateRange,
  onDateRangeChange,
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            placeholder="البحث في التاريخ..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pr-10"
          />
        </div>

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

        {/* Placeholder for future filters */}
        <div></div>
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
        dateFilter !== "all" ||
        dateRange.from ||
        dateRange.to) && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">الفلاتر النشطة:</span>
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              بحث: {searchTerm}
            </span>
          )}
          {dateFilter !== "all" && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              تاريخ:{" "}
              {dateFilter === "today"
                ? "اليوم"
                : dateFilter === "week"
                ? "هذا الأسبوع"
                : dateFilter === "month"
                ? "هذا الشهر"
                : dateFilter === "range"
                ? "فترة محددة"
                : "جميع التواريخ"}
            </span>
          )}
          {dateRange.from && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              من: {dateRange.from}
            </span>
          )}
          {dateRange.to && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              إلى: {dateRange.to}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
