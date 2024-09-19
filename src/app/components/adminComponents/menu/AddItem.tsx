import React, { useState } from "react";
import { motion } from "framer-motion";
import uploadImage from "@/lib/uploadImage";
import axios from "axios";
import summaryAPI from "@/lib/summaryAPI";

type Category = {
  categoryid: string;
  categoryname: string;
  isactive: boolean;
};

type CategoryListProps = {
  categories: Category[];
};

const AddItem = ({ categories }: CategoryListProps) => {
  const [formData, setFormData] = useState<{
    itemname: string;
    description: string;
    price: string;
    categoryid: string;
    itemimage: string;
  }>({
    itemname: "",
    description: "",
    price: "",
    categoryid: "",
    itemimage: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadStatus("Uploading image...");

    try {
      if (file) {
        const uploadResult = await uploadImage(file);
        const newFormData = { ...formData, itemimage: uploadResult.secure_url };
        setFormData(newFormData);

        const response = await axios.post(
          summaryAPI.admin.items.commonUlr,
          newFormData
        );
        console.log(response.data);

        setUploadStatus("Image uploaded successfully!");
        setFormData({
          itemname: "",
          description: "",
          price: "",
          categoryid: "",
          itemimage: "",
        });
      } else {
        console.log("Form data to be submitted:", formData);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setUploadStatus("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] w-full bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 overflow-hidden relative">
      <div className="stars-container fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: `${Math.random() * 5 + 3}s`,
            }}
          />
        ))}
      </div>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Launch Your Item!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="itemname"
              className="block text-sm font-medium text-white"
            >
              Item Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.05 }}
              type="text"
              id="itemname"
              name="itemname"
              value={formData.itemname}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-full bg-white bg-opacity-20 border-2 border-transparent focus:border-yellow-300 focus:outline-none transition-all duration-300 text-white placeholder-gray-300"
              placeholder="Enter item name"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-white"
            >
              Description
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.05 }}
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 rounded-xl bg-white bg-opacity-20 border-2 border-transparent focus:border-yellow-300 focus:outline-none transition-all duration-300 text-white placeholder-gray-300"
              placeholder="Describe your item"
              required
            ></motion.textarea>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-white"
              >
                Price
              </label>
              <motion.input
                whileFocus={{ scale: 1.05 }}
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-full bg-white bg-opacity-20 border-2 border-transparent focus:border-yellow-300 focus:outline-none transition-all duration-300 text-white placeholder-gray-300"
                placeholder="💫"
                required
              />
            </div>

            <div className="flex-1 space-y-2">
              <label
                htmlFor="categoryid"
                className="block text-sm font-medium text-white"
              >
                Category
              </label>
              <motion.select
                whileFocus={{ scale: 1.05 }}
                id="categoryid"
                name="categoryid"
                value={formData.categoryid}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-full bg-white bg-opacity-20 border-2 border-transparent focus:border-yellow-300 focus:outline-none transition-all duration-300 text-white"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option
                    key={category.categoryid}
                    value={category.categoryid}
                    className="text-black"
                  >
                    {category.categoryname}
                  </option>
                ))}
              </motion.select>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-white"
            >
              Upload Image
            </label>
            <motion.input
              whileHover={{ scale: 1.05 }}
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 rounded-full bg-white bg-opacity-20 border-2 border-transparent focus:border-yellow-300 focus:outline-none transition-all duration-300 text-sm text-white
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-yellow-300 file:text-purple-900
                hover:file:bg-yellow-400"
            />
          </div>

          {uploadStatus && (
            <p className="text-sm text-center text-white">{uploadStatus}</p>
          )}

          {formData.itemimage && (
            <p className="text-sm text-center text-white">
              Image uploaded: {formData.itemimage}
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95, rotate: -5 }}
            type="submit"
            className="w-full py-3 px-4 rounded-full shadow-lg text-lg font-bold text-purple-900 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-all duration-300"
          >
            Launch This Item! 🌠
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddItem;
