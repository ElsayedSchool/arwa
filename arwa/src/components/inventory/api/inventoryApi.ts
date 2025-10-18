import api from "../../../services/api";

// Backend entities
export interface SupplierDto {
  id: string;
  name: string;
  nickName?: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  isBase?: boolean;
  category?: string | null;
  categoryType?: number;
}

export interface DeliveryDto {
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

export interface DeliveryItemDto {
  id: string;
  truckId: string | null;
  typeId: string | null;
  amount: number; // weight
  classification?: string | null;
}

export type PaymentStatus = "paid" | "unpaid" | "partial";

export interface InventoryFishTypeUi {
  id?: string;
  type: string; // type name
  quantity: number;
  unit: string;
  weight: number;
}

export interface InventoryDeliveryUi {
  id: string;
  supplierName: string;
  driverName: string;
  deliveryDate: string; // YYYY-MM-DD
  deliveryTime: string; // HH:mm
  lastEditTime: string | null; // ISO or null
  totalWeight: number;
  fishTypes: InventoryFishTypeUi[];
}

const toDateParts = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
};

export interface CreateDeliveryPayload {
  supplierId?: string;
  supplierName: string;
  driverName: string;
  deliveryDate: string;
  deliveryTime: string;
  totalCost: number;
  amountPaid: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  fishTypes: Array<{
    type: string;
    quantity: number;
    unit: string;
    weight: number;
    pricePerKg: number;
  }>;
}

