import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useOrderStore } from "../../store/CustomerOrderStore";
import { toast } from "react-toastify";
import {
  Search,
  ChevronDown,
  Download,
  RefreshCw,
  Plus,
  Filter,
  X,
  Clock,
  Users,
  CheckCircle,
  ShoppingBag,
  ArrowLeft,
  Home,
  Eye,
  SortAsc,
  SortDesc,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Edit,
} from "lucide-react";

const OrdersTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchOrders, changeOrderStatus } = useOrderStore();
  const newOrder = location.state?.orderData;
  const initialCustomerName = location.state?.customerName;

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [customerName, setCustomerName] = useState(initialCustomerName || "");
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch orders
  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const orders = await fetchOrders();
      const mappedData = orders.map((order) => ({
        key: order._id,
        id: order._id,
        date: new Date(order.createdAt).toLocaleString(),
        customer: `${order.customer?.firstName || ""} ${
          order.customer?.lastName || ""
        }`,
        customerOrders: 1,
        orderStatus: order.orderStatus || "Pending",
        paymentStatus: order.paymentStatus || "Pending",
        total: `₹${parseFloat(order.paymentTotal || 0).toFixed(2)}`,
        orderDetails: order,
      }));
      setData(mappedData);

      // Apply filters and sorting
      applyFiltersAndSort(mappedData);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  // Apply filters and sorting
  const applyFiltersAndSort = (sourceData) => {
    let filtered = customerName
      ? sourceData.filter((item) =>
          item.customer.toLowerCase().includes(customerName.toLowerCase())
        )
      : sourceData;

    // Search filter
    if (searchText) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((item) => item.orderStatus === filterStatus);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case "date":
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case "total":
          aValue = parseFloat(a.total.replace("₹", ""));
          bValue = parseFloat(b.total.replace("₹", ""));
          break;
        case "customer":
          aValue = a.customer.toLowerCase();
          bValue = b.customer.toLowerCase();
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

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Update customerName when navigation state changes
  useEffect(() => {
    setCustomerName(initialCustomerName || "");
  }, [initialCustomerName]);

  // Add new order from navigation state
  useEffect(() => {
    if (newOrder) {
      const mappedNewOrder = {
        key: newOrder._id,
        id: newOrder._id,
        date: new Date(newOrder.createdAt || Date.now()).toLocaleString(),
        customer: `${newOrder.customer?.firstName || ""} ${
          newOrder.customer?.lastName || ""
        }`,
        customerOrders: 1,
        orderStatus: newOrder.orderStatus || "Pending",
        paymentStatus: newOrder.paymentStatus || "Pending",
        total: `₹${parseFloat(newOrder.paymentTotal || 0).toFixed(2)}`,
        orderDetails: newOrder,
      };
      setData((prevData) => [...prevData, mappedNewOrder]);
      applyFiltersAndSort([...data, mappedNewOrder]);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [newOrder, navigate, location.pathname]);

  // Handle search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    applyFiltersAndSort(data);
  };

  // Handle status filter
  const handleFilter = (value) => {
    setFilterStatus(value);
    applyFiltersAndSort(data);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    applyFiltersAndSort(data);
  };

  // Handle page size change
  const handlePageSizeChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Handle status change
  const handleStatusChange = async (record, type, value) => {
    const previousData = [...data];
    const updatedData = data.map((item) =>
      item.key === record.key ? { ...item, [type]: value } : item
    );
    setData(updatedData);
    applyFiltersAndSort(updatedData);

    const statusData = {};
    if (type === "orderStatus") statusData.orderStatus = value;
    if (type === "paymentStatus") statusData.paymentStatus = value;

    try {
      await changeOrderStatus(record.key, statusData);
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update status");
      setData(previousData);
      applyFiltersAndSort(previousData);
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle cancel customer filter
  const handleCancelCustomerFilter = () => {
    setCustomerName("");
    applyFiltersAndSort(data);
    setSearchText("");
    setFilterStatus("all");
    setCurrentPage(1);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchText("");
    setFilterStatus("all");
    setSortBy("date");
    setSortOrder("desc");
    setShowAdvancedFilters(false);
    setCurrentPage(1);
    applyFiltersAndSort(data);
  };

  const handleEditOrder = (orderId, orderDetails) => {
    navigate(`/sales/orders/order-update/${orderId}`, {
      state: { order: orderDetails },
    });
  };

  // UPDATE THIS: handleMenuClick to include Edit
  const handleMenuClick = (key, record) => {
    if (key === "edit") {
      handleEditOrder(record.id, record.orderDetails);
    } else if (key === "abandoned-cart") {
      navigate("/sales/abandoned-cart");
    } else if (key === "cancelled-orders") {
      navigate("/sales/cancelled-orders");
    }
  };

  // Export functionality
  const handleExport = (format = "csv") => {
    const headers = [
      "Order #",
      "Date",
      "Customer",
      "Order Status",
      "Payment Status",
      "Total",
    ];
    const exportData = filteredData.length > 0 ? filteredData : data;
    const dataRows = exportData.map((order) => [
      order.orderDetails.invoiceDetails[0]?.invoiceNo || order.id,
      new Date(order.date).toLocaleDateString(),
      order.customer,
      order.orderStatus,
      order.paymentStatus,
      order.total.replace("₹", ""),
    ]);

    let content, mimeType, fileName;

    if (format === "csv") {
      content = [headers, ...dataRows]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");
      mimeType = "text/csv";
      fileName = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      content = [headers, ...dataRows].map((row) => row.join("\t")).join("\n");
      mimeType = "text/tab-separated-values";
      fileName = `orders-${new Date().toISOString().split("T")[0]}.xls`;
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
  const totalOrders = data.length;
  const pendingOrders = data.filter((o) => o.orderStatus === "Pending").length;
  const confirmedOrders = data.filter(
    (o) => o.orderStatus === "Confirmed"
  ).length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "Confirmed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Shipped":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      case "Delivered":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-3 h-3" />;
      case "Confirmed":
        return <CheckCircle className="w-3 h-3" />;
      case "Shipped":
        return <Truck className="w-3 h-3" />;
      case "Delivered":
        return <Package className="w-3 h-3" />;
      case "Cancelled":
        return <X className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#293a90]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Header */}
        <div className="flex items-center justify-end gap-2 mb-0 py-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Download size={14} />
            Export
          </button>

          <button
            onClick={() => navigate("/sales/orders/AddOrder")}
            className="inline-flex items-center gap-2 bg-[#293a90] hover:bg-[#293a90]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add Order
          </button>
        </div>

        {/* Customer Filter Banner */}
        {customerName && (
          <div className="bg-[#293a90]/10 border border-[#293a90]/20 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#293a90]">
                Showing orders for: <strong>{customerName}</strong>
              </span>
              <button
                onClick={handleCancelCustomerFilter}
                className="inline-flex items-center gap-1 text-xs text-[#293a90] hover:text-[#293a90]/80 px-2 py-1 rounded hover:bg-[#293a90]/10 transition-colors"
              >
                <X size={12} />
                Clear Filter
              </button>
            </div>
          </div>
        )}

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 w-full">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Orders
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalOrders.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-[#293a90]/10">
                <ShoppingBag className="h-4 w-4 text-[#293a90]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Pending Orders
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {pendingOrders.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-[#eb0082]/10">
                <Clock className="h-4 w-4 text-[#eb0082]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Confirmed Orders
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {confirmedOrders.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
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
                    data.reduce(
                      (acc, order) =>
                        acc + parseFloat(order.total.replace("₹", "")),
                      0
                    ) / data.length || 0
                  ).toFixed(2)}
                </p>
              </div>
              <div className="p-2 rounded-md bg-[#293a90]/10">
                <DollarSign className="h-4 w-4 text-[#293a90]" />
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
                    placeholder="Search orders..."
                    value={searchText}
                    onChange={handleSearchChange}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
                  />
                </div>
              </div>

              <select
                value={filterStatus}
                onChange={(e) => handleFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#293a90]"
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
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

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-2 focus:ring-[#293a90]"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-xs text-gray-600">entries</span>
              </div>
            </div>

            {showAdvancedFilters && (
              <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200 w-full text-xs">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#293a90]"
                >
                  <option value="date">Sort by Date</option>
                  <option value="total">Sort by Total</option>
                  <option value="customer">Sort by Customer</option>
                </select>

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {sortOrder === "asc" ? "↑" : "↓"} {sortOrder.toUpperCase()}
                </button>

                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs bg-[#eb0082]/10 text-[#eb0082] hover:bg-[#eb0082]/20 rounded-lg"
                >
                  <X size={12} />
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-visible w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order #
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
                  Total
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((record) => (
                <tr
                  key={record.key}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-4">
                    <Link
                      to={`order-details/${record.id}`}
                      state={{ order: record.orderDetails }}
                      className="text-xs font-medium text-[#293a90] hover:underline"
                    >
                      {record.orderDetails.invoiceDetails[0]?.invoiceNo ||
                        record.id}
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-xs text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <Link
                      to={`/customers/${record.orderDetails?.customer?._id}`}
                      state={{
                        orders: data
                          .filter(
                            (o) =>
                              o.orderDetails?.customer?._id ===
                              record.orderDetails?.customer?._id
                          )
                          .map((o) => o.orderDetails),
                        customer: record.orderDetails.customer,
                      }}
                      className="text-xs font-medium text-[#293a90] hover:underline"
                    >
                      {record.customer} ({record.customerOrders})
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={record.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(
                          record,
                          "orderStatus",
                          e.target.value
                        )
                      }
                      className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                        record.orderStatus
                      )}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={record.paymentStatus}
                      onChange={(e) =>
                        handleStatusChange(
                          record,
                          "paymentStatus",
                          e.target.value
                        )
                      }
                      className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(
                        record.paymentStatus
                      )}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <span className="text-xs font-medium text-gray-900">
                      {record.total}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="relative group justify-end">
                      <button className="p-1 text-[#293a90] hover:bg-[#293a90]/10 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                      <div className="absolute right-0 top-full mt-1 text-xs bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <div className="p-1">
                          {/* EDIT BUTTON ADDED HERE */}
                          <button
                            onClick={() => handleMenuClick("edit", record)}
                            className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                          >
                            <Edit size={12} />
                            Edit Order
                          </button>
                          <div className="border-t border-gray-200 my-1"></div>
                          <button
                            onClick={() =>
                              handleMenuClick("abandoned-cart", record)
                            }
                            className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded"
                          >
                            Abandoned Cart
                          </button>
                          <button
                            onClick={() =>
                              handleMenuClick("cancelled-orders", record)
                            }
                            className="block w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-100 rounded"
                          >
                            Cancelled Orders
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingBag className="w-8 h-8 text-gray-300" />
                      <span className="text-xs">No orders found</span>
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
                        ? "bg-[#293a90] text-white border border-[#293a90]"
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

export default OrdersTable;
