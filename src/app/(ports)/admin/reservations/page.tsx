"use client";

import AddTable from "@/app/components/adminComponents/reservations/AddTable";
import TableList from "@/app/components/adminComponents/reservations/TableList";
import summaryAPI from "@/lib/summaryAPI";
import axios from "axios";
import { List, Menu, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

type SidebarOption = "table-list" | "add-table";

const links = [
  { label: "Table List", id: "table-list", icon: List },
  { label: "Add Table", id: "add-table", icon: PlusCircle },
];

export default function Reservations() {
  const [selectedOption, setSelectedOption] =
    useState<SidebarOption>("table-list");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLinkClick = (id: SidebarOption) => {
    setSelectedOption(id);
    setSidebarOpen(false);
  };

  const [tables, setTables] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(summaryAPI.admin.table.getallTable.url);
      setTables(response.data.result);
      setIsLoading(false);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  useEffect(() => {
    if (selectedOption === "table-list") {
      fetchData();
    }
  }, [selectedOption]);

  const renderComponent = () => {
    switch (selectedOption) {
      case "table-list":
        return (
          <div className="">
            <TableList
              tables={tables}
              isLoading={isLoading}
              fetchData={fetchData}
            />
          </div>
        );
      case "add-table":
        return (
          <div className="">
            <AddTable />
          </div>
        );
      default:
        return <div className="text-lavender-700">Please select an option</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-lavender-50">
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

          <h1 className="text-2xl sm:text-3xl font-bold text-lavender-900 ">
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
