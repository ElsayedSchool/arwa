import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Grid3X3,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/Button";
// @ts-expect-error - JSX module import
import { AddCategoryModal } from "./modals/AddCategoryModal";
// @ts-expect-error - JSX module import
import { EditCategoryModal } from "./modals/EditCategoryModal";
import { TopNavigation } from "../common/TopNavigation";
import {
  isNewMainCategory,
  isNewSubCategory,
  isUpdateMainCategory,
  isUpdateSubCategory,
  isApiResponse,
} from "../../utils/typeGuards";

interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
  subcategories: SubCategory[];
}

interface SubCategory {
  id: number;
  name: string;
  character: string;
  color: string;
  productCount: number;
}

interface EditingItem {
  id: number;
  name: string;
  description?: string;
  type: "main" | "sub";
  mainCategoryId?: number;
  character?: string;
  color?: string;
}

interface ApiResponse {
  data?: Category[];
}

const CategoriesPage: React.FC = () => {
  // Demo data for categories
  const demoCategories = useMemo<Category[]>(
    () => [
      {
        id: 1,
        name: "أسماك البحر الأحمر",
        description: "أسماك طازجة من البحر الأحمر",
        productCount: 15,
        subcategories: [
          {
            id: 1,
            name: "بلطي",
            character: "ط",
            color: "#FF6B6B",
            productCount: 5,
          },
          {
            id: 2,
            name: "دنيس",
            character: "د",
            color: "#4ECDC4",
            productCount: 3,
          },
          {
            id: 3,
            name: "قاروص",
            character: "ق",
            color: "#45B7D1",
            productCount: 7,
          },
        ],
      },
      {
        id: 2,
        name: "أسماك المياه العذبة",
        description: "أسماك من المزارع والأنهار",
        productCount: 12,
        subcategories: [
          {
            id: 4,
            name: "مبروك",
            character: "م",
            color: "#FFA07A",
            productCount: 4,
          },
          {
            id: 5,
            name: "بوري",
            character: "ب",
            color: "#98D8C8",
            productCount: 8,
          },
        ],
      },
      {
        id: 3,
        name: "أسماك المحيطات",
        description: "أسماك من المحيطات العميقة",
        productCount: 8,
        subcategories: [
          {
            id: 6,
            name: "سردين",
            character: "س",
            color: "#F7DC6F",
            productCount: 3,
          },
          {
            id: 7,
            name: "تونة",
            character: "ت",
            color: "#BB8FCE",
            productCount: 5,
          },
        ],
      },
    ],
    []
  );

  // Initialize with demo data immediately so the page shows categories on first render
  const [categories, setCategories] = useState<Category[]>(() => {
    console.log("Initializing categories with demo data:", demoCategories);
    return demoCategories;
  });

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
    let mounted = true;
    // @ts-expect-error - API module import
    import("../../utils/api").then(({ getCategories }) => {
      getCategories()
        .then((res: ApiResponse) => {
          if (mounted) {
            // API returns DTO-shaped array
            setCategories(res.data || []);
          }
        })
        .catch(() => {
          // keep empty or fallback to local sample if desired
        })
        .finally(() => {
          // API call completed
        });
    });
    return () => {
      mounted = false;
    };
  }, []);

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
    setEditingItem({ ...subcategory, type: "sub", mainCategoryId });
    setShowEditModal(true);
  };

  const handleDeleteMainCategory = (categoryId: number) => {
    if (
      confirm("هل أنت متأكد من حذف هذه الفئة الرئيسية وجميع الفئات الفرعية؟")
    ) {
      // @ts-expect-error - JS module
      import("../../utils/api").then(({ deleteCategory }) => {
        deleteCategory(categoryId)
          .then(() =>
            setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
          )
          .catch(() => alert("خطأ أثناء حذف الفئة"));
      });
    }
  };

  const handleDeleteSubCategory = (
    mainCategoryId: number,
    subCategoryId: number
  ) => {
    if (confirm("هل أنت متأكد من حذف هذه الفئة الفرعية؟")) {
      // @ts-expect-error - JS module
      import("../../utils/api").then(({ deleteSubCategory }) => {
        deleteSubCategory(mainCategoryId, subCategoryId)
          .then(() =>
            setCategories((prev) =>
              prev.map((cat) =>
                cat.id === mainCategoryId
                  ? {
                      ...cat,
                      subcategories: cat.subcategories.filter(
                        (sub) => sub.id !== subCategoryId
                      ),
                      productCount: (cat.subcategories || []).length - 1,
                    }
                  : cat
              )
            )
          )
          .catch(() => alert("خطأ أثناء حذف الفئة الفرعية"));
      });
    }
  };

  const handleSaveCategory = (categoryData: unknown) => {
    if (modalType === "main" && isNewMainCategory(categoryData)) {
      // @ts-expect-error - JS module
      import("../../utils/api").then(({ upsertCategory }) => {
        upsertCategory({
          name: categoryData.name,
          description: categoryData.description,
        })
          .then((res: unknown) => {
            if (isApiResponse(res)) {
              setCategories((prev) => [...prev, res.data as Category]);
            }
          })
          .catch(() => alert("خطأ أثناء إضافة الفئة"));
      });
    } else if (modalType === "sub" && isNewSubCategory(categoryData)) {
      // @ts-expect-error - JS module
      import("../../utils/api").then(({ upsertCategory }) => {
        upsertCategory({
          name: categoryData.name,
          type: "sub",
          mainCategoryId: selectedMainCategory,
          character: categoryData.character,
          color: categoryData.color,
        })
          .then((res: unknown) => {
            if (isApiResponse(res)) {
              // append returned subcategory (or reload)
              setCategories((prev) =>
                prev.map((cat) =>
                  cat.id === selectedMainCategory
                    ? {
                        ...cat,
                        subcategories: [
                          ...(cat.subcategories || []),
                          res.data as SubCategory,
                        ],
                      }
                    : cat
                )
              );
            }
          })
          .catch(() => alert("خطأ أثناء إضافة الفئة الفرعية"));
      });
    }
    setShowAddModal(false);
  };

  const handleUpdateCategory = (updatedData: unknown) => {
    if (!editingItem) return;

    // @ts-expect-error - JS module
    import("../../utils/api").then(({ upsertCategory }) => {
      let payload: Record<string, unknown> = {
        id: editingItem.id,
      };

      if (editingItem.type === "main" && isUpdateMainCategory(updatedData)) {
        payload = {
          ...payload,
          name: updatedData.name,
          description: updatedData.description,
        };
      } else if (
        editingItem.type === "sub" &&
        isUpdateSubCategory(updatedData)
      ) {
        payload = {
          ...payload,
          name: updatedData.name,
          type: "sub",
          mainCategoryId: editingItem.mainCategoryId,
          character: updatedData.character,
          color: updatedData.color,
        };
      }

      upsertCategory(payload)
        .then(() => {
          // naive local update: ideally reload categories
          setCategories((prev) =>
            prev.map((cat) => {
              if (
                editingItem.type === "main" &&
                isUpdateMainCategory(updatedData)
              ) {
                return cat.id === editingItem.id
                  ? {
                      ...cat,
                      name: updatedData.name,
                      description: updatedData.description || "",
                    }
                  : cat;
              }
              if (
                cat.id === editingItem.mainCategoryId &&
                isUpdateSubCategory(updatedData)
              ) {
                return {
                  ...cat,
                  subcategories: (cat.subcategories || []).map((sub) =>
                    sub.id === editingItem.id
                      ? {
                          ...sub,
                          name: updatedData.name,
                          character: updatedData.character,
                          color: updatedData.color,
                        }
                      : sub
                  ),
                };
              }
              return cat;
            })
          );
        })
        .catch(() => alert("خطأ أثناء تحديث الفئة"))
        .finally(() => {
          setShowEditModal(false);
          setEditingItem(null);
        });
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-end mb-8">
          <TopNavigation currentPage="categories" />
        </div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة الفئات</h1>
            <p className="text-gray-600 mt-2">
              إضافة وتعديل فئات المنتجات والفئات الفرعية
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleAddMainCategory}
              className="inline-flex items-center"
            >
              <Plus size={20} className="ml-2" />
              إضافة فئة رئيسية
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {(() => {
            console.log("Categories to render:", categories);
            return null;
          })()}
          {categories.length === 0 ? (
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
                        <p className="text-gray-600">{category.description}</p>
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
                                style={{ backgroundColor: subcategory.color }}
                              >
                                {subcategory.character}
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
