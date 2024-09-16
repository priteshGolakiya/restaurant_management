"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Table {
  tableid: string;
  noOfSeats: number;
  tableNumber: number;
  isReserved: boolean;
  isActive: boolean;
}

interface FormData {
  customerName: string;
  customerNumber: string;
  time_to: Date | null;
  time_end: Date | null;
  note?: string;
  selectedTables: string[];
}

const ReservationForm: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerNumber: "",
    time_to: null,
    time_end: null,
    note: "",
    selectedTables: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get("/api/table/");
      setTables(response.data.result);
    } catch (error) {
      console.error("Error fetching tables:", error);
      setMessage({
        text: "Failed to load tables. Please try again.",
        isError: true,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleTableSelection = (tableid: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTables: prev.selectedTables.includes(tableid)
        ? prev.selectedTables.filter((id) => id !== tableid)
        : [...prev.selectedTables, tableid],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axios.post("/api/reserve", {
        ...formData,
        time_to: formData.time_to?.toISOString(),
        time_end: formData.time_end?.toISOString(),
      });
      if (response.data.success) {
        setMessage({ text: "Reservation successful!", isError: false });
        setFormData({
          customerName: "",
          customerNumber: "",
          time_to: null,
          time_end: null,
          note: "",
          selectedTables: [],
        });
        setStep(1);
      } else {
        setMessage({
          text: response.data.message || "Reservation failed.",
          isError: true,
        });
      }
    } catch (error) {
      console.log("error::: ", error);
      if (axios.isAxiosError(error) && error.response) {
        setMessage({
          text: error.response.data.message || "An unexpected error occurred",
          isError: true,
        });
      } else {
        setMessage({
          text: "An unknown error occurred",
          isError: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    if (step === 3) {
      const form = document.querySelector("form");
      if (form) {
        form.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true })
        );
      }
    } else {
      nextStep();
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Personal Details
            </h3>
            <div className="space-y-4">
              <Input
                label="Customer Name"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Customer Number"
                name="customerNumber"
                type="tel"
                value={formData.customerNumber}
                onChange={handleInputChange}
                required
                minLength={10}
              />
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Reservation Time
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-lg font-semibold text-white mb-2">
                  Start Time
                </label>
                <DatePicker
                  selected={formData.time_to}
                  onChange={(date) => handleDateChange(date, "time_to")}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full rounded-lg px-4 py-3 bg-white text-gray-800 border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out"
                  required
                />
              </div>
              <div className="relative">
                <label className="block text-lg font-semibold text-white mb-2">
                  End Time
                </label>
                <DatePicker
                  selected={formData.time_end}
                  onChange={(date) => handleDateChange(date, "time_end")}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full rounded-lg px-4 py-3 bg-white text-gray-800 border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out"
                  required
                />
              </div>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Table Selection & Notes
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tables.map((table) => (
                  <TableSelection
                    key={table.tableid}
                    table={table}
                    isSelected={formData.selectedTables.includes(table.tableid)}
                    isReserved={table.isReserved}
                    onSelect={() => handleTableSelection(table.tableid)}
                  />
                ))}
              </div>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Additional notes..."
                className="w-full p-3 rounded-lg bg-white text-gray-800 border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out"
                rows={3}
              />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <motion.div
      className={twMerge(
        "w-full max-w-2xl mx-auto mt-10 p-8 rounded-lg shadow-xl",
        "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"
      )}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-4xl font-bold text-white text-center mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        Book Your Table
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <motion.button
              type="button"
              onClick={prevStep}
              whileHover={{ scale: 1.05 }}
              className={twMerge(
                "py-2 px-4 rounded-lg text-white font-semibold",
                "bg-gray-500 hover:bg-gray-600",
                "transition-all duration-300 ease-in-out"
              )}
            >
              Previous
            </motion.button>
          )}
          <motion.button
            type="button"
            onClick={handleFinalSubmit}
            whileHover={{ scale: 1.05 }}
            className={twMerge(
              "py-2 px-4 rounded-lg text-white font-semibold",
              "bg-green-500 hover:bg-green-600",
              "transition-all duration-300 ease-in-out"
            )}
            disabled={isLoading}
          >
            {step === 3
              ? isLoading
                ? "Submitting..."
                : "Confirm Reservation"
              : "Next"}
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={twMerge(
              "mt-6 p-4 rounded-md text-lg font-semibold",
              message.isError
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            )}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Input: React.FC<{
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
}> = ({ label, ...props }) => (
  <div className="relative">
    <label className="block text-lg font-semibold text-white mb-2">
      {label}
    </label>
    <input
      {...props}
      className={twMerge(
        "w-full rounded-lg px-4 py-3",
        "bg-white text-gray-800 border-2 border-transparent",
        "focus:outline-none focus:ring-4 focus:ring-indigo-300",
        "transition-all duration-300 ease-in-out"
      )}
    />
  </div>
);

const TableSelection: React.FC<{
  table: Table;
  isSelected: boolean;
  isReserved: boolean;
  onSelect: () => void;
}> = ({ table, isSelected, isReserved, onSelect }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={clsx(
        "flex items-center p-4 rounded-lg cursor-pointer",
        "shadow-lg border-2",
        "transition-all duration-300 ease-in-out",
        isSelected
          ? "bg-indigo-100 border-indigo-500"
          : "bg-white border-transparent hover:border-indigo-300",

        isReserved
          ? "bg-red-500 border-indigo-500"
          : "bg-blue-400 border-transparent hover:border-indigo-300"
      )}
      onClick={onSelect}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="sr-only"
      />
      <div className="ml-2 text-sm font-medium text-gray-800">
        <p className="font-bold">Table {table.tableNumber}</p>
        <p>{table.noOfSeats} seats</p>
      </div>
    </motion.div>
  );
};

export default ReservationForm;
