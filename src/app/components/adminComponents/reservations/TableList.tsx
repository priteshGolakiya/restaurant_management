import React, { useState, useEffect } from "react";
import { AnimatedTableGrid } from "@/app/ui/animated-tooltip";
import { motion } from "framer-motion";
import axios from "axios";
import { cn } from "@/lib/utils";
import SkeletonLoader from "@/app/ui/SkeletonLoader";
import { toast } from "react-toastify";
import summaryAPI from "@/lib/summaryAPI";

interface TableItem {
  tableid: string;
  noOfSeats: number;
  tableNumber: number;
  isReserved: boolean;
  isActive: boolean;
  time_to: string | null;
  time_end: string | null;
  note: string | null;
}

interface TableListProps {
  tables: TableItem[];
  isLoading: boolean;
  fetchData: () => Promise<void>;
}

const TableList: React.FC<TableListProps> = ({
  tables: initialTables,
  isLoading,
  fetchData,
}) => {
  const [tables, setTables] = useState<TableItem[]>([]);

  useEffect(() => {
    setTables(initialTables);
  }, [initialTables]);

  const updateTableStatus = async (
    tableid: string,
    isActive: boolean,
    isReserved: boolean
  ) => {
    try {
      const response = await axios.put(
        `${summaryAPI.admin.table.commonUlr}/${tableid}`,
        {
          isActive,
          isReserved,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchData();
      } else {
        console.error("Failed to update table status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating table status:", error);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center min-h-screen",
        "bg-gradient-to-br from-blue-50 to-purple-100 p-4 "
      )}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "text-5xl font-extrabold mb-12 text-gray-800",
          "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        )}
      >
        Restaurant Tables
      </motion.h1>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <AnimatedTableGrid items={tables} onTableUpdate={updateTableStatus} />
      )}
    </div>
  );
};

export default TableList;
