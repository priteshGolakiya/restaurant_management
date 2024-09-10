"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

type Category = {
  categoryid: string;
  categoryname: string;
  isactive: boolean;
};

interface CategoryHoverEffectProps {
  items: Category[];
}

export const CategoryHoverEffect = ({ items }: CategoryHoverEffectProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const renderContent = () => {
    return items.map((item, idx) => (
      <Link
        href="#"
        key={item.categoryid}
        className="relative group block p-2 h-full w-full"
        onMouseEnter={() => setHoveredIndex(idx)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <AnimatePresence>
          {hoveredIndex === idx && (
            <motion.span
              className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-[#003D35]/[0.8] block rounded-3xl"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.15 },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15, delay: 0.2 },
              }}
            />
          )}
        </AnimatePresence>
        <Card>
          <CardTitle>{item.categoryname}</CardTitle>{" "}
          <div className="text-white m-3">
            {item.isactive ? (
              <span className="bg-green-500 text-white font-semibold py-1 px-3 rounded-lg shadow-md">
                Active
              </span>
            ) : (
              <span className="bg-red-500 text-white font-semibold py-1 px-3 rounded-lg shadow-md">
                Disabled
              </span>
            )}
          </div>
        </Card>
      </Link>
    ));
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-10")}>
      {renderContent()}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-[#83a58c] border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
