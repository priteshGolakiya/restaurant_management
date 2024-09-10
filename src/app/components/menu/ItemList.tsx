import axios from "axios";
import { useEffect, useState } from "react";
import { ItemHoverEffect } from "../ui/item-hover";

type ItemImage = {
  img1: string;
};

type Items = {
  itemid: string;
  itemname: string;
  description: string;
  price: number;
  categoryid: number;
  isactive: boolean;
  itemimage: ItemImage;
};

const ItemList = () => {
  const [items, setItems] = useState<Items[]>([]);

  const fetchData = async () => {
    try {
      const itemsResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/items`
      );

      console.log("Items Response:", itemsResponse.data);
      setItems(itemsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 ">
      <ItemHoverEffect items={items} />
    </div>
  );
};

export default ItemList;
