import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

type Item = {
  itemId: number;
  itemName: string;
  description: string;
  price: number;
  categoryId: number;
  isActive: boolean;
  itemImage: string;
};

type Category = {
  categoryid: number;
  categoryname: string;
  isactive: boolean;
  items: Item[];
};

type DisplayItemsProps = {
  categories: Category[];
  toggleCategory: (categoryId: number) => void;
  expandedCategory: number | null;
};

const DisplayItems = ({
  categories,
  toggleCategory,
  expandedCategory,
}: DisplayItemsProps) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {categories.map((category) => (
        <motion.div
          key={category.categoryid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <motion.button
            onClick={() => toggleCategory(category.categoryid)}
            className="w-full flex justify-between items-center p-4 bg-indigo-600 text-white"
            whileHover={{ backgroundColor: "#4338ca" }}
          >
            <span className="text-xl font-semibold">
              {category.categoryname}
            </span>
            {expandedCategory === category.categoryid ? (
              <ChevronUp />
            ) : (
              <ChevronDown />
            )}
          </motion.button>
          {/* <AnimatePresence>
            {expandedCategory === category.categoryid && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.items.map((item) => (
                    <motion.div
                      key={item.itemId}
                      className="bg-indigo-50 rounded-lg p-4 shadow"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="relative h-48 mb-4 rounded-md overflow-hidden"></div>
                      <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                        {item.itemName}
                      </h3>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center text-green-600 font-semibold">
                          <DollarSign size={18} className="mr-1" />
                          {item.price.toFixed(2)}
                        </span>
                        <span
                          className={`flex items-center ${
                            item.isActive ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          <Tag size={18} className="mr-1" />
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence> */}
        </motion.div>
      ))}
    </div>
  );
};

export default DisplayItems;
