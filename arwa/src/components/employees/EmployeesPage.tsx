import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { TopNavigation } from "../common/TopNavigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useEmployeeStore } from "../../stores/employeeStore";
import EmployeeModal from "./modals/EmployeeModal";
import { EmployeesStats } from "./components/EmployeesStats";
import { EmployeesTable } from "./components/EmployeesTable";

const EmployeesPage: React.FC = () => {
  const {
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
        <EmployeesStats stats={computedStats} />

        {/* Employees Table */}
        <EmployeesTable
          employees={filteredEmployees}
          onEdit={(id) => {
            setEditingId(id);
            setShowModal(true);
          }}
          onDeactivate={deactivateEmployee}
          onDelete={deleteEmployee}
          onResetPassword={resetPassword}
          newPasswords={newPasswords}
          onNewPasswordChange={(id, password) =>
            setNewPasswords((prev) => ({ ...prev, [id]: password }))
          }
        />
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
