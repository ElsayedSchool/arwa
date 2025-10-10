import React from "react";
import { Calendar, User, Truck, Package, Fish } from "lucide-react";
import { Modal } from "../../common/Modal";
import { type InventoryDeliveryUi } from "../api/InventoryApi";

interface InventoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: InventoryDeliveryUi | null;
}

export const InventoryDetailsModal: React.FC<InventoryDetailsModalProps> = ({
  isOpen,
  onClose,
  delivery,
}) => {
  if (!delivery) return null;

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

        {/* Fish Types */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">أنواع الأسماك</h3>
            <div className="flex items-center">
              <Fish className="h-5 w-5 text-gray-400 ml-2" />
              <div className="text-left">
                <p className="text-sm text-gray-500">عدد الأنواع</p>
                <p className="font-medium">{delivery.fishTypes.length}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {delivery.fishTypes.map((fish, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">النوع</p>
                    <p className="font-medium">{fish.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الوزن</p>
                    <p className="font-medium">{fish.weight.toFixed(1)} كجم</p>
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
