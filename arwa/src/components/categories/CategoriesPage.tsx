import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Grid3X3,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/Button";
import { AddCategoryModal } from "./modals/AddCategoryModal";
import { EditCategoryModal } from "./modals/EditCategoryModal";
import { TopNavigation } from "../common/TopNavigation";
import {
  isNewMainCategory,
  isUpdateMainCategory,
  isUpdateSubCategory,
} from "../../utils/typeGuards";
import { useCategoryStore } from "../../stores/categoryStore";
import type { CategoryDTO, UpsertCategoryPayload } from "./api/categoryApi";

type Category = CategoryDTO;
type SubCategory = CategoryDTO["subcategories"][number];

interface EditingItem {
  id: number;
  name: string;
  type: "main" | "sub";
  mainCategoryId?: number;
  character?: string | null;
  color?: string | null;
  categoryType?: number;
}

const CategoriesPage: React.FC = () => {
  const {
    categories,
    loading,
    fetch,
    upsert,
    removeCategory,
    removeSubCategory,
  } = useCategoryStore();
  const [error, setError] = useState<string | null>(null);

  const [expandedCategories, setExpandedCategories] = useState(
    new Set([1, 2, 3])
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [modalType, setModalType] = useState("main"); // 'main' or 'sub'
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    number | null
  >(null);

  const toggleCategory = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleAddMainCategory = () => {
    setModalType("main");
    setSelectedMainCategory(null);
    setShowAddModal(true);
  };

  useEffect(() => {
    (async () => {
      setError(null);
      try {
        await fetch();
      } catch {
        // store already set error, but keep a local message for UI
        setError("غير مصرح لك بعرض الفئات أو حدث خطأ أثناء التحميل");
      }
    })();
  }, [fetch]);

  const handleAddSubCategory = (mainCategoryId: number) => {
    setModalType("sub");
    setSelectedMainCategory(mainCategoryId);
    setShowAddModal(true);
  };

  const handleEditMainCategory = (category: Category) => {
    setEditingItem({ ...category, type: "main" });
    setShowEditModal(true);
  };

  const handleEditSubCategory = (
    subcategory: SubCategory,
    mainCategoryId: number
  ) => {
    const mainCategory = categories.find((c) => c.id === mainCategoryId);
    setEditingItem({
      ...subcategory,
      type: "sub",
      mainCategoryId,
      categoryType: mainCategory?.categoryType,
    });
    setShowEditModal(true);
  };

  const handleDeleteMainCategory = async (categoryId: number) => {
    const sure = confirm("هل أنت متأكد من حذف هذه الفئة الرئيسية؟");
    if (!sure) return;
    try {
      await removeCategory(categoryId);
      // If successful, the store will refetch automatically
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "خطأ أثناء حذف الفئة";
      alert(errorMessage);
    }
  };

  const handleDeleteSubCategory = async (
    mainCategoryId: number,
    subCategoryId: number
  ) => {
    const sure = confirm("هل أنت متأكد من حذف هذه الفئة الفرعية؟");
    if (!sure) return;
    try {
      const ok = await removeSubCategory(mainCategoryId, subCategoryId);
      if (!ok) {
        alert("غير مصرح بحذف الفئة الفرعية أو حدث خطأ.");
      }
    } catch {
      alert("خطأ أثناء حذف الفئة الفرعية");
    }
  };

  const handleSaveCategory = (categoryData: unknown) => {
    const data = categoryData as {
      name: string;
      categoryType: number;
      character?: string;
      color?: string;
    };
    if (modalType === "main" && isNewMainCategory(data)) {
      upsert({ name: data.name, categoryType: data.categoryType })
        .then((ok) => {
          if (!ok) setError("غير مصرح بإضافة الفئة أو حدث خطأ.");
        })
        .catch(() => setError("غير مصرح بإضافة الفئة أو حدث خطأ."));
    } else if (
      modalType === "sub" &&
      data.name &&
      data.character &&
      data.color &&
      data.categoryType
    ) {
      const mainCategory = categories.find(
        (c) => c.id === selectedMainCategory
      );
      if (!mainCategory) return;
      upsert({
        name: data.name,
        type: "sub",
        mainCategoryId: selectedMainCategory as number,
        character: data.character,
        color: data.color,
        categoryType: data.categoryType,
      })
        .then((ok) => {
          if (!ok) setError("غير مصرح بإضافة الفئة الفرعية أو حدث خطأ.");
        })
        .catch(() => setError("غير مصرح بإضافة الفئة الفرعية أو حدث خطأ."));
    }
    setShowAddModal(false);
  };

  const handleUpdateCategory = (updatedData: unknown) => {
    const data = updatedData as {
      name: string;
      categoryType: number;
      character?: string;
      color?: string;
    };
    if (!editingItem) return;

    let payload: Record<string, unknown> = {
      id: editingItem.id,
    };

    if (editingItem.type === "main" && isUpdateMainCategory(data)) {
      payload = {
        ...payload,
        name: data.name,
        categoryType: data.categoryType,
      };
    } else if (editingItem.type === "sub" && isUpdateSubCategory(data)) {
      const mainCategory = categories.find(
        (c) => c.id === editingItem.mainCategoryId
      );
      payload = {
        ...payload,
        name: data.name,
        type: "sub",
        mainCategoryId: editingItem.mainCategoryId,
        character: data.character,
        color: data.color,
        categoryType: mainCategory?.categoryType || 1,
      };
    }

    upsert(payload as UpsertCategoryPayload)
      .then((ok) => {
        if (!ok) setError("غير مصرح بتحديث الفئة أو حدث خطأ.");
      })
      .finally(() => {
        setShowEditModal(false);
        setEditingItem(null);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <TopNavigation currentPage="categories" />
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                انواع الاسماك
              </h1>
              <p className="text-gray-600 mt-2">
                إضافة وتعديل فئات المنتجات والفئات الفرعية
              </p>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={handleAddMainCategory}
            >
              <Plus className="h-4 w-4" />
              إضافة فئة رئيسية
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {error ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">جاري التحميل...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">لا توجد فئات لعرضها</p>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm">
                {/* Main Category Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        {expandedCategories.has(category.id) ? (
                          <ChevronDown size={20} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={20} className="text-gray-500" />
                        )}
                      </button>
                      <div className="p-3 rounded-full bg-blue-100 mr-3">
                        <Grid3X3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {category.productCount} منتج •{" "}
                          {category.subcategories.length} فئة فرعية
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleAddSubCategory(category.id)}
                        variant="outline"
                        size="sm"
                        className="inline-flex items-center"
                      >
                        <Plus size={16} className="ml-1" />
                        فئة فرعية
                      </Button>
                      <button
                        onClick={() => handleEditMainCategory(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMainCategory(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                {expandedCategories.has(category.id) && (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.subcategories.map((subcategory) => (
                        <div
                          key={subcategory.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{
                                  backgroundColor: subcategory.color || "#888",
                                }}
                              >
                                {subcategory.character || "?"}
                              </div>
                              <span className="font-medium text-gray-900 mr-3">
                                {subcategory.name}
                              </span>
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() =>
                                  handleEditSubCategory(
                                    subcategory,
                                    category.id
                                  )
                                }
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteSubCategory(
                                    category.id,
                                    subcategory.id
                                  )
                                }
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {subcategory.productCount} منتج
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Category Modal */}
        <AddCategoryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveCategory}
          type={modalType}
          mainCategoryName={
            selectedMainCategory
              ? categories.find((c) => c.id === selectedMainCategory)?.name
              : ""
          }
          mainCategoryType={
            selectedMainCategory
              ? categories.find((c) => c.id === selectedMainCategory)
                  ?.categoryType
              : undefined
          }
        />

        {/* Edit Category Modal */}
        <EditCategoryModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateCategory}
          editingItem={editingItem}
        />
      </div>
    </div>
  );
};

export { CategoriesPage };
