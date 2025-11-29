// src/stores/useUserStore.js
import { create } from "zustand";
import axiosInstance from "../../utils/axios";

const useUserStore = create((set) => ({
  // State
  users: [], // Array of all users
  loading: false, // Indicates if an API request is in progress
  error: null, // Stores error messages

  // Fetch all users
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/users?role=userpannel");
      set({ users: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Fetch a single user by ID
  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Create a new user
  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/users", userData);
      set((state) => ({
        users: [...state.users, response.data.data],
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

  // Update a user by ID
  updateUser: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/users/${id}`, payload);
      set((state) => ({
        users: state.users.map((user) =>
          user._id === id ? response.data.data : user
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

  // Delete a user by ID
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/users/${id}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Toggle user status
  toggleStatus: async (id, newStatus) => {
    const isActive = newStatus === "active";
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/users/${id}/activate`, {
        isActive,
      });
      const updatedUser = response.data.data;
      set((state) => ({
        users: state.users.map((user) =>
          user._id === id ? updatedUser : user
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

export default useUserStore;
