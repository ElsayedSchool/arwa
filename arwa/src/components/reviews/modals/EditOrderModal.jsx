import React from "react";
import { X, Save } from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

export const EditOrderModal = ({ order, setOrder, userRole, onSave, onCancel }) => {
  const fishTypes = ["بلطي", "دنيس", "مبروك", "بوري", "قاروص", "سردين", "تونة", "سلمون"];
  const suppliers = ["مورد الأسماك الطازجة", "شركة البحر الأبيض", "مزرعة الأسماك الذهبية"];
  const statuses = ["قيد المراجعة", "تم التأكيد", "ملغي"];

  const handleInputChange = (field, value) => {
    setOrder(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">تعديل الطلب</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم العميل
                </label>
                <Input
                  value={order.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <Input
                  value={order.clientPhone}
                  onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                />
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع السمك
                </label>
                <select
                  value={order.fishType}
                  onChange={(e) => handleInputChange('fishType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {fishTypes.map((fish) => (
                    <option key={fish} value={fish}>{fish}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكمية (كجم)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={order.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المورد
                </label>
                <select
                  value={order.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {suppliers.map((supplier) => (
                    <option key={supplier} value={supplier}>{supplier}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  حالة الطلب
                </label>
                <select
                  value={order.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {userRole === "admin" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر (ج.م/كجم)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={order.price || ''}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الإجمالي (ج.م)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={order.totalAmount || ''}
                    onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ملاحظات
              </label>
              <textarea
                rows={3}
                value={order.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onCancel}>
            إلغاء
          </Button>
          <Button onClick={onSave}>
            <Save size={16} className="ml-2" />
            حفظ التغييرات
          </Button>
        </div>
      </div>
    </div>
  );
};