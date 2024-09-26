import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  List,
  Typography,
  message,
  Modal,
  Divider,
} from "antd";
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  EditOutlined,
} from "@ant-design/icons";
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
  tableNumber: number | null;
  item: number;
  quantity: number;
  note?: string;
  paymentMethod?: string;
}

interface NewOrderFormProps {
  tables: TableNumber[];
  items: Item[];
  fetchAvailableTable: () => void;
  fetchTableData: () => void;
  onCancel: () => void;
  orderType: "dinein" | "takeaway";
}

const NewOrderForm: React.FC<NewOrderFormProps> = ({
  tables,
  items,
  fetchAvailableTable,
  fetchTableData,
  onCancel,
  orderType,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const onFinish = async (values: FormValues) => {
    const orderData = {
      tableNumber: orderType === "dinein" ? values.tableNumber : null,
      items: orderItems.map((item) => ({
        itemId: item.item,
        quantity: item.quantity,
        note: item.note || "",
      })),
      orderType: orderType,
      paymentMethod:
        orderType === "takeaway" ? values.paymentMethod : undefined,
    };
    const hide = message.loading("Placing order...", 0);
    try {
      const response = await axios.post(
        summaryAPI.manager.placeOrder.placeOrder.url,
        orderData
      );
      if (response.status === 200) {
        hide();
        message.success("Order placed successfully");
        if (response.data.tokenNo) {
          message.info(`Token number: ${response.data.tokenNo}`);
        }
        form.resetFields();
        fetchAvailableTable();
        fetchTableData();
        setOrderItems([]);
        onCancel();
      }
    } catch (error) {
      hide();
      message.error("Failed to place order");
    }
  };

  const addItem = () => {
    form.validateFields(["item", "note"]).then((values) => {
      const newItem: OrderItem = {
        ...values,
        quantity,
        key: Date.now(),
      };
      setOrderItems([...orderItems, newItem]);
      form.setFieldsValue({
        item: undefined,
        note: undefined,
      });
      setQuantity(1);
    });
  };

  const removeItem = (key: number) => {
    setOrderItems(orderItems.filter((item) => item.key !== key));
  };

  const editItem = (item: OrderItem) => {
    setEditingItem(item);
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = () => {
    if (editingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item.key === editingItem.key ? editingItem : item
        )
      );
    }
    setIsEditModalVisible(false);
    setEditingItem(null);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditingItem(null);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        New {orderType === "dinein" ? "Dine-in" : "Takeaway"} Order
      </h2>
      <Divider style={{ borderColor: "#6B21A8" }} />
      <Form form={form} onFinish={onFinish} layout="vertical">
        {orderType === "dinein" && (
          <Form.Item
            name="tableNumber"
            label="Table Number"
            rules={[
              { required: true, message: "Please select a table number" },
            ]}
          >
            <Select placeholder="Select table number">
              {tables.map((table) => (
                <Option key={table.tableid} value={Number(table.tableid)}>
                  {table.tableNumber}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {orderType === "takeaway" && (
          <Form.Item
            name="paymentMethod"
            label="Payment Method"
            rules={[
              { required: true, message: "Please select a payment method" },
            ]}
          >
            <Select placeholder="Select payment method">
              <Option value="upi">UPI</Option>
              <Option value="cash">Cash</Option>
              <Option value="card">Card</Option>
            </Select>
          </Form.Item>
        )}

        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <Form.Item name="item" label="Item">
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
                  label={`${item.itemname} - ₹${item.price}`}
                >
                  {item.itemname} - ₹{item.price}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Quantity">
            <div className="flex items-center">
              <Button onClick={decrementQuantity} icon={<MinusOutlined />} />
              <InputNumber
                min={1}
                value={quantity}
                onChange={(value) => setQuantity(value || 1)}
                className="mx-2"
                style={{ width: "40px" }}
              />
              <Button onClick={incrementQuantity} icon={<PlusOutlined />} />
            </div>
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
          renderItem={(item) => {
            const currentItem = items.find((i) => i.itemid === item.item);
            return (
              <List.Item
                className="px-4 py-2 border-b last:border-b-0 flex justify-between"
                actions={[
                  <Button
                    onClick={() => editItem(item)}
                    size="small"
                    key="edit"
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>,
                  <Button
                    danger
                    onClick={() => removeItem(item.key)}
                    size="small"
                    key="remove"
                  >
                    Remove
                  </Button>,
                ]}
              >
                <div>
                  <Typography.Text strong>
                    {currentItem?.itemname}
                  </Typography.Text>
                  <Typography.Text className="ml-2">
                    Quantity: {item.quantity}
                  </Typography.Text>
                  {item.note && (
                    <Typography.Text className="ml-2 text-gray-500">
                      Note: {item.note}
                    </Typography.Text>
                  )}
                </div>
              </List.Item>
            );
          }}
        />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-12 text-lg"
            icon={<ShoppingCartOutlined />}
          >
            Place {orderType === "dinein" ? "Dine-in" : "Takeaway"} Order
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Edit Item"
        open={isEditModalVisible}
        onOk={handleEditModalOk}
        onCancel={handleEditModalCancel}
      >
        {editingItem && (
          <Form layout="vertical">
            <Form.Item label="Item">
              <Select
                showSearch
                placeholder="Search for an item"
                value={editingItem.item}
                onChange={(value) =>
                  setEditingItem({ ...editingItem, item: value })
                }
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: "100%" }}
              >
                {items.map((item) => (
                  <Option
                    key={item.itemid}
                    value={item.itemid}
                    label={`${item.itemname} - ₹${item.price}`}
                  >
                    {item.itemname} - ₹{item.price}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Quantity">
              <div className="flex items-center">
                <Button
                  onClick={() => {
                    if (editingItem.quantity > 1) {
                      setEditingItem({
                        ...editingItem,
                        quantity: editingItem.quantity - 1,
                      });
                    }
                  }}
                  icon={<MinusOutlined />}
                />
                <InputNumber
                  min={1}
                  value={editingItem.quantity}
                  onChange={(value) =>
                    setEditingItem({ ...editingItem, quantity: value || 1 })
                  }
                  className="mx-2"
                  style={{ width: "40px" }}
                />
                <Button
                  onClick={() =>
                    setEditingItem({
                      ...editingItem,
                      quantity: editingItem.quantity + 1,
                    })
                  }
                  icon={<PlusOutlined />}
                />
              </div>
            </Form.Item>
            <Form.Item label="Note">
              <TextArea
                rows={2}
                value={editingItem.note}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, note: e.target.value })
                }
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default NewOrderForm;
