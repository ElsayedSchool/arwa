import React, { useState, useMemo } from "react";
import { Calendar, Package, Filter, Eye } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

export const ClientOrderHistory = ({ orders, clientName }) => {
  const [dateFilter, setDateFilter] = useState("all"); // all, today, specific, range
  const [specificDate, setSpecificDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedDay, setExpandedDay] = useState(null);

  // Filter orders based on date criteria
  const filteredOrders = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    
    return orders.filter(order => {
      switch (dateFilter) {
        case "today":
          return order.orderDate === today;
        case "specific":
          return specificDate ? order.orderDate === specificDate : true;
        case "range":
          if (startDate && endDate) {
            return order.orderDate >= startDate && order.orderDate <= endDate;
          }
          return true;
        default:
          return true;
      }
    });
  }, [orders, dateFilter, specificDate, startDate, endDate]);

  // Group orders by date and calculate daily summaries
  const dailySummaries = useMemo(() => {
    const grouped = filteredOrders.reduce((acc, order) => {
      const date = order.orderDate;
      if (!acc[date]) {
        acc[date] = {
          date,
          orders: [],
          totalCost: 0,
          totalQuantity: 0,
          fishTypes: new Set()
        };
      }
      
      acc[date].orders.push(order);
      acc[date].totalCost += order.totalAmount || 0;
      acc[date].totalQuantity += order.quantity || 0;
      acc[date].fishTypes.add(order.fishType);
      
      return acc;
    }, {});

    // Convert to array and sort by date (newest first)
    return Object.values(grouped)
      .map(summary => ({
        ...summary,
        fishTypes: Array.from(summary.fishTypes)
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredOrders]);

  const toggleDayExpansion = (date) => {
    setExpandedDay(expandedDay === date ? null : date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center mb-4">
          <Package className="h-5 w-5 text-gray-500 ml-2" />
          <h3 className="text-lg font-medium text-gray-900">
            تاريخ طلبات {clientName}
          </h3>
        </div>

        {/* Date Filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={dateFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateFilter("all")}
            >
              جميع الطلبات
            </Button>
            <Button
              variant={dateFilter === "today" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateFilter("today")}
            >
              اليوم
            </Button>
            <Button
              variant={dateFilter === "specific" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateFilter("specific")}
            >
              يوم محدد
            </Button>
            <Button
              variant={dateFilter === "range" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateFilter("range")}
            >
              فترة زمنية
            </Button>
          </div>

          {/* Specific Date Input */}
          {dateFilter === "specific" && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <Input
                type="date"
                value={specificDate}
                onChange={(e) => setSpecificDate(e.target.value)}
                className="w-auto"
              />
            </div>
          )}

          {/* Date Range Inputs */}
          {dateFilter === "range" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">من:</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-auto"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">إلى:</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-auto"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Daily Summaries */}
      <div className="p-6">
        {dailySummaries.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              لا توجد طلبات
            </h3>
            <p className="text-gray-600">
              لا توجد طلبات تطابق المعايير المحددة
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dailySummaries.map((summary) => (
              <div key={summary.date} className="border border-gray-200 rounded-lg">
                {/* Daily Summary Header */}
                <div
                  className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleDayExpansion(summary.date)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-500 ml-2" />
                      <span className="font-medium text-gray-900">
                        {new Date(summary.date).toLocaleDateString("ar-EG", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{summary.orders.length} طلب</span>
                      <span>{summary.totalQuantity} كجم</span>
                      <span className="font-medium text-green-600">
                        {summary.totalCost.toFixed(2)} ج.م
                      </span>
                      <Eye size={16} className="text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Fish Types Summary */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {summary.fishTypes.map((fishType, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {fishType}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedDay === summary.date && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              رقم الطلب
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              نوع السمك
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              الكمية
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              السعر
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              الإجمالي
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              المورد
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {summary.orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {order.orderNumber}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {order.fishType}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {order.quantity} كجم
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {order.price} ج.م
                              </td>
                              <td className="px-4 py-2 text-sm font-medium text-green-600">
                                {order.totalAmount} ج.م
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-500">
                                {order.supplier}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};