"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../_Components/Navbar";

interface ProductType {
  id: string;
  name: string;
  price: number;
  images: string[];
  count: number;
}

export default function Buy() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [userOrder, setUserOrder] = useState({
    firstName: "",
    lastName: "",
    address: "",
    email: "",
    phone: "",
  });

  const supabase = createClient();

  useEffect(() => {
    const storedOrder = localStorage.getItem("order");
    if (storedOrder) {
      const parsedOrder = JSON.parse(storedOrder);
      setProducts(parsedOrder?.products || []);
      setTotal(parsedOrder?.total || 0);
    }
  }, []);

  const handlePlaceOrder = async () => {
    try {
      const { firstName, lastName, address, email, phone } = userOrder;
      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !address.trim() ||
        !email.trim() ||
        !phone.trim()
      ) {
        return toast.error("Iltimos, barcha maydonlarni to‘ldiring!");
      }

      const productIds = products.map((p) => p.id); // <--- mahsulot IDlar ro‘yxati

      const { data: order, error } = await supabase
        .from("Shop_Order")
        .insert({
          username: `${firstName} ${lastName}`,
          createdAt: new Date(),
          status: "Yig‘ilmoqda",
          totalPrice: total,
          location: address,
          phone,
          email,
          productId: productIds, // <--- IDlar array sifatida yuboriladi
        })
        .select("id")
        .single();

      if (error) throw error;

      toast.success("Buyurtma muvaffaqiyatli jo‘natildi!");
      localStorage.removeItem("order");
      localStorage.setItem(
        "GettedProduct",
        JSON.stringify({
          username: `${firstName} ${lastName}`,
          email,
        })
      );
      setTimeout(() => (location.href = "/"), 1500);
    } catch (error: any) {
      toast.error("Xatolik yuz berdi: " + error.message);
    }
  };

  return (
    <div className="w-full max-w-[1520px] mx-auto">
      <Navbar />
      <ToastContainer />
      <div className="mt-6 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-bold mb-4">To‘lov manzili</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm">
              Ism*
              <input
                value={userOrder.firstName}
                onChange={(e) =>
                  setUserOrder({ ...userOrder, firstName: e.target.value })
                }
                type="text"
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
              />
            </label>
            <label className="text-sm">
              Familiya*
              <input
                value={userOrder.lastName}
                onChange={(e) =>
                  setUserOrder({ ...userOrder, lastName: e.target.value })
                }
                type="text"
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
              />
            </label>
            <label className="text-sm md:col-span-2">
              Ko‘cha manzili*
              <input
                value={userOrder.address}
                onChange={(e) =>
                  setUserOrder({ ...userOrder, address: e.target.value })
                }
                type="text"
                placeholder="Uy raqami va ko‘cha nomi"
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
              />
            </label>
            <label className="text-sm">
              Email manzil*
              <input
                value={userOrder.email}
                onChange={(e) =>
                  setUserOrder({ ...userOrder, email: e.target.value })
                }
                type="email"
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
              />
            </label>
            <label className="text-sm">
              Telefon raqami*
              <input
                value={userOrder.phone}
                onChange={(e) =>
                  setUserOrder({ ...userOrder, phone: e.target.value })
                }
                type="tel"
                className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
              />
            </label>
          </div>
        </div>

        <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <Image
                src={`https://tjnkjlpbumtqlylftrkn.supabase.co/storage/v1/object/public/${product.images[0]}`}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-44 object-cover rounded mb-3"
              />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-green-600 font-bold">{product.price} so‘m</p>
              <p className="text-gray-500">Soni: {product.count} dona</p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full text-center mt-10">
        <h3 className="text-xl font-bold mb-3">Jami: {total} so‘m</h3>
        <button
          onClick={handlePlaceOrder}
          className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-6 rounded font-semibold"
        >
          Buyurtma berish
        </button>
      </div>
    </div>
  );
}
