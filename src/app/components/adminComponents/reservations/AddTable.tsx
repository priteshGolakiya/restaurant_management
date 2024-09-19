"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import summaryAPI from "@/lib/summaryAPI";

const AddTable = () => {
  const [noOfSeats, setNoOfSeats] = useState<number>(0);
  const [tableNumber, setTableNumber] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        summaryAPI.admin.table.createTable.url,
        {
          noOfSeats,
          tableNumber,
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setNoOfSeats(0);
        setTableNumber(0);
      } else {
        toast.error(response.data.message || "An error occurred");
      }
    } catch (error) {
      toast.error("An error occurred");
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
          Add Table
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="NoSets"
              className="block text-sm font-medium text-white"
            >
              No Sets
            </label>
            <motion.input
              type="number"
              id="NoSets"
              name="NoSets"
              value={noOfSeats}
              onChange={(e) => setNoOfSeats(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-full bg-white bg-opacity-20 border-2 border-transparent focus:border-yellow-300 focus:outline-none transition-all duration-300 text-white placeholder-gray-300"
              placeholder="Enter number of sets"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="TableNumber"
              className="block text-sm font-medium text-white"
            >
              Table Number
            </label>
            <motion.input
              type="number"
              id="TableNumber"
              name="TableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-full bg-white bg-opacity-20 border-2 border-transparent focus:border-yellow-300 focus:outline-none transition-all duration-300 text-white placeholder-gray-300"
              placeholder="Enter table number"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95, rotate: -5 }}
            type="submit"
            className="w-full py-3 px-4 rounded-full shadow-lg text-lg font-bold text-purple-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-300"
          >
            Submit Table Details 🌠
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddTable;
