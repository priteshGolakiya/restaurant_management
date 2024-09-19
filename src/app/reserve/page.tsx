"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker, Button, Input, message } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TableOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import summaryAPI from "@/lib/summaryAPI";

const { TextArea } = Input;

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
  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get(summaryAPI.admin.table.commonUlr);
      setTables(response.data.result);
    } catch (error) {
      console.error("Error fetching tables:", error);
      message.error("Failed to load tables. Please try again.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: moment.Moment | null, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: date ? date.toDate() : null }));
  };

  const handleTableSelection = (tableid: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTables: prev.selectedTables.includes(tableid)
        ? prev.selectedTables.filter((id) => id !== tableid)
        : [...prev.selectedTables, tableid],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post(summaryAPI.common.bookTable.url, {
        ...formData,
        time_to: formData.time_to?.toISOString(),
        time_end: formData.time_end?.toISOString(),
      });
      if (response.data.success) {
        message.success("Reservation successful!");
        setFormData({
          customerName: "",
          customerNumber: "",
          time_to: null,
          time_end: null,
          note: "",
          selectedTables: [],
        });
        setCurrentStep(0);
      } else {
        message.error(response.data.message || "Reservation failed.");
      }
    } catch (error) {
      console.error("error::: ", error);
      if (axios.isAxiosError(error) && error.response) {
        message.error(
          error.response.data.message || "An unexpected error occurred"
        );
      } else {
        message.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      title: "Personal Details",
      icon: <UserOutlined />,
      content: (
        <div className="space-y-4">
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Customer Name"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            required
          />
          <Input
            prefix={<PhoneOutlined className="site-form-item-icon" />}
            placeholder="Customer Number"
            name="customerNumber"
            value={formData.customerNumber}
            onChange={handleInputChange}
            required
          />
        </div>
      ),
    },
    {
      title: "Date & Time",
      icon: <CalendarOutlined />,
      content: (
        <div className="space-y-4">
          <DatePicker
            showTime
            placeholder="Start Time"
            value={formData.time_to ? moment(formData.time_to) : null}
            onChange={(date) => handleDateChange(date, "time_to")}
            className="w-full"
          />
          <DatePicker
            showTime
            placeholder="End Time"
            value={formData.time_end ? moment(formData.time_end) : null}
            onChange={(date) => handleDateChange(date, "time_end")}
            className="w-full"
          />
        </div>
      ),
    },
    {
      title: "Table Selection",
      icon: <TableOutlined />,
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {tables.map((table) => (
            <motion.div
              key={table.tableid}
              whileHover={{ scale: 1.05 }}
              className={`p-4 rounded-lg cursor-pointer ${
                formData.selectedTables.includes(table.tableid)
                  ? "bg-blue-100 border-blue-500"
                  : "bg-white border-gray-200"
              } ${
                table.isReserved ? "opacity-50 cursor-not-allowed" : ""
              } border-2 transition-all duration-300`}
              onClick={() =>
                !table.isReserved && handleTableSelection(table.tableid)
              }
            >
              <p className="font-bold">Table {table.tableNumber}</p>
              <p>{table.noOfSeats} seats</p>
            </motion.div>
          ))}
        </div>
      ),
    },
    {
      title: "Additional Notes",
      icon: <FileTextOutlined />,
      content: (
        <TextArea
          rows={4}
          placeholder="Additional notes..."
          name="note"
          value={formData.note}
          onChange={handleInputChange}
        />
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Book Your Perfect Table
      </h1>

      <div className="flex justify-center mb-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index < steps.length - 1 ? "w-full" : ""
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.icon}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  index < currentStep ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            {steps[currentStep].title}
          </h2>
          {steps[currentStep].content}
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-between">
        <Button
          onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          type="primary"
          onClick={() => {
            if (currentStep === steps.length - 1) {
              handleSubmit();
            } else {
              setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
            }
          }}
          loading={isLoading}
        >
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default ReservationForm;
