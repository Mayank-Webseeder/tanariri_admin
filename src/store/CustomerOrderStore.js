// src/store/orderStore.js
import { create } from "zustand";
import axiosInstance from "../../utils/axios";

// Base URL for your API (adjust as per your backend setup)
const API_URL = "/customer-orders"; // Update with your actual API endpoint

export const useOrderStore = create((set) => ({
  // Actions
  // Create a new order
  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/createOrder`,
        orderData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error creating order");
    }
  },

  // Get all orders with optional filters
  fetchOrders: async (filters = {}) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/getAllOrders`, {
        params: filters,
      });
      console.log("order", response.data.data);
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error fetching orders");
    }
  },

  // Get a single order by ID
  fetchOrderById: async (id) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/getOrders/${id}`);
      console.log(response.data.data)
      return response.data.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error fetching order");
    }
  },

  // Update an order
  updateOrder: async (id, updateData) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/updateOrdersById/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error updating order");
    }
  },

  // Delete an order
  deleteOrder: async (id) => {
    try {
      const response = await axiosInstance.delete(`${API_URL}/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error deleting order");
    }
  },

  // Change order status and/or payment status
  changeOrderStatus: async (id, statusData) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/updateOrdersStatus/${id}/status`,
        statusData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error updating status");
    }
  },

  // Generate invoice
  generateInvoice: async (id) => {
    try {
      const response = await axiosInstance.get(
        `${API_URL}/orders/${id}/invoice`
      );
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error generating invoice"
      );
    }
  },

  // Get order summary
  fetchOrderSummary: async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/summary`);
      return response.data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching summary"
      );
    }
  },

  // Action to fetch order summary from the API
  fetchCustomerOrderSummary: async () => {
    try {
      // Calls the API endpoint handled by getAllCustomerOrdersSummary controller
      const response = await axiosInstance.get(`${API_URL}/customer`);
      // Assuming the API returns an object with the "orders" key
      const summary = response.data.orders;

      // Update the store state with the fetched order summary
      // set({ orderSummary: summary });
      return summary;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Error fetching order summary"
      );
    }
  },
}));
