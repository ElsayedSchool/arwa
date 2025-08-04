// Custom hook for suppliers management
import { useState, useEffect, useMemo } from "react";

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFishType, setSelectedFishType] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  // Demo data for suppliers
  const getDemoSuppliers = () => {
    return [
      {
        id: 1,
        name: "مورد الأسماك الطازجة",
        phone: "01234567890",
        email: "supplier1@example.com",
        address: "الإسكندرية، كورنيش البحر",
        fishTypes: [
          { type: "بلطي", pricePerKg: 45 },
          { type: "مبروك", pricePerKg: 50 },
          { type: "قراميط", pricePerKg: 55 },
        ],
        totalDeliveries: 15,
        totalWeight: 450.5,
        totalAmount: 22500,
        paymentStatus: "paid",
        paymentTerms: "cash",
        lastDelivery: "2024-01-15",
        createdAt: "2024-01-01T00:00:00Z",
        notes: "مورد موثوق، جودة عالية",
      },
      {
        id: 2,
        name: "شركة البحر الأحمر",
        phone: "01987654321",
        email: "redsea@example.com",
        address: "الغردقة، ميناء الصيد",
        fishTypes: [
          { type: "دنيس", pricePerKg: 85 },
          { type: "قاروص", pricePerKg: 120 },
          { type: "لوت", pricePerKg: 75 },
        ],
        totalDeliveries: 8,
        totalWeight: 320.0,
        soldWeight: 280.0,
        totalAmount: 28800,
        paymentStatus: "partial",
        paymentTerms: "credit",
        lastDelivery: "2024-01-14",
        createdAt: "2024-01-05T00:00:00Z",
        notes: "أسماك بحرية طازجة",
      },
      {
        id: 3,
        name: "مزرعة الأسماك الذهبية",
        phone: "01122334455",
        email: "golden@example.com",
        address: "كفر الشيخ، مزارع الأسماك",
        fishTypes: [
          { type: "بلطي", pricePerKg: 42 },
          { type: "مبروك", pricePerKg: 48 },
          { type: "بوري", pricePerKg: 60 },
        ],
        totalDeliveries: 12,
        totalWeight: 380.0,
        soldWeight: 200.0,
        totalAmount: 18240,
        paymentStatus: "unpaid",
        paymentTerms: "credit",
        lastDelivery: "2024-01-13",
        createdAt: "2024-01-03T00:00:00Z",
        notes: "مزرعة أسماك حديثة",
      },
      {
        id: 4,
        name: "تجارة الأسماك المتحدة",
        phone: "01555666777",
        email: "united@example.com",
        address: "دمياط، سوق السمك",
        fishTypes: [
          { type: "سردين", pricePerKg: 35 },
          { type: "تونة", pricePerKg: 150 },
          { type: "سلمون", pricePerKg: 200 },
        ],
        totalDeliveries: 6,
        totalWeight: 180.0,
        totalAmount: 15300,
        paymentStatus: "paid",
        paymentTerms: "cash",
        lastDelivery: "2024-01-12",
        createdAt: "2024-01-08T00:00:00Z",
        notes: "متخصص في الأسماك المستوردة",
      },
    ];
  };

  // Load suppliers on mount
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      const suppliersData = getDemoSuppliers();
      setSuppliers(suppliersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter suppliers
  const filterSuppliers = (
    suppliers,
    { searchTerm, selectedFishType, paymentFilter, dateFilter, dateRange }
  ) => {
    return suppliers.filter((supplier) => {
      const matchesSearch = searchTerm
        ? supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesFishType = selectedFishType
        ? supplier.fishTypes?.some((fish) => fish.type === selectedFishType)
        : true;
      const matchesPayment =
        paymentFilter !== "all"
          ? supplier.paymentStatus === paymentFilter
          : true;

      // Date filter logic
      let matchesDate = true;
      if (supplier.supplyDate && dateFilter !== "all") {
        const supplierDate = new Date(supplier.supplyDate);
        const today = new Date();

        if (dateFilter === "today") {
          matchesDate = supplierDate.toDateString() === today.toDateString();
        } else if (dateFilter === "week") {
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = supplierDate >= weekAgo;
        } else if (dateFilter === "month") {
          matchesDate =
            supplierDate.getMonth() === today.getMonth() &&
            supplierDate.getFullYear() === today.getFullYear();
        } else if (dateFilter === "range") {
          if (dateRange.from && supplierDate < new Date(dateRange.from))
            matchesDate = false;
          if (dateRange.to && supplierDate > new Date(dateRange.to))
            matchesDate = false;
        }
      }

      return matchesSearch && matchesFishType && matchesPayment && matchesDate;
    });
  };

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return filterSuppliers(suppliers, {
      searchTerm,
      selectedFishType,
      paymentFilter,
      dateFilter,
      dateRange,
    });
  }, [
    suppliers,
    searchTerm,
    selectedFishType,
    paymentFilter,
    dateFilter,
    dateRange,
  ]);

  // Create supplier
  const createSupplier = async (supplierData) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newSupplier = {
        ...supplierData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        totalDeliveries: 0,
        totalWeight: 0,
        totalAmount: 0,
        paymentStatus: "unpaid",
        lastDelivery: null,
      };
      setSuppliers((prev) => [newSupplier, ...prev]);
      return newSupplier;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update supplier
  const updateSupplier = async (supplierId, supplierData) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === supplierId
            ? { ...supplier, ...supplierData }
            : supplier
        )
      );
      return { ...supplierData, id: supplierId };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Delete supplier
  const deleteSupplier = async (supplierId) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSuppliers((prev) =>
        prev.filter((supplier) => supplier.id !== supplierId)
      );
      return { success: true };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    suppliers: filteredSuppliers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedFishType,
    setSelectedFishType,
    paymentFilter,
    setPaymentFilter,
    dateFilter,
    setDateFilter,
    dateRange,
    setDateRange,
    createSupplier,
    updateSupplier,
    deleteSupplier,
  };
};
