import React from "react";
import { Package, Plus, Search, BarChart3 } from "lucide-react";
import { TopNavigation } from "../common/TopNavigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const InventoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TopNavigation currentPage="inventory" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                جرد نهاية اليوم
              </h1>
              <p className="text-gray-600 mt-2">جرد المخزون نهاية كل يوم</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة جرد جديد
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="البحث في الجرد..." className="w-full pr-10" />
            </div>
          </div>
        </div>

        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي المخزون
                </p>
                <p className="text-2xl font-bold text-gray-900">2,450 كجم</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  الكمية المتاحة
                </p>
                <p className="text-2xl font-bold text-gray-900">2,120 كجم</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  الكمية المباعة اليوم
                </p>
                <p className="text-2xl font-bold text-gray-900">330 كجم</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <Package className="h-6 w-6 text-red-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  نقص في المخزون
                </p>
                <p className="text-2xl font-bold text-gray-900">5 أنواع</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table Placeholder */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              تفاصيل الجرد
            </h3>
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">سيتم عرض تفاصيل الجرد هنا</p>
              <p className="text-sm text-gray-400 mt-2">قريباً - تحت التطوير</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
