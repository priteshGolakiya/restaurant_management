"use client";

import axios from "axios";
import { Edit2, Trash2, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

interface StaffType {
  userid: number;
  full_name: string;
  user_name: string;
  email: string;
  role: string;
}

interface StaffComponentProps {
  initialStaffData: StaffType[];
}

const StaffComponent: React.FC<StaffComponentProps> = ({
  initialStaffData,
}) => {
  const [staffData, setStaffData] = useState<StaffType[]>(initialStaffData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffType | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    role: "",
  });

  const openModal = (staff: StaffType) => {
    setSelectedStaff(staff);
    setFormData({
      fullName: staff.full_name,
      userName: staff.user_name,
      email: staff.email,
      role: staff.role,
    });
    setIsModalOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    if (!selectedStaff) return;

    try {
      await axios.put(`/api/staff/${selectedStaff.userid}`, formData);
      toast.success("Staff updated successfully!");
      setIsModalOpen(false);
      const updatedStaff = staffData.map((staff) =>
        staff.userid === selectedStaff.userid
          ? { ...staff, ...formData }
          : staff
      );
      setStaffData(updatedStaff);
    } catch (error) {
      toast.error("Error updating staff.");
    }
  };

  const deleteUser = async (staff: StaffType) => {
    try {
      await axios.delete(`/api/staff/${staff.userid}`);
      toast.success("Staff deleted successfully!");
      setStaffData(staffData.filter((item) => item.userid !== staff.userid));
    } catch (error) {
      toast.error("Error deleting staff.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600">
          <h1 className="text-3xl font-extrabold text-white">
            Staff Management
          </h1>
        </div>
        <div className="p-6">
          <Link
            href="/admin/staff/addStaff"
            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors duration-200"
          >
            <UserPlus className="mr-2" size={20} />
            Add New Staff
          </Link>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staffData.map((staff) => (
                  <tr key={staff.userid} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          staff.role === "Manager"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2 gap-4">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          onClick={() => openModal(staff)}
                          aria-label={`Edit ${staff.user_name}`}
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          onClick={() => deleteUser(staff)}
                          aria-label={`Delete ${staff.user_name}`}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Staff</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <input
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
            <input
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="text"
              name="userName"
              placeholder="Username"
              value={formData.userName}
              onChange={handleChange}
            />
            <input
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <select
              className="w-full px-4 py-2 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="Manager">Manager</option>
              <option value="Waiter">Waiter</option>
            </select>
            <button
              onClick={handleUpdate}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Update Staff
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffComponent;
