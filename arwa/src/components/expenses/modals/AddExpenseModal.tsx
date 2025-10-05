import React, { useState, useEffect } from "react";
import { Modal } from "../../common/Modal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import type { ExpenseUi } from "../api/expensesApi";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: ExpenseUi | null;
  onSave: (payload: {
    id?: string;
    name: string;
    description?: string;
    price: number;
  }) => Promise<void>;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  expense,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (expense) {
      setName(expense.name);
      setDescription(expense.description || "");
      setPrice(expense.price.toString());
    } else {
      setName("");
      setDescription("");
      setPrice("");
    }
  }, [expense]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave({
        id: expense?.id,
        name,
        description: description || undefined,
        price: parseFloat(price) || 0,
      });
      onClose();
    } catch (e) {
      console.error(e);
      alert("فشل في حفظ المصروف");
    } finally {
      setSaving(false);
    }
  };

  const isEdit = !!expense;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "تعديل مصروف" : "إضافة مصروف"}
    >
      <div className="space-y-4" dir="rtl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الاسم
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="اسم المصروف"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الوصف
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="وصف المصروف (اختياري)"
            className="w-full border rounded px-3 py-2"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            السعر
          </label>
          <Input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            إلغاء
          </Button>
          <Button onClick={handleSave} disabled={saving || !name || !price}>
            {saving ? "جارٍ الحفظ..." : isEdit ? "تحديث" : "إضافة"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
