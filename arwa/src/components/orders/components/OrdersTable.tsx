import React, { useState } from "react";
import {
  Package,
  Edit,
  MoreVertical,
  Phone,
  Fish,
  Eye,
  Trash2,
  DollarSign,
} from "lucide-react";
import type { Order } from "../api/ordersApi";

// Helper to format date as Today/Yesterday/else formatted date
const formatRelativeDate = (raw?: string | Date): string => {
  if (!raw) return "تاريخ غير محدد";
  const d = new Date(raw);
  const today = new Date();
  const isSameDay =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  if (isSameDay) return "اليوم";

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();
  if (isYesterday) return "أمس";

  return d.toLocaleDateString("ar-EG");
};

interface OrdersTableProps {
  orders: Order[];
  dateFilter: string;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  onRemoveItem?: (orderId: string, itemId: string) => Promise<void>;
  onViewOrder?: (order: Order) => void;
  onPriceOrder?: (order: Order) => void;
  onPaymentOrder?: (order: Order) => void;
  onUpdatePrice?: (order: Order) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  dateFilter,
  onEditOrder,
  onDeleteOrder,
  onViewOrder,
  onPriceOrder,
  onPaymentOrder,
  onUpdatePrice,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (orderId: string) => {
    setOpenDropdown(openDropdown === orderId ? null : orderId);
  };

  // No per-item actions now; showing price state instead

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {dateFilter === "today"
            ? `طلبات اليوم (${orders.length})`
            : dateFilter === "week"
            ? `طلبات الأسبوع (${orders.length})`
            : dateFilter === "month"
            ? `طلبات الشهر (${orders.length})`
            : dateFilter === "range"
            ? `طلبات الفترة (${orders.length})`
            : `جميع الطلبات (${orders.length})`}
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد طلبات
          </h3>
          <p className="text-gray-600">
            لم يتم العثور على طلبات تطابق الفلاتر المحددة
          </p>
        </div>
      ) : (
        <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Order Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.customerName ||
                        order.customer?.name ||
                        "عميل غير محدد"}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Phone className="h-4 w-4 ml-1" />
                      {order.customerPhone ||
                        order.customer?.phoneNumber ||
                        "غير محدد"}
                    </div>
                  </div>
                  <div className="relative flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      {onViewOrder && (
                        <button
                          onClick={() => onViewOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                          title="عرض التفاصيل"
                        >
                          <Eye size={16} className="text-gray-500" />
                        </button>
                      )}
                      {onPriceOrder && (
                        <button
                          onClick={() => onPriceOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                          title="تسعير الطلب"
                        >
                          {/* Using Edit icon for pricing; can swap to a tag/money icon if desired */}
                          <Edit size={16} className="text-gray-500" />
                        </button>
                      )}
                      {onPaymentOrder && (
                        <button
                          onClick={() => onPaymentOrder(order)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                          title="إضافة دفعة"
                        >
                          <DollarSign size={16} className="text-gray-500" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleDropdown(order.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                        title="المزيد"
                      >
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {formatRelativeDate(order.createAt || order.date)}
                    </div>

                    {openDropdown === order.id && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          {onViewOrder && (
                            <button
                              onClick={() => {
                                onViewOrder(order);
                                setOpenDropdown(null);
                              }}
                              className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye size={16} className="ml-2" />
                              تفاصيل الطلب
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onEditOrder(order);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit size={16} className="ml-2" />
                            تعديل الطلب
                          </button>
                          {onUpdatePrice && (
                            <button
                              onClick={() => {
                                onUpdatePrice(order);
                                setOpenDropdown(null);
                              }}
                              className="flex items-center w-full text-right px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                            >
                              <DollarSign size={16} className="ml-2" />
                              تحديث السعر
                            </button>
                          )}
                          {onPaymentOrder && (
                            <button
                              onClick={() => {
                                onPaymentOrder(order);
                                setOpenDropdown(null);
                              }}
                              className="flex items-center w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                            >
                              <DollarSign size={16} className="ml-2" />
                              إضافة دفعة
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onDeleteOrder(order.id);
                              setOpenDropdown(null);
                            }}
                            className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} className="ml-2" />
                            حذف الطلب
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="bg-red-50 border border-red-200 rounded p-2 text-center">
                    <div className="text-[11px] text-red-600">الدين السابق</div>
                    <div className="text-sm font-semibold text-red-700">
                      {`${Number(order.totalDebt || 0).toFixed(2)} ج.م`}
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                    <div className="text-[11px] text-gray-600">سعر الطلب</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {`${Number(order.totalPrice || 0).toFixed(2)} ج.م`}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
                    <div className="text-[11px] text-green-600">المدفوع</div>
                    <div className="text-sm font-semibold text-green-700">
                      {`${Number(order.paid || 0).toFixed(2)} ج.م`}
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
                    <div className="text-[11px] text-blue-600">الخصم</div>
                    <div className="text-sm font-semibold text-blue-700">
                      {`${Number(order.discount || 0).toFixed(2)} ج.م`}
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded p-2 text-center">
                    <div className="text-[11px] text-orange-600">
                      الدين المحدث
                    </div>
                    <div className="text-sm font-semibold text-orange-700">
                      {`${Number(order.updatedDebt || 0).toFixed(2)} ج.م`}
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded p-2 text-center">
                    <div className="text-[11px] text-purple-600">
                      عدد العناصر
                    </div>
                    <div className="text-sm font-semibold text-purple-700">
                      {order.orderItems?.length || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Fish className="h-4 w-4 ml-2" />
                  تفاصيل الطلب
                </h4>
                <div className="space-y-3">
                  {order.orderItems?.length ? (
                    order.orderItems.slice(0, 3).map((item) => {
                      const price = Number(item.totalPrice ?? 0);
                      return (
                        <div
                          key={item.id}
                          className="bg-gray-50 rounded-lg p-3"
                        >
                          <div className="flex justify-between items-center gap-3">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                {`${item.amount} ${
                                  item.fishTypeName || item.fishTypeId || ""
                                }`}
                              </div>
                              {(item.SupplierName || item.SupplierId) && (
                                <div className="text-xs text-gray-600 mt-1">
                                  المورد: {item.SupplierName || item.SupplierId}
                                </div>
                              )}
                            </div>
                            <div>
                              {price > 0 ? (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                  {price.toFixed(2)} ج.م
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                  لم تسعر
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-4">
                      لا توجد عناصر في هذا الطلب
                    </div>
                  )}
                  {order.orderItems && order.orderItems.length > 3 && (
                    <div className="pt-1">
                      <button
                        onClick={() => onViewOrder && onViewOrder(order)}
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <Eye size={14} /> عرض المزيد من التفاصيل (
                        {order.orderItems.length - 3} عناصر إضافية)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
