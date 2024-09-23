"use client";
import React, { useState, useEffect } from "react";
import { Card, Skeleton, Tooltip } from "antd";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  ClockCircleOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { cn } from "@/lib/utils";

interface TableNumber {
  tableid: number;
  noOfSeats: number;
  tableNumber: number;
  isReserved: boolean;
  isActive: boolean;
  time_to: string | null;
  time_end: string | null;
  note: string | null;
  status?: string;
}

interface TableListProps {
  tables: TableNumber[];
  loading: boolean;
  onTableClick: (table: TableNumber) => void;
}

interface TableCardProps {
  table: TableNumber;
  onClick: (table: TableNumber) => void;
}

const TableCard: React.FC<TableCardProps> = ({ table, onClick }) => {
  // const getStatusColor = (status?: string) => {
  //   switch (status) {
  //     case "Running":
  //       return "orange";
  //     case "Reserved":
  //       return "red";
  //     case "Available":
  //       return "green";
  //     default:
  //       return "default";
  //   }
  // };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card
        hoverable
        className={cn(
          "transform transition-all duration-300 shadow-lg",
          clsx({
            "hover:scale-105": table.isActive,
            "opacity-50": !table.isActive,
          })
        )}
        onClick={() => table.isActive && onClick(table)}
      >
        <div className="relative h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-4xl font-bold text-gray-700">
              Table {table.tableNumber}
            </span>
          </motion.div>
          {/* <Badge.Ribbon
            text={table.status}
            color={getStatusColor(table.status)}
            className="z-10"
          /> */}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-gray-600">
            <UserOutlined className="mr-2" />
            <span>{table.noOfSeats} seats</span>
          </div>
          {table.time_to && table.time_end && (
            <Tooltip
              title={`${new Date(
                table.time_to
              ).toLocaleTimeString()} - ${new Date(
                table.time_end
              ).toLocaleTimeString()}`}
            >
              <div className="flex items-center text-gray-600">
                <ClockCircleOutlined className="mr-2" />
                <span>Reserved time</span>
              </div>
            </Tooltip>
          )}
          {table.note && (
            <Tooltip title={table.note}>
              <div className="flex items-center text-gray-600">
                <FileTextOutlined className="mr-2" />
                <span>Has notes</span>
              </div>
            </Tooltip>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const SkeletonCard: React.FC = () => (
  <Card className="h-64">
    <Skeleton active paragraph={{ rows: 3 }} />
  </Card>
);

const WaiterTableList: React.FC<TableListProps> = ({
  tables,
  onTableClick,
  loading,
}) => {
  const [tableData, setTableData] = useState<TableNumber[]>([]);

  useEffect(() => {
    if (tables.length > 0) {
      setTableData(tables);
    }
  }, [tables]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold mb-8 text-center text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Restaurant Tables
      </motion.h1>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        ) : tableData.length === 0 ? (
          <h1>No Data Running</h1>
        ) : (
          tableData.map((table) => (
            <TableCard
              key={table.tableid}
              table={table}
              onClick={onTableClick}
            />
          ))
        )}
      </motion.div>
    </div>
  );
};

export default WaiterTableList;
