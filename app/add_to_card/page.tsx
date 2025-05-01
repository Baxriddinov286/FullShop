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
    <div className=" w-full max-w-[1520px] mx-auto">
      <Navbar />
      <ToastContainer />
      <table className="table table-dark table-hover">
        <thead>
          <tr>
            <th>Img</th>
            <th>Name</th>
            <th>Price</th>
            <th>Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                {product.images && product.images.length > 0 ? (
                  <Image
                    onClick={() =>
                      (location.href = `/productsInfo/${product.id}`)
                    }
                    src={`https://tjnkjlpbumtqlylftrkn.supabase.co/storage/v1/object/public/${product.images[0]}`}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-lg cursor-pointer"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
                    Rasmlar mavjud emas
                  </div>
                )}
              </td>
              <td>
                <h2 className="text- font-semibold text-white">
                  {product.name}
                </h2>
              </td>
              <td>
                <p className="text-green-500 font-bold">
                  {product.price.toLocaleString()} so‘m
                </p>
              </td>
              <td>
                <div className="flex items-center">
                  <button
                    className="btn btn-success"
                    onClick={() => updateCount(product.id, 1)}
                  >
                    +
                  </button>
                  <h4 className="text-white mx-2">{counts[product.id] || 1}</h4>
                  <button
                    onClick={() => updateCount(product.id, -1)}
                    className="btn btn-success"
                  >
                    -
                  </button>
                </div>
              </td>
              <td>
                <button
                  className="btn btn-danger text-2xl text-white"
                  onClick={() => deleteProduct(product.id)}
                >
                  <MdDeleteOutline />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-end mt-4">
        <div className="text-black text-xl font-bold mt-4 flex gap-3 justify-end">
          <p>Jami summa:</p>
          <p>{total.toLocaleString()} so&apos;m</p>
        </div>
        <button onClick={BuyNow} className="btn btn-success w-64">
          Buy
        </button>
      </div>
    </div>
  );
}
