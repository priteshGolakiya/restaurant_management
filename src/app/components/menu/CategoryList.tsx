"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { CategoryHoverEffect } from "@/app/components/ui/category-hover";

type Category = {
  categoryid: string;
  categoryname: string;
  isactive: boolean;
};

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = async () => {
    try {
      const categoriesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category`
      );

      console.log("Categories Response:", categoriesResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3">
      <CategoryHoverEffect items={categories} />
    </div>
  );
};

export default CategoryList;
