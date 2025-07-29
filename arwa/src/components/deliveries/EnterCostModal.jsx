import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const EnterCostModal = ({ isOpen, onClose, onSave, delivery }) => {
  const [formData, setFormData] = useState({
    totalCost: '',
    amountPaid: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (delivery) {
      setFormData({
        totalCost: delivery.totalCost || '',
        amountPaid: delivery.amountPaid || ''
      });
    }
  }, [delivery]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.totalCost || formData.totalCost <= 0) {
      newErrors.totalCost = 'التكلفة الإجمالية مطلوبة ويجب أن تكون أكبر من صفر';
    }
    
    if (formData.amountPaid < 0) {
      newErrors.amountPaid = 'المبلغ المدفوع لا يمكن أن يكون سالباً';
    }
    
    if (parseFloat(formData.amountPaid) > parseFloat(formData.totalCost)) {
      newErrors.amountPaid = 'المبلغ المدفوع لا يمكن أن يكون أكبر من التكلفة الإجمالية';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const costData = {
        totalCost: parseFloat(formData.totalCost),
        amountPaid: parseFloat(formData.amountPaid || 0)
      };
      onSave(delivery.id, costData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({ totalCost: '', amountPaid: '' });
    setErrors({});
    onClose();
  };

  if (!delivery) return null;

  const remainingAmount = parseFloat(formData.totalCost || 0) - parseFloat(formData.amountPaid || 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="إدخال تكلفة التوصيل"
    >
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">تفاصيل التوصيل</h3>
          <p className="text-sm text-gray-600">المورد: {delivery.supplierName}</p>
          <p className="text-sm text-gray-600">السائق: {delivery.driverName}</p>
          <p className="text-sm text-gray-600">
            التاريخ: {new Date(delivery.deliveryDate).toLocaleDateString('ar-EG')}
          </p>
          <p className="text-sm text-gray-600">الوزن الإجمالي: {delivery.totalWeight.toFixed(1)} كجم</p>
        </div>

        <div className="space-y-4">
          <Input
            label="التكلفة الإجمالية (ج.م)"
            type="number"
            step="0.01"
            value={formData.totalCost}
            onChange={(e) => handleInputChange('totalCost', e.target.value)}
            placeholder="أدخل التكلفة الإجمالية"
            error={errors.totalCost}
          />

          <Input
            label="المبلغ المدفوع (ج.م)"
            type="number"
            step="0.01"
            value={formData.amountPaid}
            onChange={(e) => handleInputChange('amountPaid', e.target.value)}
            placeholder="أدخل المبلغ المدفوع (اختياري)"
            error={errors.amountPaid}
          />

          {formData.totalCost && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">التكلفة الإجمالية:</span>
                  <span className="font-medium mr-2">
                    {parseFloat(formData.totalCost || 0).toLocaleString()} ج.م
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">المبلغ المدفوع:</span>
                  <span className="font-medium mr-2">
                    {parseFloat(formData.amountPaid || 0).toLocaleString()} ج.م
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">المبلغ المتبقي:</span>
                  <span className={`font-medium mr-2 ${remainingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {remainingAmount.toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>
            حفظ التكلفة
          </Button>
        </div>
      </div>
    </Modal>
  );
};