import React, { useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { TopNavigation } from "../common/TopNavigation";

interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalSales: number;
  productsCount: number;
  status: string;
}

const SellersPage: React.FC = () => {
  const sellers: Seller[] = [
    {
      id: 1,
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "01234567890",
      totalSales: 15000,
      productsCount: 25,
      status: "نشط",
    },
    {
      id: 2,
      name: "فاطمة علي",
      email: "fatma@example.com",
      phone: "01987654321",
      totalSales: 12500,
      productsCount: 18,
      status: "نشط",
    },
  ];

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TopNavigation currentPage="sellers" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Users className="ml-3" size={32} />
                إدارة الموردين
              </h1>
              <p className="text-gray-600 mt-2">إدارة الموردين وعمليات البيع</p>
            </div>
            <Button className="inline-flex items-center">
              <Plus size={20} className="ml-2" />
              إضافة مورد جديد
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في الموردين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>

        {/* Sellers Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  اسم المورد
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  البريد الإلكتروني
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  رقم الهاتف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  إجمالي المبيعات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  عدد المنتجات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {seller.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {seller.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {seller.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {seller.totalSales.toLocaleString()} ج.م
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {seller.productsCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {seller.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { SellersPage };
