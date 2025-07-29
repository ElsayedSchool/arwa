import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { CreditCard } from "lucide-react";

export const EditPaymentModal = ({ isOpen, onClose, onSave, supplier }) => {
  const [formData, setFormData] = useState({
    amountPaid: "",
    dueDate: "",
    paymentStatus: "unpaid",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplier) {
      setFormData({
        amountPaid: supplier.amountPaid?.toString() || "0",
        dueDate: supplier.dueDate || "",
        paymentStatus: supplier.paymentStatus || "unpaid",
      });
    }
  }, [supplier]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-calculate payment status
    if (field === "amountPaid" && supplier) {
      const paidAmount = parseFloat(value) || 0;
      let status = "unpaid";
      if (paidAmount >= supplier.totalCost) {
        status = "paid";
      } else if (paidAmount > 0) {
        status = "partial";
      }
      setFormData((prev) => ({ ...prev, paymentStatus: status }));
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.amountPaid < 0) {
      newErrors.amountPaid = "المبلغ المدفوع لا يمكن أن يكون سالباً";
    }

    if (parseFloat(formData.amountPaid) > supplier.totalCost) {
      newErrors.amountPaid =
        "المبلغ المدفوع لا يمكن أن يكون أكبر من التكلفة الإجمالية";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const paymentData = {
        amountPaid: parseFloat(formData.amountPaid || 0),
        dueDate: formData.dueDate || null,
        paymentStatus: formData.paymentStatus,
      };
      onSave(supplier.id, paymentData);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!supplier) return null;

  const remainingAmount =
    supplier.totalCost - parseFloat(formData.amountPaid || 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="تعديل حالة الدفع">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">تفاصيل المعاملة</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">المورد: </span>
              <span className="font-medium">{supplier.supplierName}</span>
            </div>
            <div>
              <span className="text-gray-600">نوع السمك: </span>
              <span className="font-medium">{supplier.fishType}</span>
            </div>
            <div>
              <span className="text-gray-600">الكمية: </span>
              <span className="font-medium">{supplier.suppliedKg} كجم</span>
            </div>
            <div>
              <span className="text-gray-600">التكلفة الإجمالية: </span>
              <span className="font-medium">
                {supplier.totalCost.toFixed(2)} ج.م
              </span>
            </div>
          </div>
        </div>

        <Input
          label="المبلغ المدفوع (ج.م)"
          type="number"
          step="0.01"
          value={formData.amountPaid}
          onChange={(e) => handleInputChange("amountPaid", e.target.value)}
          placeholder="أدخل المبلغ المدفوع"
          error={errors.amountPaid}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            حالة الدفع
          </label>
          <select
            value={formData.paymentStatus}
            onChange={(e) => handleInputChange("paymentStatus", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="unpaid">غير مدفوع</option>
            <option value="partial">مدفوع جزئ</option>
            <option value="paid">مدفوع بالكامل</option>
          </select>
        </div>

        {formData.paymentStatus !== "paid" && (
          <Input
            label="تاريخ الاستحقاق (اختياري)"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
          />
        )}

        {remainingAmount > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              المبلغ المتبقي:{" "}
              <span className="font-bold">
                {remainingAmount.toFixed(2)} ج.م
              </span>
            </p>
          </div>
        )}

        {/* Payment History Table */}
        {supplier.paymentHistory && supplier.paymentHistory.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <CreditCard className="h-4 w-4 ml-2" />
              سجل المدفوعات
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ المدفوع
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ الدفع
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ملاحظات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {supplier.paymentHistory.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                        {payment.amount.toFixed(2)} ج.م
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.date).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                        {payment.notes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">إجمالي المدفوعات:</span>
                <span className="font-medium text-gray-900">
                  {supplier.paymentHistory
                    .reduce((sum, payment) => sum + payment.amount, 0)
                    .toFixed(2)}{" "}
                  ج.م
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button onClick={handleSubmit} className="flex-1">
            حفظ التغييرات
          </Button>
          <Button variant="outline" onClick={handleClose} className="flex-1">
            إلغاء
          </Button>
        </div>
      </div>
    </Modal>
  );
};
