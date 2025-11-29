import { create } from "zustand";
import axiosInstance from "../../utils/axios";

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  // Fetch all categories
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get(`/categories/getallcategories`);
      const categories = res.data?.data || [];
      // console.log("Store - API Response:", res.data);
      // console.log("Store - Categories extracted:", categories);
      set({ categories, loading: false });
      return categories;
    } catch (error) {
      const msg = error.response?.data?.message || "Error fetching categories";
      set({ error: msg, loading: false, categories: [] });
      throw error;
    }
  },

  // Fetch single category - CORRECTED
  fetchCategoryById: async (id) => {
    try {
      const res = await axiosInstance.get(`/categories/getcategory/${id}`);
      return res.data?.data;
    } catch (error) {
      throw error.response?.data?.message || "Error fetching category";
    }
  },

  // Create category
  createCategory: async (payload) => {
    try {
      const res = await axiosInstance.post(
        `/categories/createcategory`,
        payload
      );
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Error creating category";
    }
  },

  // Update category
  updateCategory: async (id, payload) => {
    try {
      const res = await axiosInstance.put(
        `/categories/updatecategory/${id}`,
        payload
      );
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Error updating category";
    }
  },

  // Delete category
  deleteCategory: async (id) => {
    try {
      await axiosInstance.delete(`/categories/deletecategory/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data?.message || "Error deleting category";
    }
  },
}));
