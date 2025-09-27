import React from "react";
import { CreditCard, AlertCircle } from "lucide-react";

interface ClientDebt {
  totalDebt?: number;
  lastPaymentDate?: string | null;
  lastPaymentAmount?: number;
}

interface ClientDebtSummaryProps {
  clientDebt: ClientDebt | null;
  sessionTotal: number;
}

export const ClientDebtSummary: React.FC<ClientDebtSummaryProps> = ({
  clientDebt,
  sessionTotal,
}) => {
  const previousDebt = clientDebt?.totalDebt || 0;
  const totalToPay = previousDebt + sessionTotal;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <CreditCard size={20} className="ml-2" />
        ملخص المديونية
      </h3>

      <div className="space-y-4">
        {/* Previous Debt */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">المديونية السابقة:</span>
          <span
            className={`font-medium ${
              previousDebt > 0 ? "text-red-600" : "text-gray-900"
            }`}
          >
            {previousDebt.toFixed(2)} ج.م
          </span>
        </div>

        {/* Current Session */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">إجمالي الجلسة الحالية:</span>
          <span className="font-medium text-gray-900">
            {sessionTotal.toFixed(2)} ج.م
          </span>
        </div>

        {/* Total to Pay */}
        <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg px-4">
          <span className="font-medium text-gray-900">
            إجمالي المطلوب دفعه:
          </span>
          <span className="font-bold text-lg text-blue-600">
            {totalToPay.toFixed(2)} ج.م
          </span>
        </div>

        {/* Warning for high debt */}
        {totalToPay > 1000 && (
          <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
            <AlertCircle size={16} className="text-yellow-600 ml-2" />
            <span className="text-sm text-yellow-800">
              مديونية عالية - ينصح بالمتابعة
            </span>
          </div>
        )}

        {/* Last Payment Info */}
        {clientDebt?.lastPaymentDate && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            آخر دفعة: {clientDebt.lastPaymentAmount} ج.م في{" "}
            {new Date(clientDebt.lastPaymentDate).toLocaleDateString("ar-EG")}
          </div>
        )}
      </div>
    </div>
  );
};
