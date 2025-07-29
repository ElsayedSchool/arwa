import React from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { SearchableDropdown } from '../common/SearchableDropdown';

export const AddSupplierProductForm = ({ 
  onSubmit, 
  onCancel, 
  existingSuppliers 
}) => {
  const [formData, setFormData] = React.useState({
    supplierName: "",
    fishType: "",
    suppliedKg: "",
    supplyDate: "",
    pricePerKg: "",
  });
  const [errors, setErrors] = React.useState({});
  const [isNewSupplier, setIsNewSupplier] = React.useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.supplierName.trim()) newErrors.supplierName = "اسم المورد مطلوب";
    if (!formData.fishType.trim()) newErrors.fishType = "نوع السمك مطلوب";
    if (!formData.suppliedKg || parseFloat(formData.suppliedKg) <= 0) 
      newErrors.suppliedKg = "الكمية يجب أن تكون أكبر من صفر";
    if (!formData.supplyDate) newErrors.supplyDate = "تاريخ التوريد مطلوب";
    if (!formData.pricePerKg || parseFloat(formData.pricePerKg) <= 0) 
      newErrors.pricePerKg = "السعر يجب أن يكون أكبر من صفر";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const newProduct = {
        id: Date.now(),
        supplierName: formData.supplierName,
        fishType: formData.fishType,
        suppliedKg: parseFloat(formData.suppliedKg),
        supplyDate: formData.supplyDate,
        amountSold: 0,
        pricePerKg: parseFloat(formData.pricePerKg),
      };
      onSubmit(newProduct);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSupplierChange = (supplierName) => {
    setFormData((prev) => ({ ...prev, supplierName }));
    setIsNewSupplier(!existingSuppliers.includes(supplierName));
    if (errors.supplierName) {
      setErrors((prev) => ({ ...prev, supplierName: "" }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Supplier Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          المورد
        </label>
        <SearchableDropdown
          options={existingSuppliers}
          value={formData.supplierName}
          onChange={handleSupplierChange}
          placeholder="اختر مورد موجود أو أدخل اسم جديد..."
          allowCustomInput={true}
        />
        {isNewSupplier && formData.supplierName && (
          <p className="text-sm text-blue-600">
            سيتم إضافة مورد جديد: "{formData.supplierName}"
          </p>
        )}
        {errors.supplierName && (
          <p className="text-sm text-red-600">{errors.supplierName}</p>
        )}
      </div>

      <Input
        label="نوع السمك"
        value={formData.fishType}
        onChange={(e) => handleInputChange("fishType", e.target.value)}
        placeholder="أدخل نوع السمك"
        error={errors.fishType}
      />

      <Input
        label="الكمية المورّدة (كجم)"
        type="number"
        value={formData.suppliedKg}
        onChange={(e) => handleInputChange("suppliedKg", e.target.value)}
        placeholder="أدخل الكمية بالكيلوجرام"
        error={errors.suppliedKg}
      />

      <Input
        label="تاريخ التوريد"
        type="date"
        value={formData.supplyDate}
        onChange={(e) => handleInputChange("supplyDate", e.target.value)}
        error={errors.supplyDate}
      />

      <Input
        label="السعر لكل كيلوجرام (ج.م)"
        type="number"
        step="0.01"
        value={formData.pricePerKg}
        onChange={(e) => handleInputChange("pricePerKg", e.target.value)}
        placeholder="أدخل السعر لكل كيلوجرام"
        error={errors.pricePerKg}
      />

      <div className="flex space-x-3 pt-4">
        <Button onClick={handleSubmit} className="flex-1">
          إضافة المنتج
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          إلغاء
        </Button>
      </div>
    </div>
  );
};