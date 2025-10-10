import React, { useState, useEffect } from "react";
import { X, Save, Package } from "lucide-react";
import type {
  InventoryDeliveryUi,
  InventoryFishTypeUi,
} from "../api/InventoryApi";

interface UpdateRestAmountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: InventoryDeliveryUi | null;
  onSave: (
    deliveryId: string,
    updates: Array<{ deliveryItemId: string; restAmount: number }>
  ) => Promise<void>;
  loading?: boolean;
}

interface DeliveryItemWithRest extends InventoryFishTypeUi {
  deliveryItemId: string;
  totalAmount: number;
  soldAmount: number;
  stockAmount: number;
  restAmount: number;
}

export const UpdateRestAmountsModal: React.FC<UpdateRestAmountsModalProps> = ({
  isOpen,
  onClose,
  delivery,
  onSave,
  loading = false,
}) => {
  const [items, setItems] = useState<DeliveryItemWithRest[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (delivery && delivery.fishTypes) {
      // Transform delivery items to include rest amount fields
      const transformedItems: DeliveryItemWithRest[] = delivery.fishTypes.map(
        (item) => ({
          ...item,
          deliveryItemId: item.id || "",
          totalAmount: item.weight || 0,
          soldAmount: 0, // This would come from the backend in a real implementation
          stockAmount: (item.weight || 0) - 0, // total - sold
          restAmount: 0, // Default to 0, will be updated by staff
        })
      );
      setItems(transformedItems);
      setHasChanges(false);
    }
  }, [delivery]);

  const handleRestAmountChange = (index: number, value: number) => {
    const newItems = [...items];
    newItems[index].restAmount = value;
    setItems(newItems);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!delivery) return;

    const updates = items.map((item) => ({
      deliveryItemId: item.deliveryItemId,
      restAmount: item.restAmount,
    }));

    try {
      await onSave(delivery.id, updates);
      setHasChanges(false);
      onClose();
    } catch (error) {
      console.error("Failed to update rest amounts:", error);
    }
  };

  if (!isOpen || !delivery) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 ml-2" />
              تحديث المخزون المتبقي
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {delivery.supplierName} - {delivery.deliveryDate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              أدخل الكميات المتبقية لكل نوع من الأسماك في نهاية اليوم. هذه
              الكميات ستساعد في تتبع المخزون المتاح.
            </p>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.deliveryItemId}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.type}
                  </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-600 mb-1">
                      الكمية الإجمالية
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {item.totalAmount} كجم
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-600 mb-1">
                      الكمية المباعة
                    </div>
                    <div className="text-lg font-semibold text-yellow-800">
                      {item.soldAmount} كجم
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-600 mb-1">
                      المخزون المتاح
                    </div>
                    <div className="text-lg font-semibold text-green-800">
                      {item.stockAmount} كجم
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-600 mb-1">
                      المتبقي (إدخال)
                    </div>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max={item.stockAmount}
                      value={item.restAmount}
                      onChange={(e) =>
                        handleRestAmountChange(
                          index,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full text-center text-lg font-semibold text-blue-800 border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  المتبقي يجب أن يكون أقل من أو يساوي المخزون المتاح (
                  {item.stockAmount} كجم)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} />
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>
    </div>
  );
};
