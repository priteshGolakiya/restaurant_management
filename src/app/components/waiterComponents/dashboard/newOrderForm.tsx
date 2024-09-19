"use client";
import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  List,
  Typography,
  message,
} from "antd";
import { PlusOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";
import summaryAPI from "@/lib/summaryAPI";

const { TextArea } = Input;
const { Option } = Select;

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
  item: number;
  quantity: number;
  note?: string;
}

interface FormValues {
  tableNumber: number;
  item: number;
  quantity: number;
  note?: string;
}

const NewOrderForm: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const [tableNumbers, setTableNumbers] = useState<TableNumber[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetchTableNumbers();
    fetchItems();
  }, []);

  const fetchTableNumbers = async () => {
    try {
      const response = await axios.get<{ result: TableNumber[] }>(
        summaryAPI.waiter.tables.commaUrl
      );
      setTableNumbers(response.data.result);
    } catch (error) {
      message.error("Failed to fetch table numbers");
    }
  };

  const fetchItems = async () => {
    try {
      const response = await axios.get<Item[]>(
        summaryAPI.waiter.items.commonUrl
      );
      setItems(response.data);
    } catch (error) {
      message.error("Failed to fetch items");
    }
  };

  const onFinish = async (values: FormValues) => {
    const orderData = {
      ...values,
      items: orderItems,
    };

    try {
      const response = await axios.post("/api/place-order", orderData);
      if (response.status === 200) {
        message.success("Order placed successfully");
        form.resetFields();
        setOrderItems([]);
      }
    } catch (error) {
      message.error("Failed to place order");
    }
  };

  const addItem = () => {
    form.validateFields(["item", "quantity", "note"]).then((values) => {
      const newItem: OrderItem = {
        ...values,
        key: Date.now(),
      };
      setOrderItems([...orderItems, newItem]);
      form.setFieldsValue({
        item: undefined,
        quantity: undefined,
        note: undefined,
      });
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        New Order
      </h2>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="tableNumber"
          label="Table Number"
          rules={[{ required: true, message: "Please select a table number" }]}
        >
          <Select placeholder="Select table number">
            {tableNumbers.map((table) => (
              <Option key={table.tableid} value={table.tableid}>
                {table.tableNumber}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <Form.Item
            name="item"
            label="Item"
            rules={[{ required: true, message: "Please select an item" }]}
          >
            <Select
              showSearch
              placeholder="Search for an item"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label as string)
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {items.map((item) => (
                <Option
                  key={item.itemid}
                  value={item.itemid}
                  label={item.itemname}
                >
                  {item.itemname} - ${item.price}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item name="note" label="Note">
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item>
            <Button
              type="dashed"
              onClick={addItem}
              className="w-full"
              icon={<PlusOutlined />}
            >
              Add Item
            </Button>
          </Form.Item>
        </div>

        <List
          className="mb-4 bg-gray-50 rounded-md"
          header={
            <div className="font-bold px-4 py-2 bg-gray-200 rounded-t-md">
              Order Items
            </div>
          }
          bordered
          dataSource={orderItems}
          renderItem={(item) => (
            <List.Item className="px-4 py-2 border-b last:border-b-0">
              <Typography.Text strong>
                {items.find((i) => i.itemid === item.item)?.itemname}
              </Typography.Text>
              <Typography.Text className="ml-2">
                Quantity: {item.quantity}
              </Typography.Text>
              {item.note && (
                <Typography.Text className="ml-2 text-gray-500">
                  Note: {item.note}
                </Typography.Text>
              )}
            </List.Item>
          )}
        />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 text-lg"
            icon={<ShoppingCartOutlined />}
          >
            Place Order
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewOrderForm;
