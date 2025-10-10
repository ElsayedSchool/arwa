import React from "react";
import { Calendar, User, Truck, Package, Fish, DollarSign } from "lucide-react";
import { Modal } from "../../common/Modal";
import { type InventoryDeliveryUi } from "../api/InventoryApi";

interface InventoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: InventoryDeliveryUi | null;
  userRole?: string;
}

export const InventoryDetailsModal: React.FC<InventoryDetailsModalProps> = ({
  isOpen,
  onClose,
  delivery,
  userRole = "user",
}) => {
  if (!delivery) return null;

  const isAdmin = userRole === "admin" || userRole === "owner";

  const formatDateTime = (date: string, time: string) => {
    const formattedDate = new Date(date).toLocaleDateString("ar-EG");
    return `${formattedDate} - ${time}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تفاصيل التوصيل" size="lg">
      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-gray-400 ml-2" />
              <div>
                <p className="text-sm text-gray-500">المورد</p>
                <p className="font-medium">{delivery.supplierName}</p>
              </div>
            </div>

            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 ml-2" />
              <div>
                <p className="text-sm text-gray-500">السائق</p>
                <p className="font-medium">{delivery.driverName}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 ml-2" />
              <div>
                <p className="text-sm text-gray-500">تاريخ ووقت التوصيل</p>
                <p className="font-medium">
                  {formatDateTime(delivery.deliveryDate, delivery.deliveryTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <Package className="h-5 w-5 text-gray-400 ml-2" />
              <div>
                <p className="text-sm text-gray-500">إجمالي الوزن</p>
                <p className="font-medium">
                  {delivery.totalWeight.toFixed(1)} كجم
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">حالة المخزون</span>
            <span className="text-sm font-medium text-green-600">متوفر</span>
          </div>
        </div>

        {/* Inventory Summary (Admin Only) */}
        {isAdmin && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 ml-2" />
              ملخص المخزون
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">إجمالي الوزن</p>
                <p className="text-lg font-semibold text-gray-900">
                  {delivery.totalWeight.toFixed(1)} كجم
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">عدد الأنواع</p>
                <p className="text-lg font-semibold text-blue-600">
                  {delivery.fishTypes.length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">الكميه المباعه</p>
                <p className="text-lg font-semibold text-green-600">
                  {delivery.fishTypes
                    .reduce((total, fish) => total + fish.weight * 0.3, 0) // Assuming 30% sold as example
                    .toFixed(1)}{" "}
                  كجم
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">المتبقي</p>
                <p className="text-lg font-semibold text-purple-600">
                  {delivery.fishTypes
                    .reduce((total, fish) => total + fish.weight * 0.7, 0) // Assuming 70% remaining
                    .toFixed(1)}{" "}
                  كجم
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">المتبقي اليدوي</p>
                <p className="text-lg font-semibold text-orange-600">
                  {delivery.fishTypes
                    .reduce((total, fish) => total + fish.weight * 0.8, 0) // Assuming manual adjustment
                    .toFixed(1)}{" "}
                  كجم
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fish Types */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Fish className="h-5 w-5 ml-2" />
            أنواع الأسماك والتفاصيل
          </h3>
          <div className="space-y-3">
            {delivery.fishTypes.map((fish, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">النوع</p>
                    <p className="font-medium">{fish.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الوزن</p>
                    <p className="font-medium text-blue-600">
                      {fish.weight.toFixed(1)} كجم
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">المباع</p>
                    <p className="font-medium text-green-600">
                      {(fish.weight * 0.3).toFixed(1)} كجم
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">المتبقي</p>
                    <p className="font-medium text-purple-600">
                      {(fish.weight * 0.7).toFixed(1)} كجم
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">المتبقي اليدوي</p>
                    <p className="font-medium text-orange-600">
                      {(fish.weight * 0.8).toFixed(1)} كجم
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Edit */}
        {delivery.lastEditTime && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              آخر تعديل:{" "}
              {new Date(delivery.lastEditTime).toLocaleString("ar-EG")}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
