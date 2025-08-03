import React, { useState } from "react";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

export const AddOrderForm = ({
  onBack,
  onSubmit,
  clients,
  onCreateClient,
  userRole
}) => {
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    fishType: "",
    quantity: "",
    supplier: "",
    price: "",
    notes: ""
  });

  const [isNewClient, setIsNewClient] = useState(false);

  const fishTypes = ["بلطي", "دنيس", "مبروك", "بوري", "قاروص", "سردين", "تونة", "سلمون"];
  const suppliers = ["مورد الأسماك الطازجة", "شركة البحر الأبيض", "مزرعة الأسماك الذهبية"];

  const handleClientSelect = (clientName) => {
    const selectedClient = clients.find(client => client.name === clientName);
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientPhone: selectedClient.phone,
        clientEmail: selectedClient.email
      }));
      setIsNewClient(false);
    } else {
      setFormData(prev => ({
        ...prev,
        clientId: "",
        clientName: clientName,
        clientPhone: "",
        clientEmail: ""
      }));
      setIsNewClient(true);
    }
  };

  const handleSubmit = async () => {
    try {
      // Create client if new
      if (isNewClient) {
        await onCreateClient({
          name: formData.clientName,
          phone: formData.clientPhone,
          email: formData.clientEmail
        });
      }

      // Create order
      await onSubmit(formData);
      
      // Reset form
      setFormData({
        clientId: "",
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        fishType: "",
        quantity: "",
        supplier: "",
        price: "",
        notes: ""
      });
      setIsNewClient(false);
      onBack();
    } catch (error) {
      alert("فشل في إضافة الطلب");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft size={20} className="ml-2" />
            العودة إلى قائمة الطلبات
          </button>
          <h1 className="text-3xl font-bold text-gray-900">إضافة طلب جديد</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Client Selection */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العميل *
              </label>
              <select
                value={formData.clientName}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">اختر عميل أو أدخل اسم جديد</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name} - {client.phone}
                  </option>
                ))}
              </select>
              <Input
                placeholder="أو أدخل اسم عميل جديد..."
                value={formData.clientName}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="mt-2"
              />
            </div>

            {isNewClient && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="رقم الهاتف *"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                />
                <Input
                  placeholder="البريد الإلكتروني"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                />
              </div>
            )}
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع السمك *
              </label>
              <select
                value={formData.fishType}
                onChange={(e) => setFormData(prev => ({ ...prev, fishType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">اختر نوع السمك</option>
                {fishTypes.map((fish) => (
                  <option key={fish} value={fish}>{fish}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الكمية (كجم) *
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="الكمية"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المورد *
              </label>
              <select
                value={formData.supplier}
                onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">اختر المورد</option>
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
            </div>

            {userRole === "admin" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر (ج.م/كجم)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="السعر"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات
            </label>
            <textarea
              rows={3}
              placeholder="ملاحظات إضافية..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onBack}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              حفظ الطلب
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};