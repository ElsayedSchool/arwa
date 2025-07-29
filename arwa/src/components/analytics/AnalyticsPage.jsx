import React from 'react';
import { ArrowLeft, BarChart3, TrendingUp, Users, Package } from 'lucide-react';

export const AnalyticsPage = ({ onBack }) => {
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
          <h1 className="text-3xl font-bold text-gray-900">التحليلات</h1>
          <p className="text-gray-600 mt-2">تحليل البيانات والتقارير المفصلة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Analytics */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 ml-2" />
              تحليل المبيعات
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">مبيعات هذا الشهر</span>
                <span className="font-semibold">45,230 ج.م</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">نمو المبيعات</span>
                <span className="font-semibold text-green-600">+12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">أفضل منتج</span>
                <span className="font-semibold">بلطي</span>
              </div>
            </div>
          </div>

          {/* Customer Analytics */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 ml-2" />
              تحليل العملاء
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">إجمالي العملاء</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">عملاء جدد هذا الشهر</span>
                <span className="font-semibold text-blue-600">23</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">معدل الاحتفاظ</span>
                <span className="font-semibold">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};