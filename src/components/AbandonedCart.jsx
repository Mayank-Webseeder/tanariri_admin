import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAdminCustomerStore from "../store/useAdminCustomerStore.js";
import {
  Search,
  ChevronDown,
  Download,
  RefreshCw,
  Eye,
  Filter,
  X,
  Clock,
  Users,
  ShoppingBag,
  Home,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const AbandonedCart = () => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const { cartCustomers, fetchCartCustomers, loading } =
    useAdminCustomerStore();

  useEffect(() => {
    handleRefresh();
  }, [fetchCartCustomers]);

  const handleRefresh = async () => {
    try {
      await fetchCartCustomers();
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error fetching cart customers:", error);
      toast.error("Failed to load abandoned carts");
    }
  };

  // Filter data
  useEffect(() => {
    let filtered = cartCustomers;

    if (searchText) {
      filtered = filtered.filter((record) => {
        const fullName = `${record.customer?.firstName || ""} ${
          record.customer?.lastName || ""
        }`.toLowerCase();
        const phone = record.customer?.phone?.toString() || "";
        const email = record.customer?.email?.toLowerCase() || "";
        return (
          fullName.includes(searchText.toLowerCase()) ||
          phone.includes(searchText) ||
          email.includes(searchText.toLowerCase())
        );
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [cartCustomers, searchText]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageSizeChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const handleOpenModal = (record) => {
    setSelectedCustomer(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCustomer(null);
  };

  // Export functionality
  const handleExport = (format = "csv") => {
    const headers = ["Customer Name", "Mobile No", "Email", "Total Cart Items"];
    const exportData = filteredData.length > 0 ? filteredData : cartCustomers;
    const dataRows = exportData.map((record) => [
      `${record.customer?.firstName || "N/A"} ${
        record.customer?.lastName || ""
      }`,
      record.customer?.phone || "N/A",
      record.customer?.email || "N/A",
      record.cartItems ? record.cartItems.length : 0,
    ]);

    let content, mimeType, fileName;

    if (format === "csv") {
      content = [headers, ...dataRows]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");
      mimeType = "text/csv";
      fileName = `abandoned-carts-${
        new Date().toISOString().split("T")[0]
      }.csv`;
    } else {
      content = [headers, ...dataRows].map((row) => row.join("\t")).join("\n");
      mimeType = "text/tab-separated-values";
      fileName = `abandoned-carts-${
        new Date().toISOString().split("T")[0]
      }.xls`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchText("");
    setCurrentPage(1);
  };

  // Stats
  const totalCarts = cartCustomers.length;
  const totalItems = cartCustomers.reduce(
    (sum, record) => sum + (record.cartItems ? record.cartItems.length : 0),
    0
  );

  // Format currency
  const formatINR = (amount) => `₹${parseFloat(amount || 0).toFixed(2)}`;

  // Table columns
  const columns = [
    {
      title: "Customer Name",
      key: "customerName",
      render: (_, record) => (
        <span className="text-xs font-medium text-blue-600 hover:underline cursor-pointer">
          {record.customer?.firstName || "N/A"}{" "}
          {record.customer?.lastName || ""}
        </span>
      ),
    },
    {
      title: "Mobile No",
      key: "mobile",
      render: (_, record) => (
        <span className="text-xs">{record.customer?.phone || "N/A"}</span>
      ),
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => (
        <span className="text-xs">{record.customer?.email || "N/A"}</span>
      ),
    },
    {
      title: "Total Cart Items",
      key: "totalCartItems",
      align: "center",
      render: (_, record) => (
        <span className="text-xs font-medium">
          {record.cartItems ? record.cartItems.length : 0}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <button
          onClick={() => handleOpenModal(record)}
          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
        >
          <Eye size={12} />
        </button>
      ),
    },
  ];

  // Modal table columns
  const modalColumns = [
    {
      title: "Image",
      key: "image",
      render: (_, cartItem) => (
        <img
          src={
            cartItem.product?.images && cartItem.product.images[0]
              ? cartItem.product.images[0]
              : "/placeholder-image.jpg"
          }
          alt="product"
          className="w-12 h-12 object-cover rounded-md border border-gray-200"
        />
      ),
      width: 80,
    },
    {
      title: "Product Name",
      key: "productName",
      render: (_, cartItem) => (
        <span className="text-xs">
          {cartItem.product?.productName || "N/A"}
        </span>
      ),
    },
    {
      title: "Variant Weight",
      key: "variantWeight",
      align: "center",
      render: (_, cartItem) => {
        let weight = "N/A";
        if (cartItem.variant?.weight) {
          weight = cartItem.variant.weight;
        } else if (
          cartItem.product?.variants &&
          cartItem.product.variants.length > 0
        ) {
          weight = cartItem.product.variants[0].weight;
        }
        return <span className="text-xs">{weight}</span>;
      },
    },
    {
      title: "Variant Price",
      key: "variantPrice",
      align: "center",
      render: (_, cartItem) => {
        let price = "N/A";
        if (cartItem.variant?.price) {
          price = formatINR(cartItem.variant.price);
        } else if (
          cartItem.product?.variants &&
          cartItem.product.variants.length > 0
        ) {
          price = formatINR(cartItem.product.variants[0].price);
        } else if (cartItem.product?.price) {
          price = formatINR(cartItem.product.price);
        }
        return <span className="text-xs font-medium">{price}</span>;
      },
    },
    {
      title: "Quantity",
      key: "quantity",
      align: "center",
      render: (_, cartItem) => (
        <span className="text-xs font-medium">{cartItem.quantity || 0}</span>
      ),
    },
  ];

  // Modal data
  const modalData =
    selectedCustomer && selectedCustomer.cartItems
      ? selectedCustomer.cartItems.map((item, index) => ({
          key: item._id || index,
          product: item.product || {},
          variant: item.variant || {},
          quantity: item.quantity || 0,
        }))
      : [];

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filtered = cartCustomers.filter((record) => {
      const fullName = `${record.customer?.firstName || ""} ${
        record.customer?.lastName || ""
      }`.toLowerCase();
      const phone = record.customer?.phone?.toString() || "";
      const email = record.customer?.email?.toLowerCase() || "";
      return (
        fullName.includes(value.toLowerCase()) ||
        phone.includes(value) ||
        email.includes(value.toLowerCase())
      );
    });
    setFilteredData(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Header */}
        <div className="flex justify-end items-center mb-0 py-2">
          <div className="flex items-center gap-2">
            {/* <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button> */}
            {/* <div className="relative group">
              <button className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={14} />
                Export
                <ChevronDown size={14} />
              </button>
              <div className="absolute right-0 top-full mt-1 text-xs bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-1">
                  <button
                    onClick={() => handleExport("csv")}
                    className="block w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <Download size={12} />
                    Export
                  </button>
                  <button
                    onClick={() => handleExport("excel")}
                    className="block w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                  >
                    <Download size={12} />
                    Export Excel
                  </button>
                </div>
              </div>
            </div> */}
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1 px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Abandoned Carts
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalCarts.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Items
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalItems.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <ShoppingBag className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Avg Items per Cart
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {(totalItems / (totalCarts || 1)).toFixed(1)}
                </p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Recovery Potential
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {formatINR(totalItems * 500)} {/* Assume avg value */}
                </p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs font-sans"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600 font-sans">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs font-sans"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-xs text-gray-600 font-sans">entries</span>
              </div>
            </div>
            {/* <div className="flex items-center justify-between text-xs text-gray-500">
              <div>
                Showing {filteredData.length} of {cartCustomers.length}{" "}
                abandoned carts{searchText && ` matching "${searchText}"`}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} />
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div> */}
          </div>
        </div>

        {/* Abandoned Carts Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider font-sans"
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedData.map((record) => (
                  <tr
                    key={record._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-4">
                      <span className="text-xs font-medium text-gray-900">
                        {record.customer?.firstName || "N/A"}{" "}
                        {record.customer?.lastName || ""}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-xs text-gray-900">
                        {record.customer?.phone || "N/A"}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-xs text-gray-900">
                        {record.customer?.email || "N/A"}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-xs font-medium text-gray-900">
                        {record.cartItems ? record.cartItems.length : 0}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleOpenModal(record)}
                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                        <span className="text-xs font-sans">
                          No abandoned carts found
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-xs text-gray-700 font-sans">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} results
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                >
                  Previous
                </button>
                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 text-xs rounded font-sans ${
                      currentPage === page
                        ? "bg-[#293a90] text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal for displaying cart items */}
        {isModalVisible && selectedCustomer && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 font-sans">
                  Cart Items for {selectedCustomer.customer?.firstName || "N/A"}{" "}
                  {selectedCustomer.customer?.lastName || ""}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <div className="overflow-x-auto p-4">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {modalColumns.map((col) => (
                        <th
                          key={col.key}
                          className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider font-sans"
                        >
                          {col.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {modalData.map((cartItem) => (
                      <tr
                        key={cartItem.key}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2 px-4">
                          <img
                            src={
                              cartItem.product?.images &&
                              cartItem.product.images[0]
                                ? cartItem.product.images[0]
                                : "/placeholder-image.jpg"
                            }
                            alt="product"
                            className="w-12 h-12 object-cover rounded-md border border-gray-200"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <span className="text-xs font-sans">
                            {cartItem.product?.productName || "N/A"}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <span className="text-xs font-sans">
                            {cartItem.variant?.weight ||
                              (cartItem.product?.variants?.length > 0
                                ? cartItem.product.variants[0].weight
                                : "N/A")}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <span className="text-xs font-medium font-sans">
                            {cartItem.variant?.price
                              ? formatINR(cartItem.variant.price)
                              : cartItem.product?.variants?.length > 0
                              ? formatINR(cartItem.product.variants[0].price)
                              : cartItem.product?.price
                              ? formatINR(cartItem.product.price)
                              : "N/A"}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-center">
                          <span className="text-xs font-medium font-sans">
                            {cartItem.quantity || 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {modalData.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                            <span className="text-xs font-sans">
                              No cart items
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbandonedCart;
