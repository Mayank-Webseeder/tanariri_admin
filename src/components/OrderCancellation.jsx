import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Select } from "antd";
import { useOrderStore } from "../store/CustomerOrderStore.js";
import { toast } from "react-toastify";
import {
  Search,
  ChevronDown,
  Download,
  RefreshCw,
  Filter,
  X,
  Clock,
  Users,
  AlertCircle,
  Home,
  ArrowLeft,
  Eye,
  MoreHorizontal,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";

const { Option } = Select;

const OrderCancellation = () => {
  const navigate = useNavigate();
  const { fetchOrders } = useOrderStore();

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch orders
  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const allOrders = await fetchOrders();
      // Filter only cancelled orders
      const cancelledOrders = allOrders.filter(
        (order) => order.orderStatus === "Cancelled"
      );
      setOrders(cancelledOrders);

      // Apply filters and sorting
      applyFiltersAndSort(cancelledOrders);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  // Apply filters and sorting
  const applyFiltersAndSort = (sourceData) => {
    let filtered = sourceData;

    // Search filter
    if (searchText) {
      filtered = filtered.filter((order) => {
        const invoiceNo =
          order.invoiceDetails && order.invoiceDetails.length > 0
            ? order.invoiceDetails[0].invoiceNo
            : "";
        const date = new Date(order.createdAt).toLocaleString();
        const customerName = `${order.customer.firstName} ${order.customer.lastName}`;
        return (
          invoiceNo.toLowerCase().includes(searchText.toLowerCase()) ||
          date.toLowerCase().includes(searchText.toLowerCase()) ||
          customerName.toLowerCase().includes(searchText.toLowerCase()) ||
          order.orderStatus.toLowerCase().includes(searchText.toLowerCase()) ||
          order.paymentStatus
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          (order.paymentTotal &&
            order.paymentTotal
              .toString()
              .toLowerCase()
              .includes(searchText.toLowerCase()))
        );
      });
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentStatus === filterStatus
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "date":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "total":
          aValue = parseFloat(a.paymentTotal || 0);
          bValue = parseFloat(b.paymentTotal || 0);
          break;
        case "customer":
          aValue =
            `${a.customer.firstName} ${a.customer.lastName}`.toLowerCase();
          bValue =
            `${b.customer.firstName} ${b.customer.lastName}`.toLowerCase();
          break;
        default:
          aValue = a[sortBy];
          bValue = b[sortBy];
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadOrders();
  }, [fetchOrders]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    applyFiltersAndSort(orders);
  };

  const handleFilter = (value) => {
    setFilterStatus(value);
    applyFiltersAndSort(orders);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    applyFiltersAndSort(orders);
  };

  const handlePageSizeChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchText("");
    setFilterStatus("all");
    setCurrentPage(1);
  };

  // Export functionality
  const handleExport = (format = "csv") => {
    const headers = [
      "Invoice No",
      "Date",
      "Customer",
      "Order Status",
      "Payment Status",
      "Cancellation Reason",
      "Total",
    ];
    const exportData = filteredOrders.length > 0 ? filteredOrders : orders;
    const dataRows = exportData.map((order) => [
      order.invoiceDetails && order.invoiceDetails.length > 0
        ? order.invoiceDetails[0].invoiceNo
        : "",
      new Date(order.createdAt).toLocaleString(),
      `${order.customer.firstName} ${order.customer.lastName}`,
      order.orderStatus,
      order.paymentStatus,
      order.cancellationReason || "",
      `₹${order.paymentTotal || 0}`,
    ]);

    let content, mimeType, fileName;

    if (format === "csv") {
      content = [headers, ...dataRows]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");
      mimeType = "text/csv";
      fileName = `cancelled-orders-${
        new Date().toISOString().split("T")[0]
      }.csv`;
    } else {
      content = [headers, ...dataRows].map((row) => row.join("\t")).join("\n");
      mimeType = "text/tab-separated-values";
      fileName = `cancelled-orders-${
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

  // Stats
  const totalCancelled = orders.length;
  const pendingRefunds = orders.filter(
    (o) => o.paymentStatus === "Pending"
  ).length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="w-3 h-3 text-green-700" />;
      case "Shipped":
        return <CheckCircle className="w-3 h-3 text-blue-700" />;
      case "Delivered":
        return <CheckCircle className="w-3 h-3 text-teal-700" />;
      case "Cancelled":
        return <X className="w-3 h-3 text-red-700" />;
      case "Pending":
        return <Clock className="w-3 h-3 text-yellow-700" />;
      default:
        return <AlertCircle className="w-3 h-3 text-gray-700" />;
    }
  };

  if (loading && orders.length === 0) {
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
          {/* <button
            onClick={loadOrders}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button> */}

          {/* <div className="relative group">
            <button className="inline-flex items-center gap-1 px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              <Download size={14} />
              Export
              <ChevronDown size={14} />
            </button>
            <div className="absolute right-0 top-full mt-1 text-xs bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="p-1">
                <button
                  onClick={() => handleExport("csv")}
                  className="block w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                >
                  Export
                </button>
                <button
                  onClick={() => handleExport("excel")}
                  className="block w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                >
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

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 w-full">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Cancelled
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalCancelled.toLocaleString()}
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
                  Pending Refunds
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {pendingRefunds.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Avg Order Value
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ₹
                  {(
                    orders.reduce((sum, o) => sum + (o.paymentTotal || 0), 0) /
                      orders.length || 0
                  ).toFixed(2)}
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
                  Cancellation Rate
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {((totalCancelled / (totalCancelled + 100)) * 100).toFixed(1)}
                  %
                </p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <AlertCircle className="h-4 w-4 text-blue-600" />
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
                    placeholder="Search by invoice, date, customer..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => handleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Payment Status</option>
                <option value="Pending">Pending</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
                <option value="Unconfirmed">Unconfirmed</option>
              </select>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter size={12} />
                More
                <ChevronDown
                  size={12}
                  className={showAdvancedFilters ? "rotate-180" : ""}
                />
              </button>
            </div>

            {showAdvancedFilters && (
              <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200 w-full text-xs">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="total">Sort by Total</option>
                  <option value="customer">Sort by Customer</option>
                </select>

                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  <X size={12} />
                  Clear All
                </button>
              </div>
            )}

            {/* <div className="flex items-center justify-between text-xs text-gray-500">
              <div>
                Showing {filteredOrders.length} of {orders.length} cancelled orders
                {searchText && ` matching "${searchText}"`}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={12} />
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
            </div> */}
          </div>
        </div>

        {/* Items per page selector */}
        <div className="flex items-center justify-end mb-4 w-full">
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

        {/* Cancelled Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-visible w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice No
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Status
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cancellation Reason
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                {/* <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-4">
                    <span className="text-xs font-medium text-gray-900">
                      {order.invoiceDetails && order.invoiceDetails.length > 0
                        ? order.invoiceDetails[0].invoiceNo
                        : order._id.slice(-6)}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-xs text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-xs font-medium text-gray-900">
                      {`${order.customer.firstName} ${order.customer.lastName}`}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {getStatusIcon(order.paymentStatus)}
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-xs text-gray-900">
                      {order.cancellationReason || "N/A"}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-xs font-medium text-gray-900">
                      ₹{order.paymentTotal || 0}
                    </span>
                  </td>
                  {/* <td className="py-2 px-4">
                    <div className="relative group">
                      <button className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                      <div className="absolute right-0 top-full mt-1 text-xs bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <div className="p-1">
                          <button className="block w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded">
                            Edit
                          </button>
                          <button className="block w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </td> */}
                </tr>
              ))}
              {paginatedData.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingBag className="w-8 h-8 text-gray-300" />
                      <span className="text-xs">No cancelled orders found</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between w-full">
              <div className="text-xs text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
                {filteredOrders.length} results
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
      </div>
    </div>
  );
};

export default OrderCancellation;
