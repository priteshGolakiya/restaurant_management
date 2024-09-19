"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutList,
  FolderTree,
  PlusCircle,
  FileEdit,
  Menu,
  X,
} from "lucide-react";
import ItemList from "@/app/components/adminComponents/menu/ItemList";
import CategoryList from "@/app/components/adminComponents/menu/CategoryList";
import AddTable from "@/app/components/adminComponents/menu/AddCategory";
import AddItem from "@/app/components/adminComponents/menu/AddItem";
import axios from "axios";
import summaryAPI from "@/lib/summaryAPI";

type SidebarOption =
  | "category-list"
  | "item-list"
  | "add-category"
  | "add-item";

type Category = {
  categoryid: string;
  categoryname: string;
  isactive: boolean;
};

type Item = {
  itemid: string;
  itemname: string;
  description: string;
  price: number;
  categoryid: string;
  isactive: boolean;
  itemimage: {
    img1: string;
  };
};

const links = [
  { label: "Items", id: "item-list", icon: LayoutList },
  { label: "Categories", id: "category-list", icon: FolderTree },
  { label: "Add Category", id: "add-category", icon: PlusCircle },
  { label: "Add Item", id: "add-item", icon: FileEdit },
];

export default function SidebarDemo() {
  const [selectedOption, setSelectedOption] =
    useState<SidebarOption>("item-list");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLinkClick = (id: SidebarOption) => {
    setSelectedOption(id);
    setSidebarOpen(false);
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const fetchData = async () => {
    try {
      const categoriesResponse = await axios.get(
        summaryAPI.admin.category.getallCategory.url
      );
      const itemsResponse = await axios.get(
        summaryAPI.admin.items.getallItems.url
      );

      setItems(itemsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectedOption === "item-list" || "category-list" || "add-item") {
      fetchData();
    }
  }, [selectedOption]);

  const renderComponent = () => {
    switch (selectedOption) {
      case "item-list":
        return (
          <ItemList
            items={items}
            categories={categories}
            fetchData={fetchData}
          />
        );
      case "category-list":
        return <CategoryList categories={categories} />;
      case "add-category":
        return <AddTable />;
      case "add-item":
        return <AddItem categories={categories} />;
      default:
        return <div className="text-lavender-700">Please select an option</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-lavender-50">
      {/* Sidebar for larger screens */}
      <aside className="hidden lg:flex flex-col w-50 bg-white shadow-md">
        <nav className="flex-1 px-4 py-6">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id as SidebarOption)}
              className={`flex items-center w-full px-4 py-2 mt-2 text-lg font-medium text-left ${
                selectedOption === link.id
                  ? "bg-lavender-100 text-lavender-900 rounded-lg"
                  : "text-lavender-600 hover:bg-lavender-50 hover:text-lavender-900 rounded-lg"
              }`}
            >
              <link.icon className="w-5 h-5 mr-3" />
              {link.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={toggleSidebar}
        ></div>
        <nav
          className="fixed top-0 left-0 bottom-0 flex flex-col w-64 max-w-sm bg-white overflow-y-auto shadow-lg transform transition-transform duration-300 ease-in-out"
          style={{
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-lavender-200">
            <h2 className="text-xl font-semibold text-lavender-900">Menu</h2>
            <button
              onClick={toggleSidebar}
              className="text-lavender-500 hover:text-lavender-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 px-4 py-6">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id as SidebarOption)}
                className={`flex items-center w-full px-4 py-2 mt-2 text-lg font-medium text-left ${
                  selectedOption === link.id
                    ? "bg-lavender-100 text-lavender-900 rounded-lg"
                    : "text-lavender-600 hover:bg-lavender-50 hover:text-lavender-900 rounded-lg"
                }`}
              >
                <link.icon className="w-5 h-5 mr-3" />
                {link.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-lavender-50">
        <div className="p-4 lg:p-6">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden mb-4 p-2 rounded-md bg-white text-lavender-700 hover:bg-lavender-100 shadow-md"
          >
            <Menu className="w-6 h-6" />
          </button>

          <h1 className="text-2xl sm:text-3xl font-bold text-lavender-900 mb-6">
            {links.find((link) => link.id === selectedOption)?.label}
          </h1>
          <div className="bg-white rounded-lg shadow-md p-6">
            {renderComponent()}
          </div>
        </div>
      </main>
    </div>
  );
}
