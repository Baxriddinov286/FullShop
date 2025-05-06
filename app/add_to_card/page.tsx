"use client";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { MdDeleteOutline } from "react-icons/md";
import Image from "next/image";
import Navbar from "./../_Components/Navbar";

interface ProductType {
  id: string;
  name: string;
  desc: string;
  price: number;
  category_id: string;
  active: boolean;
  images: string[];
}

export default function Page() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [counts, setCounts] = useState<{ [key: string]: number }>({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const ticketData = localStorage.getItem("cart");
    if (ticketData) {
      const parsedProducts: ProductType[] = JSON.parse(ticketData);
      setProducts(parsedProducts);

      const initialCounts: { [key: string]: number } = {};
      parsedProducts.forEach((product) => {
        initialCounts[product.id] = 1;
      });
      setCounts(initialCounts);
    }
  }, []);

  useEffect(() => {
    const totalPrice = products.reduce(
      (sum, product) => sum + product.price * (counts[product.id] || 1),
      0
    );
    setTotal(totalPrice);
  }, [counts, products]);

  const updateCount = (id: string, amount: number) => {
    setCounts((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + amount),
    }));
  };

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
    toast.success("Mahsulot o‘chirildi!");
  };

  const BuyNow = () => {
    const orderData = {
      products: products.map((product) => ({
        ...product,
        count: counts[product.id] || 1,
      })),
      total,
    };
    localStorage.setItem("order", JSON.stringify(orderData));
    location.href = "/buy";
  };

  return (
    <div className="w-full max-w-[1520px] mx-auto px-2">
      <Navbar />
      <ToastContainer />

      <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded-lg shadow-md bg-white flex flex-col justify-between"
          >
            <Image
              onClick={() => (location.href = `/productsInfo/${product.id}`)}
              src={`https://tjnkjlpbumtqlylftrkn.supabase.co/storage/v1/object/public/${product.images[0]}`}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-lg mb-3 cursor-pointer"
            />
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              {product.name}
            </h2>
            <p className="text-green-600 font-bold mb-2">
              {product.price.toLocaleString()} so‘m
            </p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCount(product.id, -1)}
                  className="px-2 py-1 bg-gray-200 text-black rounded"
                >
                  -
                </button>
                <span className="text-black">{counts[product.id] || 1}</span>
                <button
                  onClick={() => updateCount(product.id, 1)}
                  className="px-2 py-1 bg-gray-200 text-black rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => deleteProduct(product.id)}
                className="text-red-600 text-xl btn btn-danger"
              >
                <MdDeleteOutline />
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length > 0 && (
        <div className="flex flex-col items-end mt-6 gap-4">
          <p className="text-xl font-bold text-black">
            Jami summa: {total.toLocaleString()} so‘m
          </p>
          <button onClick={BuyNow} className="btn btn-success w-64">
            Buy
          </button>
        </div>
      )}
    </div>
  );
}
