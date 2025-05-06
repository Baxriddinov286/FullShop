"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Navbar from "../_Components/Navbar";
import { CiHeart } from "react-icons/ci";
import { MdAddShoppingCart, MdOutlineShoppingCart } from "react-icons/md";

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
  const [likedProducts, setLikedProducts] = useState<ProductType[]>([]);
  const [cartItems, setCartItems] = useState<ProductType[]>([]);

  useEffect(() => {
    const liked = localStorage.getItem("likedProducts");
    if (liked) {
      setLikedProducts(JSON.parse(liked));
    }
  }, []);

  const isLiked = (id: string) => likedProducts.some((p) => p.id === id);

  const addToCart = (product: ProductType) => {
    const isInCart = cartItems.some((item) => item.id === product.id);
    if (isInCart) {
      toast.info("Bu mahsulot allaqachon savatchada!");
      return;
    }

    const updatedCart = [...cartItems, product];
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Mahsulot savatchaga qo'shildi!");
  };

  const toggleLike = (product: ProductType) => {
    let updatedLikes: ProductType[];

    if (isLiked(product.id)) {
      updatedLikes = likedProducts.filter((p) => p.id !== product.id);
    } else {
      updatedLikes = [...likedProducts, product];
    }

    setLikedProducts(updatedLikes);
    localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
  };

  return (
    <div className="max-w-[1520px] w-full px-2 sm:px-6 mx-auto">
      <Navbar />
      {likedProducts.length === 0 ? (
        <div className="w-full mt-6 text-center">
          <p className="text-lg text-gray-600 mb-6">Sevimli mahsulotlar yo‘q</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="border p-4 rounded shadow-sm">
                <div className="w-full h-48 bg-gray-200 animate-pulse mb-4 rounded-lg"></div>
                <div className="w-4/5 h-5 bg-gray-200 animate-pulse mb-2 rounded"></div>
                <div className="w-3/5 h-5 bg-gray-200 animate-pulse mb-4 rounded"></div>
                <div className="flex justify-end items-center mt-4 gap-3">
                  <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                  <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {likedProducts.map((product) => (
            <div
              key={product.id}
              className="cursor-pointer border p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              <Image
                onClick={() => (location.href = `/productsInfo/${product.id}`)}
                src={`https://tjnkjlpbumtqlylftrkn.supabase.co/storage/v1/object/public/${product.images[0]}`}
                alt={product.name}
                width={300}
                height={200}
                className="w-full aspect-[4/3] object-cover rounded-lg mb-4"
              />
              <h2 className="text-base md:text-lg font-semibold text-gray-800">
                {product.name}
              </h2>
              <p className="text-green-500 font-bold text-sm md:text-base">
                {product.price} so'm
              </p>
              <div className="flex justify-end items-center mt-4 gap-4">
                <button
                  onClick={() => toggleLike(product)}
                  className="text-gray-500"
                >
                  <CiHeart
                    className={`text-2xl ${
                      isLiked(product.id) ? "text-red-500" : "text-black"
                    }`}
                  />
                </button>
                <button onClick={() => addToCart(product)}>
                  {cartItems.some((item) => item.id === product.id) ? (
                    <MdAddShoppingCart className="text-2xl text-green-500" />
                  ) : (
                    <MdOutlineShoppingCart className="text-2xl text-black hover:text-green-500" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
