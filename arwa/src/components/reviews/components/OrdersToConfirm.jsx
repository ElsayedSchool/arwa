import React, { useState } from "react";
import { Package, Calendar, Check, X, Edit } from "lucide-react";
import { Button } from "../../ui/Button";
import { Badge } from "../../common/Badge";
import { EditOrderModal } from "./EditOrderModal";

export const OrdersToConfirm = ({ orders, onApprove, onReject, onEdit }) => {
  const [editingOrder, setEditingOrder] = useState(null);

  const handleEditSave = (orderId, updatedData) => {
    onEdit(orderId, updatedData);
    setEditingOrder(null);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          لا توجد طلبات للمراجعة
        </h3>
        <p className="text-gray-600">
          لا توجد طلبات معلقة لهذا العميل
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Package size={20} className="ml-2" />
          الطلبات المطلوب تأكيدها ({orders.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                التاريخ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                نوع السمك
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الكمية
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                السعر
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الإجمالي
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Calendar size={16} className="ml-2 text-gray-400" />
                    {new Date(order.orderDate).toLocaleDateString("ar-EG")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.fishType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.quantity} كجم
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.price ? `${order.price} ج.م/كجم` : "غير محدد"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.totalAmount ? `${order.totalAmount} ج.م` : "غير محدد"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="warning" size="sm">
                    {order.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onApprove(order.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Check size={16} className="ml-1" />
                      تأكيد
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingOrder(order)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Edit size={16} className="ml-1" />
                      تعديل
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReject(order.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={16} className="ml-1" />
                      رفض
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          setOrder={setEditingOrder}
          userRole="admin"
          onSave={() => handleEditSave(editingOrder.id, editingOrder)}
          onCancel={() => setEditingOrder(null)}
        />
      )}
    </div>
  );
};