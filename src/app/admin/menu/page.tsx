"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/app/components/ui/sidebar";
import { LayoutList, FolderTree, PlusCircle, FileEdit } from "lucide-react";
import ItemList from "@/app/components/menu/ItemList";
import CategoryList from "@/app/components/menu/CategoryList";
import AddCategory from "@/app/components/menu/AddCategory";
import AddItem from "@/app/components/menu/AddItem";

type SidebarOption =
  | "category-list"
  | "item-list"
  | "add-category"
  | "add-item";

export default function SidebarDemo() {
  const [selectedOption, setSelectedOption] =
    useState<SidebarOption>("item-list");
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const links = [
    {
      label: "Items",
      id: "item-list" as const,
      icon: <LayoutList className="text-lavender-600 text-2xl" />,
    },
    {
      label: "Categories",
      id: "category-list" as const,
      icon: <FolderTree className="text-lavender-700 text-2xl" />,
    },
    {
      label: "Add Category",
      id: "add-category" as const,
      icon: <PlusCircle className="text-lavender-800 text-2xl" />,
    },
    {
      label: "Add Item",
      id: "add-item" as const,
      icon: <FileEdit className="text-lavender-900 text-2xl" />,
    },
  ];

  const handleLinkClick = (id: SidebarOption) => {
    setSelectedOption(id);
    if (isMobile) {
      setOpen(false);
    }
  };

  const renderComponent = () => {
    switch (selectedOption) {
      case "item-list":
        return <ItemList />;
      case "category-list":
        return <CategoryList />;
      case "add-category":
        return <AddCategory />;
      case "add-item":
        return <AddItem />;
      default:
        return <div className="text-lavender-700">Please select an option</div>;
    }
  };

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-lavender-50 ">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="py-6 bg-lavender-100">
          <nav className="mt-6 flex flex-col gap-2">
            {links.map((link) => (
              <div key={link.id} onClick={() => handleLinkClick(link.id)}>
                <SidebarLink
                  href="#"
                  link={{
                    label: link.label,
                    href: "#",
                    icon: link.icon,
                  }}
                  className={
                    selectedOption === link.id
                      ? "bg-lavender-200 rounded-xl text-2xl p-1"
                      : ""
                  }
                />
              </div>
            ))}
          </nav>
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto w-full lg:w-3/4 xl:w-4/5 bg-lavender-50 bg-[#d4d9ff]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
