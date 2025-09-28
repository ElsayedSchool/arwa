import React, { useState } from "react";
import { ClientSelector } from "./components/ClientSelector.tsx";
import { OrdersToConfirm } from "./components/OrdersToConfirm.tsx";
import { ClientDebtSummary } from "./components/ClientDebtSummary.tsx";
import { PaymentEntry } from "./components/PaymentEntry.tsx";
import { ClientOrderHistory } from "./components/ClientOrderHistory.tsx";
import { Button } from "../ui/Button.tsx";
import { CheckCircle } from "lucide-react";
import { TopNavigation } from "../common/TopNavigation";

interface Order {
  id: number;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  fishType: string;
  quantity: number;
  supplier: string;
  orderDate: string;
  status: string;
  price: number;
  totalAmount: number;
}

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface ClientDebt {
  totalDebt: number;
  lastPaymentDate: string | null;
  lastPaymentAmount: number;
}

interface PaymentData {
  amountPaid: string;
  paymentMethod: string;
  notes: string;
}

const ReviewOrdersPage: React.FC = () => {
  // Demo data for orders (including historical orders)
  const [demoOrders] = useState<Order[]>([
    // Current pending orders
    {
      id: 1,
      orderNumber: "ORD-001",
      clientName: "محمد أحمد",
      clientPhone: "01234567890",
      fishType: "بلطي",
      quantity: 5,
      supplier: "مورد الأسماك الطازجة",
      orderDate: new Date().toISOString().split("T")[0],
      status: "قيد المراجعة",
      price: 45.5,
      totalAmount: 227.5,
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      clientName: "فاطمة علي",
      clientPhone: "01987654321",
      fishType: "دنيس",
      quantity: 2,
      supplier: "شركة البحر الأحمر",
      orderDate: new Date().toISOString().split("T")[0],
      status: "قيد المراجعة",
      price: 85,
      totalAmount: 170,
    },
    {
      id: 3,
      orderNumber: "ORD-003",
      clientName: "محمد أحمد",
      clientPhone: "01234567890",
      fishType: "مبروك",
      quantity: 3,
      supplier: "مزرعة الأسماك الذهبية",
      orderDate: new Date().toISOString().split("T")[0],
      status: "قيد المراجعة",
      price: 50,
      totalAmount: 150,
    },
    // Historical orders
    {
      id: 4,
      orderNumber: "ORD-004",
      clientName: "محمد أحمد",
      clientPhone: "01234567890",
      fishType: "بلطي",
      quantity: 3,
      supplier: "مورد الأسماك الطازجة",
      orderDate: "2024-01-15",
      status: "تم التأكيد",
      price: 45,
      totalAmount: 135,
    },
    {
      id: 5,
      orderNumber: "ORD-005",
      clientName: "محمد أحمد",
      clientPhone: "01234567890",
      fishType: "دنيس",
      quantity: 2,
      supplier: "شركة البحر الأحمر",
      orderDate: "2024-01-15",
      status: "تم التأكيد",
      price: 80,
      totalAmount: 160,
    },
    {
      id: 6,
      orderNumber: "ORD-006",
      clientName: "محمد أحمد",
      clientPhone: "01234567890",
      fishType: "قاروص",
      quantity: 1,
      supplier: "مزرعة الأسماك الذهبية",
      orderDate: "2024-01-14",
      status: "تم التأكيد",
      price: 120,
      totalAmount: 120,
    },
    {
      id: 7,
      orderNumber: "ORD-007",
      clientName: "فاطمة علي",
      clientPhone: "01987654321",
      fishType: "بوري",
      quantity: 4,
      supplier: "مورد الأسماك الطازجة",
      orderDate: "2024-01-13",
      status: "تم التأكيد",
      price: 60,
      totalAmount: 240,
    },
    {
      id: 8,
      orderNumber: "ORD-008",
      clientName: "محمد أحمد",
      clientPhone: "01234567890",
      fishType: "سردين",
      quantity: 5,
      supplier: "شركة البحر الأحمر",
      orderDate: "2024-01-12",
      status: "تم التأكيد",
      price: 35,
      totalAmount: 175,
    },
  ]);

  // Demo data for clients
  const [demoClients] = useState<Client[]>([
    {
      id: 1,
      name: "محمد أحمد",
      phone: "01234567890",
      email: "mohamed@example.com",
    },
    {
      id: 2,
      name: "فاطمة علي",
      phone: "01987654321",
      email: "fatma@example.com",
    },
    {
      id: 3,
      name: "أحمد سعد",
      phone: "01122334455",
      email: "ahmed@example.com",
    },
  ]);

  // Demo data for client debts
  const [demoDebts] = useState<Record<number, ClientDebt>>({
    1: {
      totalDebt: 500,
      lastPaymentDate: "2024-01-10",
      lastPaymentAmount: 200,
    },
    2: { totalDebt: 0, lastPaymentDate: null, lastPaymentAmount: 0 },
    3: {
      totalDebt: 1200,
      lastPaymentDate: "2024-01-05",
      lastPaymentAmount: 300,
    },
  });

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientOrders, setClientOrders] = useState<Order[]>([]);
  const [clientDebt, setClientDebt] = useState<ClientDebt | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amountPaid: "",
    paymentMethod: "cash",
    notes: "",
  });
  const [sessionTotal, setSessionTotal] = useState<number>(0);

  // Handle client selection
  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);

    // Get client's pending orders from demo data
    const pendingOrders = demoOrders.filter(
      (order) =>
        order.clientName === client.name && order.status === "قيد المراجعة"
    );
    setClientOrders(pendingOrders);

    // Calculate session total
    const total = pendingOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );
    setSessionTotal(total);

    // Get client debt from demo data
    const debt = demoDebts[client.id] || {
      totalDebt: 0,
      lastPaymentDate: null,
      lastPaymentAmount: 0,
    };
    setClientDebt(debt);
  };

  // Get client's historical orders
  const getClientHistoricalOrders = (): Order[] => {
    if (!selectedClient) return [];
    return demoOrders.filter(
      (order) =>
        order.clientName === selectedClient.name &&
        order.status === "تم التأكيد"
    );
  };

  // Handle order approval
  const handleApproveOrder = (orderId: number) => {
    setClientOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "تم التأكيد" } : order
      )
    );
    alert("تم تأكيد الطلب بنجاح");
  };

  // Handle order rejection
  const handleRejectOrder = (orderId: number) => {
    setClientOrders((prev) => prev.filter((order) => order.id !== orderId));

    // Recalculate session total
    const newTotal = clientOrders
      .filter((order) => order.id !== orderId)
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    setSessionTotal(newTotal);

    alert("تم إلغاء الطلب بنجاح");
  };

  // Handle order edit
  const handleEditOrder = (orderId: number, updatedData: Partial<Order>) => {
    setClientOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, ...updatedData } : order
      )
    );

    // Recalculate session total
    const newTotal = clientOrders
      .map((order) =>
        order.id === orderId ? { ...order, ...updatedData } : order
      )
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    setSessionTotal(newTotal);

    alert("تم تحديث الطلب بنجاح");
  };

  // Handle confirm all orders
  const handleConfirmAll = () => {
    if (!selectedClient) return;

    // Simulate processing
    const amountPaid = parseFloat(paymentData.amountPaid) || 0;
    const totalDue = (clientDebt?.totalDebt || 0) + sessionTotal;
    const remainingBalance = totalDue - amountPaid;

    console.log("Processing payment:", {
      clientId: selectedClient.id,
      amountPaid,
      totalDue,
      remainingBalance,
      paymentMethod: paymentData.paymentMethod,
      notes: paymentData.notes,
    });

    alert("تم تأكيد جميع الطلبات بنجاح");

    // Reset form
    setSelectedClient(null);
    setClientOrders([]);
    setClientDebt(null);
    setSessionTotal(0);
    setPaymentData({
      amountPaid: "",
      paymentMethod: "cash",
      notes: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with top-right navigation */}

        <div className="mb-8">
          <TopNavigation currentPage="reviews" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">العملاء</h1>
              <p className="text-gray-600 mt-2">مراجعة طلبات العملاء</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Client Selection & Orders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Client Selector */}
            <ClientSelector
              clients={demoClients}
              selectedClient={selectedClient}
              onClientSelect={handleClientSelect}
            />

            {/* Orders to Confirm */}
            {selectedClient && (
              <OrdersToConfirm
                orders={clientOrders}
                onApprove={handleApproveOrder}
                onReject={handleRejectOrder}
                onEdit={handleEditOrder}
              />
            )}

            {/* Client Order History */}
            {selectedClient && (
              <ClientOrderHistory
                orders={getClientHistoricalOrders()}
                clientName={selectedClient.name}
              />
            )}
          </div>

          {/* Right Column - Debt & Payment */}
          {selectedClient && (
            <div className="space-y-6">
              {/* Client Debt Summary */}
              <ClientDebtSummary
                clientDebt={clientDebt}
                sessionTotal={sessionTotal}
              />

              {/* Payment Entry */}
              <PaymentEntry
                paymentData={paymentData}
                setPaymentData={setPaymentData}
                totalDue={(clientDebt?.totalDebt || 0) + sessionTotal}
              />

              {/* Confirm All Button */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Button
                  onClick={handleConfirmAll}
                  className="w-full"
                  disabled={clientOrders.length === 0}
                >
                  <CheckCircle size={20} className="ml-2" />
                  تأكيد جميع الطلبات
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ReviewOrdersPage };
