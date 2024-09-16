import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Users,
  Coffee,
  Lock,
  Unlock,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Clock,
  FileText,
} from "lucide-react";
import moment from "moment";

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

interface TableCardProps {
  item: TableItem;
  index: number;
  onUpdate: (tableid: string, isActive: boolean, isReserved: boolean) => void;
}

const TableCard: React.FC<TableCardProps> = ({ item, index, onUpdate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const springConfig = { stiffness: 300, damping: 30 };
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(y, [-100, 100], [5, -5]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(x, [-100, 100], [-5, 5]),
    springConfig
  );

  const scale = useSpring(1, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const getStatusColor = () => {
    if (!item.isActive) return "from-gray-300 to-gray-400";
    if (item.isReserved) return "from-red-300 to-red-400";
    return "from-green-300 to-green-400";
  };

  return (
    <motion.div
      className={`relative p-6 rounded-xl shadow-lg transition-all duration-300
        ${!item.isActive ? "opacity-75" : ""}
        hover:shadow-xl`}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        scale: scale,
        perspective: 1000,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <motion.div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${getStatusColor()} opacity-50`}
        initial={{ opacity: 0.5 }}
        whileHover={{ opacity: 0.7 }}
      />
      <div className="relative z-10">
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
          className="w-full h-32 bg-white rounded-lg flex items-center justify-center shadow-inner cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Coffee
            size={64}
            className={`${
              item.isReserved ? "text-red-500" : "text-green-500"
            } transition-colors duration-300`}
          />
        </motion.div>
        <div className="mt-4 flex gap-4 flex-col justify-between items-center">
          <span
            className={`font-semibold ${
              item.isActive ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.isActive ? "Active" : "Inactive"}
          </span>
          <motion.button
            onClick={() =>
              onUpdate(item.tableid, !item.isActive, item.isReserved)
            }
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.isActive ? (
              <ToggleRight className="mr-2" />
            ) : (
              <ToggleLeft className="mr-2" />
            )}
            {item.isActive ? "Deactivate" : "Activate"}
          </motion.button>
          <motion.button
            onClick={() =>
              onUpdate(item.tableid, item.isActive, !item.isReserved)
            }
            className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.isReserved ? (
              <Unlock className="mr-2" />
            ) : (
              <Lock className="mr-2" />
            )}
            {item.isReserved ? "Unreserve" : "Reserve"}
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute -top-32  left-3 -translate-x-1/2 flex flex-col items-start justify-center rounded-lg bg-gray-800 text-white shadow-lg p-4 z-50 w-72 lg:left-1/3"
          >
            <div className="font-bold text-sm mb-2 flex items-center justify-between w-full">
              <span>{item.isReserved ? "Reserved" : "Available"}</span>
              {item.isReserved ? <Lock size={16} /> : <Unlock size={16} />}
            </div>
            <div className="text-xs mb-1">Table ID: {item.tableid}</div>
            {item.time_to && (
              <div className="text-xs mb-1 flex items-center">
                <Clock size={12} className="mr-1" />
                Start: {moment(item.time_to).format("MMMM D, YYYY h:mm A")}
              </div>
            )}
            {item.time_end && (
              <div className="text-xs mb-1 flex items-center">
                <Clock size={12} className="mr-1" />
                End:{moment(item.time_end).format("MMMM D, YYYY h:mm A")}
              </div>
            )}
            {item.note && (
              <div className="text-xs flex items-start">
                <FileText size={12} className="mr-1 mt-1" />
                Note: {item.note}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {!item.isActive && (
        <motion.div
          className="absolute top-2 right-2 text-yellow-500"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <AlertTriangle size={24} />
        </motion.div>
      )}
    </motion.div>
  );
};

interface AnimatedTableGridProps {
  items: TableItem[];
  onTableUpdate: (
    tableid: string,
    isActive: boolean,
    isReserved: boolean
  ) => void;
}

export const AnimatedTableGrid: React.FC<AnimatedTableGridProps> = ({
  items,
  onTableUpdate,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8 bg-gray-100 rounded-2xl shadow-inner">
      {items.map((item, index) => (
        <TableCard
          key={item.tableid}
          item={item}
          index={index}
          onUpdate={onTableUpdate}
        />
      ))}
    </div>
  );
};
