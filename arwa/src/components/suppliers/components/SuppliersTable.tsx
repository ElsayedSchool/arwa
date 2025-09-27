import React from "react";
import { Edit, Trash2 } from "lucide-react";
import type { Supplier } from "../models/supplier";

interface SuppliersTableProps {
  suppliers: Supplier[];
  loading?: boolean;
  searchTerm?: string;
  onAdd: () => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}

const fmt = new Intl.NumberFormat("ar-EG");
const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("ar-EG") : "—";

const SuppliersTable: React.FC<SuppliersTableProps> = ({
  suppliers,
  loading = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الاسم
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الهاتف
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              واتساب
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              إجمالي المبلغ
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المدفوع
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المتبقي
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              آخر تحديث
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                جاري التحميل...
              </td>
            </tr>
          ) : suppliers.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                لا توجد بيانات موردين
              </td>
            </tr>
          ) : (
            suppliers.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {s.name}
                  </div>
                  {s.nickName && (
                    <div className="text-xs text-gray-500">{s.nickName}</div>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {s.phone}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {s.whatsApp || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {fmt.format(s.totalMoney)} ج.م
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {fmt.format(s.totalPaid)} ج.م
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={
                      s.totalDue > 0
                        ? "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        : "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    }
                  >
                    {fmt.format(s.totalDue)} ج.م
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                  {fmtDate(s.lastUpdated)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-left">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(s)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(s.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SuppliersTable;
