"use client";
import { createClient } from "@/supabase/client";
import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import { CiHeart } from "react-icons/ci";
import { MdAddShoppingCart, MdOutlineShoppingCart } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "@/app/_Components/Navbar";

interface ProductType {
  id: number;
  name: string;
  desc: string;
  price: number;
  category_id: string;
  active: boolean;
  images: string[];
}

interface CategoryType {
  id: string;
  name: string;
  active: boolean;
}

const Page = () => {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [product, setProduct] = useState<ProductType | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [cartItems, setCartItems] = useState<number[]>([]);

  const supabase = createClient();

  useEffect(() => {
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

  const fetchCategory = useCallback(async () => {
    const { data, error } = await supabase.from("Shop_Category").select("*");
    if (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik!");
    } else {
      setCategories(data);
    }
  }, [supabase]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from("Shop_Products")
          .select("*")
          .eq("id", id);

        if (error) {
          toast.error("Mahsulotni yuklashda xatolik!");
        }

        if (data && data.length > 0) {
          setProduct(data[0]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchCategory();
  }, [id, fetchCategory]);

  const category = categories.find((cat) => cat.id === product?.category_id);

  const addToCart = (product: ProductType) => {
    const existingCart = localStorage.getItem("cart");
    const cartItems: ProductType[] = existingCart
      ? JSON.parse(existingCart)
      : [];

    if (!cartItems.some((item) => item.id === product.id)) {
      const updatedCart = [...cartItems, product];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems((prev) => [...prev, product.id]);
    }
  };

  const toggleLike = (product: ProductType) => {
    setLikedProducts((prevLikes) => {
      const updatedLikes = prevLikes.includes(product.id)
        ? prevLikes.filter((id) => id !== product.id)
        : [...prevLikes, product.id];

      localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
      return updatedLikes;
    });
  };

  return (
    <div className="w-full max-w-[1520] mx-auto">
      <ToastContainer />
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Image Section */}
        <div className="flex items-start gap-3">
          <div className="flex flex-col gap-2">
            {loading
              ? Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <Skeleton
                      key={index}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                  ))
              : product?.images.map((img, index) => (
                  <Image
                    onMouseEnter={() => setImgIndex(index)}
                    key={index}
                    src={`https://tjnkjlpbumtqlylftrkn.supabase.co/storage/v1/object/public/${img}`}
                    alt={`thumb-${index}`}
                    width={80}
                    height={80}
                    className={`rounded-lg cursor-pointer border hover:border-gray-600 transition-opacity ${
                      imgIndex === index ? "opacity-100" : "opacity-50"
                    }`}
                    unoptimized
                  />
                ))}
          </div>

          <div>
            {loading ? (
              <Skeleton width={500} height={384} className="rounded-lg" />
            ) : (
              <Image
                src={`https://tjnkjlpbumtqlylftrkn.supabase.co/storage/v1/object/public/${product?.images[imgIndex]}`}
                alt={product?.name || "Mahsulot rasmi"}
                width={500}
                height={384}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
                unoptimized
              />
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          {loading ? (
            <Skeleton width={300} height={40} />
          ) : (
            <h1 className="text-4xl font-bold">{product?.name}</h1>
          )}

          {loading ? (
            <Skeleton width={150} height={30} />
          ) : (
            <p className="text-3xl font-semibold text-green-600">
              ${product?.price}
            </p>
          )}

          {loading ? (
            <Skeleton width={250} height={20} />
          ) : (
            <p className="text-gray-500 text-sm">
              <strong>Mahsulot haqida:</strong> {product?.desc}
            </p>
          )}

          <div className="flex items-center space-x-4 mt-4">
            {loading ? (
              <>
                <Skeleton width={150} height={50} />
                <Skeleton width={150} height={50} />
              </>
            ) : (
              <div className="actions">
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
                <button
                  onClick={() => toggleLike(product)}
                  className="text-gray-500"
                >
                  <CiHeart
                    className={`text-2xl ${
                      likedProducts.includes(product.id)
                        ? "text-red-500"
                        : "text-black"
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          <div>
            {loading ? (
              <Skeleton width={250} height={20} />
            ) : (
              <p className="text-gray-500 text-sm">
                <strong>Mahsulot turi:</strong> {category?.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
