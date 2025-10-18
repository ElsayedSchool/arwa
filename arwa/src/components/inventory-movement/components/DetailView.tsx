import React from "react";
import { Button } from "../../ui/Button";
import type { StockDelivery } from "../types";
import type { InventoryDeliveryUi } from "../api/inventoryMovementApi";

interface DetailViewProps {
  stockDelivery: StockDelivery;
  deliveries: InventoryDeliveryUi[];
  onBack: () => void;
}

export const DetailView: React.FC<DetailViewProps> = ({
  stockDelivery,
  deliveries,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      {/* Stock Delivery Summary */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              المخزون الحالي - {stockDelivery.date}
            </h3>
            <Button onClick={onBack} variant="outline">
              العودة للموجز
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">إجمالي الوزن</p>
              <p className="text-2xl font-bold text-blue-900">
                {stockDelivery.totalWeight.toFixed(1)} كجم
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">
                الوزن المتبقي
              </p>
              <p className="text-2xl font-bold text-green-900">
                {stockDelivery.remainingWeight.toFixed(1)} كجم
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">عدد الأنواع</p>
              <p className="text-2xl font-bold text-purple-900">
                {stockDelivery.fishTypes.length}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900">
              تفاصيل الأنواع
            </h4>
            {stockDelivery.fishTypes.map((fish, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-gray-900">{fish.type}</h5>
                  <span className="text-sm text-gray-600">
                    إجمالي: {fish.weight?.toFixed(1)} {fish.unit}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">المتبقي</p>
                    <p className="text-lg font-semibold text-green-600">
                      {fish.quantity?.toFixed(1)} {fish.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">المباع</p>
                    <p className="text-lg font-semibold text-red-600">
                      {((fish.weight || 0) - (fish.quantity || 0)).toFixed(1)}{" "}
                      {fish.unit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Deliveries */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            تفاصيل التوصيلات ({deliveries.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {delivery.supplierName}
                  </h4>
                  <p className="text-sm text-gray-600">
                    السائق: {delivery.driverName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {delivery.deliveryDate} - {delivery.deliveryTime}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">إجمالي الوزن</p>
                  <p className="font-semibold">
                    {delivery.totalWeight?.toFixed(1)} كجم
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {delivery.fishTypes?.map((fish, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded">
                    <p className="font-medium text-sm">{fish.type}</p>
                    <div className="text-xs text-gray-600 mt-1">
                      <p>
                        الوزن: {fish.weight?.toFixed(1)} {fish.unit}
                      </p>
                      <p>
                        المتبقي: {fish.quantity?.toFixed(1)} {fish.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
