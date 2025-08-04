import React from "react";
import { DollarSign, Calculator } from "lucide-react";
import { Input } from "../../ui/Input";

export const PaymentEntry = ({ paymentData, setPaymentData, totalDue }) => {
  const amountPaid = parseFloat(paymentData.amountPaid) || 0;
  const remainingBalance = totalDue - amountPaid;

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <DollarSign size={20} className="ml-2" />
        إدخال الدفعة
      </h3>

      <div className="space-y-4">
        {/* Amount Paid */}
        <Input
          label="المبلغ المدفوع اليوم"
          type="number"
          step="0.01"
          value={paymentData.amountPaid}
          onChange={(e) => handleInputChange("amountPaid", e.target.value)}
          placeholder="0.00"
        />

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            طريقة الدفع
          </label>
          <select
            value={paymentData.paymentMethod}
            onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cash">نقدي</option>
            <option value="card">بطاقة ائتمان</option>
            <option value="bank_transfer">تحويل بنكي</option>
            <option value="check">شيك</option>
          </select>
        </div>

        {/* Payment Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ملاحظات الدفع
          </label>
          <textarea
            rows={2}
            value={paymentData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="ملاحظات إضافية..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Calculation Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Calculator size={16} className="ml-2 text-gray-600" />
            <span className="font-medium text-gray-900">حساب الرصيد</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">إجمالي المطلوب:</span>
              <span className="font-medium">{totalDue.toFixed(2)} ج.م</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">المبلغ المدفوع:</span>
              <span className="font-medium text-green-600">
                {amountPaid.toFixed(2)} ج.م
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="font-medium text-gray-900">الرصيد المتبقي:</span>
              <span className={`font-bold ${remainingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {remainingBalance.toFixed(2)} ج.م
              </span>
            </div>
          </div>

          {/* Payment Status */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            {remainingBalance === 0 && amountPaid > 0 && (
              <div className="text-sm text-green-600 font-medium">
                ✓ تم السداد بالكامل
              </div>
            )}
            {remainingBalance > 0 && amountPaid > 0 && (
              <div className="text-sm text-yellow-600 font-medium">
                ⚠ دفع جزئي - يتبقى {remainingBalance.toFixed(2)} ج.م
              </div>
            )}
            {amountPaid === 0 && (
              <div className="text-sm text-gray-600">
                لم يتم إدخال أي دفعة
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};