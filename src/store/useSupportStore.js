// src/stores/useSupportStore.js
import { create } from "zustand";
import axiosInstance from "../../utils/axios";

const useSupportStore = create((set, get) => ({
  // State
  supports: [], 
  loading: false, 
  error: null, 

  // Fetch all support tickets
  fetchSupports: async (status = null) => {
    set({ loading: true, error: null });
    try {
      let url = "/support";
      if (status) {
        url += `?status=${status}`;
      }
      const response = await axiosInstance.get(url);
      set({ supports: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Fetch a single support ticket by ID
  fetchSupportById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/support/${id}`);
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

  // Update a support ticket by ID
  updateSupport: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/support/${id}`, payload);
      set((state) => ({
        supports: state.supports.map((support) =>
          support._id === id ? response.data.data : support
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

  // Change support ticket status
  changeStatus: async (id, newStatus) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.patch(`/support/${id}/status`, {
        status: newStatus,
      });
      const updatedSupport = response.data.data;
      set((state) => ({
        supports: state.supports.map((support) =>
          support._id === id ? updatedSupport : support
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

  // Delete a support ticket by ID
  deleteSupport: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/support/${id}`);
      set((state) => ({
        supports: state.supports.filter((support) => support._id !== id),
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
}));

export default useSupportStore;
