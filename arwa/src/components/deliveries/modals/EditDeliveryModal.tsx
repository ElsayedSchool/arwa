import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "../../common/Modal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import {
  type DeliveryUi,
  type CategoryDto,
  type FishTypeUi,
} from "../api/deliveriesApi";

interface FishTypeEdit {
  baseType: string;
  type: string;
  weight: string;
  pricePerKg: string;
}

interface EditFormData {
  supplierName: string;
  driverName: string;
  deliveryDate: string;
  deliveryTime: string;
  fishTypes: FishTypeEdit[];
}

interface EditDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DeliveryUi) => void;
  delivery: DeliveryUi | null;
  suppliers: string[];
  types: CategoryDto[];
}

export const EditDeliveryModal: React.FC<EditDeliveryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  delivery,
  suppliers,
  types = [],
}) => {
  const [formData, setFormData] = useState<EditFormData>({
    supplierName: "",
    driverName: "",
    deliveryDate: "",
    deliveryTime: "",
    fishTypes: [{ baseType: "", type: "", weight: "", pricePerKg: "" }],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (delivery) {
      setFormData({
        supplierName: delivery.supplierName,
        driverName: delivery.driverName,
        deliveryDate: delivery.deliveryDate,
        deliveryTime: delivery.deliveryTime,
        fishTypes: delivery.fishTypes.map((fish: FishTypeUi) => {
          const sub = types.find((t) => !t.isBase && t.name === fish.type);
          const baseName = sub?.category || "";
          return {
            baseType: baseName,
            type: fish.type,
            weight: fish.weight.toString(),
            pricePerKg: fish.pricePerKg.toString(),
          };
        }),
      });
    }
  }, [delivery, types]);

  const handleInputChange = (field: keyof EditFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFishTypeChange = (
    index: number,
    field: keyof FishTypeEdit,
    value: string
  ) => {
    setFormData((prev) => {
      const newFishTypes = [...prev.fishTypes];
      newFishTypes[index] = { ...newFishTypes[index], [field]: value };
      return { ...prev, fishTypes: newFishTypes };
    });

    // Clear error for this field if it exists
    const errorKey =
      field === "baseType"
        ? `baseType_${index}`
        : field === "type"
        ? `fishType_${index}`
        : field === "weight"
        ? `weight_${index}`
        : `price_${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const addFishType = () => {
    setFormData((prev) => ({
      ...prev,
      fishTypes: [
        ...prev.fishTypes,
        { baseType: "", type: "", weight: "", pricePerKg: "" },
      ],
    }));
  };

  const removeFishType = (index: number) => {
    if (formData.fishTypes.length > 1) {
      setFormData((prev) => ({
        ...prev,
        fishTypes: prev.fishTypes.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplierName.trim()) {
      newErrors.supplierName = "اسم المورد مطلوب";
    }

    if (!formData.driverName.trim()) {
      newErrors.driverName = "اسم السائق مطلوب";
    }

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = "تاريخ التوصيل مطلوب";
    }

    if (!formData.deliveryTime) {
      newErrors.deliveryTime = "وقت التوصيل مطلوب";
    }

    formData.fishTypes.forEach((fish, index) => {
      if (!fish.baseType.trim()) {
        newErrors[`baseType_${index}`] = "النوع الأساسي مطلوب";
      }
      if (!fish.type.trim()) {
        newErrors[`fishType_${index}`] = "النوع الفرعي مطلوب";
      }
      if (!fish.weight || parseFloat(fish.weight) <= 0) {
        newErrors[`weight_${index}`] = "الوزن مطلوب ويجب أن يكون أكبر من صفر";
      }
      if (!fish.pricePerKg || parseFloat(fish.pricePerKg) <= 0) {
        newErrors[`price_${index}`] = "السعر مطلوب ويجب أن يكون أكبر من صفر";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const totalWeight = formData.fishTypes.reduce(
        (sum, fish) => sum + parseFloat(fish.weight || "0"),
        0
      );
      const totalCost = formData.fishTypes.reduce(
        (sum, fish) =>
          sum +
          parseFloat(fish.weight || "0") * parseFloat(fish.pricePerKg || "0"),
        0
      );

      const updatedDelivery = {
        ...delivery,
        ...formData,
        totalWeight,
        totalCost,
        fishTypes: formData.fishTypes.map((fish) => ({
          weight: parseFloat(fish.weight),
          pricePerKg: parseFloat(fish.pricePerKg),
          // Only record the subtype, not baseType
          type: fish.type,
        })),
      };

      onSave(updatedDelivery as unknown as DeliveryUi);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!delivery) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="تعديل التوصيل"
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم المورد
            </label>
            <select
              value={formData.supplierName}
              onChange={(e) =>
                handleInputChange("supplierName", e.target.value)
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">اختر المورد</option>
              {suppliers.map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
            {errors.supplierName && (
              <p className="text-sm text-red-600 mt-1">{errors.supplierName}</p>
            )}
          </div>

          <Input
            label="اسم السائق"
            value={formData.driverName}
            onChange={(e) => handleInputChange("driverName", e.target.value)}
            placeholder="أدخل اسم السائق"
            error={errors.driverName}
          />

          <Input
            label="تاريخ التوصيل"
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
            error={errors.deliveryDate}
          />

          <Input
            label="وقت التوصيل"
            type="time"
            value={formData.deliveryTime}
            onChange={(e) => handleInputChange("deliveryTime", e.target.value)}
            error={errors.deliveryTime}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">أنواع الأسماك</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFishType}
              className="inline-flex items-center"
            >
              <Plus size={16} className="ml-1" />
              إضافة نوع
            </Button>
          </div>

          <div className="space-y-4">
            {formData.fishTypes.map((fish, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">
                    {fish.type
                      ? `${fish.type} - ${fish.weight} كجم - ${fish.pricePerKg} ج.م/كجم`
                      : `نوع السمك ${index + 1}`}
                  </span>
                  {formData.fishTypes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFishType(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      النوع الأساسي
                    </label>
                    <select
                      value={fish.baseType || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleFishTypeChange(index, "baseType", value);
                        handleFishTypeChange(index, "type", "");
                      }}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">اختر النوع الأساسي</option>
                      {types
                        .filter((t) => t.isBase)
                        .map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                    </select>
                    {errors[`baseType_${index}`] && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors[`baseType_${index}`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      النوع الفرعي
                    </label>
                    <select
                      value={fish.type || ""}
                      onChange={(e) =>
                        handleFishTypeChange(index, "type", e.target.value)
                      }
                      disabled={!fish.baseType}
                      className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        !fish.baseType ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                    >
                      <option value="">
                        {fish.baseType
                          ? "اختر النوع الفرعي"
                          : "اختر النوع الأساسي أولاً"}
                      </option>
                      {fish.baseType &&
                        types
                          .filter(
                            (t) =>
                              !t.isBase &&
                              (t.category || "") === (fish.baseType || "")
                          )
                          .map((t) => (
                            <option key={t.id} value={t.name}>
                              {t.name}
                            </option>
                          ))}
                    </select>
                    {errors[`fishType_${index}`] && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors[`fishType_${index}`]}
                      </p>
                    )}
                  </div>
                  <Input
                    placeholder="الوزن (كجم)"
                    type="number"
                    step="0.1"
                    value={fish.weight}
                    onChange={(e) =>
                      handleFishTypeChange(index, "weight", e.target.value)
                    }
                    error={errors[`weight_${index}`]}
                  />
                  <Input
                    placeholder="السعر/كجم"
                    type="number"
                    step="0.01"
                    value={fish.pricePerKg}
                    onChange={(e) =>
                      handleFishTypeChange(index, "pricePerKg", e.target.value)
                    }
                    error={errors[`price_${index}`]}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>حفظ التغييرات</Button>
        </div>
      </div>
    </Modal>
  );
};
