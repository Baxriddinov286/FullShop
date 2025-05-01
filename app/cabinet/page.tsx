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

        // Buyurtmalarni email orqali olish
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

          // Agar productId massiv bo'lsa, so'rov yuborish
          const { data: products, error: productError } = await supabase
            .from("Shop_Product")
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

  return (
    <div className="w-full max-w-[1520px] mx-auto">
      <Navbar />
    </div>
  );
}
