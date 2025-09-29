import api from "../../../services/api";

// Backend entities
export interface SupplierDto {
  id: string;
  name: string;
  nickName?: string;
}

export interface TypeDto {
  id: string;
  name: string;
  isBase?: boolean;
  category?: string | null;
}

export interface TruckDto {
  id: string;
  supplierId?: string | null;
  supplierName: string;
  driverName?: string | null;
  deliveryDate: string; // ISO string
  lastUpdated: string; // ISO string
  isPriceUpdated: boolean;
  totalPrice: number;
  totalPaid: number;
  totalDue: number;
}

export interface TruckItemDto {
  id: string;
  truckId: string | null;
  typeId: string | null;
  amount: number; // weight
  classification?: string | null;
}

export interface DeliveryDto extends TruckDto {}
export interface DeliveryItemDto extends TruckItemDto {}

export type PaymentStatus = "paid" | "unpaid" | "partial";

export interface FishTypeUi {
  type: string; // type name
  weight: number;
  pricePerKg: number;
}

export interface DeliveryUi {
  id: string;
  supplierName: string;
  driverName: string;
  deliveryDate: string; // YYYY-MM-DD
  deliveryTime: string; // HH:mm
  lastEditTime: string | null; // ISO or null
  totalWeight: number;
  paymentStatus: PaymentStatus;
  totalCost: number;
  amountPaid: number;
  remainingAmount: number;
  fishTypes: FishTypeUi[];
}

const toDateParts = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
};

const computePaymentStatus = (total: number, paid: number): PaymentStatus => {
  if (!total || total <= 0) return "unpaid";
  if (!paid || paid <= 0) return "unpaid";
  if (paid >= total) return "paid";
  return "partial";
};

export const deliveriesApi = {
  async getSuppliers(): Promise<SupplierDto[]> {
    const { data } = await api.get("/supplier");
    return Array.isArray(data) ? data : data?.items ?? [];
  },

  async getTypes(): Promise<TypeDto[]> {
    const { data } = await api.get("/type");
    return Array.isArray(data) ? data : data?.items ?? [];
  },

  async getDeliveries(): Promise<DeliveryDto[]> {
    const { data } = await api.get("/delivery");
    return Array.isArray(data) ? data : data?.items ?? [];
  },

  async getDeliveryItems(): Promise<DeliveryItemDto[]> {
    const { data } = await api.get("/delivery-item");
    return Array.isArray(data) ? data : data?.items ?? [];
  },

  async ensureTypeByName(
    name: string,
    existing: Map<string, TypeDto>,
    baseName?: string
  ): Promise<TypeDto> {
    // try exact match (case-sensitive first), fallback to case-insensitive
    for (const t of existing.values()) {
      if (t.name === name) return t;
    }
    for (const t of existing.values()) {
      if (t.name.toLowerCase() === name.toLowerCase()) return t;
    }
    const payload: Partial<TypeDto> = baseName
      ? { name, isBase: false, category: baseName }
      : { name };
    const { data } = await api.post("/type", payload);
    const created: TypeDto = data;
    existing.set(created.id, created);
    return created;
  },

  async createDelivery(payload: Partial<DeliveryDto>): Promise<DeliveryDto> {
    const { data } = await api.post("/delivery", payload);
    return data;
  },

  async createDeliveryItem(
    payload: Partial<DeliveryItemDto>
  ): Promise<DeliveryItemDto> {
    const { data } = await api.post("/delivery-item", payload);
    return data;
  },

  async deleteDelivery(id: string): Promise<void> {
    await api.delete(`/delivery/${id}`);
  },

  async updateDeliveryTotals(
    id: string,
    totalCost: number,
    amountPaid: number
  ): Promise<DeliveryDto> {
    const totalDue = Math.max(0, totalCost - amountPaid);
    const { data } = await api.post("/delivery", {
      id,
      isPriceUpdated: true,
      totalPrice: totalCost,
      totalPaid: amountPaid,
      totalDue,
    });
    return data;
  },

  assembleDeliveries(
    trucks: DeliveryDto[],
    items: DeliveryItemDto[],
    types: TypeDto[]
  ): DeliveryUi[] {
    const typeById = new Map(types.map((t) => [t.id, t] as const));
    const itemsByTruck = new Map<string, DeliveryItemDto[]>();
    for (const it of items) {
      if (!it.truckId) continue;
      const arr = itemsByTruck.get(it.truckId) || [];
      arr.push(it);
      itemsByTruck.set(it.truckId, arr);
    }
    return trucks.map((t) => {
      const its = itemsByTruck.get(t.id) || [];
      const fishTypes: FishTypeUi[] = its.map((it) => ({
        type: it.typeId
          ? typeById.get(it.typeId)?.name || "غير معروف"
          : "غير معروف",
        weight: it.amount || 0,
        pricePerKg: 0, // Backend doesn't track per-item price yet
      }));
      const totalWeight = fishTypes.reduce(
        (sum, f) => sum + (f.weight || 0),
        0
      );
      const parts = toDateParts(t.deliveryDate);
      const status = computePaymentStatus(t.totalPrice || 0, t.totalPaid || 0);
      return {
        id: t.id,
        supplierName: t.supplierName,
        driverName: t.driverName || "",
        deliveryDate: parts.date,
        deliveryTime: parts.time,
        lastEditTime: t.lastUpdated || null,
        totalWeight,
        paymentStatus: status,
        totalCost: t.totalPrice || 0,
        amountPaid: t.totalPaid || 0,
        remainingAmount:
          t.totalDue || Math.max(0, (t.totalPrice || 0) - (t.totalPaid || 0)),
        fishTypes,
      } as DeliveryUi;
    });
  },
  splitBaseAndSubtypes(types: TypeDto[]) {
    const bases = types.filter((t) => t.isBase);
    const subs = types.filter((t) => !t.isBase);
    const byBase: Record<string, TypeDto[]> = {};
    for (const base of bases) {
      byBase[base.name] = subs.filter((s) => (s.category || "") === base.name);
    }
    return { bases, subs, byBase };
  },
  getSubtypesForBase(types: TypeDto[], baseName: string) {
    const { byBase } = this.splitBaseAndSubtypes(types);
    return byBase[baseName] || [];
  },
};

export default deliveriesApi;
