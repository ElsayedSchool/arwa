import React, { useState, useMemo } from "react";
import {
  Search,
  Package,
  Plus,
  Edit,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { TopNavigation } from "../common/TopNavigation";

interface Order {
  id: number;
  orderNumber: string;
  clientName: string;
  clientPhone?: string;
  fishType: string;
  fishAmount: number;
  supplierName: string;
  orderDate: string;
  orderTime?: string;
  addedTime: string;
}

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface FishItem {
  fishType: string;
  quantity: string;
  supplier: string;
}

interface FormData {
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  fishItems: FishItem[];
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderNumber: "ORD-001",
      clientName: "محمد أحمد",
      fishType: "بلطي",
      fishAmount: 5,
      supplierName: "مورد الأسماك الطازجة",
      orderDate: new Date().toISOString().split("T")[0],
      orderTime: "08:30",
      addedTime: new Date().toISOString(),
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      clientName: "فاطمة علي",
      fishType: "دنيس",
      fishAmount: 2,
      supplierName: "شركة البحر الأحمر",
      orderDate: new Date().toISOString().split("T")[0],
      orderTime: "14:20",
      addedTime: new Date().toISOString(),
    },
    {
      id: 3,
      orderNumber: "ORD-003",
      clientName: "أحمد سعد",
      fishType: "مبروك",
      fishAmount: 4,
      supplierName: "مزرعة الأسماك الذهبية",
      orderDate: new Date().toISOString().split("T")[0],
      orderTime: "16:45",
      addedTime: new Date().toISOString(),
    },
  ]);

  const [clients, setClients] = useState<Client[]>([
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

  const [suppliers] = useState<string[]>([
    "مورد الأسماك الطازجة",
    "شركة البحر الأبيض",
    "مزرعة الأسماك الذهبية",
    "تجارة الأسماك المتحدة",
  ]);

  const [fishTypes] = useState<string[]>([
    "بلطي",
    "دنيس",
    "مبروك",
    "بوري",
    "قاروص",
    "سردين",
    "تونة",
    "سلمون",
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [isNewClient, setIsNewClient] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    clientId: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    fishItems: [{ fishType: "", quantity: "", supplier: "" }],
  });

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const toggleDropdown = (orderId: number) => {
    setOpenDropdown(openDropdown === orderId ? null : orderId);
  };

  const handleDeleteOrder = (orderId: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    }
  };

  const handleEditOrder = (order: Order) => {
    // TODO: Implement edit functionality
    console.log("Edit order:", order);
  };

  // Filter orders for today and by search terms
  const filteredOrders = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return orders.filter((order) => {
      const isToday = order.orderDate === today;
      const matchesName = order.clientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPhone = order.clientPhone?.includes(phoneFilter) || true;
      return isToday && matchesName && matchesPhone;
    });
  }, [orders, searchTerm, phoneFilter]);

  const handleClientSelect = (clientName: string) => {
    const selectedClient = clients.find((client) => client.name === clientName);
    if (selectedClient) {
      setFormData((prev) => ({
        ...prev,
        clientId: selectedClient.id.toString(),
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

  const addFishItem = () => {
    setFormData((prev) => ({
      ...prev,
      fishItems: [
        ...prev.fishItems,
        { fishType: "", quantity: "", supplier: "" },
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
    // Create orders for each fish item
    formData.fishItems.forEach((fishItem, index) => {
      const newOrder: Order = {
        id: Date.now() + index,
        orderNumber: `ORD-${String(orders.length + index + 1).padStart(
          3,
          "0"
        )}`,
        clientName: formData.clientName,
        clientPhone: formData.clientPhone,
        fishType: fishItem.fishType,
        fishAmount: parseFloat(fishItem.quantity),
        supplierName: fishItem.supplier,
        orderDate: new Date().toISOString().split("T")[0],
        addedTime: new Date().toISOString(),
      };

      setOrders((prev) => [newOrder, ...prev]);
    });

    // Add new client if needed
    if (isNewClient) {
      const newClient: Client = {
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
      fishItems: [{ fishType: "", quantity: "", supplier: "" }],
    });
    setIsNewClient(false);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TopNavigation currentPage="orders" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                إدارة الطلبات
              </h1>
              <p className="text-gray-600 mt-2">
                عرض وإدارة طلبات اليوم الحالي
              </p>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus size={20} className="ml-2" />
              إضافة طلب جديد
            </Button>
          </div>
        </div>

        {/* Search Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            البحث والفلترة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث باسم العميل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Input
              placeholder="البحث برقم الهاتف..."
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value)}
            />
          </div>
        </div>

        {/* Add Order Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">إضافة طلب جديد</h3>

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
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientPhone: e.target.value,
                        }))
                      }
                    />
                    <Input
                      placeholder="البريد الإلكتروني"
                      value={formData.clientEmail}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          clientEmail: e.target.value,
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
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <select
                        value={item.fishType}
                        onChange={(e) =>
                          updateFishItem(index, "fishType", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">نوع السمك</option>
                        {fishTypes.map((fish) => (
                          <option key={fish} value={fish}>
                            {fish}
                          </option>
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

                      <select
                        value={item.supplier}
                        onChange={(e) =>
                          updateFishItem(index, "supplier", e.target.value)
                        }
                        className="px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">المورد</option>
                        {suppliers.map((supplier) => (
                          <option key={supplier} value={supplier}>
                            {supplier}
                          </option>
                        ))}
                      </select>

                      <Button
                        onClick={() => removeFishItem(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        disabled={formData.fishItems.length === 1}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleSubmit}>حفظ الطلب</Button>
              </div>
            </div>
          </div>
        )}

        {/* Today's Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              طلبات اليوم ({filteredOrders.length})
            </h2>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لا توجد طلبات اليوم
              </h3>
              <p className="text-gray-600">
                لم يتم إضافة أي طلبات لليوم الحالي
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اسم العميل
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نوع السمك
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الكمية (كجم)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المورد
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      وقت الإضافة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.fishType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.fishAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.supplierName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.addedTime).toLocaleTimeString("ar-EG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { OrdersPage };
