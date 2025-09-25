import React from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign } from "lucide-react";

const ProfitsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">الأرباح اليومية</h1>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            العودة للرئيسية
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <DollarSign className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              صفحة الأرباح اليومية
            </h2>
            <p className="text-gray-600 mb-6">
              هذه الصفحة قيد التطوير. سيتم إضافة تتبع الأرباح قريباً.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-800">
                <strong>الميزات القادمة:</strong>
              </p>
              <ul className="text-emerald-700 mt-2 text-right">
                <li>• عرض الأرباح اليومية</li>
                <li>• تحليل الإيرادات</li>
                <li>• تتبع المصروفات</li>
                <li>• تقارير الأرباح التفصيلية</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfitsPage };
