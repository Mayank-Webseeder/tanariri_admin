import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Star,
  Edit,
  Save,
  X,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Eye,
  Plus,
  User,
  Home,
  Trash2,
} from "lucide-react";
import useCustomerStore from "../store/useCustomerStore";
import { toast } from "react-toastify";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentCustomer, fetchCustomerById, updateCustomer } =
    useCustomerStore();

  // Retrieve passed orders (if any) from the location state.
  const passedOrders = location.state?.orders || [];
  console.log(passedOrders);

  // Local state for customer editing and modal handling
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [addressFormData, setAddressFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sample internal notes
  const [internalNotes, setInternalNotes] = useState([
    {
      id: 1,
      text: "Customer prefers extra cheese on pizzas. Very polite and always tips well.",
      author: "John Admin",
      date: "2025-09-20T10:30:00",
    },
    {
      id: 2,
      text: "Active customer - always gets priority service. Frequent orders during lunch hours.",
      author: "Sarah Manager",
      date: "2025-09-15T14:20:00",
    },
  ]);

  // Spending analytics data computed from orders
  const [spendingData, setSpendingData] = useState([]);

  // Branch distribution sample (since no branch data)
  const branchDistribution = [
    { branch: "Downtown Branch", orders: 18, amount: 2567.2, color: "#6366F1" },
    { branch: "Mall Branch", orders: 4, amount: 645.3, color: "#10B981" },
    { branch: "Airport Branch", orders: 2, amount: 244.0, color: "#F59E0B" },
  ];

  useEffect(() => {
    const loadCustomer = async () => {
      setIsLoading(true);
      try {
        await fetchCustomerById(id);
      } catch (error) {
        toast.error("Failed to load customer");
      } finally {
        setIsLoading(false);
      }
    };
    loadCustomer();
  }, [id, fetchCustomerById]);

  useEffect(() => {
    if (currentCustomer && !profileLoaded) {
      setEditedCustomer(currentCustomer);
      setProfileLoaded(true);
    }
  }, [currentCustomer, profileLoaded]);

  // Compute spending data from passedOrders
  useEffect(() => {
    if (passedOrders.length > 0) {
      const monthly = passedOrders.reduce((acc, order) => {
        const date = new Date(order.invoiceDetails[0].invoiceDate);
        const month = date.toLocaleString("default", { month: "short" });
        const year = date.getFullYear();
        const key = `${month} ${year}`;
        acc[key] = (acc[key] || 0) + parseFloat(order.paymentTotal || 0);
        return acc;
      }, {});
      const data = Object.keys(monthly).map((key) => ({
        month: key,
        amount: monthly[key],
      }));
      setSpendingData(data);
    } else {
      setSpendingData([]);
    }
  }, [passedOrders]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchCustomerById(id);
    } catch (error) {
      toast.error("Failed to refresh customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (isEdit = false, address = null) => {
    setIsEditing(isEdit);
    setSavedAddress(address);
    if (isEdit && address) {
      setAddressFormData(address);
    } else {
      setAddressFormData({});
    }
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSavedAddress(null);
    setAddressFormData({});
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setEditedCustomer((prev) => ({
        ...prev,
        addresses: prev.addresses.map((addr) =>
          addr._id === savedAddress._id ? { ...addr, ...addressFormData } : addr
        ),
      }));
      toast.success("Address updated successfully");
    } else {
      const newAddress = { ...addressFormData };
      setEditedCustomer((prev) => ({
        ...prev,
        addresses: [...prev.addresses, newAddress],
      }));
      toast.success("Address added successfully");
    }
    handleCloseModal();
  };

  const handleDeleteAddress = (address) => {
    setEditedCustomer((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((addr) => addr !== address),
    }));
    toast.success("Address removed successfully");
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const updatedData = {
        email: editedCustomer.email,
        phone: editedCustomer.phone,
        addresses: editedCustomer.addresses,
      };
      console.log(updatedData);
      await updateCustomer(id, updatedData);
      toast.success("Customer updated successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update customer";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote,
        author: "Current Admin",
        date: new Date().toISOString(),
      };
      setInternalNotes([note, ...internalNotes]);
      setNewNote("");
      setIsEditingNotes(false);
    }
  };

  const BreadcrumbNav = () => (
    <div className="flex items-center text-gray-500 mb-3 md:mb-4 text-xs sm:text-sm">
      <Link to="/customers" className="flex items-center hover:text-blue-600">
        <Home size={14} className="mr-1" />
        <span>Customers</span>
      </Link>
      <span className="mx-2">/</span>
      <span>Update Customer</span>
    </div>
  );

  // --- Order Aggregation Functions ---
  // Calculate time difference for the last order
  const getTimeAgo = (invoiceDate) => {
    const lastDate = new Date(invoiceDate);
    const now = new Date("2025-10-15"); // Current date as per context
    const diffMs = now - lastDate;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays < 30) {
      return `${Math.floor(diffDays)} day(s) ago`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} month(s) ago`;
    } else {
      return `${Math.floor(diffDays / 365)} year(s) ago`;
    }
  };

  // Compute aggregated order details
  const computeOrderAggregates = (orders) => {
    if (!orders || orders.length === 0) {
      return {
        lastOrderTime: "No orders",
        totalSpent: "No orders",
        averageOrder: "No orders",
        totalOrders: "No orders",
      };
    }
    const totalOrders = orders.length;
    const totalSpent = orders.reduce(
      (acc, order) => acc + parseFloat(order.paymentTotal || 0),
      0
    );
    const averageOrder = totalSpent / totalOrders;
    // Determine the last order based on the most recent invoiceDate
    const lastOrder = orders.reduce((prev, curr) => {
      const prevDate = new Date(prev.invoiceDetails[0]?.invoiceDate);
      const currDate = new Date(curr.invoiceDetails[0]?.invoiceDate);
      return currDate > prevDate ? curr : prev;
    });
    const lastOrderTime = getTimeAgo(lastOrder.invoiceDetails[0].invoiceDate);
    return {
      lastOrderTime,
      totalSpent: `₹${totalSpent.toFixed(2)}`,
      averageOrder: `₹${averageOrder.toFixed(2)}`,
      totalOrders: `${totalOrders} Order(s)`,
    };
  };

  const orderAggregates = computeOrderAggregates(passedOrders);

  // Prepare order history table data
  const orderHistory =
    passedOrders.length > 0
      ? passedOrders.map((order, index) => ({
          key: order._id || index,
          id: order.invoiceDetails[0].invoiceNo,
          date: order.invoiceDetails[0].invoiceDate,
          status: order.paymentStatus,
          fulfillment: order.orderStatus,
          amount: parseFloat(order.paymentTotal || 0),
          items: 3, // Assume
          paymentMethod: "Credit Card", // Assume
        }))
      : [];

  // Filter orders
  const filteredOrders = orderHistory.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;

    if (dateFilter !== "all") {
      const orderDate = new Date(order.date);
      const today = new Date("2025-10-15");
      const daysDiff = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case "week":
          if (daysDiff > 7) return false;
          break;
        case "month":
          if (daysDiff > 30) return false;
          break;
        case "quarter":
          if (daysDiff > 90) return false;
          break;
      }
    }

    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "Pending":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="w-3 h-3" />;
      case "Cancelled":
        return <XCircle className="w-3 h-3" />;
      case "Pending":
        return <Clock className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const formatINR = (amount) => `₹${amount.toFixed(2)}`;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!editedCustomer) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-sans">
        Loading...
      </div>
    );
  }

  const customer = {
    id,
    name: `${editedCustomer.firstName} ${editedCustomer.lastName}`,
    email: editedCustomer.email,
    phone: editedCustomer.phone,
    joinDate: editedCustomer.createdAt || "2024-03-15", // Assume
    lastOrderDate:
      passedOrders.length > 0
        ? passedOrders[0].invoiceDetails[0].invoiceDate
        : "2025-09-23",
    totalOrders: passedOrders.length,
    totalSpend: passedOrders.reduce(
      (acc, order) => acc + parseFloat(order.paymentTotal || 0),
      0
    ),
    avgOrderValue:
      passedOrders.length > 0
        ? passedOrders.reduce(
            (acc, order) => acc + parseFloat(order.paymentTotal || 0),
            0
          ) / passedOrders.length
        : 0,
    mostActiveBranch: "N/A", // No data
    status: "active",
    visitFrequency: passedOrders.length, // Approximate
    preferredPayment: "Credit Card", // Assume
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-sans">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        <div className="flex flex-col">
          {/* Top bar with breadcrumb and buttons */}
          <div className="flex justify-between items-center py-2 mb-0">
            {/* <BreadcrumbNav /> */}

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/customers")}
                className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft size={14} />
                Back
              </button>

              {/* <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw
                  size={14}
                  className={isLoading ? "animate-spin" : ""}
                />
                Refresh
              </button> */}

              {/* <button className="inline-flex items-center gap-1.5 bg-[#293a90] hover:bg-[#293a90]/90 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors shadow-sm">
                <Download size={14} />
                Export
              </button> */}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-6">
                {/* Customer Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {customer.name}
                      </h2>
                      <p className="text-xs text-gray-500">
                        Customer ID: {customer.id}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">
                          {customer.status} Customer
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatINR(customer.totalSpend)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total Lifetime Value
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Contact Info */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                        Contact
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-700">
                            {customer.email}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-700">
                            {customer.phone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-700">
                            {customer.mostActiveBranch}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Stats */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                        Order Stats
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">
                            Total Orders:
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {customer.totalOrders}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">
                            Avg Order Value:
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {formatINR(customer.avgOrderValue)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account Info */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                        Account
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">
                            Member Since:
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {formatDate(customer.joinDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">
                            Last Order:
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {formatDate(customer.lastOrderDate)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">
                            Payment Method:
                          </span>
                          <span className="text-xs font-semibold text-gray-900">
                            {customer.preferredPayment}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Total Orders
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {customer.totalOrders.toLocaleString()}
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
                    Total Spend
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatINR(customer.totalSpend)}
                  </p>
                </div>
                <div className="p-2 rounded-md bg-gray-50">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Avg Order
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatINR(customer.avgOrderValue)}
                  </p>
                </div>
                <div className="p-2 rounded-md bg-gray-50">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Last order
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {/* {customer.visitFrequency + "/month"} */}
                    {formatDate(customer.lastOrderDate)}
                  </p>
                </div>
                <div className="p-2 rounded-md bg-gray-50">
                  <ShoppingBag className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === "orders"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Order History ({orderHistory.length})
                </button>

                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`py-3 text-xs font-medium border-b-2 transition-colors ${
                    activeTab === "addresses"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Addresses
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Order History Tab */}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="all">All Status</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Pending">Pending</option>
                    </select>

                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-xs"
                    >
                      <option value="all">All Time</option>
                      <option value="week">Last 7 Days</option>
                      <option value="month">Last 30 Days</option>
                      <option value="quarter">Last 3 Months</option>
                    </select>

                    <button
                      onClick={() => {
                        setStatusFilter("all");
                        setDateFilter("all");
                        setCurrentPage(1);
                      }}
                      className="flex items-center gap-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                  </div>

                  {/* Orders Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">
                            Order ID
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">
                            Amount
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">
                            Items
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">
                            Fulfillment
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedOrders.map((order) => (
                          <tr
                            key={order.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-2 px-3">
                              <span className="text-xs font-medium text-blue-600">
                                {order.id}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span className="text-xs font-semibold text-gray-900">
                                {formatINR(order.amount)}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span className="text-xs text-gray-700">
                                {order.items} items
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span className="text-xs text-gray-700">
                                {order.fulfillment}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span className="text-xs text-gray-700">
                                {formatDate(order.date)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <p className="text-xs text-gray-700">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(
                          startIndex + itemsPerPage,
                          filteredOrders.length
                        )}{" "}
                        of {filteredOrders.length} orders
                      </p>
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
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
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="">
                  <div className="flex items-center justify-between p-2 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <MapPin size={16} />
                      Addresses
                    </h3>
                    <button
                      onClick={() => handleOpenModal()}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 px-3 py-2 border border-blue-300 rounded-lg hover:bg-blue-50"
                    >
                      <Plus size={12} />
                      Add Address
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-6">
                    {editedCustomer.addresses &&
                    editedCustomer.addresses.length > 0 ? (
                      editedCustomer.addresses.map((address, index) => (
                        <div
                          key={address._id || `new-${index}`}
                          className="relative border border-gray-200 hover:shadow-lg transition-shadow rounded-lg p-4"
                        >
                          {/* Edit/Delete buttons in top-right */}
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={() => handleOpenModal(true, address)}
                              className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address)}
                              className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* Address content */}
                          <div className="text-xs text-gray-700 space-y-1">
                            <p className="font-medium">
                              Address: {address.address}
                            </p>
                            <p>City: {address.city}</p>
                            <p>Pincode: {address.pincode}</p>
                            <p>State: {address.state}</p>
                            <p>Country: {address.country}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-500 py-8">
                        <MapPin
                          size={32}
                          className="mx-auto mb-2 text-gray-300"
                        />
                        <p className="text-xs">No addresses found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  {isEditing ? "Edit Address" : "Add Address"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleModalSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={addressFormData.address || ""}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={addressFormData.city || ""}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={addressFormData.pincode || ""}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          pincode: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={addressFormData.state || ""}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={addressFormData.country || ""}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs bg-[#293a90] hover:bg-[#293a90]/90 text-white rounded-lg"
                  >
                    {isEditing ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
