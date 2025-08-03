import React, { useState } from "react";
import { useSuppliers } from "../../hooks/useSuppliers.js";
import { SuppliersTable } from "./SuppliersTable";
import { AddSupplierModal } from "./AddSupplierModal";
import { EditSupplierModal } from "./EditSupplierModal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ArrowLeft, Plus, Search, Download } from "lucide-react";

export const SuppliersPage = ({ onBack, userRole = "admin" }) => {
  const {
    suppliers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedFishType,
    setSelectedFishType,
    paymentFilter,
    setPaymentFilter,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  } = useSuppliers();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const handleAddSupplier = async (supplierData) => {
    try {
      await createSupplier(supplierData);
      setShowAddModal(false);
    } catch (error) {
      alert("فشل في إضافة المورد");
    }
  };

  const handleEditSupplier = async (supplierId, supplierData) => {
    try {
      await updateSupplier(supplierId, supplierData);
      setEditingSupplier(null);
    } catch (error) {
      alert("فشل في تحديث المورد");
    }
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المورد؟")) {
      try {
        await deleteSupplier(supplierId);
      } catch (error) {
        alert("فشل في حذف المورد");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        جاري التحميل...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center">خطأ: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft size={20} className="ml-2" />
            العودة إلى الصفحة الرئيسية
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                تحليل الموردين
              </h1>
              <p className="text-gray-600 mt-2">
                متابعة وتحليل أداء جميع الموردين والمخزون
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download size={16} className="ml-2" />
                تصدير التقرير الشامل
              </Button>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus size={20} className="ml-2" />
                إضافة مورد جديد
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <Input
                placeholder="البحث عن مورد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <select
              value={selectedFishType}
              onChange={(e) => setSelectedFishType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع أنواع الأسماك</option>
              <option value="بلطي">بلطي</option>
              <option value="مبروك">مبروك</option>
              <option value="قراميط">قراميط</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع حالات الدفع</option>
              <option value="paid">مدفوع</option>
              <option value="partial">مدفوع جزئي</option>
              <option value="unpaid">غير مدفوع</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              بيانات الموردين
            </h3>
          </div>
          <SuppliersTable
            data={filteredData}
            getStockStatus={getStockStatus}
            onEditPayment={handleEditPayment}
            onEditPrice={handleEditPrice}
            onEditDueDate={handleEditDueDate}
            userRole={userRole}
            getPaymentStatusText={getPaymentStatusText}
            getPaymentStatusVariant={getPaymentStatusVariant}
          />
        </div>
      </div>
      <EditPaymentModal
        isOpen={showEditPaymentModal}
        onClose={() => setShowEditPaymentModal(false)}
        onSave={handleUpdatePayment}
        supplier={selectedSupplierForPayment}
      />
      <EditPriceModal
        isOpen={showEditPriceModal}
        onClose={() => setShowEditPriceModal(false)}
        onSave={handleUpdatePrice}
        supplier={selectedSupplierForPrice}
      />
    </div>
  );
};
