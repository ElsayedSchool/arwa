import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { TopNavigation } from "../common/TopNavigation";
import { OrdersFilters } from "./components/OrdersFilters";
import { OrdersAnalytics } from "./components/OrdersAnalytics";
import { OrdersTable } from "./components/OrdersTable";
import { AddOrderModal } from "./modals/AddOrderModal";
import { OrderDetailsModal } from "./modals/OrderDetailsModal";
import { PriceOrderModal } from "./modals/PriceOrderModal";
import { AddPaymentModal } from "./modals/AddPaymentModal";
import { UpdatePriceModal } from "./modals/UpdatePriceModal";
import { ordersApi } from "./api/ordersApi";
import { deliveriesApi } from "../deliveries/api/deliveriesApi";
import { useSupplierStore } from "../../stores/supplierStore";
import type {
  Order,
  FormData,
  AnalyticsData,
  Customer as Client,
} from "./api/ordersApi";
import type { CategoryDto } from "../deliveries/api/deliveriesApi";

interface DateRange {
  from: string;
  to: string;
}

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [types, setTypes] = useState<CategoryDto[]>([]);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [pricingOrder, setPricingOrder] = useState<Order | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [updatePriceOrder, setUpdatePriceOrder] = useState<Order | null>(null);
  const [updatePriceOpen, setUpdatePriceOpen] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("today");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: "",
    to: "",
  });
  const [unpricedOnly, setUnpricedOnly] = useState<boolean>(false);

  // Get suppliers from store
  const { suppliers, fetchSuppliers } = useSupplierStore();

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: {
        dateFilter?: string;
        dateFrom?: string;
        dateTo?: string;
      } = {
        dateFilter,
      };

      if (dateFilter === "range") {
        filters.dateFrom = dateRange.from;
        filters.dateTo = dateRange.to;
      }

      const ordersData = await ordersApi.getOrders(filters);
      setOrders(ordersData);
    } catch (err) {
      setError("فشل في تحميل الطلبات");
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, dateRange]);

  // Load orders on component mount and when filters change
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Load other data on component mount
  useEffect(() => {
    loadClients();
    loadTypes();
    fetchSuppliers();
  }, [fetchSuppliers]);

  const loadClients = async () => {
    try {
      const clientsData = await ordersApi.getClients();
      setClients(clientsData);
    } catch (err) {
      console.error("Error loading clients:", err);
    }
  };

  const loadTypes = async () => {
    try {
      const typesData = await deliveriesApi.getTypes();
      setTypes(typesData);
    } catch (err) {
      console.error("Error loading types:", err);
    }
  };

  // Filter orders based on date filter and search terms
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Date filter: backend uses 'createAt' for order creation date (fall back to 'date')
      const rawDate = order.createAt || order.date;
      const orderDate = rawDate ? new Date(rawDate) : new Date(0);
      const today = new Date();

      let dateMatches = true;
      if (dateFilter === "today") {
        dateMatches = orderDate.toDateString() === today.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateMatches = orderDate >= weekAgo;
      } else if (dateFilter === "month") {
        dateMatches =
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getFullYear() === today.getFullYear();
      } else if (dateFilter === "range") {
        if (dateRange.from && orderDate < new Date(dateRange.from)) {
          dateMatches = false;
        }
        if (dateRange.to && orderDate > new Date(dateRange.to)) {
          dateMatches = false;
        }
      }
      // For "all", dateMatches remains true

      // Search filters (empty filters should not auto-match)
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const normalizedPhone = phoneFilter.trim();

      const matchesName = (order.customerName || order.customer?.name || "")
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesPhone = (
        order.customerPhone ||
        order.customer?.phoneNumber ||
        ""
      ).includes(normalizedPhone);

      const passesText =
        (!normalizedSearch || matchesName) &&
        (!normalizedPhone || matchesPhone);

      // Unpriced-only filter: show orders where at least one item has price 0
      const unpricedMatch = unpricedOnly
        ? (order.orderItems || []).some(
            (it) =>
              Number(it.totalPrice || 0) === 0 ||
              Number(it.pricePerKilo || 0) === 0
          )
        : true;

      return dateMatches && passesText && unpricedMatch;
    });
  }, [orders, searchTerm, phoneFilter, dateFilter, dateRange, unpricedOnly]);

  // Analytics calculations
  const analytics: AnalyticsData = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalPaid = filteredOrders.reduce(
      (sum, order) => sum + (Number(order.paid) || 0),
      0
    );
    const totalUpdatedDebt = filteredOrders.reduce(
      (sum, order) => sum + (Number(order.updatedDebt) || 0),
      0
    );

    const fishTypeBreakdown: Record<string, number> = {};
    filteredOrders.forEach((order) => {
      order.orderItems?.forEach((item) => {
        const key: string =
          (item as { fishTypeName?: string }).fishTypeName ||
          item.fishTypeId ||
          "غير معروف";
        const amt = Number(item.amount) || 0;
        fishTypeBreakdown[key] = (fishTypeBreakdown[key] || 0) + amt;
      });
    });

    const uniqueCustomers = new Set(
      filteredOrders.map((order) => order.customer?.name).filter(Boolean)
    ).size;

    return {
      totalOrders,
      totalPaid,
      totalUpdatedDebt,
      fishTypeBreakdown,
      uniqueCustomers,
    };
  }, [filteredOrders]);

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      try {
        await ordersApi.deleteOrder(orderId);
        await loadOrders(); // Reload orders after deletion
      } catch (err) {
        setError("فشل في حذف الطلب");
        console.error("Error deleting order:", err);
      }
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowAddForm(true);
  };

  const handleViewOrder = (order: Order) => {
    setViewingOrder(order);
    setDetailsOpen(true);
  };

  const handlePriceOrder = (order: Order) => {
    setPricingOrder(order);
    setPricingOpen(true);
  };

  const handlePaymentOrder = (order: Order) => {
    setPaymentOrder(order);
    setPaymentOpen(true);
  };

  const handleUpdatePrice = (order: Order) => {
    setUpdatePriceOrder(order);
    setUpdatePriceOpen(true);
  };

  const handleSavePriceUpdate = async (orderId: string, newPrice: number) => {
    try {
      await ordersApi.updateOrderPrice(orderId, { totalPrice: newPrice });
      await loadOrders(); // Reload orders after update
      setUpdatePriceOpen(false);
      setUpdatePriceOrder(null);
    } catch (error) {
      console.error("Error updating price:", error);
      alert("حدث خطأ أثناء تحديث السعر");
    }
  };

  const handleSavePayment = async (paymentData: {
    totalDebt: number;
    orderPrice: number;
    paid: number;
    discount: number;
    updatedDebt: number;
  }) => {
    if (!paymentOrder) return;

    try {
      // Update only the financial data using the new API
      await ordersApi.updateOrderFinancial(paymentOrder.id, {
        totalDebt: paymentData.totalDebt,
        paid: paymentData.paid,
        discount: paymentData.discount,
        updatedDebt: paymentData.updatedDebt,
      });

      await loadOrders(); // Reload orders after payment update
      setPaymentOpen(false);
      setPaymentOrder(null);
    } catch (err) {
      setError("فشل في حفظ الدفعة");
      console.error("Error saving payment:", err);
    }
  };

  const handleAddOrder = async (formData: FormData) => {
    try {
      const payload = {
        customerId: formData.customerId,
        customerName: formData.customerName,
        orderItems: formData.fishItems.map((item) => ({
          // Back-end expects fishTypeName (subtype string) and SupplierName (supplier string)
          // Supplier select holds supplier id, so convert to name
          fishTypeName: item.type,
          SupplierName:
            suppliers.find((s) => s.id === item.supplier)?.name ||
            item.supplier,
          amount: parseFloat(item.quantity || "0"),
        })),
        totalDebt: formData.totalDebt,
        paid: formData.paid,
        discount: formData.discount,
        updatedDebt: formData.updatedDebt,
      } as const;
      await ordersApi.createOrder(payload);
      await loadOrders(); // Reload orders after creation
      setShowAddForm(false);
    } catch (err) {
      setError("فشل في إضافة الطلب");
      console.error("Error creating order:", err);
    }
  };

  const handleUpdateOrder = async (formData: FormData) => {
    if (!editingOrder) return;

    try {
      // Transform to UpdateOrderItemsDto
      const updateData = {
        id: editingOrder.id,
        customerId: editingOrder.customerId || editingOrder.customer?.id || "",
        customerName:
          editingOrder.customerName || editingOrder.customer?.name || "",
        orderItems: formData.fishItems.map((item) => ({
          fishTypeName: item.type,
          SupplierName:
            suppliers.find((s) => s.id === item.supplier)?.name ||
            item.supplier,
          amount: parseFloat(item.quantity || "0"),
        })),
      };

      await ordersApi.updateOrder(editingOrder.id, updateData);
      await loadOrders(); // Reload orders after update
      setShowAddForm(false);
      setEditingOrder(null);
    } catch (err) {
      // Keep modal open and show a friendly error without forcing page reload
      console.error("Error updating order:", err);
      alert("حدث خطأ أثناء حفظ التعديلات. راجع البيانات وحاول مرة أخرى.");
    }
  };
  const handleStartOrders = async () => {
    try {
      await ordersApi.createOrderList();
      // After creating or confirming, reload today's orders
      await loadOrders();
    } catch (err) {
      setError("فشل في بدء الطلبات");
      console.error("Error starting orders:", err);
    }
  };

  const handleRemoveOrderItem = async (
    orderId: string,
    itemId: string
  ): Promise<void> => {
    if (!orderId || !itemId) return;
    const confirm = window.confirm("هل تريد إزالة هذا الصنف من الطلب؟");
    if (!confirm) return;
    try {
      await ordersApi.deleteOrderItem(itemId);
      // Optimistically update local state for snappier UI
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                orderItems: (o.orderItems || []).filter(
                  (it) => it.id !== itemId
                ),
              }
            : o
        )
      );
      // Also refresh from server to keep totals etc. correct
      await loadOrders();
    } catch (err) {
      console.error("Error removing order item:", err);
      alert("فشل في إزالة الصنف من الطلب");
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setPhoneFilter("");
    setDateFilter("today");
    setDateRange({ from: "", to: "" });
    setUnpricedOnly(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-600">{error}</div>
          <Button onClick={loadOrders} className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TopNavigation />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
          <div className="flex gap-4">
            <Button onClick={handleStartOrders} variant="outline">
              بدء الطلبات
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              إضافة طلب جديد
            </Button>
          </div>
        </div>

        {/* Filters */}
        <OrdersFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          phoneFilter={phoneFilter}
          onPhoneFilterChange={setPhoneFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onClearFilters={handleClearFilters}
          unpricedOnly={unpricedOnly}
          onUnpricedOnlyChange={setUnpricedOnly}
        />

        {/* Analytics */}
        <OrdersAnalytics analytics={analytics} />

        {/* Orders Table */}
        <OrdersTable
          orders={filteredOrders}
          dateFilter={dateFilter}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onRemoveItem={handleRemoveOrderItem}
          onViewOrder={handleViewOrder}
          onPriceOrder={handlePriceOrder}
          onPaymentOrder={handlePaymentOrder}
          onUpdatePrice={handleUpdatePrice}
        />

        {/* Add Order Modal */}
        <AddOrderModal
          isOpen={showAddForm}
          onClose={() => {
            setShowAddForm(false);
            setEditingOrder(null);
          }}
          clients={clients}
          suppliers={suppliers}
          types={types}
          onSubmit={editingOrder ? handleUpdateOrder : handleAddOrder}
          editMode={!!editingOrder}
          editingOrder={editingOrder}
        />

        {/* Order Details Modal */}
        <OrderDetailsModal
          isOpen={detailsOpen}
          onClose={() => {
            setDetailsOpen(false);
            setViewingOrder(null);
          }}
          order={viewingOrder}
        />

        {/* Price Order Modal */}
        <PriceOrderModal
          isOpen={pricingOpen}
          onClose={() => {
            setPricingOpen(false);
            setPricingOrder(null);
          }}
          order={pricingOrder}
          onSavePrices={async (
            items: Array<{
              id: string;
              pricePerKilo: number;
              totalPrice: number;
            }>
          ) => {
            if (!pricingOrder) return;
            // Upsert each item with new price/total and include orderId so backend can recalc total
            await Promise.all(
              items.map((it) =>
                fetch(
                  `${
                    import.meta.env.VITE_API_URL || "http://localhost:3000"
                  }/orderItem`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      id: it.id,
                      orderId: pricingOrder.id,
                      pricePerKilo: it.pricePerKilo,
                      totalPrice: it.totalPrice,
                    }),
                  }
                )
              )
            );
            // After pricing, refresh orders
            await loadOrders();
          }}
        />

        {/* Add Payment Modal */}
        <AddPaymentModal
          isOpen={paymentOpen}
          onClose={() => {
            setPaymentOpen(false);
            setPaymentOrder(null);
          }}
          order={paymentOrder}
          onSave={handleSavePayment}
        />

        {/* Update Price Modal */}
        <UpdatePriceModal
          isOpen={updatePriceOpen}
          onClose={() => {
            setUpdatePriceOpen(false);
            setUpdatePriceOrder(null);
          }}
          order={updatePriceOrder}
          onSave={handleSavePriceUpdate}
        />
      </div>
    </div>
  );
};
