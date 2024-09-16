import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SkeletonLoader = () => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
      {[...Array(9)].map((_, index) => (
        <motion.div
          key={index}
          className={cn("bg-gray-300 rounded-lg h-32", "animate-pulse")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
