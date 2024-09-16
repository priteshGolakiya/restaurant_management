// import React, { useState } from "react";
// import {
//   motion,
//   useTransform,
//   AnimatePresence,
//   useMotionValue,
//   useSpring,
// } from "framer-motion";
// import { Users, Coffee } from "lucide-react";

// export const AnimatedTableGrid = ({
//   items,
// }: {
//   items: {
//     tableid: number;
//     noOfSeats: number;
//     tableNumber: number;
//     isReserved: boolean;
//     isActive: boolean;
//   }[];
// }) => {
//   const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
//   const springConfig = { stiffness: 150, damping: 15 };
//   const x = useMotionValue(0);

//   const rotate = useSpring(useTransform(x, [-100, 100], [-5, 5]), springConfig);

//   const translateX = useSpring(
//     useTransform(x, [-100, 100], [-5, 5]),
//     springConfig
//   );

//   const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
//     const halfWidth = event.currentTarget.offsetWidth / 2;
//     x.set(event.nativeEvent.offsetX - halfWidth);
//   };

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 p-4 md:p-6 bg-gray-100 rounded-xl">
//       {items.map((item) => (
//         <motion.div
//           className={`relative group p-4 rounded-lg border border-gray-200 shadow-md transition-transform duration-300 cursor-pointer ${
//             item.isReserved ? "bg-red-50" : "bg-green-50"
//           } ${
//             !item.isActive ? "opacity-50 pointer-events-none" : ""
//           } hover:bg-opacity-80 hover:shadow-lg hover:scale-105`}
//           key={item.tableid}
//           onMouseEnter={() => setHoveredIndex(item.tableid)}
//           onMouseLeave={() => setHoveredIndex(null)}
//           onMouseMove={handleMouseMove}
//         >
//           {!item.isActive && (
//             <div className="absolute inset-0 bg-red-700 bg-opacity-60 flex items-center justify-center rounded-lg text-black text-xl font-bold z-10">
//               Inactive
//             </div>
//           )}
//           <div className="flex items-center justify-between mb-2">
//             <h3 className="text-lg font-semibold text-gray-800">
//               Table No: {item.tableNumber}
//             </h3>
//             <div className="flex items-center text-gray-600">
//               <Users size={18} className="mr-1" />
//               <span>No. Of Seats: {item.noOfSeats}</span>
//             </div>
//           </div>
//           <div className="w-full h-24 bg-white rounded-md flex items-center justify-center shadow-inner">
//             <Coffee
//               size={48}
//               className={`text-${item.isReserved ? "red-600" : "green-600"}`}
//             />
//           </div>
//           <AnimatePresence>
//             {hoveredIndex === item.tableid && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20, scale: 0.7 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                   scale: 1,
//                   transition: {
//                     type: "spring",
//                     stiffness: 200,
//                     damping: 20,
//                   },
//                 }}
//                 exit={{ opacity: 0, y: 20, scale: 0.7 }}
//                 style={{
//                   translateX: translateX,
//                   rotate: rotate,
//                   whiteSpace: "nowrap",
//                 }}
//                 className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center rounded-md bg-black text-white shadow-lg px-4 py-2 z-20"
//               >
//                 <div className="font-bold text-sm">
//                   {item.isReserved ? "Reserved" : "Available"}
//                 </div>
//                 <div className="text-xs">
//                   {item.isActive ? "Active" : "Inactive"}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Users, Coffee, Lock, Unlock } from "lucide-react";

interface TableItem {
  tableId: number;
  noOfSeats: number;
  tableNumber: number;
  isReserved: boolean;
  isActive: boolean;
}

interface TableCardProps {
  item: TableItem;
  index: number;
}

const TableCard: React.FC<TableCardProps> = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const springConfig = { stiffness: 150, damping: 15 };
  const x = useMotionValue(0);

  const rotate = useSpring(useTransform(x, [-100, 100], [-5, 5]), springConfig);
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-5, 5]),
    springConfig
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <motion.div
      className={`relative p-6 rounded-xl border-2 shadow-lg transition-all duration-300 cursor-pointer
        ${
          item.isReserved
            ? "border-red-300 bg-red-50"
            : "border-green-300 bg-green-50"
        }
        ${!item.isActive ? "opacity-60" : ""}
        hover:shadow-xl hover:scale-105`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {!item.isActive && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center rounded-xl text-white text-xl font-bold z-10">
          <Lock size={24} className="mr-2" />
          Inactive
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-800">
          Table {item.tableNumber}
        </h3>
        <div className="flex items-center text-gray-600 bg-white px-3 py-1 rounded-full shadow">
          <Users size={18} className="mr-2" />
          <span className="font-semibold">{item.noOfSeats}</span>
        </div>
      </div>
      <motion.div
        className="w-full h-32 bg-white rounded-lg flex items-center justify-center shadow-inner"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <Coffee
          size={64}
          className={`${
            item.isReserved ? "text-red-500" : "text-green-500"
          } transition-colors duration-300`}
        />
      </motion.div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.7 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
              },
            }}
            exit={{ opacity: 0, y: 20, scale: 0.7 }}
            style={{
              translateX: translateX,
              rotate: rotate,
              whiteSpace: "nowrap",
            }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-lg bg-gray-800 text-white shadow-lg px-4 py-2 z-20"
          >
            <div className="font-bold text-sm mr-2">
              {item.isReserved ? "Reserved" : "Available"}
            </div>
            {item.isReserved ? <Lock size={16} /> : <Unlock size={16} />}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface AnimatedTableGridProps {
  items: TableItem[];
}

export const AnimatedTableGrid: React.FC<AnimatedTableGridProps> = ({
  items,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 p-8 bg-gray-100 rounded-2xl shadow-inner">
      {items.map((item, index) => (
        <TableCard key={index} item={item} index={index} />
      ))}
    </div>
  );
};
