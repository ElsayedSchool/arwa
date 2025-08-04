import React, { useState } from "react";
import { useSuppliers } from "../../hooks/useSuppliers.js";
import { SuppliersTable } from "./SuppliersTable";
import { AddSupplierModal } from "./AddSupplierModal";
import { EditSupplierModal } from "./EditSupplierModal";
import { EditPaymentModal } from "./EditPaymentModal";
import { EditPriceModal } from "./EditPriceModal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
  ArrowLeft,
  Plus,
  Search,
  Download,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  Archive,
} from "lucide-react";

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
    dateFilter,
    setDateFilter,
    dateRange,
    setDateRange,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  } = useSuppliers();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [showEditPriceModal, setShowEditPriceModal] = useState(false);
  const [selectedSupplierForPayment, setSelectedSupplierForPayment] =
    useState(null);
  const [selectedSupplierForPrice, setSelectedSupplierForPrice] =
    useState(null);

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

  const handleEditPayment = (supplier) => {
    setSelectedSupplierForPayment(supplier);
    setShowEditPaymentModal(true);
  };

  const handleEditPrice = (supplier) => {
    setSelectedSupplierForPrice(supplier);
    setShowEditPriceModal(true);
  };

  const handleEditDueDate = (supplier) => {
    console.log("Edit due date for:", supplier);
  };

  const handleUpdatePayment = async (paymentData) => {
    try {
      await updateSupplier(selectedSupplierForPayment.id, paymentData);
      setShowEditPaymentModal(false);
      setSelectedSupplierForPayment(null);
    } catch (error) {
      alert("فشل في تحديث بيانات الدفع");
    }
  };

  const handleUpdatePrice = async (priceData) => {
    try {
      await updateSupplier(selectedSupplierForPrice.id, priceData);
      setShowEditPriceModal(false);
      setSelectedSupplierForPrice(null);
    } catch (error) {
      alert("فشل في تحديث السعر");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedFishType("");
    setPaymentFilter("all");
    setDateFilter("all");
    setDateRange({ from: "", to: "" });
  };

  const getStockStatus = (supplier) => {
    if (supplier.totalWeight > 400) return "high";
    if (supplier.totalWeight > 200) return "medium";
    return "low";
  };

  const getPaymentStatusText = (status) => {
    const statusMap = {
      paid: "مدفوع",
      partial: "مدفوع جزئي",
      unpaid: "غير مدفوع",
    };
    return statusMap[status] || "غير محدد";
  };

  const getPaymentStatusVariant = (status) => {
    const variantMap = {
      paid: "success",
      partial: "warning",
      unpaid: "destructive",
    };
    return variantMap[status] || "secondary";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        جاري التحميل...
      </div>
    );
  if (error)
    return <div className="text-red-600 text-center">خطأ: {error}</div>;

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
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                تحليل الموردين
              </h1>
              <p className="text-gray-600 mt-2">
                متابعة وتحليل أداء جميع الموردين والمخزون
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Download size={16} className="ml-2" />
                تصدير التقرير الشامل
              </Button>
              <Button
                onClick={() => setShowAddModal(true)}
                className="w-full sm:w-auto"
              >
                <Plus size={20} className="ml-2" />
                إضافة مورد جديد
              </Button>
            </div>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-6">
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 lg:p-3 rounded-full bg-blue-100">
                <Package className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
              </div>
              <div className="mr-3 lg:mr-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">
                  إجمالي التوريد
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {suppliers
                    .reduce(
                      (sum, supplier) => sum + (supplier.totalWeight || 0),
                      0
                    )
                    .toFixed(1)}{" "}
                  كجم
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 lg:p-3 rounded-full bg-indigo-100">
                <Archive className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-600" />
              </div>
              <div className="mr-3 lg:mr-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">
                  إجمالي المخزون
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {suppliers
                    .reduce((sum, supplier) => {
                      const stored =
                        (supplier.totalWeight || 0) -
                        (supplier.soldWeight || 0);
                      return sum + Math.max(0, stored);
                    }, 0)
                    .toFixed(1)}{" "}
                  كجم
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 lg:p-3 rounded-full bg-green-100">
                <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
              </div>
              <div className="mr-3 lg:mr-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">
                  إجمالي المبيعات
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {suppliers
                    .reduce(
                      (sum, supplier) => sum + (supplier.totalAmount || 0),
                      0
                    )
                    .toLocaleString()}{" "}
                  ج.م
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 lg:p-3 rounded-full bg-purple-100">
                <Users className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
              </div>
              <div className="mr-3 lg:mr-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">
                  عدد الموردين
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {suppliers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 lg:p-3 rounded-full bg-orange-100">
                <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
              </div>
              <div className="mr-3 lg:mr-4">
                <p className="text-xs lg:text-sm font-medium text-gray-600">
                  إجمالي التوصيلات
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {suppliers.reduce(
                    (sum, supplier) => sum + (supplier.totalDeliveries || 0),
                    0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <h3 className="text-lg font-medium text-gray-900">
              البحث والتصفية
            </h3>
            <Button
              variant="outline"
              onClick={clearFilters}
              size="sm"
              className="w-full sm:w-auto"
            >
              مسح الفلاتر
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Date Filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">جميع التواريخ</option>
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="range">فترة محددة</option>
            </select>

            <select
              value={selectedFishType}
              onChange={(e) => setSelectedFishType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">جميع أنواع الأسماك</option>
              <option value="بلطي">بلطي</option>
              <option value="مبروك">مبروك</option>
              <option value="قراميط">قراميط</option>
              <option value="دنيس">دنيس</option>
              <option value="قاروص">قاروص</option>
              <option value="بوري">بوري</option>
              <option value="سردين">سردين</option>
              <option value="تونة">تونة</option>
              <option value="سلمون">سلمون</option>
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">جميع حالات الدفع</option>
              <option value="paid">مدفوع</option>
              <option value="partial">مدفوع جزئي</option>
              <option value="unpaid">غير مدفوع</option>
            </select>
          </div>

          {/* Date Range Inputs */}
          {dateFilter === "range" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Input
                label="من تاريخ"
                type="date"
                value={dateRange.from}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, from: e.target.value }))
                }
              />
              <Input
                label="إلى تاريخ"
                type="date"
                value={dateRange.to}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, to: e.target.value }))
                }
              />
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              بيانات الموردين
            </h3>
          </div>
          <SuppliersTable
            data={suppliers}
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

      {/* Add Supplier Modal */}
      {showAddModal && (
        <AddSupplierModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddSupplier}
        />
      )}

      {/* Edit Supplier Modal */}
      {editingSupplier && (
        <EditSupplierModal
          isOpen={!!editingSupplier}
          onClose={() => setEditingSupplier(null)}
          onSave={(data) => handleEditSupplier(editingSupplier.id, data)}
          supplier={editingSupplier}
        />
      )}

      {/* Edit Payment Modal */}
      {showEditPaymentModal && (
        <EditPaymentModal
          isOpen={showEditPaymentModal}
          onClose={() => setShowEditPaymentModal(false)}
          onSave={handleUpdatePayment}
          supplier={selectedSupplierForPayment}
        />
      )}

      {/* Edit Price Modal */}
      {showEditPriceModal && (
        <EditPriceModal
          isOpen={showEditPriceModal}
          onClose={() => setShowEditPriceModal(false)}
          onSave={handleUpdatePrice}
          supplier={selectedSupplierForPrice}
        />
      )}
    </div>
  );
};
