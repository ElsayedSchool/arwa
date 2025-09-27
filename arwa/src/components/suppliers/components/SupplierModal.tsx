import React, { useEffect, useState } from "react";
// @ts-expect-error Modal is a JS/JSX module without TS types
import { Modal } from "../../common/Modal";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import type {
  Supplier,
  CreateSupplierData,
  UpdateSupplierData,
} from "../models/supplier";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: Supplier | null;
  onSave: (data: CreateSupplierData | UpdateSupplierData) => Promise<void>;
  loading?: boolean;
}

const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  supplier,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    nickName: string;
    phone: string;
    whatsApp: string;
  }>({ name: "", nickName: "", phone: "", whatsApp: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!supplier;

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || "",
        nickName: supplier.nickName || "",
        phone: supplier.phone || "",
        whatsApp: supplier.whatsApp || "",
      });
    } else {
      setFormData({ name: "", nickName: "", phone: "", whatsApp: "" });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "اسم المورد مطلوب";
    const digits = formData.phone.replace(/\D/g, "");
    if (!digits) newErrors.phone = "رقم الهاتف مطلوب";
    else if (!/^01\d{9}$/.test(digits))
      newErrors.phone = "رقم الهاتف غير صحيح (11 رقم ويبدأ بـ 01)";
    if (formData.whatsApp) {
      const waDigits = formData.whatsApp.replace(/\D/g, "");
      if (!/^01\d{9}$/.test(waDigits))
        newErrors.whatsApp = "رقم الواتساب غير صحيح";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload: CreateSupplierData | UpdateSupplierData = isEditing
      ? { id: supplier!.id, name: formData.name, nickName: formData.nickName || undefined, phone: formData.phone, whatsApp: formData.whatsApp || undefined }
      : { name: formData.name, nickName: formData.nickName || undefined, phone: formData.phone, whatsApp: formData.whatsApp || undefined };
    try {
      await onSave(payload);
      onClose();
    } catch {
      // store handles error
    }
  };

  const setField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "تعديل المورد" : "إضافة مورد جديد"} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المورد *</label>
          <Input
            value={formData.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="أدخل اسم المورد"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اللقب (اختياري)</label>
          <Input
            value={formData.nickName}
            onChange={(e) => setField("nickName", e.target.value)}
            placeholder="أدخل لقب المورد"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف *</label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="مثال: 01xxxxxxxxx"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الواتساب (اختياري)</label>
          <Input
            type="tel"
            value={formData.whatsApp}
            onChange={(e) => setField("whatsApp", e.target.value)}
            placeholder="مثال: 01xxxxxxxxx"
            className={errors.whatsApp ? "border-red-500" : ""}
          />
          {errors.whatsApp && <p className="text-red-500 text-sm mt-1">{errors.whatsApp}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            إلغاء
          </Button>
          <Button type="submit" disabled={loading} className="min-w-[100px]">
            {loading ? "جاري الحفظ..." : isEditing ? "تحديث" : "إضافة"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SupplierModal;
