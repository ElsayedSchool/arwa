import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TopNavigation } from "../common/TopNavigation";
import { customerPaymentsApi } from "./api/customerPaymentsApi";
import type { CustomerPayment, Customer } from "./api/customerPaymentsApi";
import { CustomerPaymentsFilters } from "./components/CustomerPaymentsFilters";
import { CustomerPaymentsAnalytics } from "./components/CustomerPaymentsAnalytics";
import { CustomerPaymentsTable } from "./components/CustomerPaymentsTable";

interface DateRange {
  from: string;
  to: string;
}

const CustomerPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<CustomerPayment[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("today");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: "",
    to: "",
  });
  const [specificDate, setSpecificDate] = useState<string>("");

  // Load data
  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: {
        customerId?: string;
        dateFilter?: string;
        dateFrom?: string;
        dateTo?: string;
      } = {};

      if (selectedCustomerId) {
        filters.customerId = selectedCustomerId;
      }

      // Convert date filters to actual date ranges
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setDate(monthAgo.getDate() - 30);

      switch (dateFilter) {
        case "today":
          filters.dateFrom = today.toISOString().split("T")[0];
          filters.dateTo = today.toISOString().split("T")[0];
          break;
        case "yesterday":
          filters.dateFrom = yesterday.toISOString().split("T")[0];
          filters.dateTo = yesterday.toISOString().split("T")[0];
          break;
        case "week":
          filters.dateFrom = weekAgo.toISOString().split("T")[0];
          filters.dateTo = today.toISOString().split("T")[0];
          break;
        case "month":
          filters.dateFrom = monthAgo.toISOString().split("T")[0];
          filters.dateTo = today.toISOString().split("T")[0];
          break;
        case "specific":
          if (specificDate) {
            filters.dateFrom = specificDate;
            filters.dateTo = specificDate;
          }
          break;
        case "range":
          if (dateRange.from && dateRange.to) {
            filters.dateFrom = dateRange.from;
            filters.dateTo = dateRange.to;
          }
          break;
        case "all":
        default:
          // No date filter for "all"
          break;
      }

      const paymentsData = await customerPaymentsApi.getCustomerPayments(
        filters
      );
      setPayments(paymentsData);
    } catch (err) {
      setError("فشل في تحميل بيانات المدفوعات");
      console.error("Error loading payments:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCustomerId, dateFilter, dateRange, specificDate]);

  const loadCustomers = async () => {
    try {
      const customersData = await customerPaymentsApi.getCustomers();
      setCustomers(customersData);
    } catch (err) {
      console.error("Error loading customers:", err);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  // Calculate statistics
  const stats = useMemo(() => {
    const filteredPayments = payments;

    const totalPaid = filteredPayments.reduce(
      (sum, payment) =>
        sum +
        (typeof payment.amount === "number"
          ? payment.amount
          : parseFloat(payment.amount) || 0),
      0
    );
    const transactionCount = filteredPayments.length;
    const averagePayment =
      transactionCount > 0 ? totalPaid / transactionCount : 0;

    // Calculate pending amounts (this would need to be fetched from customer data)
    const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
    const pendingAmount = selectedCustomer
      ? typeof selectedCustomer.totalDue === "number"
        ? selectedCustomer.totalDue
        : parseFloat(selectedCustomer.totalDue) || 0
      : 0;

    return {
      totalPaid,
      transactionCount,
      averagePayment,
      pendingAmount,
    };
  }, [payments, selectedCustomerId, customers]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TopNavigation currentPage="customer-payments" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                مدفوعات العملاء
              </h1>
              <p className="text-gray-600 mt-2">
                عرض وسجل المدفوعات المالية للعملاء
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <CustomerPaymentsFilters
          selectedCustomerId={selectedCustomerId}
          onCustomerChange={setSelectedCustomerId}
          customerSearchTerm={customerSearchTerm}
          onCustomerSearchTermChange={setCustomerSearchTerm}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          specificDate={specificDate}
          onSpecificDateChange={setSpecificDate}
          customers={customers}
        />

        {/* Payments Stats */}
        <CustomerPaymentsAnalytics stats={stats} />

        {/* Payments Table */}
        <CustomerPaymentsTable
          payments={payments}
          loading={loading}
          error={error}
          onRetry={loadPayments}
        />
      </div>
    </div>
  );
};

export default CustomerPaymentsPage;
