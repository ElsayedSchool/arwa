import React from "react";
import { Search } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

interface DateRange {
  from: string;
  to: string;
}

interface OrdersFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  phoneFilter: string;
  onPhoneFilterChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onClearFilters: () => void;
  unpricedOnly?: boolean;
  onUnpricedOnlyChange?: (value: boolean) => void;
}

export const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  searchTerm,
  onSearchTermChange,
  phoneFilter,
  onPhoneFilterChange,
  dateFilter,
  onDateFilterChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  unpricedOnly = false,
  onUnpricedOnlyChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">البحث والفلترة</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="البحث باسم العميل..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pr-10"
          />
        </div>
        <Input
          placeholder="البحث برقم الهاتف..."
          value={phoneFilter}
          onChange={(e) => onPhoneFilterChange(e.target.value)}
        />
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
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center text-sm text-gray-700 select-none">
            <input
              type="checkbox"
              className="ml-2 h-4 w-4"
              checked={unpricedOnly}
              onChange={(e) =>
                onUnpricedOnlyChange && onUnpricedOnlyChange(e.target.checked)
              }
            />
            عرض غير المسعّرة فقط
          </label>
          <Button variant="outline" onClick={onClearFilters} size="sm">
            مسح الفلاتر
          </Button>
        </div>
      </div>

      {/* Date Range Inputs */}
      {dateFilter === "range" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
};
