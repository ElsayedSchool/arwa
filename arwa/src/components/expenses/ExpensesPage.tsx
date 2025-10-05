import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, DollarSign } from "lucide-react";
import { Button } from "../ui/Button";
import { TopNavigation } from "../common/TopNavigation";
import { ExpensesTable } from "./components/ExpensesTable";
import { ExpensesFilters } from "./components/ExpensesFilters";
import { ExpensesAnalytics } from "./components/ExpensesAnalytics";
import { AddExpenseModal } from "./modals/AddExpenseModal";
import expensesApi, { type ExpenseUi } from "./api/expensesApi";

const ExpensesPage: React.FC = () => {
  const [expensesData, setExpensesData] = useState<ExpenseUi[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [nameFilter, setNameFilter] = useState<string>("");
  const [descriptionFilter, setDescriptionFilter] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseUi | null>(
    null
  );

  const fetchExpenses = useCallback(async () => {
    try {
      const filters = {
        dateFilter,
        from,
        to,
        name: nameFilter,
        description: descriptionFilter,
      };
      const data = await expensesApi.getExpenses(filters);
      setExpensesData(data);
    } catch (e) {
      console.error(e);
      alert("فشل في تحميل المصروفات");
    }
  }, [dateFilter, from, to, nameFilter, descriptionFilter]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleClearFilters = () => {
    setDateFilter("all");
    setFrom("");
    setTo("");
    setNameFilter("");
    setDescriptionFilter("");
  };

  const handleAdd = () => {
    setSelectedExpense(null);
    setShowAddModal(true);
  };

  const handleEdit = (expense: ExpenseUi) => {
    setSelectedExpense(expense);
    setShowEditModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا المصروف؟")) {
      try {
        await expensesApi.deleteExpense(id);
        await fetchExpenses();
      } catch (e) {
        console.error(e);
        alert("فشل في حذف المصروف");
      }
    }
  };

  const handleSave = async (payload: {
    id?: string;
    name: string;
    description?: string;
    price: number;
  }) => {
    await expensesApi.upsertExpense(payload);
    await fetchExpenses();
  };

  const analytics = useMemo(() => {
    const totalExpenses = expensesData.reduce(
      (sum, expense) => sum + Number(expense.price),
      0
    );
    const numberOfExpenses = expensesData.length;
    return { totalExpenses, numberOfExpenses };
  }, [expensesData]);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <TopNavigation currentPage="expenses" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <DollarSign className="ml-3" size={32} />
                إدارة المصروفات
              </h1>
              <p className="text-gray-600 mt-2">
                إدارة ومتابعة جميع المصروفات والنفقات
              </p>
            </div>
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة مصروف جديد
            </Button>
          </div>
        </div>

        <ExpensesFilters
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          from={from}
          setFrom={setFrom}
          to={to}
          setTo={setTo}
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          descriptionFilter={descriptionFilter}
          setDescriptionFilter={setDescriptionFilter}
          onClearFilters={handleClearFilters}
        />

        <ExpensesAnalytics analytics={analytics} />

        <ExpensesTable
          expenses={expensesData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <AddExpenseModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSave}
        />

        <AddExpenseModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          expense={selectedExpense}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default ExpensesPage;
