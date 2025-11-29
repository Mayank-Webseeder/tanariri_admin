import { create } from "zustand";
import axiosInstance from "../../utils/axios";

const useCustomerStore = create((set) => ({
  // State
  customers: [],
  currentCustomer: null,
  loading: false,
  error: null,

  // Fetch all customers
  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/customers/getAllCustomer");
      set({ customers: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Fetch a single customer by ID
  fetchCustomerById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/customers/getById/${id}`);
      set({ currentCustomer: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Create a new customer
  createCustomer: async (customerData) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        "/customers/create",
        customerData
      );
      set((state) => ({
        customers: [...state.customers, response.data.customer],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Update a customer by ID
  updateCustomer: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      console.log(updatedData);
      const response = await axiosInstance.put(
        `/customers/update/${id}`,
        updatedData
      );
      set((state) => ({
        customers: state.customers.map((customer) =>
          customer._id === id ? response.data.customer : customer
        ),
        currentCustomer:
          state.currentCustomer?._id === id
            ? response.data.customer
            : state.currentCustomer,
        loading: false,
      }));
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // Delete a customer by ID
  deleteCustomer: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/customers/delete/${id}`);
      set((state) => ({
        customers: state.customers.filter((customer) => customer._id !== id),
        currentCustomer:
          state.currentCustomer?._id === id ? null : state.currentCustomer,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
}));

export default useCustomerStore;
