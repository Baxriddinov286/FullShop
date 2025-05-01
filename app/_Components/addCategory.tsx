"use client";
import React, { useEffect, useState, useCallback } from "react";
import Rodal from "rodal";
import { createClient } from "@/supabase/client";
import { MdDelete, MdEdit } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Skeleton from "react-loading-skeleton";

interface CategoryType {
  id: number;
  name: string;
  active: boolean;
}

function Categories() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [activeCategory, setActiveCategory] = useState(false);
  const [current, setCurrent] = useState<number | null>(null);
  const [openRodal, setOpenRodal] = useState(false);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchCategory = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("Shop_Category").select("*");
    if (error) {
      toast.error("Ma'lumotlarni yuklashda xatolik!");
      console.error(error);
    }
    if (data) {
      setCategories(data);
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  const handleAddCategory = async () => {
    if (categoryName.trim() === "") {
      toast.warn("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

    if (current) {
      const { error } = await supabase
        .from("Shop_Category")
        .update({
          name: categoryName,
          active: activeCategory,
        })
        .eq("id", current);

      if (error) {
        toast.error("Tahrirlashda xatolik yuz berdi!");
        console.error(error);
      } else {
        toast.success("Kategoriya muvaffaqiyatli yangilandi!");
        fetchCategory();
        setOpenRodal(false);
      }
    } else {
      const { error } = await supabase.from("Shop_Category").insert([
        {
          name: categoryName,
          active: activeCategory,
        },
      ]);

      if (error) {
        toast.error("Kategoriya qo‘shishda xatolik yuz berdi!");
        console.error(error);
      } else {
        toast.success("Kategoriya muvaffaqiyatli qo‘shildi!");
        fetchCategory();
        setOpenRodal(false);
      }
    }

    setCategoryName("");
    setActiveCategory(false);
    setCurrent(null);
  };

  const handleActive = async (id: number) => {
    const { data, error } = await supabase
      .from("Shop_Category")
      .select("active")
      .eq("id", id)
      .single();

    if (error) {
      toast.error("Holatni yangilashda xatolik!");
      console.error(error);
      return;
    }

    if (data) {
      const newStatus = !data.active;
      const { error: updateError } = await supabase
        .from("Shop_Category")
        .update({ active: newStatus })
        .eq("id", id);

      if (updateError) {
        toast.error("Holatni yangilashda xatolik yuz berdi!");
        console.error(updateError);
      } else {
        toast.success("Holat muvaffaqiyatli o'zgartirildi!");
        fetchCategory();
      }
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("Shop_Category")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Kategoriya o‘chirishda xatolik yuz berdi!");
      console.error(error);
    } else {
      toast.success("Kategoriya muvaffaqiyatli o‘chirildi!");
      fetchCategory();
    }
  };

  const handleUpdate = (item: CategoryType) => {
    setCurrent(item.id);
    setCategoryName(item.name);
    setActiveCategory(item.active);
    setOpenRodal(true);
  };

  return (
    <div className="flex">
      <div className="w-full py-10 px-10">
        <ToastContainer />
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">Categories</h1>
          <button
            onClick={() => {
              setCurrent(null);
              setCategoryName("");
              setActiveCategory(false);
              setOpenRodal(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            + Add New
          </button>
        </div>
        <table className="table table-light table-hover">
          <thead>
            <tr>
              <th>№</th>
              <th>Title</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td>
                      <Skeleton width={300} />
                    </td>
                    <td>
                      <Skeleton width={120} />
                    </td>
                    <td>
                      <Skeleton width={180} />
                    </td>
                    <td>
                      <Skeleton width={80} />
                    </td>
                    <td>
                      <Skeleton width={100} />
                    </td>
                  </tr>
                ))
              : categories.map((category, index) => (
                  <tr key={category.id}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>
                      <button
                        onClick={() => handleActive(category.id)}
                        className={`btn btn-sm ${
                          category.active ? "btn-success" : "btn-danger"
                        }`}
                      >
                        {category.active ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleUpdate(category)}
                        className="btn btn-primary mr-2"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="btn btn-danger"
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <Rodal
        height={280}
        visible={openRodal}
        onClose={() => setOpenRodal(false)}
      >
        <div className="pt-4">
          <h1 className="text-2xl font-bold mb-4 text-center">
            {current ? "Edit Category" : "Add New Category"}
          </h1>
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            type="text"
            placeholder="Category Name"
            className="form-control mb-2"
          />
          <div className="mb-2">
            <input
              className="form-check-input"
              checked={activeCategory}
              onChange={(e) => setActiveCategory(e.target.checked)}
              type="checkbox"
            />
            <label className="ml-2">Active</label>
          </div>
          <button
            onClick={handleAddCategory}
            className="btn btn-success w-full"
          >
            {current ? "Update Category" : "Add Category"}
          </button>
        </div>
      </Rodal>
    </div>
  );
}

export default Categories;
