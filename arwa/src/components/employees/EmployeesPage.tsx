import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Plus,
  Search,
  DollarSign,
  Edit,
  Trash2,
  Power,
  Key,
} from "lucide-react";
import { TopNavigation } from "../common/TopNavigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useEmployeeStore } from "../../stores/employeeStore";
import EmployeeModal from "./modals/EmployeeModal";

const EmployeesPage: React.FC = () => {
  const {
    loading,
    error,
    searchTerm,
    setSearchTerm,
    employees,
    fetchEmployees,
    deleteEmployee,
    deactivateEmployee,
    resetPassword,
    clearError,
  } = useEmployeeStore();
  const [newPasswords, setNewPasswords] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees;
    const term = searchTerm.toLowerCase();
    return employees.filter(
      (e) => e.name.toLowerCase().includes(term) || e.phone.includes(searchTerm)
    );
  }, [employees, searchTerm]);

  const computedStats = useMemo(() => {
    const total = filteredEmployees.length;
    const active = filteredEmployees.filter((e) => e.isActive).length;
    const totalMonthlySalary = filteredEmployees.reduce(
      (sum, e) => sum + (Number(e.salary) || 0),
      0
    );
    const averageSalary = total ? Math.round(totalMonthlySalary / total) : 0;
    return { total, active, totalMonthlySalary, averageSalary };
  }, [filteredEmployees]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <TopNavigation currentPage="employees" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                الموظفون والرواتب
              </h1>
              <p className="text-gray-600 mt-2">إدارة الموظفين ورواتبهم</p>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                setEditingId(null);
                setShowModal(true);
              }}
            >
              <Plus className="h-4 w-4" />
              إضافة موظف جديد
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="البحث في الموظفين..."
                className="w-full pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Employees Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الموظفين
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {computedStats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  موظفين نشطين
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {computedStats.active}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الرواتب الشهرية
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {computedStats.totalMonthlySalary.toLocaleString()} ج.م
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">
                  متوسط الراتب
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {computedStats.averageSalary.toLocaleString()} ج.م
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              قائمة الموظفين
            </h3>
            {error && <div className="text-red-600 mb-3">{error}</div>}
            {loading ? (
              <div className="text-gray-600">جاري التحميل...</div>
            ) : (
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
                    {filteredEmployees.map((e) => (
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
                            className={
                              e.isActive ? "text-green-600" : "text-red-600"
                            }
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
                              onClick={() =>
                                deactivateEmployee(e.id, !e.isActive)
                              }
                            >
                              <Power className="h-4 w-4 text-gray-600" />
                            </button>
                            <button
                              title="تعديل"
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={() => {
                                setEditingId(e.id);
                                setShowModal(true);
                              }}
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              title="حذف"
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={() => deleteEmployee(e.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                            <div className="flex items-center">
                              <Input
                                placeholder="كلمة مرور جديدة"
                                value={newPasswords[e.id] || ""}
                                onChange={(ev) =>
                                  setNewPasswords((prev) => ({
                                    ...prev,
                                    [e.id]: ev.target.value,
                                  }))
                                }
                                className="h-8 text-xs py-1 mr-2"
                              />
                              <button
                                title="إعادة تعيين كلمة المرور"
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={async () => {
                                  const pw = newPasswords[e.id];
                                  if (pw) {
                                    const ok = await resetPassword(e.id, pw);
                                    if (ok)
                                      setNewPasswords((prev) => ({
                                        ...prev,
                                        [e.id]: "",
                                      }));
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
                {filteredEmployees.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    لا توجد نتائج
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <EmployeeModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            clearError();
          }}
          employee={
            editingId ? filteredEmployees.find((x) => x.id === editingId) : null
          }
          error={error}
          onSave={async (payload) => {
            if (editingId) {
              const ok = await useEmployeeStore.getState().updateEmployee({
                ...(payload as import("../../components/employees/models/employee").UpdateEmployeeData),
                id: editingId,
              });
              if (ok) setShowModal(false);
              return ok;
            } else {
              const ok = await useEmployeeStore
                .getState()
                .createEmployee(
                  payload as import("../../components/employees/models/employee").CreateEmployeeData
                );
              if (ok) setShowModal(false);
              return ok;
            }
          }}
        />
      </div>
    </div>
  );
};

export default EmployeesPage;
