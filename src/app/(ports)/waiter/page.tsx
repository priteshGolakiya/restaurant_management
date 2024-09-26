"use client";

import React, { useEffect, useState } from "react";
import { Button, message, Modal } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import axios from "axios";
import CreateExistingOrderForm from "@/app/components/waiterComponents/dashboard/createExistingOrderForm";
import NewOrderForm from "@/app/components/waiterComponents/dashboard/newOrderForm";
import WaiterTableList from "@/app/components/waiterComponents/dashboard/waiterTableList";
import summaryAPI from "@/lib/summaryAPI";

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

interface Item {
  itemid: number;
  itemname: string;
  description: string;
  price: string;
  categoryid: string;
  isactive: string;
  itemimage: {
    img1: string;
  };
}

interface OrderItem {
  key: number;
  itemId: number;
  quantity: number;
  note?: string;
}

const ManagerPage: React.FC = () => {
  const [isDineInModalVisible, setIsDineInModalVisible] = useState(false);
  const [isTakeawayModalVisible, setIsTakeawayModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableNumber | null>(null);
  const [tables, setTables] = useState<TableNumber[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [availableTables, setAvailableTables] = useState<TableNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<{
    [tableId: number]: OrderItem[];
  }>({});

  const fetchAvailableTable = async () => {
    const response = await axios.get(
      `${summaryAPI.waiter.tables.commaUrl}/available-table`
    );
    const data = response.data.result.availableTables;
    setAvailableTables(data);
  };

  const fetchTableData = async () => {
    try {
      const tablesResponse = await axios.get(summaryAPI.waiter.tables.commaUrl);

      setTables(tablesResponse.data.result.tablesNeedingAttention);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Error fetching data");
    }
  };

  const fetchItemsData = async () => {
    try {
      const itemsResponse = await axios.get(summaryAPI.waiter.items.commonUrl);
      setItems(itemsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchTableData();
    fetchItemsData();
    fetchAvailableTable();
  }, []);

  const showDineInModal = () => {
    setIsDineInModalVisible(true);
  };

  const showTakeawayModal = () => {
    setIsTakeawayModalVisible(true);
  };

  const handleTableModalOpen = (table: TableNumber) => {
    setSelectedTable(table);
  };

  const handleModalClose = () => {
    setIsDineInModalVisible(false);
    setIsTakeawayModalVisible(false);
    setSelectedTable(null);
  };

  const updateOrderItems = (tableId: number, items: OrderItem[]) => {
    setOrderItems((prevState) => ({
      ...prevState,
      [tableId]: items,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Button
                icon={<MenuOutlined />}
                onClick={showDineInModal}
                className="bg-blue-500 text-white hover:bg-blue-600 mr-2"
              >
                New Dine-in Order
              </Button>
              <Button
                icon={<MenuOutlined />}
                onClick={showTakeawayModal}
                className="bg-green-500 text-white hover:bg-green-600"
              >
                New Takeaway Order
              </Button>
            </div>
          </div>

          <WaiterTableList
            tables={tables}
            onTableClick={handleTableModalOpen}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        title="New Dine-in Order"
        open={isDineInModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        <NewOrderForm
          tables={availableTables}
          items={items}
          fetchAvailableTable={fetchAvailableTable}
          fetchTableData={fetchTableData}
          onCancel={handleModalClose}
          orderType="dinein"
        />
      </Modal>

      <Modal
        title="New Takeaway Order"
        open={isTakeawayModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        <NewOrderForm
          tables={[]}
          items={items}
          fetchAvailableTable={fetchAvailableTable}
          fetchTableData={fetchTableData}
          onCancel={handleModalClose}
          orderType="takeaway"
        />
      </Modal>

      <Modal
        title={`Table ${selectedTable?.tableNumber} Details`}
        open={Boolean(selectedTable)}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedTable && (
          <CreateExistingOrderForm
            selectedTable={selectedTable}
            items={items}
            orderItems={orderItems[selectedTable.tableid] || []}
            updateOrderItems={(items) =>
              updateOrderItems(selectedTable.tableid, items)
            }
          />
        )}
      </Modal>
    </div>
  );
};

export default ManagerPage;
