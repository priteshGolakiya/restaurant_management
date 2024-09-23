"use client";
interface Table {
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

interface CreateExistingOrderForm {
  selectedTable: Table;
  items: Item[];
}
const CreateExistingOrderForm: React.FC<CreateExistingOrderForm> = ({
  selectedTable,
  items,
}) => {
  console.log("items::: ", items);
  console.log("selectedTable::: ", selectedTable);
  return <div>createExistingOrderForm</div>;
};

export default CreateExistingOrderForm;
