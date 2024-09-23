"use client";

import summaryAPI from "@/lib/summaryAPI";
import { message } from "antd";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useState } from "react";

const AddCategory = () => {
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.post(
      summaryAPI.admin.category.createCategory.url,
      {
        categoryName: category,
      }
    );
    if (response.data.success) {
      message.success(response.data.messages);
    }
  };

  return (
    <div className="min-h-[70vh] w-full bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="stars-container fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 5 + 3}s`,
            }}
          />
        ))}
      </div>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Launch Your Category!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="Category"
              className="block text-sm font-medium text-white"
            >
              Category Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.05 }}
              type="text"
              id="Category"
              name="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-white bg-opacity-20 border-2 border-transparent focus:border-yellow-300 focus:outline-none transition-all duration-300 text-white placeholder-gray-300"
              placeholder="Enter item Category"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95, rotate: -5 }}
            type="submit"
            className="w-full py-3 px-4 rounded-full shadow-lg text-lg font-bold text-purple-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-300"
          >
            Launch This Category! 🌠
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddCategory;
