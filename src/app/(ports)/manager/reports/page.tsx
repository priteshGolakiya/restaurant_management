"use client";

import React, { useEffect, useState } from "react";
import { Pagination } from "antd";
import axios from "axios";
import clsx from "clsx";
import { motion } from "framer-motion";
import { CalendarDays, IndianRupee } from "lucide-react";
import moment from "moment";
import { twMerge } from "tailwind-merge";
import summaryAPI from "@/lib/summaryAPI";

interface Report {
  bill_entry_id: string;
  total_amount: string;
  is_paid: boolean;
  payment_mod: string;
  order_type: string;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  console.log("reports::: ", reports);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("all");
  const [selectedOrderType, setSelectedOrderType] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const fetchReports = async (date: Date) => {
    setLoading(true);
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await axios.get<{ success: boolean; data: Report[] }>(
        `${summaryAPI.manager.reports.getReports}?date=${formattedDate}`
      );
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(selectedDate);
  }, [selectedDate]);

  const filteredReports = reports.filter(
    (report) =>
      (selectedPaymentMethod === "all" ||
        report.payment_mod === selectedPaymentMethod) &&
      (selectedOrderType === "all" || report.order_type === selectedOrderType)
  );

  const totalAmount = filteredReports.reduce(
    (sum, report) => sum + parseFloat(report.total_amount),
    0
  );

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <motion.div
        className="max-w-6xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-bold text-indigo-800"
          variants={itemVariants}
        >
          Reports Dashboard
        </motion.h1>

        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          variants={itemVariants}
        >
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                value={moment(selectedDate).format("YYYY-MM-DD")}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className={twMerge(
                  clsx(
                    "mt-1 block w-full px-3 py-2",
                    "rounded-md border border-gray-300",
                    "bg-white text-gray-900",
                    "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    "transition duration-150 ease-in-out",
                    "hover:border-indigo-400",
                    "text-sm leading-5",
                    "placeholder-gray-500",
                    "shadow-sm"
                  )
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className={twMerge(
                  clsx(
                    "mt-1 block w-full px-3 py-2",
                    "rounded-md border border-gray-300",
                    "bg-white text-gray-900",
                    "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    "transition duration-150 ease-in-out",
                    "hover:border-indigo-400",
                    "text-sm leading-5",
                    "placeholder-gray-500",
                    "shadow-sm"
                  )
                )}
              >
                <option value="all">All Methods</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Type
              </label>
              <select
                value={selectedOrderType}
                onChange={(e) => setSelectedOrderType(e.target.value)}
                className={twMerge(
                  clsx(
                    "mt-1 block w-full px-3 py-2",
                    "rounded-md border border-gray-300",
                    "bg-white text-gray-900",
                    "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200",
                    "transition duration-150 ease-in-out",
                    "hover:border-indigo-400",
                    "text-sm leading-5",
                    "placeholder-gray-500",
                    "shadow-sm"
                  )
                )}
              >
                <option value="all">All Types</option>
                <option value="takeaway">Takeaway</option>
                <option value="dinein">Dine-in</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-lg p-6"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-semibold text-gray-800">
                {moment(selectedDate).format("MMMM D, YYYY")}
              </span>
            </div>
            <div className="flex items-center space-x-2 ">
              <div className="flex items-center justify-center h-full">
                <IndianRupee className="h-7 w-7 font-bold text-green-600 border-green-500 border-2 rounded-full p-1" />
              </div>
              <span className="text-lg font-semibold text-gray-800">
                Total Amount: {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow-lg overflow-hidden"
          variants={itemVariants}
        >
          <h2 className="text-2xl font-semibold text-gray-800 p-6 bg-gray-50">
            Transactions
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Index",
                      "Total Amount",
                      "Payment Status",
                      "Payment Method",
                      "Order Type",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedReports.map((report, index) => (
                    <motion.tr
                      key={report.bill_entry_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        ₹{parseFloat(report.total_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={clsx(
                            "px-4 inline-flex text-sm leading-5 font-semibold rounded-full",
                            report.is_paid
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {report.is_paid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.payment_mod ? report.payment_mod : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {report.order_type
                          ? report.order_type.charAt(0).toUpperCase() +
                            report.order_type.slice(1)
                          : "N/A"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <Pagination
              current={currentPage}
              total={filteredReports.length}
              pageSize={pageSize}
              onChange={(page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              }}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Total ${total} items`}
              className="ant-pagination-custom"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Reports;
