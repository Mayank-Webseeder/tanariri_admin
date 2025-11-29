import { create } from "zustand";
import axiosInstance from "../../utils/axios";

const useAdminStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  // Initialize user from localStorage on store creation
  initializeAuth: () => {
    const storedUser = localStorage.getItem("adminUser");
    const storedToken = localStorage.getItem("adminToken");

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser);
        set({ user }); //  Set user in state
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
      }
    }
  },

  checkAuth: async () => {
    set({ loading: true, error: null });
    try {
      const storedUser = localStorage.getItem("adminUser");
      const storedToken = localStorage.getItem("adminToken");

      if (!storedUser || !storedToken) {
        set({ user: null, loading: false });
        return null;
      }

      const user = JSON.parse(storedUser);
      set({ user, loading: false }); //  Set user in state
      return user;
    } catch (error) {
      console.error("Auth check error:", error);
      set({ error: error.message, loading: false, user: null });
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
      throw error;
    }
  },

  //  MAIN FIX: Login function ab user ko state mein set karega
  loginAdmin: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/login", userData);

      console.log("API Response:", response.data); // Debug

      //  Extract user and token from response
      const { user, token } = response.data.data;

      // Store token and user data in localStorage
      if (token) {
        localStorage.setItem("adminToken", token);
      }
      if (user) {
        localStorage.setItem("adminUser", JSON.stringify(user));
        //  IMPORTANT: Set user in Zustand state
        set({ user, loading: false });
      }

      return response.data; // Return full response
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Send OTP
  sendOtp: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/admin/send-otp", userData);
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.error("Backend Error:", error.response?.data);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Verify OTP
  verifyOtp: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.post("/admin/verify-otp", userData);
      set({ loading: false });
      return res.data;
    } catch (error) {
      console.error("Backend Error:", error.response?.data);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update a user by ID
  updateUser: async (updatedUser, id) => {
    console.log(updatedUser, id);
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(
        `/AddUserRoute/updateUser/${id}`,
        updatedUser
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Admin logout
  adminLogout: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/admin/logout");
      // Clear localStorage on logout
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
      set({ user: null, loading: false });
      return response.data;
    } catch (error) {
      console.error("Backend Error:", error.response?.data);
      set({ error: error.message, loading: false });
      // Clear localStorage even if logout fails
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminToken");
      set({ user: null });
      throw error;
    }
  },

  // Clear authentication data
  clearAuth: () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    set({ user: null, loading: false, error: null });
  },
}));

export default useAdminStore;
