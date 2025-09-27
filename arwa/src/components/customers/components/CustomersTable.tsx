import React from "react";
import { Users, Edit, Trash2 } from "lucide-react";
import type { Customer } from "../models/customer";

interface CustomersTableProps {
  customers: Customer[];
  loading: boolean;
  searchTerm: string;
  onAdd: () => void;
  onEdit: (c: Customer) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("ar-SA");
};

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  loading,
  searchTerm,
  onAdd,
  onEdit,
  onDelete,
}) => {
  if (loading && customers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">جاري تحميل العملاء...</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">
          {searchTerm ? "لا توجد عملاء تطابق البحث" : "لا توجد عملاء مسجلة"}
        </p>
        {!searchTerm && (
          <button onClick={onAdd} className="mt-4 btn btn-primary">
            إضافة أول عميل
          </button>
        )}
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
            الاسم
          </th>
          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
            اللقب
          </th>
          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
            المستحق
          </th>
          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
            آخر دفعة
          </th>
          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
            إجراءات
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {customers.map((c) => (
          <tr key={c.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-sm text-gray-900">{c.name}</td>
            <td className="px-4 py-3 text-sm text-gray-600">
              {c.nickname || "-"}
            </td>
            <td className="px-4 py-3 text-sm font-medium">
              <span
                className={c.totalDue > 0 ? "text-red-600" : "text-green-600"}
              >
                {formatCurrency(c.totalDue)}
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">
              {formatDate(c.lastUpdated)}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(c)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="تعديل"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(c.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="حذف"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomersTable;
