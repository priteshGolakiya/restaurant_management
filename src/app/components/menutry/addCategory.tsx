import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";

// Props type
type AddCategoryProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: () => void;
  newCategoryName: string;
  setNewCategoryName: (name: string) => void;
};

const AddCategory: React.FC<AddCategoryProps> = ({
  isOpen,
  onClose,
  onAddCategory,
  newCategoryName,
  setNewCategoryName,
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
              Add New Category
            </Dialog.Title>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
              placeholder="Category Name"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onAddCategory}
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

export default AddCategory;
