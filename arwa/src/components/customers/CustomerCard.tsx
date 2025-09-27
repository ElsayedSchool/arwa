import React from "react";
import { Phone, DollarSign, Calendar, Edit, Trash2 } from "lucide-react";
import type { Customer } from "../../services/customerService";

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onEdit,
  onDelete,
}) => {
  // Calculate last purchase date from orders or use lastUpdated as fallback
  const getLastPurchaseDate = () => {
    if (customer.orders && customer.orders.length > 0) {
      // Assuming orders are sorted by date, get the most recent
      const lastOrder = customer.orders[customer.orders.length - 1];
      const orderDate =
        (lastOrder as { createdAt?: string }).createdAt || customer.lastUpdated;
      return new Date(orderDate).toLocaleDateString("ar-SA");
    }
    return new Date(customer.lastUpdated).toLocaleDateString("ar-SA");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {customer.name}
          </h3>
          {customer.nickname && (
            <p className="text-sm text-gray-600 mb-2">({customer.nickname})</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(customer)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="تعديل"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(customer.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">{customer.phoneNumber}</span>
        </div>

        <div className="flex items-center gap-3">
          <DollarSign className="h-4 w-4 text-red-500" />
          <span
            className={`text-sm font-medium ${
              customer.totalDue > 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {formatCurrency(customer.totalDue)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-700">
            آخر شراء: {getLastPurchaseDate()}
          </span>
        </div>
      </div>

      {customer.totalDue > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">إجمالي المعاملات:</span>
            <span className="font-medium">
              {formatCurrency(customer.totalTransaction)}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600">مدفوع:</span>
            <span className="font-medium text-green-600">
              {formatCurrency(customer.totalPaid)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCard;
