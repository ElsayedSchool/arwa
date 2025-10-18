// Re-export inventory API functions for inventory movement feature
export {
  default as inventoryApi,
  type InventoryDeliveryUi,
  type InventoryFishTypeUi,
} from "../../inventory/api/InventoryApi";

import type { AggregatedFishStock, DeliveryItem } from "../types";

// Additional API functions for inventory movement
export const inventoryMovementApi = {
  // Update aggregated stock (creates tomorrow's delivery from today's remaining stock)
  updateAggregatedStock: async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    const response = await fetch(
      "/api/inventory-movement/update-delivery-stock",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // Empty body as per current implementation
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update aggregated stock");
    }

    return response.json();
  },

  // Get aggregated stock data
  getAggregatedStock: async (): Promise<AggregatedFishStock[]> => {
    const response = await fetch("/api/inventory-movement/aggregated-stock", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get aggregated stock");
    }

    return response.json();
  },

  // Get stock of day (from stock supplier's next day delivery)
  getStockOfDay: async (date: string): Promise<DeliveryItem[]> => {
    const response = await fetch(
      `/api/inventory-movement/stock-of-day?date=${date}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get stock of day");
    }

    return response.json();
  },
};
