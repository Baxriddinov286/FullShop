import React from "react";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { HiOutlineShoppingCart } from "react-icons/hi";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar w-full mx-auto p-4 flex justify-between items-center bg-white shadow">
        <div className="navbar-left">
          <h1
            onClick={() => (location.href = "/")}
            className="cursor-pointer logo flex items-center text-2xl font-bold"
          >
            My
            <HiOutlineShoppingCart /> Shop
          </h1>
        </div>

        <div className="actions flex gap-3">
          <button
            onClick={() => (location.href = "/cabinet")}
            className="icon-btn text-xl"
          >
            <FaRegUser />
          </button>

          <button
            onClick={() => (location.href = "/likes")}
            className="icon-btn text-xl"
          >
            <FaRegHeart /> Saralangan
          </button>
          <button
            onClick={() => (location.href = "/add_to_card")}
            className="icon-btn text-xl"
          >
            <GiShoppingCart /> Savat
          </button>
        </div>
      </nav>
    </div>
  );
}
