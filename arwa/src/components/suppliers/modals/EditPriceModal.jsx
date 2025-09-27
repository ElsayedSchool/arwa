import React, { useState, useEffect } from "react";
import { Modal } from "../../common/Modal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

export const EditPriceModal = ({ isOpen, onClose, onSave, supplier }) => {
  const [formData, setFormData] = useState({
    pricePerKg: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplier) {
      setFormData({
        pricePerKg: supplier.pricePerKg?.toString() || "0",
      });
    }
  }, [supplier]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pricePerKg || parseFloat(formData.pricePerKg) <= 0) {
      newErrors.pricePerKg = "يجب إدخال سعر صحيح أكبر من صفر";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const priceData = {
        pricePerKg: parseFloat(formData.pricePerKg),
      };
      onSave(supplier.id, priceData);
      handleClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!supplier) return null;

  const newTotalCost = supplier.suppliedKg * parseFloat(formData.pricePerKg || 0);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="تعديل سعر الكيلوجرام">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">تفاصيل المنتج</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">المورد: </span>
              <span className="font-medium">{supplier.supplierName}</span>
            </div>
            <div>
              <span className="text-gray-600">نوع السمك: </span>
              <span className="font-medium">{supplier.fishType}</span>
            </div>
            <div>
              <span className="text-gray-600">الكمية: </span>
              <span className="font-medium">{supplier.suppliedKg} كجم</span>
            </div>
            <div>
              <span className="text-gray-600">السعر الحالي: </span>
              <span className="font-medium">{supplier.pricePerKg} ج.م/كجم</span>
            </div>
          </div>
        </div>

        <Input
          label="السعر الجديد لكل كيلوجرام (ج.م)"
          type="number"
          step="0.01"
          value={formData.pricePerKg}
          onChange={(e) => handleInputChange("pricePerKg", e.target.value)}
          placeholder="أدخل السعر الجديد"
          error={errors.pricePerKg}
        />

        {newTotalCost > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              التكلفة الإجمالية الجديدة:{" "}
              <span className="font-bold">{newTotalCost.toFixed(2)} ج.م</span>
            </p>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <Button onClick={handleSubmit} className="flex-1">
            حفظ التغييرات
          </Button>
          <Button variant="outline" onClick={handleClose} className="flex-1">
            إلغاء
          </Button>
        </div>
      </div>
    </Modal>
  );
};