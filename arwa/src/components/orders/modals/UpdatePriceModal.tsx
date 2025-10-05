import React, { useState } from "react";
import { Modal } from "../../common/Modal";
import type { Order } from "../api/ordersApi";
import { Button } from "../../ui/Button";

interface UpdatePriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSave: (orderId: string, newPrice: number) => Promise<void>;
}

export const UpdatePriceModal: React.FC<UpdatePriceModalProps> = ({
  isOpen,
  onClose,
  order,
  onSave,
}) => {
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (order) {
      setPrice(Number(order.totalPrice || 0).toString());
    }
  }, [order]);

  const handleSave = async () => {
    if (!order) return;
    const newPrice = parseFloat(price);
    if (isNaN(newPrice) || newPrice < 0) {
      alert("يرجى إدخال سعر صحيح");
      return;
    }

    try {
      setSaving(true);
      await onSave(order.id, newPrice);
      onClose();
    } catch (error) {
      console.error("Error updating price:", error);
      alert("حدث خطأ أثناء تحديث السعر");
    } finally {
      setSaving(false);
    }
  };

  if (!order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تحديث سعر الطلب" size="sm">
      <div className="space-y-4">
        <div className="text-sm text-gray-700">
          العميل:{" "}
          <span className="font-medium">
            {order.customerName || order.customer?.name || "غير محدد"}
          </span>
        </div>
        <div className="text-sm text-gray-700">
          السعر الحالي:{" "}
          <span className="font-medium">
            {Number(order.totalPrice || 0).toFixed(2)} ج.م
          </span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            السعر الجديد
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-right"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="أدخل السعر الجديد"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "جاري الحفظ..." : "حفظ"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
