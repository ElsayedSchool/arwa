// Business logic layer for suppliers
export const supplierService = {
  // Get all suppliers with analytics
  async getSuppliers() {
    // Always return demo data instead of trying API
    return this.getMockSuppliers();
  },

  // Create new supplier
  async createSupplier(supplierData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newSupplier = {
      ...supplierData,
      createdAt: new Date().toISOString(),
      totalDeliveries: 0,
      totalWeight: 0,
      totalAmount: 0,
    };
    return newSupplier;
  },

  // Update supplier
  async updateSupplier(supplierId, supplierData) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { ...supplierData, id: supplierId };
  },

  // Delete supplier
  async deleteSupplier(supplierId) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },

  // Filter suppliers
  filterSuppliers(suppliers, { searchTerm, selectedFishType, paymentFilter }) {
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

      return matchesSearch && matchesFishType && matchesPayment;
    });
  },

  // Enhanced mock data for suppliers
  getMockSuppliers() {
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
      {
        id: 5,
        name: "مصايد البحر المتوسط",
        phone: "01888999000",
        email: "mediterranean@example.com",
        address: "مطروح، ميناء الصيد",
        fishTypes: [
          { type: "دنيس", pricePerKg: 80 },
          { type: "بوري", pricePerKg: 65 },
          { type: "سردين", pricePerKg: 30 },
        ],
        totalDeliveries: 10,
        totalWeight: 250.0,
        totalAmount: 16250,
        paymentStatus: "partial",
        paymentTerms: "credit",
        lastDelivery: "2024-01-11",
        createdAt: "2024-01-02T00:00:00Z",
        notes: "أسماك بحرية طبيعية",
      },
    ];
  },
};
