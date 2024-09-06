/* eslint-disable react/no-unescaped-entities */
"use client";
import React, {  useState } from "react";
import { LogIn, Home, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter,  } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post("/api/login", formData);

      toast.success(response.data.message);
      setFormData({
        email: "",
        password: "",
      });
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data.message);
        setErrorMessage(
          error.response?.data?.message || "Invalid email or password"
        );
        setFormData({
          email: "",
          password: "",
        });
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Welcome Back!
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          <div className="relative">
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <div
              className="absolute inset-y-0 right-4 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {passwordVisible ? <EyeOff /> : <Eye />}
            </div>
          </div>
          {errorMessage && (
            <p className="text-red-600 text-sm">{errorMessage}</p>
          )}
          <button
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              "Logging In..."
            ) : (
              <>
                <LogIn className="mr-2" /> Log In
              </>
            )}
          </button>
        </form>

        <Link
          href={"/"}
          className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center justify-center"
        >
          <Home className="mr-2" /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
