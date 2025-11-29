import { create } from "zustand";
import axiosInstance from "../../utils/axios";

// Base URL for the admin API endpoints
const ADMIN_API_BASE = "/admin";

const useAdminCustomerStore = create((set) => ({
  // State
  allCustomers: [],
  wishlistCustomers: [],
  cartCustomers: [],
  loading: false,
  error: null,

  // --- Fetch All Customers with either Wishlist or Cart items ---
  fetchAllCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`${ADMIN_API_BASE}/customers`);
      set({ allCustomers: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error fetching customers",
        loading: false,
      });
      throw error;
    }
  },

  // --- Fetch Customers with Wishlist Items ---
  fetchWishlistCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `${ADMIN_API_BASE}/customers/wishlist`
      );
      set({ wishlistCustomers: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error fetching wishlist customers",
        loading: false,
      });
      throw error;
    }
  },

  // --- Fetch Customers with Cart Items ---
  fetchCartCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `${ADMIN_API_BASE}/customers/cart`
      );
      set({ cartCustomers: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          error.message ||
          "Error fetching cart customers",
        loading: false,
      });
      throw error;
    }
  },
}));

export default useAdminCustomerStore;
