import React, { useEffect, useState } from "react";
import { Users, Plus, Search, AlertCircle, Edit, Trash2 } from "lucide-react";
import { TopNavigation } from "../common/TopNavigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import CustomerModal from "./CustomerModal";
import { useCustomerStore } from "../../stores/customerStore";
import type {
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
} from "../../services/customerService";

const CustomersPage: React.FC = () => {
  const {
    customers,
    loading,
    error,
    searchTerm,
    filteredCustomers,
    stats,
    fetchCustomers,
    deleteCustomer,
    setSearchTerm,
    clearError,
  } = useCustomerStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العميل؟")) {
      await deleteCustomer(customerId);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSaveCustomer = async (
    data: CreateCustomerData | UpdateCustomerData
  ) => {
    if (editingCustomer) {
      await useCustomerStore
        .getState()
        .updateCustomer(data as UpdateCustomerData);
    } else {
      await useCustomerStore
        .getState()
        .createCustomer(data as CreateCustomerData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TopNavigation currentPage="customers" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">العملاء</h1>
              <p className="text-gray-600 mt-2">
                إدارة بيانات العملاء ومعلوماتهم
              </p>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={handleAddCustomer}
            >
              <Plus className="h-4 w-4" />
              إضافة عميل جديد
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700">{error}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={clearError}
                className="mr-auto"
              >
                إغلاق
              </Button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في العملاء..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10"
              />
            </div>
          </div>
        </div>

        {/* Clients Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي العملاء
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">عملاء نشطين</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  عملاء جدد هذا الشهر
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.newThisMonth}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  عملاء متوقفين
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inactive}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            قائمة العملاء
          </h3>

          {loading && customers.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">جاري تحميل العملاء...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm
                  ? "لا توجد عملاء تطابق البحث"
                  : "لا توجد عملاء مسجلة"}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddCustomer} className="mt-4">
                  إضافة أول عميل
                </Button>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    الاسم
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    اللقب
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    المستحق
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    آخر دفعة
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {c.nickname || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      <span
                        className={
                          c.totalDue > 0 ? "text-red-600" : "text-green-600"
                        }
                      >
                        {new Intl.NumberFormat("ar-SA", {
                          style: "currency",
                          currency: "SAR",
                          minimumFractionDigits: 2,
                        }).format(c.totalDue)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(c.lastUpdated).toLocaleDateString("ar-SA")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCustomer(c)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(c.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Customer Modal */}
        <CustomerModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          customer={editingCustomer}
          onSave={handleSaveCustomer}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CustomersPage;
