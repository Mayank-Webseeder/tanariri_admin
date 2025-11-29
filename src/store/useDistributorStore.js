import { create } from "zustand";
import axiosInstance from "../../utils/axios";

const API_URL = "/distributors";

const useDistributorStore = create((set) => ({
  // State
  distributors: [],
  currentDistributor: null,
  loading: false,
  error: null,

  // Fetch all distributors
  fetchDistributors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`${API_URL}/getAlldistributors`);
      set({ distributors: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Fetch a single distributor by ID
  fetchDistributorById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `${API_URL}/getdistributorById/${id}`
      );
      set({ currentDistributor: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Create a new distributor
  createDistributor: async (distributorData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `${API_URL}/createdistributor`,
        distributorData
      );
      // Optionally add the new distributor to the store's list
      set((state) => ({
        distributors: [...state.distributors, response.data],
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

export default useDistributorStore;
