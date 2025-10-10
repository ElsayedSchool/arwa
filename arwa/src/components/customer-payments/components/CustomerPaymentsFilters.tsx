import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import type { Customer } from "../api/customerPaymentsApi";

interface DateRange {
  from: string;
  to: string;
}

interface CustomerPaymentsFiltersProps {
  selectedCustomerId?: string;
  onCustomerChange: (customerId: string) => void;
  customerSearchTerm: string;
  onCustomerSearchTermChange: (term: string) => void;
  dateFilter: string;
  onDateFilterChange: (filter: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  specificDate: string;
  onSpecificDateChange: (date: string) => void;
  customers: Customer[];
}

export const CustomerPaymentsFilters: React.FC<
  CustomerPaymentsFiltersProps
> = ({
  // selectedCustomerId, // Not used in this component, used in parent for API calls
  onCustomerChange,
  customerSearchTerm,
  onCustomerSearchTermChange,
  dateFilter,
  onDateFilterChange,
  dateRange,
  onDateRangeChange,
  specificDate,
  onSpecificDateChange,
  customers,
}) => {
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const customerInputRef = useRef<HTMLInputElement>(null);

  const handleDateFilterChange = (filter: string) => {
    onDateFilterChange(filter);
    if (filter !== "range") {
      onDateRangeChange({ from: "", to: "" });
    }
    if (filter !== "specific") {
      onSpecificDateChange("");
    }
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      customer.phoneNumber.includes(customerSearchTerm)
  );

  const handleCustomerSelect = (customer: Customer) => {
    onCustomerChange(customer.id);
    onCustomerSearchTermChange(customer.name);
    setShowCustomerDropdown(false);
  };

  const handleCustomerInputChange = (value: string) => {
    onCustomerSearchTermChange(value);
    onCustomerChange(""); // Clear selection when typing
    setShowCustomerDropdown(true);
  };

  const clearCustomerSelection = () => {
    onCustomerChange("");
    onCustomerSearchTermChange("");
    setShowCustomerDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        customerInputRef.current &&
        !customerInputRef.current.contains(event.target as Node)
      ) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العميل
          </label>
          <div className="relative" ref={customerInputRef}>
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في العملاء..."
              className="w-full pr-10 pl-8 border border-gray-300 rounded-md px-3 py-2"
              value={customerSearchTerm}
              onChange={(e) => handleCustomerInputChange(e.target.value)}
              onFocus={() => setShowCustomerDropdown(true)}
            />
            {customerSearchTerm && (
              <button
                onClick={clearCustomerSelection}
                className="absolute left-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {showCustomerDropdown && filteredCustomers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-500">
                      {customer.phoneNumber}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            فلتر التاريخ
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={dateFilter}
            onChange={(e) => handleDateFilterChange(e.target.value)}
          >
            <option value="all">جميع التواريخ</option>
            <option value="today">اليوم</option>
            <option value="yesterday">أمس</option>
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="specific">يوم محدد</option>
            <option value="range">فترة محددة</option>
          </select>
        </div>

        {dateFilter === "specific" && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التاريخ المحدد
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={specificDate}
              onChange={(e) => onSpecificDateChange(e.target.value)}
            />
          </div>
        )}

        {dateFilter === "range" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                من تاريخ
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={dateRange.from}
                onChange={(e) =>
                  onDateRangeChange({ ...dateRange, from: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                إلى تاريخ
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={dateRange.to}
                onChange={(e) =>
                  onDateRangeChange({ ...dateRange, to: e.target.value })
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
