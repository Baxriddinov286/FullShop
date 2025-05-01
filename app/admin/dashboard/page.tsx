"use client";
import Categories from "@/app/_Components/addCategory";
import Products from "@/app/_Components/addProduct";
import Dashboard from "@/app/_Components/dashboard";
import Orders from "@/app/_Components/orders";
import React, { useState } from "react";
import { AiOutlineProduct } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { LuLayoutDashboard } from "react-icons/lu";
import { TbCategoryPlus } from "react-icons/tb";

export default function Page() {
  const [info, setInfo] = useState("Dashboard");

  return (
    <div className="flex">
      <div>
        <div className="flex flex-col justify-between w-64 h-screen px-4 py-6 bg-white shadow-2xl">
          <div className="flex flex-col gap-3">
            <div className="navbar-left">
              <h1
                onClick={() => (location.href = "/")}
                className="logo flex items-center text-2xl font-bold cursor-pointer"
              >
                My
                <HiOutlineShoppingCart /> Shop
              </h1>
            </div>
            <button
              onClick={() => setInfo("Dashboard")}
              className={`flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-xl transition-all duration-200 ${
                info === "Dashboard"
                  ? "bg-fuchsia-600 text-white shadow-md scale-[1.02]"
                  : "bg-gray-100 text-gray-800 hover:bg-fuchsia-100"
              }`}
            >
              <LuLayoutDashboard />
              Dashboard
            </button>
            <button
              onClick={() => setInfo("Categories")}
              className={`flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-xl transition-all duration-200 ${
                info === "Categories"
                  ? "bg-fuchsia-600 text-white shadow-md scale-[1.02]"
                  : "bg-gray-100 text-gray-800 hover:bg-fuchsia-100"
              }`}
            >
              <TbCategoryPlus />
              Categories
            </button>
            <button
              onClick={() => setInfo("Products")}
              className={`flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-xl transition-all duration-200 ${
                info === "Products"
                  ? "bg-fuchsia-600 text-white shadow-md scale-[1.02]"
                  : "bg-gray-100 text-gray-800 hover:bg-fuchsia-100"
              }`}
            >
              <AiOutlineProduct />
              Products
            </button>
            <button
              onClick={() => setInfo("Orders")}
              className={`flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-xl transition-all duration-200 ${
                info === "Orders"
                  ? "bg-fuchsia-600 text-white shadow-md scale-[1.02]"
                  : "bg-gray-100 text-gray-800 hover:bg-fuchsia-100"
              }`}
            >
              <FiUsers />
              Orders
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6">
        {info === "Categories" ? (
          <Categories />
        ) : info === "Products" ? (
          <Products />
        ) : info === "Dashboard" ? (
          <Dashboard />
        ) : info === "Orders" ? (
          <Orders />
        ) : (
          <h1 className="text-3xl font-bold text-gray-700">{info}</h1>
        )}
      </div>
    </div>
  );
}
