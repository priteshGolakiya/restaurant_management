"use client";
import { CategoryHoverEffect } from "@/app/components/ui/category-hover";

type Category = {
  categoryid: string;
  categoryname: string;
  isactive: boolean;
};

type CategoryListProps = {
  categories: Category[];
};

const CategoryList = ({ categories }: CategoryListProps) => {
  return (
    <div className="max-w-7xl mx-auto px-3">
      <CategoryHoverEffect items={categories} />
    </div>
  );
};

export default CategoryList;
