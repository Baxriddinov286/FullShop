"use client";
import { createClient } from "@/supabase/client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { GiShoppingCart } from "react-icons/gi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { MdAddShoppingCart, MdOutlineShoppingCart } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";

interface CategoryType {
  id: string;
  name: string;
  desc: string;
  active: boolean;
}

interface ProductType {
  id: number;
  name: string;
  desc: string;
  price: number;
  category_id: string;
  active: boolean;
  images: string[];
}

export default function Home() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [countProduct, setCountProduct] = useState(15);
  const [likedProducts, setLikedProducts] = useState<ProductType[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);

  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
    fetchCategory();

    const storedLikes = localStorage.getItem("likedProducts");
    if (storedLikes) {
      setLikedProducts(JSON.parse(storedLikes));
    }

    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart: ProductType[] = JSON.parse(storedCart);
      setCartItems(parsedCart.map((item) => item.id));
    }
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Shop_Products")
      .select("*")
      .limit(countProduct);
    if (error) {
      console.error(error);
    } else {
      setProducts(data);
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    const { data, error } = await supabase.from("Shop_Category").select("*");
    if (error) {
      console.error(error);
    } else {
      setCategories(data);
    }
  };

  const toggleLike = (product: ProductType) => {
    setLikedProducts((prevLikes) => {
      let updatedLikes: ProductType[];
      if (prevLikes.some((p) => p.id === product.id)) {
        updatedLikes = prevLikes.filter((p) => p.id !== product.id);
      } else {
        updatedLikes = [...prevLikes, product];
      }

      localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
      return updatedLikes;
    });
  };

  const addToCart = (product: ProductType) => {
    const existingCart = localStorage.getItem("cart");
    const cartItemsArray: ProductType[] = existingCart
      ? JSON.parse(existingCart)
      : [];

    if (!cartItemsArray.some((item) => item.id === product.id)) {
      cartItemsArray.push(product);
      localStorage.setItem("cart", JSON.stringify(cartItemsArray));
      setCartItems((prev) => [...prev, product.id]);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = categoryId
      ? product.category_id === categoryId
      : true;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <nav className="navbar w-full mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center bg-white shadow gap-4 md:gap-0">
        <div className="navbar-left">
          <h1
            onClick={() => (location.href = "/")}
            className="cursor-pointer logo flex items-center text-2xl font-bold gap-1"
          >
            My <HiOutlineShoppingCart /> Shop
          </h1>
        </div>

        <div className="navbar-center flex flex-col sm:flex-row items-center gap-2">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto"
          >
            <option value="">Barcha Kategoriyalar</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="search-box flex w-full sm:w-auto items-center">
            <input
              type="search"
              placeholder="Qidiruv..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded border w-full sm:w-64"
            />
            <button className="ml-2 px-3 py-2 bg-blue-500 text-white rounded">
              🔍
            </button>
          </div>
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

      <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
        {loading
          ? [...Array(10)].map((_, index) => (
              <div key={index} className="border p-4 rounded shadow-sm">
                <div className="w-full h-48 bg-gray-200 animate-pulse mb-4 rounded-lg"></div>
                <div className="w-4/5 h-5 bg-gray-200 animate-pulse mb-2 rounded"></div>
                <div className="w-3/5 h-5 bg-gray-200 animate-pulse mb-4 rounded"></div>
              </div>
            ))
          : filteredProducts.map((product) => (
              <div
                key={product.id}
                className="cursor-pointer border p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col justify-between"
              >
                <div>
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
                  <h5 className="text-sm font-semibold text-gray-800">
                    {product.name}
                  </h5>
                </div>
                <p className="text-green-500 font-bold">{product.price} so‘m</p>
                <div className="flex justify-end items-center mt-4 gap-4">
                  <button
                    onClick={() => toggleLike(product)}
                    className="text-gray-500"
                  >
                    <CiHeart
                      className={`text-2xl ${
                        likedProducts.some((p) => p.id === product.id)
                          ? "text-red-500"
                          : "text-black"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="text-gray-500 hover:text-green-500 text-xl"
                  >
                    {cartItems.includes(product.id) ? (
                      <MdAddShoppingCart className="text-2xl" />
                    ) : (
                      <MdOutlineShoppingCart className="text-2xl" />
                    )}
                  </button>
                </div>
              </div>
            ))}
      </div>

      <div className="flex justify-center mt-6 mb-8">
        <button
          onClick={() => {
            setCountProduct(countProduct + 15);
            fetchProducts();
          }}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded w-52"
        >
          Yana Ko‘rsatish
        </button>
      </div>
    </div>
  );
}
