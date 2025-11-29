import { create } from "zustand";
import axiosInstance from "../../utils/axios";

const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  // Fetch products
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/products/getallproducts");
      set({ products: response.data.data.products, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Fetch single
  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/products/getproductbyid/${id}`
      );
      set({ loading: false });
      return response.data.data; // <-- data contains the product directly
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Create product
  createProduct: async (productData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        "/products/createproduct",
        productData
      );
      set((state) => ({
        products: [...state.products, response.data.product],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Update product
  updateProduct: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(
        `/products/updateproduct/${id}`,
        payload
      );
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? response.data.updatedProduct : product
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.delete(
        `/products/deleteproduct/${id}`
      );
      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Toggle status
  toggleStatus: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `/products/togglestatus/${id}`
      );
      const updatedProduct = response.data.product;
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? updatedProduct : product
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Toggle bestseller
  toggleBestSeller: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `/products/togglebestseller/${id}`
      );
      const updatedProduct = response.data.product;
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? updatedProduct : product
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Toggle hidden
  toggleHideProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/products/togglehide/${id}`);
      const updatedProduct = response.data.product;
      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? updatedProduct : product
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },
}));

export default useProductStore;
