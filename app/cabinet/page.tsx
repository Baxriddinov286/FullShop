"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../_Components/Navbar";
import { createClient } from "@/supabase/client";
import Image from "next/image";

interface ProductType {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface OrderType {
  id: string;
  productId: string[];
  email: string;
  phone: string;
  totalPrice: number;
  status: string;
}

export default function Cabinet() {
  const [userProducts, setUserProducts] = useState<ProductType[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderType | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUserOrderData = async () => {
      const storedProductData = localStorage.getItem("GettedProduct");
      if (storedProductData) {
        const parsedData = JSON.parse(storedProductData);
        const { email } = parsedData;

        const { data: orders, error: orderError } = await supabase
          .from("Shop_Order")
          .select("*")
          .eq("email", email);

        if (orderError) {
          console.error("Buyurtmalarni olishda xatolik:", orderError.message);
          return;
        }

        if (orders && orders.length > 0) {
          const order = orders[0];
          setOrderDetails(order);

          const { data: products, error: productError } = await supabase
            .from("Shop_Products")
            .select("*")
            .in("id", order.productId);

          if (productError) {
            console.error(
              "Mahsulotlarni olishda xatolik:",
              productError.message
            );
            return;
          }

          if (products) {
            setUserProducts(products);
          }
        }
      }
    };

    getUserOrderData();
  }, []);

  const handleAcceptOrder = async () => {
    localStorage.removeItem("GettedProduct");

    if (orderDetails) {
      const { id } = orderDetails;

      const { error } = await supabase
        .from("Shop_Order")
        .update({ status: "Mahsulot topshirildi" })
        .eq("id", id);

      if (error) {
        console.error("Statusni yangilashda xatolik:", error.message);
        return;
      }

      setOrderDetails({ ...orderDetails, status: "Mahsulot topshirildi" });
    }
  };

  return (
    <div className="w-full max-w-[1520px] mx-auto px-4">
      <Navbar />
      <div className="w-full mt-6">
        {orderDetails ? (
          <div>
            <div className="mb-6 p-4 border rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">
                Buyurtmachi ma'lumotlari:
              </h3>
              <p className="text-gray-600 break-words">
                Email: {orderDetails.email}
              </p>
              <p className="text-gray-600 break-words">
                Telefon: {orderDetails.phone}
              </p>
              <p className="text-green-500 font-bold">
                Umumiy narx: {orderDetails.totalPrice} so‘m
              </p>
              <p className="text-green-500 font-bold">
                Buyurtma holati: {orderDetails.status}
              </p>
              <button
                onClick={handleAcceptOrder}
                className="mt-4 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
              >
                Mahsulotni qabul qilish
              </button>
            </div>

            {userProducts.length > 0 ? (
              <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {userProducts.map((product) => (
                  <div
                    key={product.id}
                    className="cursor-pointer border p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Image
                      onClick={() =>
                        (location.href = `/productsInfo/${product.id}`)
                      }
                      src={`https://tjnkjlpbumtqlylftrkn.supabase.co/storage/v1/object/public/${product.images[0]}`}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h2 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h2>
                    <p className="text-green-500 font-bold">
                      {product.price} so‘m
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-lg text-gray-600 mt-8">
                Mahsulot yo‘q
              </p>
            )}
          </div>
        ) : (
          <div className="w-full mt-6">
            <p className="text-center text-lg text-gray-600 mt-8">
              Mahsulot yo‘q
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
