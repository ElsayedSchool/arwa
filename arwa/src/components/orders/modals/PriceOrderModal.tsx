import React, { useMemo, useState } from "react";
import { Modal } from "../../common/Modal";
import type { Order } from "../api/ordersApi";
import { Button } from "../../ui/Button";

interface PriceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSavePrices: (
    items: Array<{ id: string; pricePerKilo: number; totalPrice: number }>
  ) => Promise<void>;
}

export const PriceOrderModal: React.FC<PriceOrderModalProps> = ({
  isOpen,
  onClose,
  order,
  onSavePrices,
}) => {
  const initial = useMemo(() => {
    return (order?.orderItems || []).map((it) => ({
      id: it.id,
      fishType: it.fishTypeName || it.fishTypeId || "",
      supplier: it.SupplierName || it.SupplierId || "",
      amount: Number(it.amount || 0),
      pricePerKilo: Number(it.pricePerKilo || 0),
    }));
  }, [order]);

  const [rows, setRows] = useState(initial);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setRows(initial);
  }, [initial]);

  const totals = rows.map((r) => ({
    id: r.id,
    total: r.amount * (r.pricePerKilo || 0),
  }));
  const allPriced = rows.every((r) => r.pricePerKilo > 0);
  const orderTotal = totals.reduce((s, r) => s + r.total, 0);

  const handleChange = (id: string, value: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, pricePerKilo: Number(value) || 0 } : r
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = rows.map((r) => ({
        id: r.id,
        pricePerKilo: r.pricePerKilo,
        totalPrice: r.amount * (r.pricePerKilo || 0),
      }));
      await onSavePrices(payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تسعير عناصر الطلب"
      size="lg"
    >
      <div className="space-y-4">
        <div className="text-sm text-gray-700">
          العميل:{" "}
          <span className="font-medium">
            {order.customerName || order.customer?.name || "غير محدد"}
          </span>
        </div>
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-5 gap-0 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">
            <div>الصنف</div>
            <div>المورد</div>
            <div className="text-center">الكمية</div>
            <div className="text-center">سعر الكيلو</div>
            <div className="text-center">الإجمالي</div>
          </div>
          <div className="divide-y">
            {rows.map((r) => {
              const total = r.amount * (r.pricePerKilo || 0);
              return (
                <div
                  key={r.id}
                  className="grid grid-cols-5 gap-0 items-center px-3 py-2 text-sm"
                >
                  <div className="truncate" title={r.fishType}>
                    {r.fishType}
                  </div>
                  <div className="truncate" title={r.supplier}>
                    {r.supplier}
                  </div>
                  <div className="text-center">{r.amount}</div>
                  <div className="text-center">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className="w-24 border rounded px-2 py-1 text-right"
                      value={r.pricePerKilo}
                      onChange={(e) => handleChange(r.id, e.target.value)}
                    />
                  </div>
                  <div className="text-center font-medium">
                    {total.toFixed(2)} ج.م
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            {allPriced ? (
              <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700">
                تم تسعير جميع العناصر
              </span>
            ) : (
              <span className="inline-block px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                بعض العناصر غير مسعّرة
              </span>
            )}
          </div>
          <div className="font-semibold">
            إجمالي الطلب: {orderTotal.toFixed(2)} ج.م
          </div>
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
