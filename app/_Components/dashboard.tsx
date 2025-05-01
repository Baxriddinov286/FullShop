"use client";
import { createClient } from "@/supabase/client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

export default function Dashboard() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
    fetchCategory();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("Shop_Products").select("*");
    if (error) {
      toast.error("Mahsulotlarni yuklashda xatolik!");
      console.error(error);
    } else {
      setProducts(data);
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    const { data, error } = await supabase.from("Shop_Category").select("*");
    if (error) {
      toast.error("Kategoriyalarni yuklashda xatolik!");
      console.error(error);
    } else {
      setCategories(data);
    }
  };

  return (
    <div className="w-full py-10 px-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-2/3 mb-2"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          <div className="bg-white shadow-lg p-8 rounded-xl text-center transform hover:scale-105 transition-all">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Mahsulotlar soni:
            </h2>
            <p className="text-lg font-bold text-indigo-600">
              {products.length} mahsulot mavjud
            </p>
          </div>

          <div className="bg-white shadow-lg p-8 rounded-xl text-center transform hover:scale-105 transition-all">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Kategoriyalar soni:
            </h2>
            <p className="text-lg font-bold text-indigo-600">
              {categories.length} kategoriya mavjud
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
