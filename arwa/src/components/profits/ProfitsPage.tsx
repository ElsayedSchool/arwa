import React, { useState, useEffect, useMemo } from "react";
import { TopNavigation } from "../common/TopNavigation";
import { ProfitsFilters } from "./components/ProfitsFilters";
import ProfitsAnalysis from "./components/ProfitsAnalysis";
import ProfitsTable from "./components/ProfitsTable";
import { dailyProfitApi } from "./api/dailyProfitApi";
import type { DailyProfit } from "./api/dailyProfitApi";

interface DateRange {
  from: string;
  to: string;
}

const ProfitsPage: React.FC = () => {
  const [profitsData, setProfitsData] = useState<DailyProfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });

  // Load initial data
  useEffect(() => {
    loadProfitsData();
  }, []);

  const loadProfitsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dailyProfitApi.getAll();
      setProfitsData(data);
    } catch (err) {
      setError("فشل في تحميل بيانات الأرباح");
      console.error("Error loading profits data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on current filters
  const filteredProfits = useMemo(() => {
    let filtered = [...profitsData];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (profit) =>
          new Date(profit.profitDate)
            .toLocaleDateString("ar-EG")
            .includes(searchTerm) || profit.profitDate.includes(searchTerm)
      );
    }

    // Date filter
    const today = new Date();
    filtered = filtered.filter((profit) => {
      const profitDate = new Date(profit.profitDate);

      if (dateFilter === "today") {
        return profitDate.toDateString() === today.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return profitDate >= weekAgo;
      } else if (dateFilter === "month") {
        return (
          profitDate.getMonth() === today.getMonth() &&
          profitDate.getFullYear() === today.getFullYear()
        );
      } else if (dateFilter === "range") {
        if (dateRange.from && profitDate < new Date(dateRange.from))
          return false;
        if (dateRange.to && profitDate > new Date(dateRange.to)) return false;
      }

      return true;
    });

    return filtered;
  }, [profitsData, searchTerm, dateFilter, dateRange]);

  // Handle filter changes
  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    if (value !== "range") {
      setDateRange({ from: "", to: "" });
    }
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setDateFilter("all");
    setDateRange({ from: "", to: "" });
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    console.log("Export functionality to be implemented");
  };

  const handleCalculateProfit = async (date: string) => {
    try {
      await dailyProfitApi.calculateForDate(date);
      // Reload data after calculation
      await loadProfitsData();
    } catch (err) {
      console.error("Error calculating profit for date:", date, err);
      setError("فشل في حساب الربح لهذا التاريخ");
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={loadProfitsData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TopNavigation currentPage="profits" />
          <h1 className="text-3xl font-bold text-gray-900">الأرباح اليومية</h1>
          <p className="text-gray-600 mt-2">
            متابعة الأرباح والإيرادات اليومية
          </p>
        </div>

        {/* Filters */}
        <ProfitsFilters
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          dateFilter={dateFilter}
          onDateFilterChange={handleDateFilterChange}
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          onExportData={handleExportData}
          onClearFilters={handleClearFilters}
        />

        {/* Analysis */}
        <ProfitsAnalysis profitsData={filteredProfits} />

        {/* Table */}
        <ProfitsTable
          profitsData={filteredProfits}
          onCalculateProfit={handleCalculateProfit}
        />
      </div>
    </div>
  );
};

export { ProfitsPage };
