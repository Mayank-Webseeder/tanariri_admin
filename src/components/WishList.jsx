import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAdminCustomerStore from "../store/useAdminCustomerStore.js";
import { toast } from "react-toastify";
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
  CheckCircle,
  Heart,
} from "lucide-react";

const Wishlist = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const { wishlistCustomers, fetchWishlistCustomers, loading } =
    useAdminCustomerStore();

  useEffect(() => {
    handleRefresh();
  }, [fetchWishlistCustomers]);

  const handleRefresh = async () => {
    try {
      await fetchWishlistCustomers();
    } catch (error) {
      console.error("Error fetching wishlist customers:", error);
    }
    setLastRefresh(new Date());
  };

  // Filter data
  useEffect(() => {
    let filtered = wishlistCustomers;

    if (searchQuery) {
      filtered = filtered.filter((record) => {
        const fullName =
          `${record.customer.firstName} ${record.customer.lastName}`.toLowerCase();
        const phone = record.customer.phone?.toString() || "";
        const email = record.customer.email?.toLowerCase() || "";
        return (
          fullName.includes(searchQuery.toLowerCase()) ||
          phone.includes(searchQuery) ||
          email.includes(searchQuery.toLowerCase())
        );
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [wishlistCustomers, searchQuery]);

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

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleOpenModal = (record) => {
    setSelectedCustomer(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Export functionality
  const handleExport = (format = "csv") => {
    const headers = ["Customer Name", "Mobile No", "Email", "Total Products"];
    const exportData =
      filteredData.length > 0 ? filteredData : wishlistCustomers;
    const dataRows = exportData.map((record) => [
      `${record.customer.firstName} ${record.customer.lastName}`,
      record.customer.phone,
      record.customer.email,
      record.wishlistItems ? record.wishlistItems.length : 0,
    ]);

    let content, mimeType, fileName;

    if (format === "csv") {
      content = [headers, ...dataRows]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");
      mimeType = "text/csv";
      fileName = `wishlists-${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      content = [headers, ...dataRows].map((row) => row.join("\t")).join("\n");
      mimeType = "text/tab-separated-values";
      fileName = `wishlists-${new Date().toISOString().split("T")[0]}.xls`;
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
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Stats
  const totalWishlists = wishlistCustomers.length;
  const totalProducts = wishlistCustomers.reduce(
    (sum, record) =>
      sum + (record.wishlistItems ? record.wishlistItems.length : 0),
    0
  );

  // Table columns
  const columns = [
    {
      title: "Customer Name",
      key: "customerName",
      render: (_, record) => (
        <span className="text-xs font-medium text-blue-600 hover:underline cursor-pointer">
          {record.customer.firstName} {record.customer.lastName}
        </span>
      ),
    },
    {
      title: "Mobile No",
      key: "mobile",
      render: (_, record) => (
        <span className="text-xs">{record.customer.phone}</span>
      ),
    },
    {
      title: "Email",
      key: "email",
      render: (_, record) => (
        <span className="text-xs">{record.customer.email}</span>
      ),
    },
    {
      title: "Total Products",
      key: "totalProducts",
      align: "center",
      render: (_, record) => (
        <span className="text-xs font-medium">
          {record.wishlistItems ? record.wishlistItems.length : 0}
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
          <Eye size={16} />
        </button>
      ),
    },
  ];

  // Modal table columns
  const modalColumns = [
    {
      title: "Image",
      key: "image",
      render: (_, record) => (
        <img
          src={record.image}
          alt="product"
          className="w-12 h-12 object-cover rounded-md border border-gray-200"
        />
      ),
      width: 80,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      render: (text) => <span className="text-xs">{text}</span>,
    },
    {
      title: "Variant Weight",
      dataIndex: "variantWeight",
      key: "variantWeight",
      align: "center",
      render: (weight) => <span className="text-xs">{weight}</span>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => <span className="text-xs font-medium">₹{price}</span>,
    },
  ];

  // Modal data
  const modalData =
    selectedCustomer?.wishlistItems.map((product, index) => {
      const variant =
        product.variants && product.variants.length > 0
          ? product.variants[0]
          : null;
      return {
        key: product._id || index,
        image:
          product.images && product.images.length > 0 ? product.images[0] : "",
        productName: product.productName,
        variantWeight: variant ? variant.weight : "N/A",
        price: variant ? variant.price : product.price,
      };
    }) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Header */}
        <div className="flex items-center justify-end gap-2 mb-0 py-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <div className="relative group">
            {/* <button className="inline-flex items-center gap-1 px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Download size={14} />
              Export
              <ChevronDown size={14} />
            </button> */}
            {/* <div className="absolute right-0 top-full mt-1 text-xs bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 w-full">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Wishlist Customers
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalWishlists.toLocaleString()}
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
                  Total Products
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalProducts.toLocaleString()}
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
                  Avg Products per Wishlist
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {(totalProducts / totalWishlists || 0).toFixed(1)}
                </p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <Heart className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Potential Value
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{(totalProducts * 500).toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 w-full">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-xs text-gray-600">entries</span>
              </div>
            </div>

            {/* <div className="flex items-center justify-between text-xs text-gray-500">
              <div>
                Showing {filteredData.length} of {wishlistCustomers.length} wishlist customers
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} />
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div> */}
          </div>
        </div>

        {/* Wishlist Customers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-visible w-full">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile No
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Products
                  </th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
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
                        {record.customer.firstName} {record.customer.lastName}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-xs text-gray-900">
                        {record.customer.phone}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-xs text-gray-900">
                        {record.customer.email}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-xs font-medium text-gray-900">
                        {record.wishlistItems ? record.wishlistItems.length : 0}
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
                        <Heart className="w-8 h-8 text-gray-300" />
                        <span className="text-xs">
                          No wishlist customers found
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
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between w-full">
              <div className="text-xs text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} results
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className={`px-2 py-1 text-xs rounded ${
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
                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal for showing wishlist products */}
        {isModalVisible && selectedCustomer && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  Wishlist Products for {selectedCustomer.customer.firstName}{" "}
                  {selectedCustomer.customer.lastName}
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
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Variant Weight
                      </th>
                      <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {modalData.map((record) => (
                      <tr
                        key={record.key}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2 px-4">
                          <img
                            src={record.image}
                            alt="product"
                            className="w-12 h-12 object-cover rounded-md border border-gray-200"
                          />
                        </td>
                        <td className="py-2 px-4">
                          <span className="text-xs">{record.productName}</span>
                        </td>
                        <td className="py-2 px-4">
                          <span className="text-xs">
                            {record.variantWeight}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <span className="text-xs font-medium">
                            ₹{record.price}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {modalData.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                            <span className="text-xs">No wishlist items</span>
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

export default Wishlist;
