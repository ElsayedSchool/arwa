import React from "react";
import { Settings, Plus, Search, Grid3X3 } from "lucide-react";
import { TopNavigation } from "../common/TopNavigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TopNavigation currentPage="settings" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إعدادات النظام</h1>
              <p className="text-gray-600 mt-2">إعدادات النظام والتكوين</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة إعداد جديد
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الإعدادات..."
                className="w-full pr-10"
              />
            </div>
          </div>
        </div>

        {/* Settings Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إعدادات النظام</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Grid3X3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إعدادات المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إعدادات الأمان</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Grid3X3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إعدادات أخرى</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Table Placeholder */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات النظام</h3>
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">سيتم عرض إعدادات النظام هنا</p>
              <p className="text-sm text-gray-400 mt-2">قريباً - تحت التطوير</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;