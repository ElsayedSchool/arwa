import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "../../ui/Button";
import type { ExpenseUi } from "../api/expensesApi";

interface ExpensesTableProps {
  expenses: ExpenseUi[];
  onEdit: (expense: ExpenseUi) => void;
  onDelete: (id: string) => void;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({
  expenses,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm border overflow-hidden"
      dir="rtl"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                الاسم
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                الوصف
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                السعر
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                تاريخ الإنشاء
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {expense.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {expense.description || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {expense.price.toLocaleString()} ج.م
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {new Date(expense.createdAt).toLocaleDateString("ar-SA")}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(expense)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(expense.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {expenses.length === 0 && (
        <div className="text-center py-8 text-gray-500">لا توجد مصروفات</div>
      )}
    </div>
  );
};
