import React, { useState } from "react";
import { Search, User } from "lucide-react";

export const ClientSelector = ({ clients, selectedClient, onClientSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleClientClick = (client) => {
    onClientSelect(client);
    setSearchTerm(client.name);
    setShowDropdown(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <User size={20} className="ml-2" />
        اختيار العميل
      </h3>
      
      <div className="relative">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ابحث عن عميل بالاسم أو رقم الهاتف..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {showDropdown && searchTerm && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleClientClick(client)}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{client.name}</div>
                  <div className="text-sm text-gray-500">{client.phone}</div>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-500 text-center">
                لا توجد نتائج
              </div>
            )}
          </div>
        )}
      </div>

      {selectedClient && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="font-medium text-blue-900">{selectedClient.name}</div>
          <div className="text-sm text-blue-700">{selectedClient.phone}</div>
        </div>
      )}
    </div>
  );
};