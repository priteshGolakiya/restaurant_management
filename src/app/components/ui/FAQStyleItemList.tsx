// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown } from "lucide-react";
// import Image from "next/image";
// import axios from "axios";

// type Item = {
//   itemid: string;
//   itemname: string;
//   description: string;
//   price: number;
//   categoryid: string;
//   isactive: boolean;
//   itemimage: {
//     img1: string;
//   };
// };

// type Category = {
//   categoryid: string;
//   categoryname: string;
// };

// type FAQStyleItemListProps = {
//   categories: Category[];
//   items: Item[];
// };

// const FAQStyleItemList: React.FC<FAQStyleItemListProps> = ({
//   categories,
//   items,
// }) => {
//   const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

//   const toggleCategory = (categoryId: string) => {
//     setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
//   };

//   const updateStatusOption = async ({
//     itemid,
//     isactive,
//   }: {
//     itemid: string;
//     isactive: boolean;
//   }) => {
//     const newstatus = !isactive;
//     const response = await axios.put(`/api/items/${itemid}`, {
//       isactive: newstatus,
//     });
//     if (!response.data.success) {
//       console.error(response.data);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-12 bg-gradient-to-br from-lavender-100 to-purple-200">
//       <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">
//         Our Vibrant Collection
//       </h1>
//       {categories.map((category) => (
//         <motion.div
//           key={category.categoryid}
//           className="mb-6"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <motion.button
//             className="w-full p-6 flex justify-between items-center bg-white rounded-xl shadow-lg hover:bg-lavender-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
//             onClick={() => toggleCategory(category.categoryid)}
//           >
//             <span className="text-2xl font-bold text-purple-700">
//               {category.categoryname}
//             </span>
//             <motion.div
//               animate={{
//                 rotate: expandedCategory === category.categoryid ? 180 : 0,
//               }}
//               transition={{ duration: 0.3 }}
//             >
//               <ChevronDown className="w-8 h-8 text-purple-500" />
//             </motion.div>
//           </motion.button>
//           <AnimatePresence>
//             {expandedCategory === category.categoryid && (
//               <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: "auto" }}
//                 exit={{ opacity: 0, height: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="overflow-hidden"
//               >
//                 <div className="grid gap-6 p-6 mt-2 bg-indigo-100 rounded-b-xl shadow-inner">
//                   {items
//                     .filter((item) => item.categoryid === category.categoryid)
//                     .map((item) => (
//                       <motion.div
//                         key={item.itemid}
//                         className="bg-gradient-to-r from-purple-50 to-lavender-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
//                         layout
//                         whileHover={{ scale: 1.02 }}
//                       >
//                         <div className="flex flex-col md:flex-row items-center">
//                           <div className="relative w-full h-64  md:w-2/3 lg:w-2/3mb-4 md:mb-0 md:mr-6">
//                             <Image
//                               src={item.itemimage.img1}
//                               alt={item.itemname}
//                               width={100}
//                               height={100}
//                               className="rounded-lg object-contain h-full w-full"
//                             />
//                             <div
//                               className=""
//                               onClick={updateStatusOption(
//                                 item.itemid.item.isactive
//                               )}
//                             >
//                               {item.isactive ? (
//                                 <button className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs font-semibold rounded">
//                                   Active
//                                 </button>
//                               ) : (
//                                 <button className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
//                                   Disable
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                           <div className="flex-grow">
//                             <h3 className="text-2xl font-bold text-purple-800 mb-2">
//                               {item.itemname}
//                             </h3>
//                             <p className="text-gray-600 mb-4">
//                               {item.description}
//                             </p>
//                             <div className="flex justify-between items-center">
//                               <span className="text-3xl font-bold text-purple-700">
//                                 ₹{Number(item.price).toFixed(2)}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default FAQStyleItemList;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import axios from "axios";

type Item = {
  itemid: string;
  itemname: string;
  description: string;
  price: number;
  categoryid: string;
  isactive: boolean;
  itemimage: {
    img1: string;
  };
};

type Category = {
  categoryid: string;
  categoryname: string;
};

type FAQStyleItemListProps = {
  categories: Category[];
  items: Item[];
  fetchData: () => Promise<void>;
};

const FAQStyleItemList: React.FC<FAQStyleItemListProps> = ({
  categories,
  items,
  fetchData,
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const updateStatusOption = async ({
    itemid,
    isactive,
  }: {
    itemid: string;
    isactive: boolean;
  }) => {
    const newStatus = !isactive;
    try {
      const response = await axios.put(`/api/items/${itemid}`, {
        isactive: newStatus,
      });
      if (!response.data.success) {
        console.error(response.data);
      }
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 bg-gradient-to-br from-lavender-100 to-purple-200">
      <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">
        Our Vibrant Collection
      </h1>
      {categories.map((category) => (
        <motion.div
          key={category.categoryid}
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            className="w-full p-6 flex justify-between items-center bg-white rounded-xl shadow-lg hover:bg-lavender-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            onClick={() => toggleCategory(category.categoryid)}
          >
            <span className="text-2xl font-bold text-purple-700">
              {category.categoryname}
            </span>
            <motion.div
              animate={{
                rotate: expandedCategory === category.categoryid ? 180 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-8 h-8 text-purple-500" />
            </motion.div>
          </motion.button>
          <AnimatePresence>
            {expandedCategory === category.categoryid && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <div className="grid gap-6 p-6 mt-2 bg-indigo-100 rounded-b-xl shadow-inner">
                  {items
                    .filter((item) => item.categoryid === category.categoryid)
                    .map((item) => (
                      <motion.div
                        key={item.itemid}
                        className="bg-gradient-to-r from-purple-50 to-lavender-100 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                        layout
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex flex-col md:flex-row items-center">
                          <div className="relative w-full h-64 md:w-2/3 lg:w-2/3 mb-4 md:mb-0 md:mr-6">
                            <Image
                              src={item.itemimage.img1}
                              alt={item.itemname}
                              width={100}
                              height={100}
                              className="rounded-lg object-contain h-full w-full"
                            />
                            <div>
                              <button
                                className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded ${
                                  item.isactive
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                                onClick={() =>
                                  updateStatusOption({
                                    itemid: item.itemid,
                                    isactive: item.isactive,
                                  })
                                }
                              >
                                {item.isactive ? "Active" : "Disable"}
                              </button>
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-2xl font-bold text-purple-800 mb-2">
                              {item.itemname}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {item.description}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-3xl font-bold text-purple-700">
                                ₹{Number(item.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default FAQStyleItemList;
