import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "../../ui/Input";

export const OrderFilters = ({
  clients,
  selectedClient,
  setSelectedClient,
  phoneFilter,
  setPhoneFilter
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center mb-4">
        <Filter className="h-5 w-5 text-gray-500 ml-2" />
        <h3 className="text-lg font-medium text-gray-900">تصفية الطلبات</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العميل
          </label>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">جميع العملاء</option>
            {clients.map((client) => (
              <option key={client.id} value={client.name}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم الهاتف
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="البحث برقم الهاتف..."
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value)}
              className="pr-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};