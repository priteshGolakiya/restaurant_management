import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";

type Item = {
  itemName: string;
  description: string;
  price: number;
  itemImage: string;
  isActive: boolean;
};

type Category = {
  categoryid: number;
  categoryname: string;
  isactive: boolean;
  items: Item[];
};

type AddItemProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: () => void;
  newItem: Item;
  setNewItem: (item: Item) => void;
  setSelectedCategoryId: (id: number | null) => void;
  categories: Category[];
};

const AddItem: React.FC<AddItemProps> = ({
  isOpen,
  onClose,
  onAddItem,
  newItem,
  setNewItem,
  setSelectedCategoryId,
  categories,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as="div"
          className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
          open={isOpen}
          onClose={onClose}
        >
          <motion.div
            className="bg-white rounded-lg p-8 max-w-sm mx-auto"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Dialog.Title className="text-2xl font-bold mb-4">
              Add New Item
            </Dialog.Title>
            <input
              type="text"
              value={newItem.itemName}
              onChange={(e) =>
                setNewItem({ ...newItem, itemName: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Item Name"
            />
            <textarea
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Description"
            />
            <input
              type="number"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: parseFloat(e.target.value) })
              }
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Price"
              min="0"
            />
            <input
              type="text"
              value={newItem.itemImage}
              onChange={(e) =>
                setNewItem({ ...newItem, itemImage: e.target.value })
              }
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Image URL"
            />
            <select
              onChange={(e) => setSelectedCategoryId(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
            >
              {categories.map((category: Category) => {
                return (
                  <option key={category.categoryid} value={category.categoryid}>
                    {category.categoryname}
                  </option>
                );
              })}
            </select>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onAddItem}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AddItem;
