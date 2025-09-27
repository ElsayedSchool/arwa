import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, AlertCircle } from "lucide-react";
import { TopNavigation } from "../common/TopNavigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useCustomerStore } from "../../stores/customerStore";
import type {
  Customer,
  CreateCustomerData,
  UpdateCustomerData,
} from "./models/customer";
import CustomerModal from "./components/CustomerModal";
import CustomersAnalysis from "./components/CustomersAnalysis";
import CustomersTable from "./components/CustomersTable";

const CustomersPage: React.FC = () => {
  const {
    customers,
    loading,
    error,
    searchTerm,
    deleteCustomer,
    setSearchTerm,
    clearError,
  } = useCustomerStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    useCustomerStore.getState().fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const term = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.phoneNumber.includes(searchTerm) ||
        (c.nickname && c.nickname.toLowerCase().includes(term))
    );
  }, [customers, searchTerm]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      total: customers.length,
      active: customers.filter((c) => Number(c.totalDue) > 0).length,
      newThisMonth: customers.filter((c) => new Date(c.createdAt) >= thisMonth)
        .length,
      inactive: customers.filter((c) => Number(c.totalDue) === 0).length,
    };
  }, [customers]);

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

        <CustomersAnalysis stats={stats} />

        <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            قائمة العملاء
          </h3>
          <CustomersTable
            customers={filteredCustomers}
            loading={loading}
            searchTerm={searchTerm}
            onAdd={handleAddCustomer}
            onEdit={handleEditCustomer}
            onDelete={handleDeleteCustomer}
          />
        </div>

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
