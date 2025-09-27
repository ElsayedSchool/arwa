import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, AlertCircle } from "lucide-react";
import { TopNavigation } from "../common/TopNavigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import SuppliersAnalysis from "./components/SuppliersAnalysis";
import SuppliersTable from "./components/SuppliersTable.tsx";
import SupplierModal from "./components/SupplierModal";
import { useSupplierStore } from "../../stores/supplierStore";
import type {
  Supplier,
  CreateSupplierData,
  UpdateSupplierData,
} from "./models/supplier";

const SuppliersPage: React.FC = () => {
  const {
    suppliers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    clearError,
    deleteSupplier,
  } = useSupplierStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    useSupplierStore.getState().fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    if (!searchTerm) return suppliers;
    const term = searchTerm.toLowerCase();
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        (s.nickName && s.nickName.toLowerCase().includes(term)) ||
        s.phone.includes(searchTerm)
    );
  }, [suppliers, searchTerm]);

  const stats = useMemo(() => {
    const total = suppliers.length;
    const active = suppliers.filter((s) => Number(s.totalDue) > 0).length;
    const inactive = suppliers.filter((s) => Number(s.totalDue) === 0).length;
    const totalDueMoney = suppliers.reduce(
      (sum, s) => sum + Number(s.totalDue),
      0
    );
    return { total, active, inactive, totalDueMoney };
  }, [suppliers]);

  const handleDelete = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المورد؟")) {
      await deleteSupplier(id);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  const handleSave = async (data: CreateSupplierData | UpdateSupplierData) => {
    if (editingSupplier) {
      await useSupplierStore
        .getState()
        .updateSupplier(data as UpdateSupplierData);
    } else {
      await useSupplierStore
        .getState()
        .createSupplier(data as CreateSupplierData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TopNavigation currentPage="suppliers" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">الموردون</h1>
              <p className="text-gray-600 mt-2">
                إدارة بيانات الموردين ومعلوماتهم
              </p>
            </div>
            <Button className="flex items-center gap-2" onClick={handleAdd}>
              <Plus className="h-4 w-4" />
              إضافة مورد جديد
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
                placeholder="البحث في الموردين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10"
              />
            </div>
          </div>
        </div>

        <SuppliersAnalysis stats={stats} />

        <div className="bg-white rounded-lg shadow-sm p-6 overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            قائمة الموردين
          </h3>
          <SuppliersTable
            suppliers={filteredSuppliers}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <SupplierModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          supplier={editingSupplier}
          onSave={handleSave}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default SuppliersPage;
