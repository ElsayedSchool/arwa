import React from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

const SuppliersPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إدارة الموردين</h1>
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
            <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              صفحة إدارة الموردين
            </h2>
            <p className="text-gray-600 mb-6">
              هذه الصفحة قيد التطوير. سيتم إضافة إدارة الموردين قريباً.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <strong>الميزات القادمة:</strong>
              </p>
              <ul className="text-blue-700 mt-2 text-right">
                <li>• عرض قائمة الموردين</li>
                <li>• إضافة مورد جديد</li>
                <li>• تتبع المدفوعات والمستحقات</li>
                <li>• تحليل أداء الموردين</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SuppliersPage };
