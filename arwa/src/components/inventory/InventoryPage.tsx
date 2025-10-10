import React, { useState, useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { TopNavigation } from "../common/TopNavigation";
import { InventoryTable } from "./components/InventoryTable";
import { InventoryFilters } from "./components/InventoryFilters";
import { InventoryAnalytics } from "./components/inventoryAnalytics";
import { AddInventoryModal } from "./modals/AddInventoryModal";
import { InventoryDetailsModal } from "./modals/InventoryDetailsModal";
import { UpdateRestAmountsModal } from "./modals/UpdateRestAmountsModal";
import inventoryApi, {
  type InventoryDeliveryUi,
  type InventoryFishTypeUi,
  type CategoryDto,
} from "./api/InventoryApi";

type Delivery = InventoryDeliveryUi;

interface Analytics {
  totalReceivedFish: number;
  fishTypeBreakdown: Record<string, number>;
  totalDeliveries: number;
  uniqueSuppliers: number;
}

const InventoryPage: React.FC = () => {
  const [deliveriesData, setDeliveriesData] = useState<Delivery[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [selectedBaseType, setSelectedBaseType] = useState<string>("");
  const [selectedSubtype, setSelectedSubtype] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("today");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRestAmountsModal, setShowRestAmountsModal] = useState(false);
  const [selectedDeliveryForRest, setSelectedDeliveryForRest] =
    useState<Delivery | null>(null);
  const [updatingRestAmounts, setUpdatingRestAmounts] = useState(false);
  const [types, setTypes] = useState<CategoryDto[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);

  // Fetch deliveries on mount
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await inventoryApi.getInventory();
        setDeliveriesData(data);
      } catch (error) {
        console.error("Error fetching deliveries:", error);
      }
    };

    fetchDeliveries();
  }, []);

  // Fetch types on mount
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const typesData = await inventoryApi.getTypes();
        setTypes(typesData);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchTypes();
  }, []);

  // Fetch suppliers on mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const suppliersData = await inventoryApi.getSuppliers();
        const supplierNames = suppliersData.map((s) => s.name);
        setSuppliers(supplierNames);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    return deliveriesData.filter((delivery) => {
      // Search filter
      if (
        searchTerm &&
        !delivery.supplierName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        !delivery.driverName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Supplier filter
      if (selectedSupplier && delivery.supplierName !== selectedSupplier) {
        return false;
      }

      // Base type filter - removed for inventory
      // if (selectedBaseType) {
      //   const hasBaseType = delivery.fishTypes?.some(fish => fish.baseType === selectedBaseType);
      //   if (!hasBaseType) return false;
      // }

      // Subtype filter
      if (selectedSubtype) {
        const hasSubtype = delivery.fishTypes?.some(
          (fish) => fish.type === selectedSubtype
        );
        if (!hasSubtype) return false;
      }

      // Date filter
      const deliveryDate = new Date(delivery.deliveryDate);
      const today = new Date();

      if (dateFilter === "today") {
        return deliveryDate.toDateString() === today.toDateString();
      } else if (dateFilter === "week") {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return deliveryDate >= weekAgo;
      } else if (dateFilter === "month") {
        return (
          deliveryDate.getMonth() === today.getMonth() &&
          deliveryDate.getFullYear() === today.getFullYear()
        );
      } else if (dateFilter === "range") {
        if (from && deliveryDate < new Date(from)) return false;
        if (to && deliveryDate > new Date(to)) return false;
      }

      return true;
    });
  }, [
    deliveriesData,
    searchTerm,
    selectedSupplier,
    selectedSubtype,
    dateFilter,
    from,
    to,
  ]);

  // Calculate analytics based on filtered data
  const analytics: Analytics = useMemo(() => {
    const totalReceivedFish = filteredData.reduce(
      (sum, delivery) => sum + Number(delivery.totalWeight || 0),
      0
    );

    const fishTypeBreakdown = filteredData.reduce((acc, delivery) => {
      delivery.fishTypes?.forEach((fish) => {
        acc[fish.type] = (acc[fish.type] || 0) + Number(fish.weight || 0);
      });
      return acc;
    }, {} as Record<string, number>);

    const totalDeliveries = filteredData.length;
    const uniqueSuppliers = new Set(filteredData.map((d) => d.supplierName))
      .size;

    return {
      totalReceivedFish,
      fishTypeBreakdown,
      totalDeliveries,
      uniqueSuppliers,
    };
  }, [filteredData]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSupplier("");
    setSelectedBaseType("");
    setSelectedSubtype("");
    setDateFilter("today");
    setFrom("");
    setTo("");
  };

  const handleAddDelivery = async (payload: {
    supplierName: string;
    driverName: string;
    deliveryDate: string;
    deliveryTime: string;
    fishTypes: InventoryFishTypeUi[];
  }) => {
    try {
      await inventoryApi.createInventory(payload);
      // Refresh data
      const data = await inventoryApi.getInventory();
      setDeliveriesData(data);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding delivery:", error);
    }
  };

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowDetailsModal(true);
  };

  const handleEditDelivery = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleSaveEditDelivery = async (data: InventoryDeliveryUi) => {
    try {
      // For editing, we need to call an update API
      // Since the inventory API might not have an update endpoint, we'll use the regular delivery update
      await inventoryApi.updateDelivery(data.id, {
        supplierName: data.supplierName,
        driverName: data.driverName,
        deliveryDate: data.deliveryDate,
        deliveryTime: data.deliveryTime,
        fishTypes: data.fishTypes,
      });

      // Refresh data
      const refreshedData = await inventoryApi.getInventory();
      setDeliveriesData(refreshedData);
      setShowAddModal(false);
      setIsEditMode(false);
      setSelectedDelivery(null);
    } catch (error) {
      console.error("Error updating delivery:", error);
      throw error;
    }
  };

  const handleDeleteDelivery = async (delivery: Delivery) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التوصيل")) {
      try {
        await inventoryApi.deleteDelivery(delivery.id);
        // Refresh data
        const data = await inventoryApi.getInventory();
        setDeliveriesData(data);
      } catch (error) {
        console.error("Error deleting delivery:", error);
      }
    }
  };

  const handleUpdateRestAmounts = (delivery: Delivery) => {
    setSelectedDeliveryForRest(delivery);
    setShowRestAmountsModal(true);
  };

  const handleSaveRestAmounts = async (
    deliveryId: string,
    updates: Array<{ deliveryItemId: string; restAmount: number }>
  ) => {
    setUpdatingRestAmounts(true);
    try {
      await inventoryApi.updateRestAmounts(deliveryId, updates);

      // Refresh data
      const data = await inventoryApi.getInventory();
      setDeliveriesData(data);
      setShowRestAmountsModal(false);
      setSelectedDeliveryForRest(null);
    } catch (error) {
      console.error("Error updating rest amounts:", error);
      throw error;
    } finally {
      setUpdatingRestAmounts(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TopNavigation />
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">المخزون</h1>
          <Button
            onClick={() => {
              setIsEditMode(false);
              setSelectedDelivery(null);
              setShowAddModal(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            إضافة توصيل جديد
          </Button>
        </div>

        <InventoryFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          selectedSupplier={selectedSupplier}
          onSelectedSupplierChange={setSelectedSupplier}
          selectedBaseType={selectedBaseType}
          onSelectedBaseTypeChange={setSelectedBaseType}
          selectedSubtype={selectedSubtype}
          onSelectedSubtypeChange={setSelectedSubtype}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          dateRange={{ from, to }}
          onDateRangeChange={(range) => {
            setFrom(range.from);
            setTo(range.to);
          }}
          supplierNames={[]}
          baseTypeNames={[]}
          subtypeNames={[]}
          onExportData={() => {}}
          onClearFilters={handleClearFilters}
          unpricedOnly={false}
          onUnpricedOnlyChange={() => {}}
        />

        <InventoryAnalytics analytics={analytics} />

        <InventoryTable
          data={filteredData}
          userRole="owner"
          onViewDetails={handleViewDetails}
          onDelete={handleDeleteDelivery}
          onUpdateRestAmounts={handleUpdateRestAmounts}
          onEdit={handleEditDelivery}
        />

        <AddInventoryModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setIsEditMode(false);
            setSelectedDelivery(null);
          }}
          onSave={handleAddDelivery}
          onSaveEdit={handleSaveEditDelivery}
          suppliers={suppliers}
          types={types}
          isEdit={isEditMode}
          existingDelivery={selectedDelivery}
        />

        <InventoryDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          delivery={selectedDelivery}
        />

        <UpdateRestAmountsModal
          isOpen={showRestAmountsModal}
          onClose={() => {
            setShowRestAmountsModal(false);
            setSelectedDeliveryForRest(null);
          }}
          delivery={selectedDeliveryForRest}
          onSave={handleSaveRestAmounts}
          loading={updatingRestAmounts}
        />
      </div>
    </div>
  );
};

export default InventoryPage;
