import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Modal } from "../../common/Modal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

export const AddDeliveryModal = ({
  isOpen,
  onClose,
  onSave,
  suppliers,
  types = [],
}) => {
  const [formData, setFormData] = useState({
    supplierName: "",
    driverName: "",
    deliveryDate: new Date().toISOString().split("T")[0],
    deliveryTime: new Date().toTimeString().slice(0, 5),
    // quantity: number entered by user; unit: 'kg' or 'box' (default box = 25 kg)
    fishTypes: [{ baseType: "", type: "", quantity: "", unit: "box" }],
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFishTypeChange = (index, field, value) => {
    const newFishTypes = [...formData.fishTypes];
    newFishTypes[index] = { ...newFishTypes[index], [field]: value };
    setFormData((prev) => ({ ...prev, fishTypes: newFishTypes }));
  };

  const addFishType = () => {
    setFormData((prev) => ({
      ...prev,
      fishTypes: [
        ...prev.fishTypes,
        { baseType: "", type: "", quantity: "", unit: "box" },
      ],
    }));
  };

  const removeFishType = (index) => {
    if (formData.fishTypes.length > 1) {
      setFormData((prev) => ({
        ...prev,
        fishTypes: prev.fishTypes.filter((_, i) => i !== index),
      }));
    }
  };

  // tolerant helpers for backend type shapes (isBase vs is_base, category vs parent)
  const isTruthy = (v) => v === true || v === 1 || v === "1" || v === "true";
  const isBaseType = (t) => isTruthy(t?.isBase) || isTruthy(t?.is_base);
  const getTypeCategory = (t) => {
    const v = t?.category ?? t?.parent ?? null;
    if (v && typeof v === "object") {
      // try common name fields if the backend returned an object
      return v.name ?? v.categoryName ?? v.title ?? v.label ?? v.id ?? null;
    }
    return v;
  };
  const bases = types.filter((t) => isBaseType(t));
  const subs = types.filter((t) => !isBaseType(t));
  console.log(subs);
  const normalize = (v) => (v == null ? "" : String(v).trim().toLowerCase());
  const getSubtypesForBase = (baseName) => {
    // Debug: log what's being filtered.
    console.log(`Filtering subtypes for base: '${baseName}'`);
    const filtered = subs.filter(
      (s) => normalize(getTypeCategory(s)) === normalize(baseName)
    );
    console.log(`Found ${filtered.length} subtypes:`, filtered);
    return filtered;
  };

  const validateForm = () => {
    const newErrors = {};

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
      if (!fish.type.trim()) {
        newErrors[`fishType_${index}`] = "نوع السمك مطلوب";
      }
      const qty = parseFloat(fish.quantity || 0);
      if (!qty || qty <= 0) {
        newErrors[`quantity_${index}`] =
          "الكمية مطلوبة ويجب أن تكون أكبر من صفر";
      }
      // price removed; only quantity/unit collected
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const totalWeight = formData.fishTypes.reduce((sum, fish) => {
        const qty = parseFloat(fish.quantity || 0) || 0;
        const unit = fish.unit || "kg";
        const weightKg = unit === "box" ? qty * 25 : qty;
        return sum + weightKg;
      }, 0);
      // No cost calculation in modal; cost handled elsewhere. Set to 0.
      const totalCost = 0;
      const deliveryData = {
        ...formData,
        totalWeight,
        totalCost,
        amountPaid: 0,
        remainingAmount: totalCost,
        paymentStatus: "unpaid",
        fishTypes: formData.fishTypes.map((fish) => {
          const qty = parseFloat(fish.quantity || 0) || 0;
          const unit = fish.unit || "kg";
          const weightKg = unit === "box" ? qty * 25 : qty;
          return {
            ...fish,
            quantity: qty,
            unit,
            weight: weightKg,
          };
        }),
      };

      onSave(deliveryData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      supplierName: "",
      driverName: "",
      deliveryDate: new Date().toISOString().split("T")[0],
      deliveryTime: new Date().toTimeString().slice(0, 5),
      fishTypes: [{ baseType: "", type: "", quantity: "", unit: "box" }],
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="إضافة توصيل جديد"
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
                    نوع السمك {index + 1}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      النوع الأساسي
                    </label>
                    <select
                      value={fish.baseType || ""}
                      onChange={(e) => {
                        handleFishTypeChange(index, "baseType", e.target.value);
                        // reset subtype when base changes
                        handleFishTypeChange(index, "type", "");
                      }}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">اختر النوع الأساسي</option>
                      {bases.length === 0 ? (
                        <option value="">لا توجد فئات أساسية</option>
                      ) : (
                        bases.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))
                      )}
                    </select>
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
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">اختر النوع الفرعي</option>
                      {(!fish.baseType || fish.baseType === "") && (
                        <option value="">اختر النوع الأساسي أولاً</option>
                      )}
                      {fish.baseType &&
                        (getSubtypesForBase(fish.baseType).length === 0 ? (
                          <option value="">لا توجد أنواع فرعية</option>
                        ) : (
                          getSubtypesForBase(fish.baseType).map((t) => (
                            <option key={t.id} value={t.name}>
                              {t.name}
                            </option>
                          ))
                        ))}
                    </select>
                    {errors[`fishType_${index}`] && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors[`fishType_${index}`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      الكمية
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="الكمية"
                        type="number"
                        step="0.1"
                        value={fish.quantity}
                        onChange={(e) =>
                          handleFishTypeChange(
                            index,
                            "quantity",
                            e.target.value
                          )
                        }
                        error={errors[`quantity_${index}`]}
                      />
                      <select
                        value={fish.unit || "box"}
                        onChange={(e) =>
                          handleFishTypeChange(index, "unit", e.target.value)
                        }
                        className="block px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="box">صندوق (25 كجم)</option>
                        <option value="kg">كجم</option>
                      </select>
                    </div>
                    {errors[`quantity_${index}`] && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors[`quantity_${index}`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>إضافة التوصيل</Button>
        </div>
      </div>
    </Modal>
  );
};
