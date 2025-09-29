import React from "react";
import { Edit, Trash2, Power, Key } from "lucide-react";
import { Input } from "../../ui/Input";
import type { Employee } from "../models/employee";

interface EmployeesTableProps {
  employees: Employee[];
  onEdit: (id: string) => void;
  onDeactivate: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
  onResetPassword: (id: string, password: string) => Promise<boolean>;
  newPasswords: Record<string, string>;
  onNewPasswordChange: (id: string, password: string) => void;
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees,
  onEdit,
  onDeactivate,
  onDelete,
  onResetPassword,
  newPasswords,
  onNewPasswordChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          قائمة الموظفين
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  الاسم
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  الهاتف
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  الراتب
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  الأدوار
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  نشط
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  تاريخ الانضمام
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((e) => (
                <tr key={e.id}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                    {e.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {e.phone}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {Number(e.salary).toLocaleString()} ج.م
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {e.isAdmin && (
                        <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs">
                          Admin
                        </span>
                      )}
                      {(e.roles || []).map((r) => (
                        <span
                          key={r}
                          className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <span
                      className={e.isActive ? "text-green-600" : "text-red-600"}
                    >
                      {e.isActive ? "نشط" : "غير نشط"}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    {new Date(e.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <button
                        title="تفعيل/تعطيل"
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => onDeactivate(e.id, !e.isActive)}
                      >
                        <Power className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        title="تعديل"
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => onEdit(e.id)}
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        title="حذف"
                        className="p-1 hover:bg-gray-100 rounded"
                        onClick={() => onDelete(e.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                      <div className="flex items-center">
                        <Input
                          placeholder="كلمة مرور جديدة"
                          value={newPasswords[e.id] || ""}
                          onChange={(ev) =>
                            onNewPasswordChange(e.id, ev.target.value)
                          }
                          className="h-8 text-xs py-1 mr-2"
                        />
                        <button
                          title="إعادة تعيين كلمة المرور"
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={async () => {
                            const pw = newPasswords[e.id];
                            if (pw) {
                              const ok = await onResetPassword(e.id, pw);
                              if (ok) onNewPasswordChange(e.id, "");
                            }
                          }}
                        >
                          <Key className="h-4 w-4 text-purple-600" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && (
            <div className="text-center text-gray-500 py-8">لا توجد نتائج</div>
          )}
        </div>
      </div>
    </div>
  );
};
