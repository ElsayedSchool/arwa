import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export const EditDueDateModal = ({ isOpen, onClose, onSave, supplier }) => {
  const [formData, setFormData] = useState({
    dueDate: "",
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        dueDate: supplier.dueDate || "",
      });
    }
  }, [supplier]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const dueDateData = {
      dueDate: formData.dueDate || null,
    };
    onSave(supplier.id, dueDateData);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!supplier) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="تعديل تاريخ الاستحقاق">
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
              <span className="text-gray-600">التكلفة الإجمالية: </span>
              <span className="font-medium">{(supplier.totalCost || 0).toFixed(2)} ج.م</span>
            </div>
            <div>
              <span className="text-gray-600">المبلغ المدفوع: </span>
              <span className="font-medium">{(supplier.amountPaid || 0).toFixed(2)} ج.م</span>
            </div>
          </div>
        </div>

        <Input
          label="تاريخ الاستحقاق"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleInputChange("dueDate", e.target.value)}
          placeholder="اختر تاريخ الاستحقاق"
        />

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