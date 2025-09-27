import React from "react";
import { X, User, Package, Calendar, Phone, Mail } from "lucide-react";
import { Badge } from "../../common/Badge";
import { Button } from "../../ui/Button";

export const ViewOrderModal = ({ order, userRole, onClose }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "قيد المراجعة": return "warning";
      case "تم التأكيد": return "success";
      case "ملغي": return "error";
      default: return "default";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">تفاصيل الطلب</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <User size={16} className="ml-2" />
                معلومات العميل
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">الاسم:</span> {order.clientName}
                </p>
                <p className="flex items-center">
                  <Phone size={14} className="ml-1" />
                  <span className="font-medium">الهاتف:</span> {order.clientPhone}
                </p>
                {order.clientEmail && (
                  <p className="flex items-center">
                    <Mail size={14} className="ml-1" />
                    <span className="font-medium">البريد:</span> {order.clientEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Order Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Package size={16} className="ml-2" />
                تفاصيل الطلب
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">نوع السمك:</span> {order.fishType}
                </p>
                <p>
                  <span className="font-medium">الكمية:</span> {order.quantity} كجم
                </p>
                <p>
                  <span className="font-medium">المورد:</span> {order.supplier}
                </p>
                {userRole === "admin" && order.price && (
                  <p>
                    <span className="font-medium">السعر:</span> {order.price} ج.م/كجم
                  </p>
                )}
                {userRole === "admin" && order.totalAmount && (
                  <p>
                    <span className="font-medium">الإجمالي:</span> {order.totalAmount} ج.م
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Status and Date */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">حالة الطلب:</span>
                <Badge variant={getStatusVariant(order.status)} size="sm" className="mr-2">
                  {order.status}
                </Badge>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="ml-2 text-gray-400" />
                <span className="font-medium text-gray-700">تاريخ الطلب:</span>
                <span className="mr-2 text-gray-600">
                  {new Date(order.orderDate).toLocaleDateString("ar-EG")}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">ملاحظات</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button onClick={onClose}>
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
};