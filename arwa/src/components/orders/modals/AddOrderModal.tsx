import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "../../ui/Input";
import { Button } from "../../ui/Button";
import type { FormData, Order } from "../api/ordersApi";
import type { CategoryDto } from "../../deliveries/api/deliveriesApi";
import type { Supplier } from "../../suppliers/models/supplier";

interface Client {
  id: string;
  name: string;
  nickname: string | null;
  phoneNumber: string;
  totalTransaction: number;
  totalPaid: number;
  totalDue: number;
  viewOrder: number;
  lastUpdated: string;
  createdAt: string;
  orders: Order[];
  deletedBy: string | null;
}

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  suppliers: Supplier[];
  types: CategoryDto[];
  onSubmit: (formData: FormData) => void;
  editMode?: boolean;
  editingOrder?: Order | null;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({
  isOpen,
  onClose,
  clients,
  suppliers,
  types,
  onSubmit,
  editMode = false,
  editingOrder,
}) => {
  const [formData, setFormData] = useState<FormData>({
    customerId: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    fishItems: [{ supplier: "", baseType: "", type: "", quantity: "" }],
  });
  const [isNewClient, setIsNewClient] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [submitError, setSubmitError] = useState<string>("");

  // Helper functions for fish types
  const isTruthy = (v: unknown): v is boolean | number | string =>
    v === true || v === 1 || v === "1" || v === "true";
  const isBaseType = useCallback(
    (t: CategoryDto): boolean =>
      isTruthy(t?.isBase) ||
      isTruthy((t as unknown as Record<string, unknown>)?.is_base),
    []
  );
  // Helper: find base category name for a given subtype name
  const getBaseForSubtype = useCallback(
    (subtypeName: string): string => {
      if (!subtypeName) return "";
      const sub = types.find(
        (t) => !isBaseType(t) && (t.name || "") === subtypeName
      );
      return (sub as unknown as { category?: string })?.category || "";
    },
    [types, isBaseType]
  );

  // Populate form data when editing
  useEffect(() => {
    if (editingOrder && editMode) {
      setFormData({
        customerId: editingOrder.customerId || "",
        customerName: editingOrder.customer?.name || "",
        customerPhone: editingOrder.customer?.phoneNumber || "",
        customerEmail: "",
        fishItems: editingOrder.orderItems?.map((item) => ({
          supplier: item.SupplierId || "",
          // Preselect base type based on the subtype's declared parent category
          baseType: getBaseForSubtype(item.fishTypeName || ""),
          type: item.fishTypeName || "",
          quantity: item.amount.toString(),
        })) || [{ supplier: "", baseType: "", type: "", quantity: "" }],
      });
      setCustomerSearch(editingOrder.customer?.name || "");
    } else if (!editMode) {
      // Reset form for new orders
      setFormData({
        customerId: "",
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        fishItems: [{ supplier: "", baseType: "", type: "", quantity: "" }],
      });
      setCustomerSearch("");
    }
  }, [editingOrder, editMode, getBaseForSubtype]);

  // Filter clients based on search term
  const filteredClients =
    clients?.filter(
      (client) =>
        client.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        client.phoneNumber.includes(customerSearch)
    ) || [];

  const bases = types.filter((t) => isBaseType(t));
  const getSubtypesForBase = (baseName: string): CategoryDto[] => {
    return types.filter(
      (t) => !isBaseType(t) && (t.category || "") === baseName
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showCustomerDropdown &&
        !(event.target as Element).closest(".customer-search-container")
      ) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCustomerDropdown]);

  // Populate form when editing order
  useEffect(() => {
    if (editingOrder && isOpen) {
      setFormData({
        customerId: editingOrder.customerId || "",
        customerName: editingOrder.customer?.name || "",
        customerPhone: editingOrder.customer?.phoneNumber || "",
        customerEmail: "",
        fishItems: editingOrder.orderItems?.map((item) => ({
          supplier: item.SupplierId || "",
          baseType: getBaseForSubtype(item.fishTypeName || "") || "",
          type: item.fishTypeName || "",
          quantity: item.amount.toString(),
        })) || [{ supplier: "", baseType: "", type: "", quantity: "" }],
      });
      setIsNewClient(false);
      setCustomerSearch(editingOrder.customer?.name || "");
    } else if (!editingOrder && isOpen) {
      // Reset form for new order
      setFormData({
        customerId: "",
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        fishItems: [{ supplier: "", baseType: "", type: "", quantity: "" }],
      });
      setIsNewClient(false);
      setCustomerSearch("");
    }
  }, [editingOrder, isOpen, getBaseForSubtype]);

  const addFishItem = () => {
    setFormData((prev) => ({
      ...prev,
      fishItems: [
        ...prev.fishItems,
        { supplier: "", baseType: "", type: "", quantity: "" },
      ],
    }));
  };

  const removeFishItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fishItems: prev.fishItems.filter((_, i) => i !== index),
    }));
  };

  const updateFishItem = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      fishItems: prev.fishItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = () => {
    // Basic validation: ensure a client is selected
    if (!formData.customerId || !formData.customerName) {
      setSubmitError("يجب اختيار عميل من القائمة");
      return;
    }
    // Validate there is at least one valid item (supplier, type, quantity>0)
    const validItems = formData.fishItems.filter((it) => {
      const qty = parseFloat(it.quantity || "0");
      return it.supplier && it.type && qty > 0;
    });
    if (validItems.length === 0) {
      setSubmitError(
        "أضف على الأقل صنفًا واحدًا مكتمل البيانات (المورد، النوع، الكمية)"
      );
      return;
    }
    setSubmitError("");
    onSubmit({ ...formData, fishItems: validItems });
    // Reset form
    setFormData({
      customerId: "",
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      fishItems: [{ supplier: "", baseType: "", type: "", quantity: "" }],
    });
    setIsNewClient(false);
    setCustomerSearch("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      dir="rtl"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {editingOrder ? "تعديل الطلب" : "إضافة طلب جديد"}
        </h3>
        {submitError && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-700 text-sm">
            {submitError}
          </div>
        )}

        {/* Client Selection */}
        <div className="space-y-4 mb-6">
          <div className="relative customer-search-container">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العميل *
            </label>
            <Input
              placeholder="ابحث عن العميل بالاسم أو رقم الهاتف..."
              value={customerSearch}
              onChange={(e) => {
                if (!editingOrder) {
                  setCustomerSearch(e.target.value);
                  setShowCustomerDropdown(true);
                }
              }}
              onFocus={() => !editingOrder && setShowCustomerDropdown(true)}
              disabled={!!editingOrder}
              className="w-full"
            />
            {showCustomerDropdown && customerSearch && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          customerId: client.id.toString(),
                          customerName: client.name,
                          customerPhone: client.phoneNumber,
                          customerEmail: "",
                        }));
                        setCustomerSearch(client.name);
                        setIsNewClient(false);
                        setShowCustomerDropdown(false);
                      }}
                    >
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-gray-500">
                        {client.phoneNumber}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    لا يوجد عملاء مطابقين
                  </div>
                )}
              </div>
            )}
          </div>

          {isNewClient && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="رقم الهاتف *"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerPhone: e.target.value,
                  }))
                }
              />
              <Input
                placeholder="البريد الإلكتروني"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerEmail: e.target.value,
                  }))
                }
              />
            </div>
          )}
        </div>

        {/* Fish Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium">أصناف الأسماك</h4>
            <Button onClick={addFishItem} size="sm">
              <Plus size={16} className="ml-1" />
              إضافة صنف
            </Button>
          </div>

          {formData.fishItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700">
                  صنف السمك {index + 1}
                </span>
                {formData.fishItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFishItem(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select
                  value={item.supplier}
                  onChange={(e) =>
                    updateFishItem(index, "supplier", e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">المورد</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>

                <select
                  value={item.baseType}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateFishItem(index, "baseType", value);
                    // reset subtype when base changes
                    updateFishItem(index, "type", "");
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">النوع الأساسي</option>
                  {bases.length === 0 ? (
                    <option value="">لا توجد فئات أساسية</option>
                  ) : (
                    bases.map((t: CategoryDto) => (
                      <option key={t.id} value={t.name}>
                        {t.name}
                      </option>
                    ))
                  )}
                </select>

                <select
                  value={item.type}
                  onChange={(e) =>
                    updateFishItem(index, "type", e.target.value)
                  }
                  disabled={!item.baseType}
                  className={`px-3 py-2 border border-gray-300 rounded-lg ${
                    !item.baseType ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">
                    {item.baseType
                      ? "النوع الفرعي"
                      : "اختر النوع الأساسي أولاً"}
                  </option>
                  {item.baseType &&
                    (getSubtypesForBase(item.baseType).length === 0 ? (
                      <option value="">لا توجد أنواع فرعية</option>
                    ) : (
                      getSubtypesForBase(item.baseType).map(
                        (t: CategoryDto) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        )
                      )
                    ))}
                </select>

                <Input
                  type="number"
                  step="0.1"
                  placeholder="الكمية (كجم)"
                  value={item.quantity}
                  onChange={(e) =>
                    updateFishItem(index, "quantity", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSubmit}>
            {editingOrder ? "تحديث الطلب" : "حفظ الطلب"}
          </Button>
        </div>
      </div>
    </div>
  );
};
