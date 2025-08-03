import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Plus, Trash2 } from "lucide-react";

export const AddSupplierModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    fishTypes: [{ type: "", pricePerKg: "" }],
    paymentTerms: "cash",
    notes: ""
  });
  const [errors, setErrors] = useState({});

  const fishTypeOptions = ["بلطي", "دنيس", "مبروك", "بوري", "قاروص", "سردين", "تونة", "سلمون"];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFishTypeChange = (index, field, value) => {
    const newFishTypes = [...formData.fishTypes];
    newFishTypes[index] = { ...newFishTypes[index], [field]: value };
    setFormData(prev => ({ ...prev, fishTypes: newFishTypes }));
  };

  const addFishType = () => {
    setFormData(prev => ({
      ...prev,
      fishTypes: [...prev.fishTypes, { type: "", pricePerKg: "" }]
    }));
  };

  const removeFishType = (index) => {
    if (formData.fishTypes.length > 1) {
      const newFishTypes = formData.fishTypes.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, fishTypes: newFishTypes }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "اسم المورد مطلوب";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    }

    // Validate fish types
    formData.fishTypes.forEach((fishType, index) => {
      if (!fishType.type) {
        newErrors[`fishType_${index}`] = "نوع السمك مطلوب";
      }
      if (!fishType.pricePerKg || parseFloat(fishType.pricePerKg) <= 0) {
        newErrors[`price_${index}`] = "السعر مطلوب ويجب أن يكون أكبر من صفر";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const supplierData = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        totalSupplied: 0,
        totalAmount: 0,
        paymentStatus: "unpaid",
        amountPaid: 0,
        dueDate: null
      };
      onSave(supplierData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      fishTypes: [{ type: "", pricePerKg: "" }],
      paymentTerms: "cash",
      notes: ""
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="إضافة مورد جديد"
      size="lg"
    >
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="اسم المورد *"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="أدخل اسم المورد"
            error={errors.name}
          />
          <Input
            label="رقم الهاتف *"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="أدخل رقم الهاتف"
            error={errors.phone}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="أدخل البريد الإلكتروني"
          />
          <Input
            label="العنوان"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="أدخل العنوان"
          />
        </div>

        {/* Fish Types */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              أنواع الأسماك والأسعار *
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFishType}
            >
              <Plus size={16} className="ml-1" />
              إضافة نوع
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.fishTypes.map((fishType, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="flex-1">
                  <select
                    value={fishType.type}
                    onChange={(e) => handleFishTypeChange(index, "type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">اختر نوع السمك</option>
                    {fishTypeOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  {errors[`fishType_${index}`] && (
                    <p className="text-sm text-red-600 mt-1">{errors[`fishType_${index}`]}</p>
                  )}
                </div>
                
                <div className="flex-1">
                  <Input
                    type="number"
                    step="0.1"
                    value={fishType.pricePerKg}
                    onChange={(e) => handleFishTypeChange(index, "pricePerKg", e.target.value)}
                    placeholder="السعر (ج.م/كجم)"
                    error={errors[`price_${index}`]}
                  />
                </div>
                
                {formData.fishTypes.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFishType(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Terms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            شروط الدفع
          </label>
          <select
            value={formData.paymentTerms}
            onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cash">نقدي</option>
            <option value="credit">آجل</option>
            <option value="partial">جزئي</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ملاحظات
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="ملاحظات إضافية..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>
            حفظ المورد
          </Button>
        </div>
      </div>
    </Modal>
  );
};