import React, { useState, useEffect } from "react";
import { Modal } from "../../common/Modal";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import type { Order } from "../api/ordersApi";
import { DollarSign } from "lucide-react";

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (paymentData: {
    totalDebt: number;
    orderPrice: number;
    paid: number;
    discount: number;
    updatedDebt: number;
  }) => Promise<void>;
}

export const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  isOpen,
  onClose,
  order,
  onSave,
}) => {
  const [paid, setPaid] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");

  const totalDebt = Number(order?.totalDebt || 0);
  const orderPrice = Number(order?.totalPrice || 0);
  const paidAmount = Number(paid) || 0;
  const discountAmount = Number(discount) || 0;

  // Calculate updated debt: totalDebt + orderPrice - paid - discount
  const updatedDebt = Math.max(
    0,
    totalDebt + orderPrice - paidAmount - discountAmount
  );

  useEffect(() => {
    if (isOpen && order) {
      // Reset form when modal opens
      setPaid("");
      setDiscount("");
    }
  }, [isOpen, order]);

  const handleSave = async () => {
    if (!order) return;

    await onSave({
      totalDebt,
      orderPrice,
      paid: paidAmount,
      discount: discountAmount,
      updatedDebt,
    });

    onClose();
  };

  const money = (n: number) => `${n.toFixed(2)} ج.م`;

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة دفعة للطلب" size="md">
      <div className="space-y-6">
        {/* Current Financial Status */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <DollarSign className="h-4 w-4 ml-2" />
            الحالة المالية الحالية
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <div className="text-xs text-red-600">الدين السابق</div>
              <div className="text-lg font-semibold text-red-700">
                {money(totalDebt)}
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="text-xs text-blue-600">سعر الطلب</div>
              <div className="text-lg font-semibold text-blue-700">
                {money(orderPrice)}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المبلغ المدفوع
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="أدخل المبلغ المدفوع"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الخصم المطبق
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="أدخل قيمة الخصم (اختياري)"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Calculation Preview */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-900 mb-3">
            معاينة الحساب
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>الدين السابق + سعر الطلب:</span>
              <span className="font-medium">
                {money(totalDebt + orderPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>المبلغ المدفوع:</span>
              <span className="font-medium text-red-600">
                -{money(paidAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>الخصم:</span>
              <span className="font-medium text-red-600">
                -{money(discountAmount)}
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-semibold">
              <span>الدين المحدث:</span>
              <span
                className={`font-bold ${
                  updatedDebt > 0 ? "text-orange-600" : "text-green-600"
                }`}
              >
                {money(updatedDebt)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSave} className="flex-1">
            حفظ الدفعة
          </Button>
          <Button onClick={onClose} variant="outline" className="flex-1">
            إلغاء
          </Button>
        </div>
      </div>
    </Modal>
  );
};
