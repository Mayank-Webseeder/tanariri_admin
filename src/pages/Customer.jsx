import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Download,
  RefreshCw,
  Eye,
  MoreHorizontal,
  Users,
  CheckCircle,
  Repeat,
  Crown,
  Mail,
  MapPin,
  Filter,
  X,
  Clock,
  Plus,
} from "lucide-react";
import useCustomerStore from "../store/useCustomerStore";
import { useOrderStore } from "../store/CustomerOrderStore.js";

const Customer = () => {
  const navigate = useNavigate();
  const { fetchCustomers, customers } = useCustomerStore();
  const { fetchCustomerOrderSummary } = useOrderStore();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Store orders from the order store (expected to be an array)
  const [customerOrders, setCustomerOrders] = useState([]);

  // Fetch customers and customer orders on mount
  useEffect(() => {
    handleRefresh();
  }, [fetchCustomers, fetchCustomerOrderSummary]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchCustomers();
      const res = await fetchCustomerOrderSummary();
      setCustomerOrders(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  // Combine customers with their order summaries whenever either changes.
  useEffect(() => {
    if (customers.length === 0) return;

    // Transform each customer with aggregated order info.
    const transformedData = customers.map((cust) => {
      // Filter orders matching this customer id.
      const ordersForCustomer = customerOrders.filter(
        (order) => order.customer === cust._id
      );
      const noOfOrders = ordersForCustomer.length;

      // Calculate total spent across all orders.
      const totalSpent =
        ordersForCustomer.length > 0
          ? ordersForCustomer.reduce(
              (acc, order) => acc + parseFloat(order.paymentTotal || 0),
              0
            )
          : 0;

      let lastOrder = "no order";
      let lastOrderData = null;
      let lastOrderDate = null;
      if (ordersForCustomer.length > 0) {
        // Sort orders by invoiceDate descending.
        const sortedOrders = ordersForCustomer.sort(
          (a, b) =>
            new Date(b.invoiceDetails[0].invoiceDate) -
            new Date(a.invoiceDetails[0].invoiceDate)
        );
        lastOrder = sortedOrders[0].invoiceDetails[0].invoiceNo;
        lastOrderData = sortedOrders[0];
        lastOrderDate = sortedOrders[0].invoiceDetails[0].invoiceDate;
      }

      return {
        key: cust._id,
        id: `CUST-${cust._id.slice(-4).toUpperCase()}`,
        name: `${cust.firstName} ${cust.lastName}`,
        email: cust.email,
        phone: cust.phone || "",
        location:
          cust.addresses && cust.addresses.length > 0
            ? `${cust.addresses[0].city}, ${
                cust.addresses[0].state || ""
              }`.trim()
            : "",
        orders: noOfOrders,
        lastOrder,
        lastOrderData,
        lastOrderDate,
        totalSpent: totalSpent.toFixed(2),
        status: "active",
        primaryBranch:
          cust.addresses && cust.addresses.length > 0
            ? cust.addresses[0].city
            : "N/A",
      };
    });

    setData(transformedData);
    setFilteredData(transformedData);
  }, [customers, customerOrders]);

  // Filter and sort logic
  useEffect(() => {
    let filtered = data;

    // Text search
    if (searchText) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "orders":
          aValue = a.orders;
          bValue = b.orders;
          break;
        case "totalSpent":
          aValue = parseFloat(a.totalSpent);
          bValue = parseFloat(b.totalSpent);
          break;
        case "lastOrderDate":
          aValue = a.lastOrderDate ? new Date(a.lastOrderDate) : new Date(0);
          bValue = b.lastOrderDate ? new Date(b.lastOrderDate) : new Date(0);
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
  }, [data, searchText, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate summary stats
  const totalCustomers = data.length;
  const activeCustomers = data.length;
  const returningCustomers = data.filter((c) => c.orders > 1).length;
  const highValueCustomers = data.filter(
    (c) => parseFloat(c.totalSpent) > 2000
  ).length;

  // Clear filters
  const handleClearFilters = () => {
    setSearchText("");
    setSortBy("totalSpent");
    setSortOrder("desc");
    setShowAdvancedFilters(false);
  };

  // Export functionality
  const handleExport = (format = "csv") => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "No. of Orders",
      "Total Spent",
      "Last Order Date",
      "Location",
    ];
    const exportData = filteredData.length > 0 ? filteredData : data;
    const dataRows = exportData.map((customer) => [
      customer.name,
      customer.email,
      customer.phone,
      customer.orders,
      customer.totalSpent,
      customer.lastOrderDate
        ? new Date(customer.lastOrderDate).toLocaleDateString()
        : "",
      customer.primaryBranch,
    ]);

    let content, mimeType, fileName;

    if (format === "csv") {
      content = [headers, ...dataRows]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");
      mimeType = "text/csv";
      fileName = `customers-${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      content = [headers, ...dataRows].map((row) => row.join("\t")).join("\n");
      mimeType = "text/tab-separated-values";
      fileName = `customers-${new Date().toISOString().split("T")[0]}.xls`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Navigate to customer details on name click
  const handleCustomerClick = (record) => {
    // Filter orders for the selected customer
    const ordersForCustomer = customerOrders.filter(
      (order) => order.customer === record.key
    );
    navigate(`/customers/${record.key}`, {
      state: { customer: record, orders: ordersForCustomer },
    });
  };

  // Handle menu click for actions
  const handleMenuClick = (key, record) => {
    if (key === "order") {
      navigate("/sales/orders", { state: { customerName: record.name } });
    } else if (key === "wishlist") {
      // Handle wishlist
      console.log("Wishlist for:", record.name);
    }
  };

  // Update page size
  const handlePageSizeChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No order";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-50 text-green-700 border border-green-200";
      case "inactive":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const handleStatusChange = (record, field, value) => {
    setData((prev) =>
      prev.map((c) => (c.key === record.key ? { ...c, [field]: value } : c))
    );
  };

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
            onClick={() => navigate("/customers/addcustomer")}
            className="inline-flex items-center gap-2 bg-[#293a90] hover:bg-[#293a90]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add customer
          </button>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 w-full">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Customers
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalCustomers.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-[#293a90]/10">
                <Users className="h-4 w-4 text-[#293a90]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Active Customers
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {activeCustomers.toLocaleString()}
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
                  Returning
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {returningCustomers.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-[#eb0082]/10">
                <Repeat className="h-4 w-4 text-[#eb0082]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  High-Value
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {highValueCustomers.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-[#eb0082]/10">
                <Crown className="h-4 w-4 text-[#eb0082]" />
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
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2">
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
                  <option value="totalSpent">Sort by Spend</option>
                  <option value="orders">Sort by Orders</option>
                  <option value="name">Sort by Name</option>
                  <option value="lastOrderDate">Sort by Last Order</option>
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

        {/* Customers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-visible w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCustomers.map((customer) => (
                <tr
                  key={customer.key}
                  onClick={() => handleCustomerClick(customer)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="py-2 px-4">
                    <div className="text-xs font-medium text-[#293a90]">
                      {customer.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {customer.id}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="space-y-1">
                      {customer.email && (
                        <div className="flex items-center gap-1">
                          <Mail size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-900">
                            {customer.email}
                          </span>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-900">
                            {customer.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 text-xs font-medium text-gray-900">
                    {customer.orders}
                  </td>
                  <td className="py-2 px-4 text-xs font-medium text-gray-900">
                    ₹{customer.totalSpent}
                  </td>
                  <td className="py-2 px-4 text-xs text-gray-900">
                    {formatDate(customer.lastOrderDate)}
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} className="text-gray-400" />
                      <span className="text-xs text-gray-900">
                        {customer.primaryBranch}
                      </span>
                    </div>
                  </td>
                  <td
                    className="py-2 px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={customer.status}
                      onChange={(e) =>
                        handleStatusChange(customer, "status", e.target.value)
                      }
                      className={`px-2 py-1 text-xs rounded-full border transition-colors cursor-pointer ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>

                  <td
                    className="py-2 px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative group justify-end">
                      <button className="p-1 text-[#293a90] hover:bg-[#293a90]/10 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                      <div className="absolute right-0 top-full mt-1 text-xs bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <div className="p-1">
                          <button
                            onClick={() => handleMenuClick("order", customer)}
                            className="block w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                          >
                            Order
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-gray-300" />
                      <span className="text-xs">No customers found</span>
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

export default Customer;
