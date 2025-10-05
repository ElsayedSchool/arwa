import React from "react";
import { Modal } from "../../common/Modal";
import type { Order } from "../api/ordersApi";
import {
  Phone,
  Fish,
  CalendarDays,
  User,
  DollarSign,
  Package,
} from "lucide-react";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!order) return null;

  const createdAt = order.createAt || order.date;
  const dateLabel = createdAt
    ? new Date(createdAt as string).toLocaleString("ar-EG")
    : "غير محدد";

  const items = order.orderItems || [];
  const itemsCount = items.length;
  const totalItemsPrice = items.reduce(
    (sum, it) => sum + Number(it.totalPrice || 0),
    0
  );
  const unpricedCount = items.filter(
    (it) =>
      Number(it.totalPrice || 0) === 0 || Number(it.pricePerKilo || 0) === 0
  ).length;

  const money = (n: number) => `${n.toFixed(2)} ج.م`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل الطلب" size="lg">
      <div className="space-y-5">
        {/* Top meta info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-gray-700">
              <User className="h-4 w-4 ml-2" />
              <span className="font-medium">العميل:</span>
              <span className="mr-2">
                {order.customerName || order.customer?.name || "عميل غير محدد"}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center text-gray-700">
              <Phone className="h-4 w-4 ml-2" />
              <span className="font-medium">الهاتف:</span>
              <span className="mr-2">
                {order.customerPhone ||
                  order.customer?.phoneNumber ||
                  "غير محدد"}
              </span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
            <div className="flex items-center text-gray-700">
              <CalendarDays className="h-4 w-4 ml-2" />
              <span className="font-medium">التاريخ:</span>
              <span className="mr-2">{dateLabel}</span>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center text-gray-600 text-xs">
              <DollarSign className="h-4 w-4 ml-1" /> إجمالي الطلب
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {money(Number(order.totalPrice ?? totalItemsPrice))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="flex items-center text-gray-600 text-xs">
              <Package className="h-4 w-4 ml-1" /> عدد العناصر
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              {itemsCount}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-600">حالة التسعير</div>
            <div className="mt-1">
              {unpricedCount === 0 ? (
                <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium">
                  تم تسعير جميع العناصر
                </span>
              ) : (
                <span className="inline-block px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 text-xs font-medium">
                  {unpricedCount} عنصر غير مسعّر
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <DollarSign className="h-4 w-4 ml-2" />
            التفاصيل المالية
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-600">إجمالي الدين السابق</div>
              <div className="mt-1 text-lg font-semibold text-red-600">
                {money(Number(order.totalDebt || 0))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-600">المبلغ المدفوع</div>
              <div className="mt-1 text-lg font-semibold text-green-600">
                {money(Number(order.paid || 0))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-600">الخصم المطبق</div>
              <div className="mt-1 text-lg font-semibold text-blue-600">
                {money(Number(order.discount || 0))}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-600">الدين المحدث</div>
              <div className="mt-1 text-lg font-semibold text-orange-600">
                {money(Number(order.updatedDebt || 0))}
              </div>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Fish className="h-4 w-4 ml-2" />
            عناصر الطلب ({order.orderItems?.length || 0})
          </h4>
          {order.orderItems && order.orderItems.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-5 gap-0 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">
                <div>الصنف</div>
                <div>المورد</div>
                <div className="text-center">الكمية</div>
                <div className="text-center">سعر الكيلو</div>
                <div className="text-center">الإجمالي</div>
              </div>
              <div className="divide-y max-h-96 overflow-auto pr-1">
                {order.orderItems.map((item) => {
                  const pricePerKilo = Number(item.pricePerKilo || 0);
                  const total = Number(item.totalPrice || 0);
                  const unpriced = pricePerKilo === 0 || total === 0;
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-5 gap-0 items-center px-3 py-2 text-sm bg-white"
                    >
                      <div
                        className="truncate"
                        title={
                          item.fishTypeName || item.fishTypeId || undefined
                        }
                      >
                        {item.fishTypeName || item.fishTypeId || "—"}
                      </div>
                      <div
                        className="truncate"
                        title={
                          item.SupplierName || item.SupplierId || undefined
                        }
                      >
                        {item.SupplierName || item.SupplierId || "—"}
                      </div>
                      <div className="text-center">
                        {Number(item.amount || 0)}
                      </div>
                      <div className="text-center">
                        {unpriced ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">
                            لم تسعر
                          </span>
                        ) : (
                          money(pricePerKilo)
                        )}
                      </div>
                      <div className="text-center font-medium">
                        {unpriced ? "—" : money(total)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm py-4">
              لا توجد عناصر
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
