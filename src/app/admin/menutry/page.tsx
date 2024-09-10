"use client";
import AddCategory from "@/app/_components/menutry/addCategory";
import AddItem from "@/app/_components/menutry/addItem";
import DisplayItems from "@/app/_components/menutry/displayItems";
import axios from "axios";
import { useEffect, useState } from "react";

type Item = {
  itemId: number;
  itemName: string;
  description: string;
  price: number;
  categoryId: number;
  isActive: boolean;
  itemImage: string;
};

type Category = {
  categoryid: number;
  categoryname: string;
  isactive: boolean;
  items: Item[];
};

const CategoryItemDisplay = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [newItem, setNewItem] = useState({
    itemName: "",
    description: "",
    price: 0,
    itemImage: "",
    isActive: true,
  });

  const fetchData = async () => {
    try {
      const response = await axios.get<Category[]>("/api/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post<Category>("/api/category", {
        categoryName: newCategoryName,
        isactive: true,
      });
      setCategories([response.data]);
      setNewCategoryName("");
      setIsCategoryModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleAddItem = async () => {
    if (selectedCategoryId !== null) {
      try {
        const response = await axios.post<Item>("/api/items", {
          ...newItem,
          categoryId: selectedCategoryId,
        });
        setCategories(
          categories.map((category) =>
            category.categoryid === selectedCategoryId
              ? {
                  ...category,
                  items: [...category.items, response.data],
                }
              : category
          )
        );

        setNewItem({
          itemName: "",
          description: "",
          price: 0,
          itemImage: "",
          isActive: true,
        });
        setIsItemModalOpen(false);
      } catch (error) {
        console.error("Error adding item:", error);
      }
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8">
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-10">
        Product Catalog
      </h1>
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Add Category
        </button>
        <button
          onClick={() => setIsItemModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg ml-4"
        >
          Add Item
        </button>
      </div>

      <DisplayItems
        categories={categories}
        toggleCategory={toggleCategory}
        expandedCategory={expandedCategory}
      />

      <AddCategory
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
      />

      <AddItem
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onAddItem={handleAddItem}
        newItem={newItem}
        setNewItem={setNewItem}
        categories={categories}
        setSelectedCategoryId={setSelectedCategoryId}
      />
    </div>
  );
};

export default CategoryItemDisplay;
