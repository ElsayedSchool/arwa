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

const LandPage: React.FC = () => {
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

        <div className="space-y-12">
          {/* العمليات اليومية */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right border-b-2 border-green-500 pb-2">
              العمليات اليومية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <button
                onClick={() => navigate("/dashboard/orders")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <ShoppingCart className="h-8 w-8 text-green-600 group-hover:text-green-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    إنشاء طلب للعميل
                  </h3>
                </div>
                <p className="text-gray-600">إدارة وإضافة طلبات العملاء</p>
              </button>

              <button
                onClick={() => navigate("/dashboard/client-payments")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <DollarSign className="h-8 w-8 text-emerald-600 group-hover:text-emerald-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    مدفوعات العملاء
                  </h3>
                </div>
                <p className="text-gray-600">إدارة مدفوعات العملاء</p>
              </button>

              <button
                onClick={() => navigate("/dashboard/deliveries")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <Package className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    تسجيل توريد جديد
                  </h3>
                </div>
                <p className="text-gray-600">إدارة المخزون وعمليات التوصيل</p>
              </button>

              <button
                onClick={() => navigate("/dashboard/inventory")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <BarChart3 className="h-8 w-8 text-orange-600 group-hover:text-orange-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    جرد نهاية اليوم
                  </h3>
                </div>
                <p className="text-gray-600">جرد المخزون نهاية كل يوم</p>
              </button>

              <button
                onClick={() => navigate("/dashboard/pricing")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <DollarSign className="h-8 w-8 text-yellow-600 group-hover:text-yellow-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    تسعير اليوم
                  </h3>
                </div>
                <p className="text-gray-600">تحديد أسعار اليوم</p>
              </button>
            </div>
          </div>

          {/* البيانات الأساسية */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right border-b-2 border-blue-500 pb-2">
              البيانات الأساسية
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => navigate("/dashboard/clients")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <Users className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    العملاء
                  </h3>
                </div>
                <p className="text-gray-600">إدارة بيانات العملاء ومعلوماتهم</p>
              </button>

              <button
                onClick={() => navigate("/dashboard/suppliers")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <Package className="h-8 w-8 text-green-600 group-hover:text-green-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    الموردون
                  </h3>
                </div>
                <p className="text-gray-600">
                  تحليل أداء الموردين ومتابعة المخزون
                </p>
              </button>

              <button
                onClick={() => navigate("/dashboard/categories")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <Grid3X3 className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    أنواع الأسماك
                  </h3>
                </div>
                <p className="text-gray-600">إضافة وتعديل فئات المنتجات</p>
              </button>

              <button
                onClick={() => navigate("/dashboard/employees")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <Users className="h-8 w-8 text-purple-600 group-hover:text-purple-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    الموظفون والرواتب
                  </h3>
                </div>
                <p className="text-gray-600">إدارة الموظفين ورواتبهم</p>
              </button>
            </div>
          </div>

          {/* التقارير والتحليلات */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right border-b-2 border-red-500 pb-2">
              التقارير والتحليلات
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => navigate("/dashboard/period-profits")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <BarChart3 className="h-8 w-8 text-red-600 group-hover:text-red-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    أرباح الفترة
                  </h3>
                </div>
                <p className="text-gray-600">تقارير أرباح الفترة المحددة</p>
              </button>

              <button
                onClick={() => navigate("/dashboard/profits")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <DollarSign className="h-8 w-8 text-emerald-600 group-hover:text-emerald-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    أرباح يومية
                  </h3>
                </div>
                <p className="text-gray-600">
                  متابعة الأرباح والإيرادات اليومية
                </p>
              </button>

              <button
                onClick={() => navigate("/dashboard/client-debts")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <DollarSign className="h-8 w-8 text-red-600 group-hover:text-red-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    ديون ومدفوعات العملاء
                  </h3>
                </div>
                <p className="text-gray-600">متابعة ديون العملاء ومدفوعاتهم</p>
              </button>

              <button
                onClick={() => navigate("/dashboard/inventory-movement")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <Package className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    حركة المخزون
                  </h3>
                </div>
                <p className="text-gray-600">تتبع حركة المخزون والمبيعات</p>
              </button>
            </div>
          </div>

          {/* الإعدادات وإدارة المستخدمين */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-right border-b-2 border-purple-500 pb-2">
              الإعدادات وإدارة المستخدمين
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => navigate("/dashboard/reviews")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <Star className="h-8 w-8 text-yellow-600 group-hover:text-yellow-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    مراجعة الطلبات
                  </h3>
                </div>
                <p className="text-gray-600">مراجعة وتأكيد الطلبات المشتراة</p>
              </button>

              <button
                onClick={() => navigate("/dashboard/analytics")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <BarChart3 className="h-8 w-8 text-purple-600 group-hover:text-purple-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    التحليلات المتقدمة
                  </h3>
                </div>
                <p className="text-gray-600">
                  تحليل البيانات والتقارير المفصلة
                </p>
              </button>

              <button
                onClick={() => navigate("/dashboard/settings")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <Grid3X3 className="h-8 w-8 text-gray-600 group-hover:text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    إعدادات النظام
                  </h3>
                </div>
                <p className="text-gray-600">إعدادات النظام والتكوين</p>
              </button>

              <button
                onClick={() => navigate("/dashboard/users")}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer text-right group"
              >
                <div className="flex items-center mb-3">
                  <Users className="h-8 w-8 text-indigo-600 group-hover:text-indigo-700" />
                  <h3 className="text-lg font-semibold text-gray-900 mr-3">
                    إدارة المستخدمين
                  </h3>
                </div>
                <p className="text-gray-600">إدارة المستخدمين والصلاحيات</p>
              </button>
            </div>
          </div>
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
