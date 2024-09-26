import React, { useState, useEffect, useCallback } from "react";
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
  Radio,
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
  itemId: number;
  quantity: number;
  note?: string;
}

interface OrderData {
  bill_details_id: string;
  item_id: string;
  quantity: number;
  subtotal: number;
  note: string | null;
  kotno: number;
  bill_entry_id: number;
}

interface FormValues {
  itemId: number;
  quantity: number;
  note?: string;
}

interface CreateExistingOrderFormProps {
  selectedTable: TableNumber;
  items: Item[];
  orderItems: OrderItem[];
  updateOrderItems: (items: OrderItem[]) => void;
  onCreateBill: (billEntryId: number, paymentMethod: string) => void;
}

const CreateExistingOrderForm: React.FC<CreateExistingOrderFormProps> = ({
  selectedTable,
  items,
  orderItems,
  updateOrderItems,
  onCreateBill,
}) => {
  const [form] = Form.useForm<FormValues>();
  const [quantity, setQuantity] = useState(1);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [isEditItemModalVisible, setIsEditItemModalVisible] = useState(false);
  const [editingOrderItem, setEditingOrderItem] = useState<OrderData | null>(
    null
  );
  const [isEditOrderModalVisible, setIsEditOrderModalVisible] = useState(false);
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [isPaymentModModalVisible, setIsPaymentModModalVisible] =
    useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(
        `${summaryAPI.manager.getAllOrder.commonUrl}/${selectedTable.tableid}`
      );
      if (response.data.success) {
        setOrderData(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [selectedTable.tableid]);

  useEffect(() => {
    form.resetFields();
    setQuantity(1);
    fetchOrders();
  }, [selectedTable, form, fetchOrders]);

  const onFinish = async () => {
    if (orderItems.length === 0) {
      message.warning("Please select at least one item to place an order.");
      return;
    }

    const orderData = {
      tableNumber: selectedTable.tableid,
      items: orderItems.map((item) => ({
        itemId: item.itemId.toString(),
        quantity: item.quantity,
        note: item.note || null,
      })),
    };

    const hide = message.loading("Placing order...", 0);
    try {
      const response = await axios.post(
        summaryAPI.manager.placeOrder.commonUrl,
        orderData
      );

      if (response.status === 200) {
        hide();
        message.success("Order placed successfully");
        form.resetFields();
        updateOrderItems([]);
        fetchOrders();
      }
    } catch (error) {
      console.log("error :>> ", error);
      hide();
      message.error("Failed to place order");
    }
  };

  const addItem = () => {
    form.validateFields(["itemId", "note"]).then((values) => {
      if (!values.itemId || values.itemId < 0 || values.quantity <= 0) {
        message.warning("Please select a valid item and quantity");
        return;
      }
      const newItem: OrderItem = {
        ...values,
        quantity,
        key: Date.now(),
      };
      updateOrderItems([...orderItems, newItem]);
      form.setFieldsValue({
        itemId: undefined,
        note: undefined,
      });
      setQuantity(1);
    });
  };

  const removeItem = (key: number) => {
    updateOrderItems(orderItems.filter((item) => item.key !== key));
  };

  const editItem = (item: OrderItem) => {
    setEditingItem(item);
    setIsEditItemModalVisible(true);
  };

  const editOrderItem = (order: OrderData) => {
    setEditingOrderItem(order);
    setIsEditOrderModalVisible(true);
  };

  const handleEditItemModalOk = () => {
    if (editingItem) {
      updateOrderItems(
        orderItems.map((item) =>
          item.key === editingItem.key ? editingItem : item
        )
      );
    }
    setIsEditItemModalVisible(false);
    setEditingItem(null);
  };

  const handleEditOrderModalOk = async () => {
    if (editingOrderItem) {
      try {
        await axios.put(
          `${summaryAPI.manager.getAllOrder.commonUrl}/${editingOrderItem.bill_details_id}`,
          {
            billDetailsId: editingOrderItem.bill_details_id,
            itemId: editingOrderItem.item_id,
            quantity: editingOrderItem.quantity,
            note: editingOrderItem.note,
          }
        );
        message.success("Order item updated successfully");
        fetchOrders();
      } catch (error) {
        console.error("Error updating order item:", error);
        message.error("Failed to update order item");
      }
    }
    setIsEditOrderModalVisible(false);
    setEditingOrderItem(null);
  };

  const removeOrderItem = async (bill_details_id: string) => {
    const response = await axios.delete(
      `${summaryAPI.manager.getAllOrder.deleteOrder}/${selectedTable.tableid}`,
      {
        data: {
          billDetailsId: Number(bill_details_id),
        },
      }
    );

    if (response.data.success) {
      message.success(response.data.message);
      fetchOrders();
    }
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const createBill = async () => {
    if (orderData.length > 0) {
      setIsPaymentModModalVisible(true);
    } else {
      message.error("No orders to create a bill");
    }
  };

  const handlePaymentModOk = () => {
    if (!paymentMethod) {
      message.error("Please select a payment method");
    } else {
      onCreateBill(orderData[0].bill_entry_id, paymentMethod);
      setIsPaymentModModalVisible(false);
    }
  };

  const handlePaymentModCancel = () => {
    setIsPaymentModModalVisible(false);
  };
  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Table Number: {selectedTable.tableNumber}
      </h2>
      <Button
        type="primary"
        className="mb-4 w-full"
        icon={<ShoppingCartOutlined />}
        onClick={createBill}
      >
        Create Bill
      </Button>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <Form.Item name="itemId" label="Item">
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
            const currentItem = items.find((i) => i.itemid === item.itemId);
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
            className="w-full"
            icon={<ShoppingCartOutlined />}
          >
            Place Order
          </Button>
        </Form.Item>
      </Form>

      <div className="bg-gray-100 p-4 mt-4 rounded-md">
        <Typography.Title level={5} className="text-center">
          Previous Orders for Table {selectedTable.tableNumber}
        </Typography.Title>

        <List
          className="mb-4 bg-gray-50 rounded-md"
          header={
            <div className="font-bold px-4 py-2 bg-gray-200 rounded-t-md">
              Order List
            </div>
          }
          bordered
          dataSource={orderData || []}
          renderItem={(order: OrderData) => {
            const currentItem = items.find(
              (i: Item) => i.itemid.toString() === order.item_id
            );
            if (!currentItem) {
              return null;
            }
            return (
              <List.Item
                className="px-4 py-2 border-b last:border-b-0 flex justify-between"
                actions={[
                  <Button
                    onClick={() => editOrderItem(order)}
                    size="small"
                    key="edit"
                    icon={<EditOutlined />}
                  >
                    Edit
                  </Button>,
                  <Button
                    danger
                    onClick={() => removeOrderItem(order.bill_details_id)}
                    size="small"
                    key="remove"
                  >
                    Remove
                  </Button>,
                ]}
              >
                <div>
                  {order.kotno && (
                    <Typography.Text className="block font-semibold">
                      KOT: {order.kotno}
                    </Typography.Text>
                  )}
                  <Typography.Text className="block font-bold">
                    {currentItem.itemname} - ₹{currentItem.price}
                  </Typography.Text>
                  <Typography.Text className="block text-gray-700">
                    Quantity: {order.quantity}
                  </Typography.Text>
                  {order.note && (
                    <Typography.Text className="block text-gray-500">
                      Note: {order.note}
                    </Typography.Text>
                  )}
                </div>
              </List.Item>
            );
          }}
        />
      </div>

      <Modal
        title="Edit Order Item"
        open={isEditItemModalVisible}
        onOk={handleEditItemModalOk}
        onCancel={() => setIsEditItemModalVisible(false)}
      >
        {editingItem && (
          <Form layout="vertical">
            <Form.Item label="Item">
              <Select
                showSearch
                value={editingItem.itemId}
                placeholder="Search for an item"
                optionFilterProp="children"
                onChange={(value) =>
                  setEditingItem({ ...editingItem, itemId: value })
                }
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  type="default"
                  onClick={() =>
                    setEditingItem((prev) => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        quantity: Math.max(prev.quantity - 1, 1),
                      };
                    })
                  }
                >
                  -
                </Button>
                <InputNumber
                  min={1}
                  value={editingItem?.quantity}
                  onChange={(value) =>
                    setEditingItem((prev) => {
                      if (!prev) return null;
                      return {
                        ...prev,
                        quantity: value || 1,
                      };
                    })
                  }
                  style={{ width: "60px", margin: "0 8px" }}
                />
                <Button
                  type="default"
                  onClick={() =>
                    setEditingItem((prev) => {
                      if (!prev) {
                        return {
                          key: Date.now(),
                          itemId: 0,
                          quantity: 1,
                          note: "",
                        };
                      }
                      return {
                        ...prev,
                        quantity: prev.quantity + 1,
                      };
                    })
                  }
                >
                  +
                </Button>
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

      {/* Modal for editing items in the previous orders */}
      <Modal
        title="Edit Previous Order Item"
        open={isEditOrderModalVisible}
        onOk={handleEditOrderModalOk}
        onCancel={() => setIsEditOrderModalVisible(false)}
      >
        {editingOrderItem && (
          <Form layout="vertical">
            <Form.Item label="Item">
              <Select
                showSearch
                value={editingOrderItem.item_id}
                placeholder="Search for an item"
                optionFilterProp="children"
                onChange={(value) =>
                  setEditingOrderItem({ ...editingOrderItem, item_id: value })
                }
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {items.map((item) => (
                  <Option
                    key={item.itemid}
                    value={item.itemid.toString()}
                    label={`${item.itemname} - ₹${item.price}`}
                  >
                    {item.itemname} - ₹{item.price}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Quantity">
              <InputNumber
                min={1}
                value={editingOrderItem.quantity}
                onChange={(value) =>
                  setEditingOrderItem({
                    ...editingOrderItem,
                    quantity: value || 1,
                  })
                }
              />
            </Form.Item>
            <Form.Item label="Note">
              <TextArea
                rows={2}
                value={editingOrderItem.note || ""}
                onChange={(e) =>
                  setEditingOrderItem({
                    ...editingOrderItem,
                    note: e.target.value,
                  })
                }
              />
            </Form.Item>
          </Form>
        )}
      </Modal>

      <Modal
        title="Select Payment Method"
        open={isPaymentModModalVisible}
        onOk={handlePaymentModOk}
        onCancel={handlePaymentModCancel}
        okText="Confirm"
      >
        <Radio.Group
          onChange={(e) => setPaymentMethod(e.target.value)}
          value={paymentMethod}
        >
          <Radio value="cash">Cash</Radio>
          <Radio value="upi">UPI</Radio>
          <Radio value="card">Card</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default CreateExistingOrderForm;
