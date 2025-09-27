import React, { useState, useMemo } from "react";
import { Calendar, Package } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

interface Order {
  id: number;
  orderDate: string;
  fishType: string;
  quantity: number;
  totalAmount?: number;
  supplier: string;
  status: string;
}

interface DailySummary {
  date: string;
  orders: Order[];
  totalCost: number;
  totalQuantity: number;
  fishTypes: string[];
}

interface ClientOrderHistoryProps {
  orders: Order[];
  clientName: string;
}

export const ClientOrderHistory: React.FC<ClientOrderHistoryProps> = ({
  orders,
  clientName,
}) => {
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [specificDate, setSpecificDate] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Filter orders based on date criteria
  const filteredOrders = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    return orders.filter((order: Order) => {
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
    const grouped = filteredOrders.reduce(
      (acc: Record<string, DailySummary>, order: Order) => {
        const date = order.orderDate;
        if (!acc[date]) {
          acc[date] = {
            date,
            orders: [],
            totalCost: 0,
            totalQuantity: 0,
            fishTypes: [],
          };
        }

        acc[date].orders.push(order);
        acc[date].totalCost += order.totalAmount || 0;
        acc[date].totalQuantity += order.quantity || 0;
        if (!acc[date].fishTypes.includes(order.fishType)) {
          acc[date].fishTypes.push(order.fishType);
        }

        return acc;
      },
      {}
    );

    // Convert to array and sort by date (newest first)
    return Object.values(grouped).sort(
      (a: DailySummary, b: DailySummary) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredOrders]);

  const toggleDayExpansion = (date: string) => {
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
              variant={dateFilter === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setDateFilter("all")}
            >
              جميع الطلبات
            </Button>
            <Button
              variant={dateFilter === "today" ? "primary" : "outline"}
              size="sm"
              onClick={() => setDateFilter("today")}
            >
              اليوم
            </Button>
            <Button
              variant={dateFilter === "specific" ? "primary" : "outline"}
              size="sm"
              onClick={() => setDateFilter("specific")}
            >
              تاريخ محدد
            </Button>
            <Button
              variant={dateFilter === "range" ? "primary" : "outline"}
              size="sm"
              onClick={() => setDateFilter("range")}
            >
              نطاق زمني
            </Button>
          </div>

          {dateFilter === "specific" && (
            <Input
              type="date"
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              className="max-w-xs"
            />
          )}

          {dateFilter === "range" && (
            <div className="flex gap-2">
              <Input
                type="date"
                placeholder="من تاريخ"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                type="date"
                placeholder="إلى تاريخ"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {dailySummaries.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد طلبات في الفترة المحددة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dailySummaries.map((summary: DailySummary) => (
              <div
                key={summary.date}
                className="border border-gray-200 rounded-lg"
              >
                <div
                  className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleDayExpansion(summary.date)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 ml-2" />
                      <span className="font-medium text-gray-900">
                        {new Date(summary.date).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-gray-600">
                        {summary.orders.length} طلب • {summary.totalQuantity}{" "}
                        كجم
                      </div>
                      <div className="font-medium text-gray-900">
                        {summary.totalCost.toFixed(2)} ج.م
                      </div>
                    </div>
                  </div>
                </div>

                {expandedDay === summary.date && (
                  <div className="p-4 border-t border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
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
                          {summary.orders.map((order: Order) => (
                            <tr key={order.id}>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {order.fishType}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {order.quantity} كجم
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-900">
                                {order.totalAmount && order.quantity
                                  ? (
                                      order.totalAmount / order.quantity
                                    ).toFixed(2)
                                  : "غير محدد"}{" "}
                                ج.م/كجم
                              </td>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                {order.totalAmount
                                  ? order.totalAmount.toFixed(2)
                                  : "غير محدد"}{" "}
                                ج.م
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
