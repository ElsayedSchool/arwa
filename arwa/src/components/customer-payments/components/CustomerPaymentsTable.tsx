import React from "react";
import { DollarSign, Calendar, User } from "lucide-react";
import { Button } from "../../ui/Button";
import type { CustomerPayment } from "../api/customerPaymentsApi";

interface CustomerPaymentsTableProps {
  payments: CustomerPayment[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const CustomerPaymentsTable: React.FC<CustomerPaymentsTableProps> = ({
  payments,
  loading,
  error,
  onRetry,
}) => {
  const formatCurrency = (amount: number) => {
    const numAmount =
      typeof amount === "number"
        ? amount
        : typeof amount === "string"
        ? parseFloat(amount)
        : 0;
    return `${numAmount.toFixed(2)} ج.م`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            سجل المدفوعات
          </h3>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            سجل المدفوعات
          </h3>
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <DollarSign className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-red-600">{error}</p>
            <Button onClick={onRetry} className="mt-4">
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            سجل المدفوعات
          </h3>
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              لا توجد مدفوعات تطابق الفلاتر المحددة
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          سجل المدفوعات
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الهاتف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المرحل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المطلوب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المدفوع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الخصم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الباقى
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {payment.customerName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.customerPhone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 ml-1 text-gray-400" />
                      {formatDate(payment.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    {formatCurrency(payment.totalDebt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {formatCurrency(payment.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(payment.paid)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                    {formatCurrency(payment.discount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                    {formatCurrency(payment.updatedDebt)}
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