export const deliveriesApi = {
  async getSuppliers(): Promise<SupplierDto[]> {
    const { data } = await api.get("/supplier");
    return Array.isArray(data) ? data : data?.items ?? [];
  },

  async getTypes(): Promise<CategoryDto[]> {
    // backend exposes categories at /category returning main categories with nested subcategories
    const { data } = await api.get("/category");
    const items = Array.isArray(data) ? data : data?.items ?? [];
    const result: CategoryDto[] = [];
    for (const main of items) {
      result.push({
        id: main.id,
        name: main.name,
        isBase: true,
        category: null,
      });
      // Be tolerant to different backend keys for sub-collections
      const subCandidates = ((Array.isArray(main.subcategories) &&
        main.subcategories) ||
        (Array.isArray(main.subCategories) && main.subCategories) ||
        (Array.isArray(main.children) && main.children) ||
        (Array.isArray(main.subs) && main.subs) ||
        (Array.isArray(main.subTypes) && main.subTypes) ||
        (Array.isArray(main.sub_types) && main.sub_types) ||
        (Array.isArray(main.types) && main.types) ||
        (Array.isArray(main.items) && main.items) ||
        (Array.isArray(main.SubCategories) && main.SubCategories) ||
        (Array.isArray(main?.subs?.items) && main.subs.items) ||
        []) as unknown[];
      for (const raw of subCandidates) {
        const sub = raw as { id?: string | number; name?: string };
        if (
          sub &&
          (typeof sub.id === "string" || typeof sub.id === "number") &&
          typeof sub.name === "string"
        ) {
          result.push({
            id: String(sub.id),
            name: sub.name,
            isBase: false,
            category: main.name,
          });
        }
      }
    }
    return result;
  },

  async getInventory(filters?: {
    supplierName?: string;
    phone?: string;
    baseType?: string;
    subType?: string;
    dateFilter?: string;
    from?: string;
    to?: string;
  }): Promise<InventoryDeliveryUi[]> {
    const { data } = await api.get("/delivery/inventory", { params: filters });
    return Array.isArray(data) ? data : data?.items ?? [];
  },

  async createInventory(payload: {
    supplierName: string;
    driverName: string;
    deliveryDate: string;
    deliveryTime: string;
    fishTypes: InventoryFishTypeUi[];
  }): Promise<InventoryDeliveryUi> {
    const { data } = await api.post("/delivery", payload);
    return data;
  },

  async updateRestAmounts(
    deliveryId: string,
    itemUpdates: Array<{ deliveryItemId: string; restAmount: number }>
  ): Promise<{
    success: boolean;
    message: string;
    deliveryId: string;
    updatedItems: number;
  }> {
    const { data } = await api.put(`/delivery/${deliveryId}/rest-amounts`, {
      itemUpdates,
    });
    return data;
  },

  async updateDelivery(
    deliveryId: string,
    payload: {
      supplierName: string;
      driverName: string;
      deliveryDate: string;
      deliveryTime: string;
      fishTypes: InventoryFishTypeUi[];
    }
  ): Promise<InventoryDeliveryUi> {
    // Use POST /delivery for upsert (create/update) since backend doesn't have PUT /delivery/:id
    const { data } = await api.post("/delivery", {
      ...payload,
      id: deliveryId,
    });
    return data;
  },

  async getDeliveryItems(): Promise<DeliveryItemDto[]> {
    const { data } = await api.get("/delivery-item");
    return Array.isArray(data) ? data : data?.items ?? [];
  },

  async upsertDeliveryItem(payload: {
    id?: string;
    deliveryId: string;
    typeId?: string | number;
    amount?: number;
    pricePerKilo?: number;
    totalPrice?: number;
  }) {
    const { data } = await api.post("/delivery-item", payload);
    return data;
  },

  async ensureTypeByName(
    name: string,
    existing: Map<string, CategoryDto>,
    baseName?: string
  ): Promise<CategoryDto> {
    const isBase = (t: CategoryDto) =>
      t?.isBase === true ||
      (t as unknown as { is_base?: boolean })?.is_base === true;
    // try exact match (case-sensitive first), fallback to case-insensitive
    for (const t of existing.values()) {
      if (t.name === name) return t;
    }
    for (const t of existing.values()) {
      if (t.name.toLowerCase() === name.toLowerCase()) return t;
    }
    // The backend uses /category for creating/updating categories. It returns boolean,
    // so after posting we refresh the list and return the created type.
    // Ensure base exists (if requested)
    const refreshTypes = async () => {
      const latest = await this.getTypes();
      for (const t of latest) existing.set(t.id, t);
      return latest;
    };

    // find base id if needed
    let baseId: string | undefined;
    if (baseName) {
      for (const t of existing.values()) {
        if (isBase(t) && t.name === baseName) {
          baseId = t.id;
          break;
        }
      }
      if (!baseId) {
        // create main category
        await api.post("/category", { name: baseName, type: "main" });
        const latest = await refreshTypes();
        const found = latest.find((x) => x.name === baseName && x.isBase);
        baseId = found?.id;
      }
    }

    // create sub or main
    if (baseName) {
      await api.post("/category", {
        name,
        type: "sub",
        mainCategoryId: Number(baseId),
      });
    } else {
      await api.post("/category", { name, type: "main" });
    }

    const latest = await refreshTypes();
    const created = latest.find((t) => t.name === name);
    if (!created) throw new Error("Failed to create type");
    existing.set(created.id, created);
    return created;
  },

  async createDelivery(payload: CreateDeliveryPayload): Promise<DeliveryDto> {
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
    deliveries: DeliveryDto[],
    items: DeliveryItemDto[],
    types: CategoryDto[]
  ): InventoryDeliveryUi[] {
    const typeById = new Map(types.map((t) => [t.id, t] as const));
    const itemsByTruck = new Map<string, DeliveryItemDto[]>();
    for (const it of items) {
      if (!it.truckId) continue;
      const arr = itemsByTruck.get(it.truckId) || [];
      arr.push(it);
      itemsByTruck.set(it.truckId, arr);
    }
    return deliveries.map((t) => {
      const its = itemsByTruck.get(t.id) || [];
      const fishTypes: InventoryFishTypeUi[] = its.map((it) => ({
        type: it.typeId
          ? typeById.get(it.typeId)?.name || "غير معروف"
          : "غير معروف",
        quantity: it.amount || 0,
        unit: "kg",
        weight: it.amount || 0,
      }));
      const totalWeight = fishTypes.reduce(
        (sum, f) => sum + (f.weight || 0),
        0
      );
      const parts = toDateParts(t.deliveryDate);
      return {
        id: t.id,
        supplierName: t.supplierName,
        driverName: t.driverName || "",
        deliveryDate: parts.date,
        deliveryTime: parts.time,
        lastEditTime: t.lastUpdated || null,
        totalWeight,
        fishTypes,
      } as InventoryDeliveryUi;
    });
  },
  splitBaseAndSubtypes(types: CategoryDto[]) {
    const bases = types.filter((t) => t.isBase);
    const subs = types.filter((t) => !t.isBase);
    const byBase: Record<string, CategoryDto[]> = {};
    for (const base of bases) {
      byBase[base.name] = subs.filter((s) => (s.category || "") === base.name);
    }
    return { bases, subs, byBase };
  },
  getSubtypesForBase(types: CategoryDto[], baseName: string) {
    const { byBase } = this.splitBaseAndSubtypes(types);
    return byBase[baseName] || [];
  },
};

export default deliveriesApi;
