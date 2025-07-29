import React, { useState } from "react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { DollarSign, Calendar, CreditCard, MoreVertical } from "lucide-react";

export const SuppliersTable = ({
  data,
  getStockStatus,
  onEditPayment,
  onEditPrice,
  onEditDueDate,
  userRole,
  getPaymentStatusText,
  getPaymentStatusVariant,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (itemId) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  const handleAction = (action, item) => {
    if (action === "payment") onEditPayment(item);
    else if (action === "price") onEditPrice(item);
    else if (action === "dueDate") onEditDueDate(item);
    setOpenDropdown(null);
  };

  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">لا توجد بيانات للعرض</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المورد
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              نوع السمك
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              تاريخ التوريد
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الكمية المورّدة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الكمية المباعة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              السعر/كجم
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              التكلفة الإجمالية
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المبلغ المدفوع
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              حالة الدفع
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              تاريخ الاستحقاق
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => {
            const totalCost =
              item.totalCost || item.suppliedKg * item.pricePerKg || 0;
            const amountPaid = item.amountPaid || 0;
            const remainingAmount = totalCost - amountPaid;

            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.supplierName || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.fishType || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.supplyDate
                    ? new Date(item.supplyDate).toLocaleDateString("ar-EG")
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(item.suppliedKg || 0).toFixed(1)} كجم
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(item.amountSold || 0).toFixed(1)} كجم
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(item.pricePerKg || 0).toFixed(2)} ج.م
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {totalCost.toFixed(2)} ج.م
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {amountPaid.toFixed(2)} ج.م
                  {remainingAmount > 0 && (
                    <div className="text-xs text-red-600">
                      متبقي: {remainingAmount.toFixed(2)} ج.م
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge
                    variant={getPaymentStatusVariant(
                      item.paymentStatus || "unpaid"
                    )}
                  >
                    {getPaymentStatusText(item.paymentStatus || "unpaid")}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.dueDate
                    ? new Date(item.dueDate).toLocaleDateString("ar-EG")
                    : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>

                    {openDropdown === item.id && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => handleAction("payment", item)}
                            className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <DollarSign size={16} className="ml-2" />
                            تعديل الدفع
                          </button>
                          {(userRole === "owner" || userRole === "admin") && (
                            <button
                              onClick={() => handleAction("price", item)}
                              className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <CreditCard size={16} className="ml-2" />
                              تعديل السعر
                            </button>
                          )}
                          <button
                            onClick={() => handleAction("dueDate", item)}
                            className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Calendar size={16} className="ml-2" />
                            تاريخ الاستحقاق
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
