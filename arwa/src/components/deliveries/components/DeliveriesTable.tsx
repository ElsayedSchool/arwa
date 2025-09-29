import React, { useState } from "react";
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import type { DeliveryUi, FishTypeUi } from "../api/deliveriesApi";

interface DeliveriesTableProps {
  data: DeliveryUi[];
  userRole: string;
  onViewDetails: (delivery: DeliveryUi) => void;
  onEdit: (delivery: DeliveryUi) => void;
  onDelete: (delivery: DeliveryUi) => void;
}

export const DeliveriesTable: React.FC<DeliveriesTableProps> = ({
  data,
  userRole,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  const isAdmin = userRole === "admin" || userRole === "owner";
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (deliveryId: string) => {
    setOpenDropdown(openDropdown === deliveryId ? null : deliveryId);
  };

  const handleAction = (action: string, delivery: DeliveryUi) => {
    if (action === "view") onViewDetails(delivery);
    else if (action === "edit") onEdit(delivery);
    else if (action === "delete") onDelete(delivery);
    setOpenDropdown(null);
  };

  const formatDateTime = (date: string, time: string) => {
    const formattedDate = new Date(date).toLocaleDateString("ar-EG");
    return `${formattedDate} - ${time}`;
  };

  const formatLastEdit = (lastEditTime: string | null) => {
    if (!lastEditTime) return "-";
    const date = new Date(lastEditTime);
    return date.toLocaleString("ar-EG");
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المورد
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              السائق
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              تاريخ ووقت التوصيل
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              أنواع الأسماك والكميات
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              إجمالي الوزن
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              آخر تعديل
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((delivery: DeliveryUi) => (
            <tr key={delivery.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {delivery.supplierName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {delivery.driverName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDateTime(delivery.deliveryDate, delivery.deliveryTime)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="space-y-1">
                  {delivery.fishTypes?.map(
                    (fish: FishTypeUi, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>{fish.type}:</span>
                        <span className="font-medium">{fish.weight} كجم</span>
                      </div>
                    )
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {delivery.totalWeight} كجم
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatLastEdit(delivery.lastEditTime)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(delivery.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {openDropdown === delivery.id && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => handleAction("view", delivery)}
                          className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Eye size={16} className="ml-2" />
                          عرض التفاصيل
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleAction("edit", delivery)}
                              className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit size={16} className="ml-2" />
                              تعديل
                            </button>
                            <button
                              onClick={() => handleAction("delete", delivery)}
                              className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} className="ml-2" />
                              حذف
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد توصيلات متاحة</p>
        </div>
      )}
    </div>
  );
};
