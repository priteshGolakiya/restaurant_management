"use client";

import NewOrderForm from "@/app/components/waiterComponents/dashboard/newOrderForm";
import WaiterTableList from "@/app/components/waiterComponents/dashboard/waiterTableList";
import summaryAPI from "@/lib/summaryAPI";
import { MenuOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface TableNumber {
  tableid: number;
  noOfSeats: number;
  tableNumber: number;
  isReserved: boolean;
  isActive: boolean;
  time_to: string | null;
  time_end: string | null;
  note: string | null;
}

const WaiterHome: React.FC = () => {
  const [isNewOrderModalVisible, setIsNewOrderModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableNumber | null>(null);
  const [tables, setTables] = useState<TableNumber[]>([]);

  useEffect(() => {
    fetchTableNumbers();
  }, []);

  const fetchTableNumbers = async () => {
    try {
      const response = await axios.get<{ result: TableNumber[] }>(
        summaryAPI.waiter.tables.commaUrl
      );
      setTables(response.data.result);
    } catch (error) {
      console.error("Failed to fetch table numbers", error);
    }
  };

  const showNewOrderModal = () => {
    setIsNewOrderModalVisible(true);
  };

  const handleTableModalOpen = (table: TableNumber) => {
    setSelectedTable(table);
  };

  const handleModalClose = () => {
    setIsNewOrderModalVisible(false);
    setSelectedTable(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <Button
              icon={<MenuOutlined />}
              onClick={showNewOrderModal}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              New Order
            </Button>
          </div>

          <WaiterTableList
            tables={tables}
            onTableClick={handleTableModalOpen}
          />
        </div>
      </div>

      <Modal
        title="New Order"
        open={isNewOrderModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        <NewOrderForm />
      </Modal>

      <Modal
        title={`Table ${selectedTable?.tableNumber} Details`}
        open={Boolean(selectedTable)}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        {selectedTable && (
          <>
            <p>Status: {selectedTable.isActive ? "Occupied" : "Available"}</p>
            <p>Seats: {selectedTable.noOfSeats}</p>
            <p>Reserved: {selectedTable.isReserved ? "Yes" : "No"}</p>
            {selectedTable.note && <p>Note: {selectedTable.note}</p>}
          </>
        )}
      </Modal>
    </div>
  );
};

export default WaiterHome;
