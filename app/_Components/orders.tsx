"use client";
import { createClient } from "@/supabase/client";
import React, { useEffect, useState } from "react";

interface OrderType {
  id: string;
  username: string;
  email: string;
  phone: string;
  location: string;
  status: string;
  totalPrice: number;
  productId: string[]; // bu array ekanligiga ishonch hosil qil
}

interface ProductType {
  id: string;
  images: string[];
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [productImages, setProductImages] = useState<{ [key: string]: string }>(
    {}
  );
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: orderData, error: orderError } = await supabase
        .from("Shop_Order")
        .select("*");

      if (orderError) {
        console.error("Buyurtmalarni olishda xatolik:", orderError.message);
        return;
      }

      const ordersArray = orderData || [];
      setOrders(ordersArray);

      const allProductIds = ordersArray
        .flatMap((order) =>
          Array.isArray(order.productId) ? order.productId : []
        )
        .filter((id, index, self) => id && self.indexOf(id) === index);

      if (allProductIds.length > 0) {
        const { data: productData, error: productError } = await supabase
          .from("Shop_Products")
          .select("id, images")
          .in("id", allProductIds);

        if (productError) {
          console.error("Mahsulotlarni olishda xatolik:", productError.message);
          return;
        }

        const imageMap: { [key: string]: string } = {};
        (productData || []).forEach((product) => {
          imageMap[product.id] = product.images?.[0] || "";
        });

        setProductImages(imageMap);
      }
    };

    fetchOrders();
  }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    let newStatus = currentStatus;

    if (currentStatus === "Yig‘ilmoqda") {
      newStatus = "Yetkazilmoqda";
    } else if (currentStatus === "Yetkazilmoqda") {
      newStatus = "Olib ketishga tayyor";
    } else {
      return;
    }

    const { error } = await supabase
      .from("Shop_Order")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } else {
      console.error("Statusni yangilashda xatolik:", error.message);
    }
  };

  return (
    <div className="w-full py-10 px-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">User Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Total Price</th>
            <th className="p-2 border">Product Image</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="p-2 border">{order.username}</td>
              <td className="p-2 border">{order.email}</td>
              <td className="p-2 border">{order.phone}</td>
              <td className="p-2 border">{order.location}</td>
              <td className="p-2 border">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => toggleStatus(order.id, order.status)}
                >
                  {order.status}
                </button>
              </td>
              <td className="p-2 border">{order.totalPrice} so‘m</td>
              <td className="p-2 border">
                <div className="flex flex-wrap gap-2">
                  {order.productId.length > 0 ? (
                    order.productId.map((productId) =>
                      productImages[productId] ? (
                        <img
                          key={productId}
                          src={`https://tjnkjlpbumtqlylftrkn.supabase.co/storage/v1/object/public/${productImages[productId]}`}
                          alt="Product"
                          className="w-16 h-16 object-cover rounded"
                          onClick={() =>
                            (location.href = `/productsInfo/${productId}`)
                          }
                        />
                      ) : (
                        <span className="text-gray-400">Mahsulot yo‘q</span>
                      )
                    )
                  ) : (
                    <span className="text-gray-400">Mahsulot yo‘q</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
