import React from "react";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { HiOutlineShoppingCart } from "react-icons/hi";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar w-full mx-auto p-4 flex flex-col sm:flex-row sm:justify-between items-center bg-white shadow gap-4 sm:gap-0">
        <div className="navbar-left">
          <h1
            onClick={() => (location.href = "/")}
            className="cursor-pointer logo flex items-center text-2xl font-bold"
          >
            My <HiOutlineShoppingCart className="mx-1" /> Shop
          </h1>
        </div>

        <div className="actions flex flex-wrap justify-center sm:justify-end gap-3">
          <button
            onClick={() => (location.href = "/cabinet")}
            className="icon-btn text-xl flex items-center gap-1"
          >
            <FaRegUser />
            <span className="hidden sm:inline">Kabinet</span>
          </button>

          <button
            onClick={() => (location.href = "/likes")}
            className="icon-btn text-xl flex items-center gap-1"
          >
            <FaRegHeart />
            <span className="hidden sm:inline">Saralangan</span>
          </button>

          <button
            onClick={() => (location.href = "/add_to_card")}
            className="icon-btn text-xl flex items-center gap-1"
          >
            <GiShoppingCart />
            <span className="hidden sm:inline">Savat</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
