import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "../../common/Modal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import type { DeliveryUi } from "../../deliveries/api/deliveriesApi";

interface PriceDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: DeliveryUi | null;
  onSavePrices: (
    items: Array<{
      id?: string;
      type: string;
      pricePerKg: number;
      weight: number;
      total: number;
    }>,
    deliveryId: string
  ) => Promise<void> | void;
}

export const PriceDeliveryModal: React.FC<PriceDeliveryModalProps> = ({
  isOpen,
  onClose,
  delivery,
  onSavePrices,
}) => {
  const [rows, setRows] = useState<
    Array<{ id?: string; type: string; weight: number; pricePerKg: number }>
  >([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (delivery) {
      setRows(
        (delivery.fishTypes || []).map((f) => ({
          id: f.id,
          type: f.type,
          weight: Number(f.weight) || 0,
          pricePerKg: Number(f.pricePerKg) || 0,
        }))
      );
    } else {
      setRows([]);
    }
  }, [delivery]);

  const totals = useMemo(() => {
    const items = rows.map((r) => ({
      ...r,
      total: (Number(r.weight) || 0) * (Number(r.pricePerKg) || 0),
    }));
    const grand = items.reduce((s, it) => s + it.total, 0);
    return { items, grand };
  }, [rows]);

  const setRowPrice = (idx: number, value: number) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, pricePerKg: value } : r))
    );
  };

  const handleSave = async () => {
    if (!delivery) return;
    try {
      setSaving(true);
      setError("");
      await onSavePrices(
        totals.items.map((it) => ({
          id: rows.find((r) => r.type === it.type && r.weight === it.weight)
            ?.id,
          type: it.type,
          pricePerKg: it.pricePerKg,
          weight: it.weight,
          total: it.total,
        })),
        delivery.id
      );
      onClose();
    } catch (e: unknown) {
      const msg =
        (e as { message?: string })?.message ||
        "تعذر حفظ الأسعار. الرجاء المحاولة لاحقاً.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !delivery) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`تسعير توصيل - ${delivery.supplierName}`}
    >
      <div className="space-y-4" dir="rtl">
        <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600">
          <div className="col-span-5">النوع</div>
          <div className="col-span-2 text-center">الوزن (كجم)</div>
          <div className="col-span-3 text-center">السعر للكيلو</div>
          <div className="col-span-2 text-center">الإجمالي</div>
        </div>
        <div className="divide-y rounded border">
          {rows.map((r, idx) => (
            <div
              key={r.type + idx}
              className="grid grid-cols-12 gap-2 items-center p-2"
            >
              <div className="col-span-5 text-gray-900">{r.type}</div>
              <div className="col-span-2 text-center">{r.weight}</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  step="0.01"
                  value={r.pricePerKg.toString()}
                  onChange={(e) =>
                    setRowPrice(idx, parseFloat(e.target.value || "0"))
                  }
                />
              </div>
              <div className="col-span-2 text-center text-gray-900 font-medium">
                {(
                  (Number(r.weight) || 0) * (Number(r.pricePerKg) || 0)
                ).toLocaleString()}{" "}
                ج.م
              </div>
            </div>
          ))}
        </div>
        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-600">الإجمالي</div>
          <div className="text-lg font-semibold text-gray-900">
            {totals.grand.toLocaleString()} ج.م
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "جارٍ الحفظ..." : "حفظ الأسعار"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PriceDeliveryModal;
