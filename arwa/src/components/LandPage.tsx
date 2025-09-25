import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Star,
  DollarSign,
  Grid3X3,
} from "lucide-react";

interface LandPageProps {
  userRole?: string;
}

const LandPage: React.FC<LandPageProps> = ({ userRole = "admin" }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            لوحة التحكم الرئيسية
          </h1>
          <p className="text-xl text-gray-600">
            مرحباً بك في نظام إدارة موردي الأسماك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Suppliers Analysis - Admin Only */}
          {userRole === "admin" && (
            <button
              onClick={() => navigate("/dashboard/suppliers")}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
            >
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
                <h3 className="text-lg font-semibold text-gray-900 mr-3">
                  تحليل الموردين
                </h3>
              </div>
              <p className="text-gray-600">
                تحليل أداء الموردين ومتابعة المخزون (للمديرين فقط)
              </p>
            </button>
          )}

          {/* Inventory Management */}
          <button
            onClick={() => navigate("/dashboard/deliveries")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
          >
            <div className="flex items-center mb-4">
              <ShoppingCart className="h-8 w-8 text-green-600 group-hover:text-green-700" />
              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                إدارة المخزون
              </h3>
            </div>
            <p className="text-gray-600">إدارة المخزون وعمليات التوصيل</p>
          </button>

          {/* Manage Orders */}
          <button
            onClick={() => navigate("/dashboard/orders")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
          >
            <div className="flex items-center mb-4">
              <Package className="h-8 w-8 text-green-600 group-hover:text-green-700" />
              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                إدارة الطلبات
              </h3>
            </div>
            <p className="text-gray-600">إدارة وإضافة طلبات العملاء</p>
          </button>

          {/* Revise Orders */}
          <button
            onClick={() => navigate("/dashboard/reviews")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
          >
            <div className="flex items-center mb-4">
              <Star className="h-8 w-8 text-yellow-600 group-hover:text-yellow-700" />
              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                مراجعة الطلبات
              </h3>
            </div>
            <p className="text-gray-600">مراجعة وتأكيد الطلبات المشتراة</p>
          </button>

          {/* Categories Management */}
          <button
            onClick={() => navigate("/dashboard/categories")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
          >
            <div className="flex items-center mb-4">
              <Grid3X3 className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700" />
              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                إدارة الفئات
              </h3>
            </div>
            <p className="text-gray-600">إضافة وتعديل فئات المنتجات</p>
          </button>

          {/* Daily Profits */}
          <button
            onClick={() => navigate("/dashboard/profits")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
          >
            <div className="flex items-center mb-4">
              <DollarSign className="h-8 w-8 text-emerald-600 group-hover:text-emerald-700" />
              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                الأرباح اليومية
              </h3>
            </div>
            <p className="text-gray-600">متابعة الأرباح والإيرادات اليومية</p>
          </button>

          {/* Analytics */}
          <button
            onClick={() => navigate("/dashboard/analytics")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
          >
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-red-600 group-hover:text-red-700" />
              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                التحليلات
              </h3>
            </div>
            <p className="text-gray-600">تحليل البيانات والتقارير المفصلة</p>
          </button>
        </div>

        {/* Quick Stats */}
        <div
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
          style={{ display: "none" }}
        >
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الموردين
                </p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  الطلبات اليوم
                </p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  الأرباح اليوم
                </p>
                <p className="text-2xl font-bold text-gray-900">2,450 ج.م</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandPage;
