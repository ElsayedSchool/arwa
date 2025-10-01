import React, { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  DollarSign,
  Fish,
} from "lucide-react";
import type { DeliveryUi } from "../api/deliveriesApi";

interface DeliveriesTableProps {
  data: DeliveryUi[];
  userRole: string;
  onViewDetails: (delivery: DeliveryUi) => void;
  onEdit: (delivery: DeliveryUi) => void;
  onDelete: (delivery: DeliveryUi) => void;
  onPriceDelivery: (delivery: DeliveryUi) => void;
}

export const DeliveriesTable: React.FC<DeliveriesTableProps> = ({
  data,
  userRole,
  onViewDetails,
  onEdit,
  onDelete,
  onPriceDelivery,
}) => {
  const isAdmin = userRole === "admin" || userRole === "owner";
  const isOwner = userRole === "owner";
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (deliveryId: string) => {
    setOpenDropdown(openDropdown === deliveryId ? null : deliveryId);
  };

  // Dropdown actions are inlined in buttons; keep toggle only

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

  // formatLastEdit no longer used in card view

  const formatMoney = (amount: number) =>
    `${(Number(amount) || 0).toLocaleString("ar-EG")} ج.م`;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          التوصيلات ({data.length})
        </h2>
      </div>

      {data.length === 0 ? (
        <div className="p-12 text-center">
          <TruckIconPlaceholder />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد توصيلات
          </h3>
          <p className="text-gray-600">
            لم يتم العثور على توصيلات تطابق الفلاتر المحددة
          </p>
        </div>
      ) : (
        <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((delivery) => {
            const items = delivery.fishTypes || [];
            const computedTotal = items.reduce(
              (sum, f) =>
                sum + (Number(f.weight) || 0) * (Number(f.pricePerKg) || 0),
              0
            );
            const total =
              computedTotal > 0
                ? computedTotal
                : Number(delivery.totalCost || 0);
            return (
              <div
                key={delivery.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {delivery.supplierName || "مورد غير محدد"}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        السائق: {delivery.driverName || "غير محدد"}
                      </div>
                    </div>
                    <div className="relative flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        {onViewDetails && (
                          <button
                            onClick={() => onViewDetails(delivery)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                            title="عرض التفاصيل"
                          >
                            <Eye size={16} className="text-gray-500" />
                          </button>
                        )}
                        {isOwner && (
                          <button
                            onClick={() => onPriceDelivery(delivery)}
                            className="p-2 hover:bg-gray-100 rounded-full"
                            title="تسعير التوصيل"
                          >
                            <DollarSign size={16} className="text-gray-500" />
                          </button>
                        )}
                        <button
                          onClick={() => toggleDropdown(delivery.id)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                          title="المزيد"
                        >
                          <MoreVertical size={16} className="text-gray-500" />
                        </button>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {formatRelativeDate(delivery.deliveryDate)}{" "}
                        {delivery.deliveryTime
                          ? `- ${delivery.deliveryTime}`
                          : ""}
                      </div>

                      {openDropdown === delivery.id && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            {onViewDetails && (
                              <button
                                onClick={() => {
                                  onViewDetails(delivery);
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Eye size={16} className="ml-2" />
                                تفاصيل التوصيل
                              </button>
                            )}
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  onEdit(delivery);
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit size={16} className="ml-2" />
                                تعديل التوصيل
                              </button>
                            )}
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  onDelete(delivery);
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} className="ml-2" />
                                حذف التوصيل
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                      <div className="text-[11px] text-gray-600">
                        إجمالي السعر
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatMoney(total || delivery.totalCost)}
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                      <div className="text-[11px] text-gray-600">
                        إجمالي الوزن
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {Number(delivery.totalWeight || 0)} كجم
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded p-2 text-center">
                      <div className="text-[11px] text-gray-600">
                        حالة الدفع
                      </div>
                      <div className="text-xs font-medium">
                        {delivery.paymentStatus === "paid" ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700">
                            مدفوع
                          </span>
                        ) : delivery.paymentStatus === "partial" ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                            مدفوع جزئي
                          </span>
                        ) : delivery.paymentStatus === "unpaid" ? (
                          <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-700">
                            غير مدفوع
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                            غير متوفر
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Items */}
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Fish className="h-4 w-4 ml-2" />
                    تفاصيل التوصيل
                  </h4>
                  <div className="space-y-3">
                    {items.length ? (
                      items.slice(0, 3).map((fish, idx) => {
                        const itemTotal =
                          (Number(fish.weight) || 0) *
                          (Number(fish.pricePerKg) || 0);
                        return (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between items-center gap-3">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">{`${fish.weight} ${fish.type}`}</div>
                              </div>
                              <div>
                                {itemTotal > 0 ? (
                                  <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                    {itemTotal.toFixed(2)} ج.م
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
                        لا توجد عناصر في هذا التوصيل
                      </div>
                    )}
                    {items.length > 3 && (
                      <div className="pt-1">
                        <button
                          onClick={() =>
                            onViewDetails && onViewDetails(delivery)
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <Eye size={14} /> عرض المزيد من التفاصيل (
                          {items.length - 3} عناصر إضافية)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Simple placeholder icon for empty state without importing another icon
const TruckIconPlaceholder = () => (
  <svg
    className="h-12 w-12 text-gray-400 mx-auto mb-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7h10v10H3zM13 9h4l4 4v4h-8V9zM5 21a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"
    />
  </svg>
);
