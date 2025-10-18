import type { InventoryFishTypeUi } from "../../inventory/api/InventoryApi";

export interface AggregatedFishStock {
  type: string;
  totalWeight: number;
  remainingWeight: number;
  soldWeight: number;
  unit: string;
}

export interface StockDelivery {
  id: string;
  date: string;
  supplierName: string;
  driverName: string;
  fishTypes: InventoryFishTypeUi[];
  totalWeight: number;
  remainingWeight: number;
}

export interface DeliveryItem {
  id: string;
  deliveryId: string | null;
  fishTypeId: number;
  fishTypeName: string;
  amount: number;
  pricePerKilo: number;
  totalPrice: number;
  soldAmount: number;
  restAmount: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  type?: {
    id: number;
    name: string;
  };
}
