import { create } from "zustand";
import axiosInstance from "../../utils/axios";

const API_URL = "/inquiries";

const useInquiryStore = create((set) => ({
  inquiries: [],
  currentInquiry: null,
  loading: false,
  error: null,

  // Fetch all inquiries
  fetchAllInquiries: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`${API_URL}/getallinquiries`);
      set({ inquiries: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      throw error;
    }
  },

  // Create a new inquiry
  createInquiry: async (inquiryData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `${API_URL}/createinquiry`,
        inquiryData
      );
      // Optionally, add the new inquiry to the store's inquiries array
      set((state) => ({
        inquiries: [...state.inquiries, response.data],
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

export default useInquiryStore;
