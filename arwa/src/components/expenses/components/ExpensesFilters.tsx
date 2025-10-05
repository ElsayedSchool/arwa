import React from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Search } from "lucide-react";

interface ExpensesFiltersProps {
  dateFilter: string;
  setDateFilter: (value: string) => void;
  from: string;
  setFrom: (value: string) => void;
  to: string;
  setTo: (value: string) => void;
  nameFilter: string;
  setNameFilter: (value: string) => void;
  descriptionFilter: string;
  setDescriptionFilter: (value: string) => void;
  onClearFilters: () => void;
}

export const ExpensesFilters: React.FC<ExpensesFiltersProps> = ({
  dateFilter,
  setDateFilter,
  from,
  setFrom,
  to,
  setTo,
  nameFilter,
  setNameFilter,
  descriptionFilter,
  setDescriptionFilter,
  onClearFilters,
}) => {
  const activeFilters = [];
  if (dateFilter !== "all") activeFilters.push(`تاريخ: ${dateFilter}`);
  if (from) activeFilters.push(`من: ${from}`);
  if (to) activeFilters.push(`إلى: ${to}`);
  if (nameFilter) activeFilters.push(`الاسم: ${nameFilter}`);
  if (descriptionFilter) activeFilters.push(`الوصف: ${descriptionFilter}`);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6" dir="rtl">
      <h3 className="text-lg font-medium text-gray-900 mb-4">البحث والفلترة</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="البحث بالاسم..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="pr-10"
          />
        </div>
        <Input
          placeholder="البحث بالوصف..."
          value={descriptionFilter}
          onChange={(e) => setDescriptionFilter(e.target.value)}
        />
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="all">جميع التواريخ</option>
          <option value="today">اليوم</option>
          <option value="week">هذا الأسبوع</option>
          <option value="month">هذا الشهر</option>
          <option value="range">فترة محددة</option>
        </select>
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="flex items-center gap-2"
        >
          مسح الفلاتر
        </Button>
      </div>
      {dateFilter === "range" && (
        <div className="flex gap-2 mb-4">
          <Input
            type="date"
            placeholder="من تاريخ"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Input
            type="date"
            placeholder="إلى تاريخ"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
      )}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.map((filter, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-700 text-sm"
            >
              {filter}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
