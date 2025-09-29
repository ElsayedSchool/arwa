import React, { useEffect, useState } from "react";
import { Modal } from "../../common/Modal";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import type {
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
} from "../models/customer";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSave: (data: CreateCustomerData | UpdateCustomerData) => Promise<void>;
  loading?: boolean;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  customer,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    nickname: string;
    phoneNumber: string;
  }>({ name: "", nickname: "", phoneNumber: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!customer;

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        nickname: customer.nickname || "",
        phoneNumber: customer.phoneNumber || "",
      });
    } else {
      setFormData({ name: "", nickname: "", phoneNumber: "" });
    }
    setErrors({});
  }, [customer, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "اسم العميل مطلوب";
    const digits = formData.phoneNumber.replace(/\D/g, "");
    if (!digits) newErrors.phoneNumber = "رقم الهاتف مطلوب";
    else if (!/^01\d{9}$/.test(digits))
      newErrors.phoneNumber =
        "رقم الهاتف غير صحيح (يجب أن يبدأ بـ 01 ويتكون من 11 رقمًا)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload: CreateCustomerData | UpdateCustomerData = isEditing
      ? { id: customer!.id, ...formData }
      : formData;
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "تعديل العميل" : "إضافة عميل جديد"}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اسم العميل *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="أدخل اسم العميل"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            اللقب (اختياري)
          </label>
          <Input
            value={formData.nickname}
            onChange={(e) => setField("nickname", e.target.value)}
            placeholder="أدخل لقب العميل"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            رقم الهاتف *
          </label>
          <Input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setField("phoneNumber", e.target.value)}
            placeholder="مثال: 01xxxxxxxxx"
            className={errors.phoneNumber ? "border-red-500" : ""}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
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

export default CustomerModal;
