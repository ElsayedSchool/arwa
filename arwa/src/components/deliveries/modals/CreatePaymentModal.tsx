import React, { useState, useEffect, useRef } from "react";
import { Modal } from "../../common/Modal";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";

interface CreatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (paymentData: {
    supplierId: string;
    supplierName: string;
    paidAmount: number;
    discount: number;
    driverName: string;
    id?: string;
  }) => Promise<void>;
  suppliers: Array<{ id: string; name: string }>;
  drivers: Array<{ id: string; name: string }>;
  editingPayment?: {
    id: string;
    supplierName: string;
    amountPaid: number;
    remainingAmount: number;
    driverName?: string;
  } | null;
}

export const CreatePaymentModal: React.FC<CreatePaymentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  suppliers,
  drivers,
  editingPayment,
}) => {
  const [formData, setFormData] = useState({
    supplierId: "",
    supplierName: "",
    paidAmount: "",
    discount: "",
    driverName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Driver search state
  const [driverSearchTerm, setDriverSearchTerm] = useState("");
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [filteredDrivers, setFilteredDrivers] = useState(drivers);
  const driverInputRef = useRef<HTMLInputElement>(null);
  const driverDropdownRef = useRef<HTMLDivElement>(null);

  // Update filtered drivers when search term or drivers list changes
  useEffect(() => {
    if (driverSearchTerm.trim() === "") {
      setFilteredDrivers(drivers);
    } else {
      const filtered = drivers.filter((driver) =>
        driver.name.toLowerCase().includes(driverSearchTerm.toLowerCase())
      );
      setFilteredDrivers(filtered);
    }
  }, [driverSearchTerm, drivers]);

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        driverDropdownRef.current &&
        !driverDropdownRef.current.contains(event.target as Node) &&
        driverInputRef.current &&
        !driverInputRef.current.contains(event.target as Node)
      ) {
        setShowDriverDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editingPayment) {
      const supplier = suppliers.find(
        (s) => s.name === editingPayment.supplierName
      );
      setFormData({
        supplierId: supplier?.id || "",
        supplierName: editingPayment.supplierName,
        paidAmount: editingPayment.amountPaid.toString(),
        discount: "0", // Default discount, could be enhanced to store discount in delivery
        driverName: editingPayment.driverName || "",
      });
      setDriverSearchTerm(editingPayment.driverName || "");
    } else {
      // Reset form for new payment
      setFormData({
        supplierId: "",
        supplierName: "",
        paidAmount: "",
        discount: "",
        driverName: "",
      });
      setDriverSearchTerm("");
    }
    setErrors({});
    setShowDriverDropdown(false);
  }, [editingPayment, suppliers]);

  const handleDriverSearchChange = (value: string) => {
    setDriverSearchTerm(value);
    setFormData((prev) => ({ ...prev, driverName: value }));
    setShowDriverDropdown(true);

    // Clear error when field is changed
    if (errors.driverName) {
      setErrors((prev) => ({ ...prev, driverName: "" }));
    }
  };

  const handleDriverSelect = (driverName: string) => {
    setFormData((prev) => ({ ...prev, driverName }));
    setDriverSearchTerm(driverName);
    setShowDriverDropdown(false);
  };

  const handleAddNewDriver = () => {
    if (driverSearchTerm.trim()) {
      setFormData((prev) => ({ ...prev, driverName: driverSearchTerm.trim() }));
      setShowDriverDropdown(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Update supplier name when supplier ID changes
    if (field === "supplierId") {
      const selectedSupplier = suppliers.find((s) => s.id === value);
      if (selectedSupplier) {
        setFormData((prev) => ({
          ...prev,
          supplierId: value,
          supplierName: selectedSupplier.name,
        }));
      }
    }

    // Clear error when field is changed
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplierId) {
      newErrors.supplierId = "يجب اختيار المورد";
    }

    const paidAmount = parseFloat(formData.paidAmount);
    if (!formData.paidAmount || isNaN(paidAmount) || paidAmount <= 0) {
      newErrors.paidAmount = "يجب إدخال مبلغ الدفع ويجب أن يكون أكبر من صفر";
    }

    const discount = parseFloat(formData.discount || "0");
    if (formData.discount && (isNaN(discount) || discount < 0)) {
      newErrors.discount = "الخصم يجب أن يكون رقماً موجباً أو صفر";
    }

    if (!formData.driverName) {
      newErrors.driverName = "يجب اختيار السائق";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const paidAmount = parseFloat(formData.paidAmount);
      const discount = parseFloat(formData.discount || "0");

      await onSave({
        supplierId: formData.supplierId,
        supplierName: formData.supplierName,
        paidAmount,
        discount,
        driverName: formData.driverName,
        id: editingPayment?.id,
      });

      // Reset form
      setFormData({
        supplierId: "",
        supplierName: "",
        paidAmount: "",
        discount: "",
        driverName: "",
      });
      setDriverSearchTerm("");
      setErrors({});
      setShowDriverDropdown(false);
    }
  };

  const handleClose = () => {
    setFormData({
      supplierId: "",
      supplierName: "",
      paidAmount: "",
      discount: "",
      driverName: "",
    });
    setDriverSearchTerm("");
    setErrors({});
    setShowDriverDropdown(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingPayment ? "تعديل الدفعة" : "تسجيل دفعة جديدة"}
      size="md"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المورد
            </label>
            <select
              value={formData.supplierId}
              onChange={(e) => handleInputChange("supplierId", e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">اختر المورد</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            {errors.supplierId && (
              <p className="text-sm text-red-600 mt-1">{errors.supplierId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مبلغ الدفع
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="أدخل مبلغ الدفع"
              value={formData.paidAmount}
              onChange={(e) => handleInputChange("paidAmount", e.target.value)}
              error={errors.paidAmount}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الخصم (اختياري)
            </label>
            <Input
              type="number"
              step="0.01"
              placeholder="أدخل قيمة الخصم"
              value={formData.discount}
              onChange={(e) => handleInputChange("discount", e.target.value)}
              error={errors.discount}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السائق
            </label>
            <div className="relative">
              <input
                ref={driverInputRef}
                type="text"
                placeholder="ابحث عن سائق أو أضف جديد"
                value={driverSearchTerm}
                onChange={(e) => handleDriverSearchChange(e.target.value)}
                onFocus={() => setShowDriverDropdown(true)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {showDriverDropdown && (
                <div
                  ref={driverDropdownRef}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                  {filteredDrivers.length > 0 && (
                    <div className="py-1">
                      {filteredDrivers.map((driver) => (
                        <button
                          key={driver.id}
                          type="button"
                          onClick={() => handleDriverSelect(driver.name)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          {driver.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {driverSearchTerm.trim() &&
                    !filteredDrivers.some(
                      (d) =>
                        d.name.toLowerCase() === driverSearchTerm.toLowerCase()
                    ) && (
                      <div className="border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleAddNewDriver}
                          className="w-full px-3 py-2 text-left text-blue-600 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                        >
                          إضافة "{driverSearchTerm}" كسائق جديد
                        </button>
                      </div>
                    )}
                  {filteredDrivers.length === 0 && !driverSearchTerm.trim() && (
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      ابدأ الكتابة للبحث عن سائق...
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.driverName && (
              <p className="text-sm text-red-600 mt-1">{errors.driverName}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>
            {editingPayment ? "تحديث الدفعة" : "تسجيل الدفعة"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
