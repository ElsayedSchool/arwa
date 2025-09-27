import React, { useState, useEffect } from "react";
import { Modal } from "../../common/Modal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

export const EditCategoryModal = ({ isOpen, onClose, onSave, editingItem }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    character: "",
    color: "#3B82F6",
  });
  const [errors, setErrors] = useState({});

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
        description: editingItem.description || "",
        character: editingItem.character || "",
        color: editingItem.color || "#3B82F6",
      });
    }
  }, [editingItem]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم الفئة مطلوب";
    }

    if (editingItem?.type === "main" && !formData.description.trim()) {
      newErrors.description = "وصف الفئة مطلوب";
    }

    if (editingItem?.type === "sub") {
      if (!formData.character.trim()) {
        newErrors.character = "الرمز مطلوب";
      } else if (formData.character.length !== 1) {
        newErrors.character = "الرمز يجب أن يكون حرف واحد فقط";
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

        {editingItem.type === "main" && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              وصف الفئة
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="وصف مختصر للفئة..."
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        )}

        {editingItem.type === "sub" && (
          <>
            <Input
              label="الرمز المميز"
              value={formData.character}
              onChange={(e) =>
                handleInputChange("character", e.target.value.slice(0, 1))
              }
              placeholder="حرف واحد فقط"
              maxLength={1}
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
