// import { AnimatedTableGrid } from "@/app/ui/animated-tooltip";

// export default function TableList({
//   tables,
// }: {
//   tables: {
//     tableid: number;
//     noOfSeats: number;
//     tableNumber: number;
//     isReserved: boolean;
//     isActive: boolean;
//   }[];
// }) {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-300 p-8">
//       <h1 className="text-4xl font-bold mb-8 text-gray-800">
//         Restaurant Tables
//       </h1>
//       <AnimatedTableGrid items={tables} />
//     </div>
//   );
// }

import { AnimatedTableGrid } from "@/app/ui/animated-tooltip";
import {
  motion
} from "framer-motion";
import React from "react";

interface TableItem {
  tableId: number;
  noOfSeats: number;
  tableNumber: number;
  isReserved: boolean;
  isActive: boolean;
}

interface TableListProps {
  tables: TableItem[];
}

const TableList: React.FC<TableListProps> = ({ tables }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-extrabold mb-12 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
      >
        Restaurant Tables
      </motion.h1>
      <AnimatedTableGrid items={tables} />
    </div>
  );
};

export default TableList;
