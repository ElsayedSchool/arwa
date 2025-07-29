import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  User,
  Package,
  Trash2,
  Calendar,
  Edit,
  Check,
  X,
  BarChart3,
  MoreVertical,
  Eye,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../common/Badge";
import { SearchableDropdown } from "../common/SearchableDropdown";

export const ReviseOrdersPage = ({ onBack, userRole = "admin" }) => {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "محمد أحمد",
      phone: "01234567890",
      email: "mohamed@example.com",
    },
    {
      id: 2,
      name: "فاطمة علي",
      phone: "01987654321",
      email: "fatma@example.com",
    },
    {
      id: 3,
      name: "أحمد سعد",
      phone: "01122334455",
      email: "ahmed@example.com",
    },
  ]);

  const [suppliers] = useState([
    "مورد الأسماك الطازجة",
    "شركة البحر الأبيض",
    "مزرعة الأسماك الذهبية",
    "تجارة الأسماك المتحدة",
  ]);

  const [fishTypes] = useState([
    "بلطي",
    "دنيس",
    "مبروك",
    "بوري",
    "قاروص",
    "سردين",
    "تونة",
    "سلمون",
  ]);

  const [orders, setOrders] = useState([
    {
      id: 1,
      orderNumber: "ORD-001",
      clientName: "محمد أحمد",
      clientPhone: "01234567890",
      clientEmail: "mohamed@example.com",
      fishType: "بلطي",
      quantity: 5,
      supplier: "مورد الأسماك الطازجة",
      notes: "",
      orderDate: new Date().toISOString().split("T")[0],
      status: "قيد المراجعة",
      price: userRole === "admin" ? 45.5 : null,
      totalAmount: userRole === "admin" ? 227.5 : null,
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      clientName: "فاطمة علي",
      clientPhone: "01987654321",
      clientEmail: "fatma@example.com",
      fishType: "دنيس",
      quantity: 2,
      supplier: "شركة البحر الأبيض",
      notes: "طازج",
      orderDate: new Date().toISOString().split("T")[0],
      status: "مؤكد",
      price: userRole === "admin" ? 85.0 : null,
      totalAmount: userRole === "admin" ? 170.0 : null,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);

  const toggleDropdown = (orderId) => {
    setOpenDropdown(openDropdown === orderId ? null : orderId);
  };

  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    fishType: "",
    quantity: "",
    supplier: "",
    notes: "",
    price: userRole === "admin" ? "" : null,
  });

  const [errors, setErrors] = useState({});
  const [isNewClient, setIsNewClient] = useState(false);

  // Analytics
  const analytics = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter((order) => order.orderDate === today);

    return {
      totalToday: todayOrders.length,
      underRevision: todayOrders.filter(
        (order) => order.status === "قيد المراجعة"
      ).length,
      confirmed: todayOrders.filter((order) => order.status === "مؤكد").length,
    };
  }, [orders]);

  // Filter orders based on selected client and phone
  const filteredOrders = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return orders.filter((order) => {
      const isToday = order.orderDate === today;
      const matchesClient = selectedClient
        ? order.clientName === selectedClient
        : true;
      const matchesPhone = order.clientPhone.includes(phoneFilter);
      return isToday && matchesClient && matchesPhone;
    });
  }, [orders, selectedClient, phoneFilter]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.clientName.trim()) newErrors.clientName = "اسم العميل مطلوب";
    if (!formData.clientPhone.trim())
      newErrors.clientPhone = "رقم الهاتف مطلوب";
    if (!formData.fishType.trim()) newErrors.fishType = "نوع السمك مطلوب";
    if (!formData.quantity || parseFloat(formData.quantity) <= 0)
      newErrors.quantity = "الكمية يجب أن تكون أكبر من صفر";
    if (!formData.supplier.trim()) newErrors.supplier = "المورد مطلوب";
    if (
      userRole === "admin" &&
      (!formData.price || parseFloat(formData.price) <= 0)
    )
      newErrors.price = "السعر مطلوب";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const price = userRole === "admin" ? parseFloat(formData.price) : null;
      const quantity = parseFloat(formData.quantity);
      const totalAmount =
        userRole === "admin" && price ? price * quantity : null;

      const newOrder = {
        id: Date.now(),
        orderNumber: `ORD-${String(orders.length + 1).padStart(3, "0")}`,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        clientEmail: formData.clientEmail,
        fishType: formData.fishType,
        quantity: quantity,
        supplier: formData.supplier,
        notes: formData.notes,
        orderDate: new Date().toISOString().split("T")[0],
        status: "قيد المراجعة",
        price: price,
        totalAmount: totalAmount,
      };

      setOrders((prev) => [newOrder, ...prev]);

      // Add new client if doesn't exist
      if (isNewClient) {
        const newClient = {
          id: Date.now(),
          name: formData.clientName,
          phone: formData.clientPhone,
          email: formData.clientEmail,
        };
        setClients((prev) => [...prev, newClient]);
      }

      // Reset form
      setFormData({
        clientId: "",
        clientName: "",
        clientPhone: "",
        clientEmail: "",
        fishType: "",
        quantity: "",
        supplier: "",
        notes: "",
        price: userRole === "admin" ? "" : null,
      });
      setIsNewClient(false);
      setShowAddForm(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleClientSelect = (clientName) => {
    const selectedClient = clients.find((client) => client.name === clientName);
    if (selectedClient) {
      setFormData((prev) => ({
        ...prev,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        clientPhone: selectedClient.phone,
        clientEmail: selectedClient.email,
      }));
      setIsNewClient(false);
    } else {
      setFormData((prev) => ({
        ...prev,
        clientId: "",
        clientName: clientName,
        clientPhone: "",
        clientEmail: "",
      }));
      setIsNewClient(true);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleEditOrder = (order) => {
    setEditingOrder({ ...order });
  };

  const handleSaveOrder = () => {
    // Recalculate total if admin and price changed
    if (userRole === "admin" && editingOrder.price) {
      editingOrder.totalAmount = editingOrder.price * editingOrder.quantity;
    }

    setOrders((prev) =>
      prev.map((order) => (order.id === editingOrder.id ? editingOrder : order))
    );
    setEditingOrder(null);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "مؤكد":
        return "success";
      case "قيد المراجعة":
        return "warning";
      case "ملغي":
        return "danger";
      default:
        return "default";
    }
  };

  // Get all orders for a specific client
  const getClientOrders = (clientName) => {
    return orders.filter((order) => order.clientName === clientName);
  };

  const handleViewDetails = (order) => {
    setViewingOrder(order);
  };

  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
            >
              <ArrowLeft size={20} className="ml-2" />
              العودة إلى قائمة الطلبات
            </button>
            <h1 className="text-3xl font-bold text-gray-900">إضافة طلب جديد</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="space-y-6">
              {/* Enhanced Client Selection with Search */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  العميل *
                </label>
                <SearchableDropdown
                  options={clients.map(
                    (client) => `${client.name} - ${client.phone}`
                  )}
                  value={formData.clientName}
                  onChange={(value) => {
                    const selectedClient = clients.find(
                      (c) =>
                        `${c.name} - ${c.phone}` === value || c.name === value
                    );
                    handleClientSelect(
                      selectedClient ? selectedClient.name : value
                    );
                  }}
                  placeholder="ابحث عن عميل أو أدخل اسم جديد..."
                  allowCustomInput={true}
                />
                {isNewClient && formData.clientName && (
                  <p className="text-sm text-blue-600">
                    سيتم إضافة عميل جديد: "{formData.clientName}"
                  </p>
                )}
                {errors.clientName && (
                  <p className="text-sm text-red-600">{errors.clientName}</p>
                )}
              </div>

              {/* Phone field - required for new clients */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  رقم الهاتف {isNewClient ? "*" : ""}
                </label>
                <Input
                  value={formData.clientPhone}
                  onChange={(e) =>
                    handleInputChange("clientPhone", e.target.value)
                  }
                  placeholder="أدخل رقم الهاتف..."
                  disabled={!isNewClient && formData.clientId}
                />
                {errors.clientPhone && (
                  <p className="text-sm text-red-600">{errors.clientPhone}</p>
                )}
              </div>

              {/* Fish Type with custom input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  نوع السمك *
                </label>
                <SearchableDropdown
                  options={fishTypes}
                  value={formData.fishType}
                  onChange={(value) => handleInputChange("fishType", value)}
                  placeholder="اختر أو أدخل نوع السمك..."
                  allowCustomInput={true}
                />
                {errors.fishType && (
                  <p className="text-sm text-red-600">{errors.fishType}</p>
                )}
              </div>

              {/* Fish Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  كمية السمك (كجم) *
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  placeholder="أدخل الكمية..."
                />
                {errors.quantity && (
                  <p className="text-sm text-red-600">{errors.quantity}</p>
                )}
              </div>

              {/* Supplier with custom input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  المورد *
                </label>
                <SearchableDropdown
                  options={suppliers}
                  value={formData.supplier}
                  onChange={(value) => handleInputChange("supplier", value)}
                  placeholder="اختر أو أدخل اسم المورد..."
                  allowCustomInput={true}
                />
                {errors.supplier && (
                  <p className="text-sm text-red-600">{errors.supplier}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظات (اختياري)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="أدخل أي ملاحظات إضافية..."
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSubmit}>إضافة الطلب</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft size={20} className="ml-2" />
            العودة إلى الصفحة الرئيسية
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مراجعة الطلبات</h1>
            <p className="text-gray-600 mt-2">
              مراجعة وتأكيد طلبات العملاء لليوم الحالي
            </p>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalToday}
                </p>
                <p className="text-gray-600">إجمالي طلبات اليوم</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-orange-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.underRevision}
                </p>
                <p className="text-gray-600">قيد المراجعة</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600" />
              <div className="mr-4">
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.confirmed}
                </p>
                <p className="text-gray-600">مؤكد</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            البحث والفلترة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اختر العميل
              </label>
              <SearchableDropdown
                options={[
                  "جميع العملاء",
                  ...clients.map(
                    (client) => `${client.name} - ${client.phone}`
                  ),
                ]}
                value={
                  selectedClient
                    ? `${selectedClient} - ${
                        clients.find((c) => c.name === selectedClient)?.phone ||
                        ""
                      }`
                    : "جميع العملاء"
                }
                onChange={(value) => {
                  if (value === "جميع العملاء") {
                    setSelectedClient("");
                  } else {
                    const clientName = value.split(" - ")[0];
                    setSelectedClient(clientName);
                  }
                }}
                placeholder="ابحث عن عميل..."
                allowCustomInput={false}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البحث برقم الهاتف
              </label>
              <Input
                placeholder="أدخل رقم الهاتف..."
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد طلبات
              </h3>
              <p className="text-gray-600">لا توجد طلبات تطابق معايير البحث</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      طلب رقم: {order.orderNumber}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar size={16} className="ml-1" />
                      {new Date(order.orderDate).toLocaleDateString("ar-EG")}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(order.id)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>

                      {openDropdown === order.id && (
                        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                handleViewDetails(order);
                                setOpenDropdown(null);
                              }}
                              className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Eye size={16} className="ml-2" />
                              عرض التفاصيل
                            </button>
                            {order.status === "قيد المراجعة" && (
                              <button
                                onClick={() => {
                                  handleStatusChange(order.id, "مؤكد");
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                              >
                                <Check size={16} className="ml-2" />
                                تأكيد الطلب
                              </button>
                            )}
                            <button
                              onClick={() => {
                                handleEditOrder(order);
                                setOpenDropdown(null);
                              }}
                              className="flex items-center w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit size={16} className="ml-2" />
                              تعديل الطلب
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteOrder(order.id);
                                setOpenDropdown(null);
                              }}
                              className="flex items-center w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} className="ml-2" />
                              حذف الطلب
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <User size={16} className="ml-2" />
                      تفاصيل الطلب
                    </h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">العميل:</span>{" "}
                        {order.clientName}
                      </p>
                      <p>
                        <span className="font-medium">الهاتف:</span>{" "}
                        {order.clientPhone}
                      </p>
                      <p>
                        <span className="font-medium">تاريخ الطلب:</span>{" "}
                        {new Date(order.orderDate).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Package size={16} className="ml-2" />
                      طلبات العميل ({getClientOrders(order.clientName).length})
                    </h4>
                    <div className="space-y-2 text-sm">
                      {getClientOrders(order.clientName).map((clientOrder) => (
                        <div key={clientOrder.id} className="text-gray-600">
                          {clientOrder.fishType} - {clientOrder.quantity} كجم -{" "}
                          {clientOrder.supplier}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View Details Modal */}
        {viewingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                تفاصيل الطلب {viewingOrder.orderNumber}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="اسم العميل"
                    value={viewingOrder.clientName}
                    disabled
                  />
                  <Input
                    label="رقم الهاتف"
                    value={viewingOrder.clientPhone}
                    disabled
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="نوع السمك"
                    value={viewingOrder.fishType}
                    disabled
                  />
                  <Input
                    label="الكمية (كجم)"
                    value={viewingOrder.quantity}
                    disabled
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="المورد"
                    value={viewingOrder.supplier}
                    disabled
                  />
                  {userRole === "admin" && (
                    <Input
                      label="السعر (ج.م/كجم)"
                      value={viewingOrder.price || ""}
                      disabled
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    value={viewingOrder.notes}
                    disabled
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={() => setViewingOrder(null)}>
                  إغلاق
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Order Modal */}
        {editingOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">
                تعديل الطلب {editingOrder.orderNumber}
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="اسم العميل"
                    value={editingOrder.clientName}
                    disabled
                  />
                  <Input
                    label="رقم الهاتف"
                    value={editingOrder.clientPhone}
                    disabled
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نوع السمك
                    </label>
                    <select
                      value={editingOrder.fishType}
                      onChange={(e) =>
                        setEditingOrder((prev) => ({
                          ...prev,
                          fishType: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {fishTypes.map((fish) => (
                        <option key={fish} value={fish}>
                          {fish}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="الكمية (كجم)"
                    type="number"
                    step="0.1"
                    value={editingOrder.quantity}
                    onChange={(e) =>
                      setEditingOrder((prev) => ({
                        ...prev,
                        quantity: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المورد
                    </label>
                    <select
                      value={editingOrder.supplier}
                      onChange={(e) =>
                        setEditingOrder((prev) => ({
                          ...prev,
                          supplier: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {suppliers.map((supplier) => (
                        <option key={supplier} value={supplier}>
                          {supplier}
                        </option>
                      ))}
                    </select>
                  </div>
                  {userRole === "admin" && (
                    <Input
                      label="السعر (ج.م/كجم)"
                      type="number"
                      step="0.01"
                      value={editingOrder.price || ""}
                      onChange={(e) =>
                        setEditingOrder((prev) => ({
                          ...prev,
                          price: parseFloat(e.target.value) || 0,
                        }))
                      }
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ملاحظات
                  </label>
                  <textarea
                    value={editingOrder.notes}
                    onChange={(e) =>
                      setEditingOrder((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={() => setEditingOrder(null)}>
                  إلغاء
                </Button>
                <Button onClick={handleSaveOrder}>حفظ التغييرات</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
