import React, { useState, useEffect } from "react";
import { Modal } from "../../common/Modal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: unknown) => void;
  editingItem: {
    id: number;
    name: string;
    description?: string;
    type: "main" | "sub";
    mainCategoryId?: number;
    character?: string | null;
    color?: string | null;
    categoryType?: number;
  } | null;
}

interface FormData {
  name: string;
  character: string;
  color: string;
  categoryType: number;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    character: "",
    color: "#3B82F6",
    categoryType: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
    "#84CC16",
    "#F97316",
    "#6366F1",
  ];

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        character: editingItem.character || "",
        color: editingItem.color || "#3B82F6",
        categoryType: editingItem.categoryType || 1,
      });
    }
  }, [editingItem]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم الفئة مطلوب";
    }

    if (editingItem?.type === "sub") {
      if (!formData.character.trim()) {
        newErrors.character = "الرمز مطلوب";
      } else if (formData.character.length > 3) {
        newErrors.character = "الرمز يجب أن لا يزيد عن 3 أحرف";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      setErrors({});
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!editingItem) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        editingItem.type === "main"
          ? "تعديل الفئة الرئيسية"
          : "تعديل الفئة الفرعية"
      }
    >
      <div className="space-y-4">
        <Input
          label={
            editingItem.type === "main"
              ? "اسم الفئة الرئيسية"
              : "اسم الفئة الفرعية"
          }
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder={
            editingItem.type === "main"
              ? "مثال: أسماك المياه العذبة"
              : "مثال: بلطي"
          }
          error={errors.name}
        />

        {editingItem.type !== "sub" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              نوع الفئة
            </label>
            <select
              value={formData.categoryType}
              onChange={(e) =>
                handleInputChange("categoryType", parseInt(e.target.value))
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={1}>بلطى</option>
              <option value={2}>ابيض</option>
              <option value={3}>مجمدات وبحر</option>
            </select>
          </div>
        )}

        {editingItem.type === "sub" && (
          <>
            <Input
              label="الرمز المميز"
              value={formData.character}
              onChange={(e) =>
                handleInputChange("character", e.target.value.slice(0, 3))
              }
              placeholder="حتى 3 أحرف"
              maxLength={3}
              error={errors.character}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                لون الرمز
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleInputChange("color", color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      formData.color === color
                        ? "border-gray-800"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {formData.character && (
                <div className="mt-2">
                  <span className="text-sm text-gray-600">معاينة: </span>
                  <div
                    className="inline-flex w-8 h-8 rounded-full items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: formData.color }}
                  >
                    {formData.character}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>حفظ التغييرات</Button>
        </div>
      </div>
    </Modal>
  );
};
