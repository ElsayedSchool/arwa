import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Grid3X3,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Modal } from "../common/Modal";
import { AddCategoryModal } from "./AddCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";

export const CategoriesPage = ({ onBack }) => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "أسماك المياه العذبة",
      description: "أسماك تعيش في المياه العذبة",
      productCount: 15,
      subcategories: [
        {
          id: 11,
          name: "بلطي",
          character: "ب",
          color: "#3B82F6",
          productCount: 8,
        },
        {
          id: 12,
          name: "مبروك",
          character: "م",
          color: "#10B981",
          productCount: 4,
        },
        {
          id: 13,
          name: "قراميط",
          character: "ق",
          color: "#F59E0B",
          productCount: 3,
        },
      ],
    },
    {
      id: 2,
      name: "أسماك البحر",
      description: "أسماك تعيش في المياه المالحة",
      productCount: 12,
      subcategories: [
        {
          id: 21,
          name: "دنيس",
          character: "د",
          color: "#EF4444",
          productCount: 5,
        },
        {
          id: 22,
          name: "لوت",
          character: "ل",
          color: "#8B5CF6",
          productCount: 4,
        },
        {
          id: 23,
          name: "مكرونة",
          character: "ك",
          color: "#06B6D4",
          productCount: 3,
        },
      ],
    },
    {
      id: 3,
      name: "أسماك مجمدة",
      description: "أسماك محفوظة بالتجميد",
      productCount: 8,
      subcategories: [
        {
          id: 31,
          name: "سالمون مجمد",
          character: "س",
          color: "#EC4899",
          productCount: 5,
        },
        {
          id: 32,
          name: "تونة مجمدة",
          character: "ت",
          color: "#84CC16",
          productCount: 3,
        },
      ],
    },
  ]);

  const [expandedCategories, setExpandedCategories] = useState(
    new Set([1, 2, 3])
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState("main"); // 'main' or 'sub'
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);

  const toggleCategory = (categoryId) => {
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

  const handleAddSubCategory = (mainCategoryId) => {
    setModalType("sub");
    setSelectedMainCategory(mainCategoryId);
    setShowAddModal(true);
  };

  const handleEditMainCategory = (category) => {
    setEditingItem({ ...category, type: "main" });
    setShowEditModal(true);
  };

  const handleEditSubCategory = (subcategory, mainCategoryId) => {
    setEditingItem({ ...subcategory, type: "sub", mainCategoryId });
    setShowEditModal(true);
  };

  const handleDeleteMainCategory = (categoryId) => {
    if (
      confirm("هل أنت متأكد من حذف هذه الفئة الرئيسية وجميع الفئات الفرعية؟")
    ) {
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    }
  };

  const handleDeleteSubCategory = (mainCategoryId, subCategoryId) => {
    if (confirm("هل أنت متأكد من حذف هذه الفئة الفرعية؟")) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === mainCategoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.filter(
                  (sub) => sub.id !== subCategoryId
                ),
                productCount:
                  cat.productCount -
                  (cat.subcategories.find((sub) => sub.id === subCategoryId)
                    ?.productCount || 0),
              }
            : cat
        )
      );
    }
  };

  const handleSaveCategory = (categoryData) => {
    if (modalType === "main") {
      const newCategory = {
        id: Date.now(),
        name: categoryData.name,
        description: categoryData.description,
        productCount: 0,
        subcategories: [],
      };
      setCategories((prev) => [...prev, newCategory]);
    } else {
      const newSubCategory = {
        id: Date.now(),
        name: categoryData.name,
        character: categoryData.character,
        color: categoryData.color,
        productCount: 0,
      };
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedMainCategory
            ? {
                ...cat,
                subcategories: [...cat.subcategories, newSubCategory],
              }
            : cat
        )
      );
    }
    setShowAddModal(false);
  };

  const handleUpdateCategory = (updatedData) => {
    if (editingItem.type === "main") {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingItem.id
            ? {
                ...cat,
                name: updatedData.name,
                description: updatedData.description,
              }
            : cat
        )
      );
    } else {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingItem.mainCategoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.map((sub) =>
                  sub.id === editingItem.id
                    ? {
                        ...sub,
                        name: updatedData.name,
                        character: updatedData.character,
                        color: updatedData.color,
                      }
                    : sub
                ),
              }
            : cat
        )
      );
    }
    setShowEditModal(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeft size={20} className="ml-2" />
            العودة إلى الصفحة الرئيسية
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الفئات</h1>
              <p className="text-gray-600 mt-2">
                إضافة وتعديل فئات المنتجات والفئات الفرعية
              </p>
            </div>
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
          {categories.map((category) => (
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
                                handleEditSubCategory(subcategory, category.id)
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
          ))}
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
