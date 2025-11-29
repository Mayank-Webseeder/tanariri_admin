import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Download,
  RefreshCw,
  Eye,
  MoreHorizontal,
  User,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Filter,
  Users,
  Bell,
  Info,
} from "lucide-react";
import useInquiryStore from "../store/useInquiryStore.js";

const AdminInquiries = () => {
  // Local state for table data and search/filter functionality
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const { fetchAllInquiries } = useInquiryStore();

  // Fetch inquiries on mount
  useEffect(() => {
    handleRefresh();
  }, [fetchAllInquiries]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAllInquiries();
      setData(res);
      setFilteredData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  // Filter logic
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

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [data, searchText]);

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Pagination logic
  const handlePageSizeChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInquiries = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Open modal
  const handleOpenModal = (record) => {
    setSelectedInquiry(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Export functionality
  const handleExport = (format = "csv") => {
    const headers = ["Name", "Email", "Phone", "Subject", "Created At"];
    const exportData = filteredData.length > 0 ? filteredData : data;
    const dataRows = exportData.map((inq) => [
      inq.name,
      inq.email,
      inq.phone,
      inq.subject,
      inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : "",
    ]);

    let content, mimeType, fileName;

    if (format === "csv") {
      content = [headers, ...dataRows]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");
      mimeType = "text/csv";
      fileName = `inquiries-${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      content = [headers, ...dataRows].map((row) => row.join("\t")).join("\n");
      mimeType = "text/tab-separated-values";
      fileName = `inquiries-${new Date().toISOString().split("T")[0]}.xls`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get initial letter for avatar
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // Get random color for avatar background
  const getAvatarColor = (name) => {
    const colors = [
      "#1890ff",
      "#13c2c2",
      "#52c41a",
      "#faad14",
      "#722ed1",
      "#eb2f96",
      "#f5222d",
      "#fa8c16",
      "#a0d911",
      "#2f54eb",
    ];
    const charCode = name ? name.charCodeAt(0) : 0;
    return colors[charCode % colors.length];
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status
  const getStatus = (record) => {
    const isNew = new Date(record.createdAt) > new Date(Date.now() - 86400000);
    return isNew ? "new" : "pending";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  // Calculate summary stats
  const totalInquiries = data.length;
  const newInquiries = data.filter(
    (d) => new Date(d.createdAt) > new Date(Date.now() - 86400000)
  ).length;
  const pendingInquiries = data.length; // Assuming all pending

  if (isLoading) {
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
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
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

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 w-full">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Inquiries
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalInquiries.toLocaleString()}
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
                  New Inquiries
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {newInquiries.toLocaleString()}
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
                  Pending
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {pendingInquiries.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <Bell className="h-4 w-4 text-blue-600" />
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
                    placeholder="Search by name, email, or subject..."
                    value={searchText}
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
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-visible w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedInquiries.map((inquiry) => (
                <tr
                  key={inquiry._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{
                          backgroundColor: getAvatarColor(inquiry.name),
                        }}
                      >
                        {getInitial(inquiry.name)}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">
                          {inquiry.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail size={10} className="text-gray-400" />
                          {inquiry.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <MessageSquare size={10} className="text-blue-600" />
                        <span className="text-xs font-medium text-gray-900">
                          {inquiry.subject}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {inquiry.description?.substring(0, 50)}
                        {inquiry.description?.length > 50 ? "..." : ""}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-1">
                      <Phone size={10} className="text-gray-400" />
                      <span className="text-xs text-gray-900">
                        {inquiry.phone}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-900">
                        {formatDate(inquiry.createdAt)}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                          getStatus(inquiry)
                        )}`}
                      >
                        <Clock className="w-3 h-3" />
                        {getStatus(inquiry)}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="relative group">
                      <button className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded">
                        <MoreHorizontal size={16} />
                      </button>
                      <div className="absolute right-0 top-full mt-1 text-xs bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                        <div className="p-1">
                          <button
                            onClick={() => handleOpenModal(inquiry)}
                            className="block w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                          >
                            <Eye size={12} />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedInquiries.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Phone className="w-8 h-8 text-gray-300" />
                      <span className="text-xs">No inquiries found</span>
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

        {/* Modal */}
        {isModalVisible && selectedInquiry && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-8 rounded-t-lg text-white text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold mb-1">
                  {selectedInquiry.subject}
                </h2>
                <p className="text-blue-100 text-xs">
                  Received {formatDate(selectedInquiry.createdAt)}
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xs font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={12} />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Name
                      </label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{
                            backgroundColor: getAvatarColor(
                              selectedInquiry.name
                            ),
                          }}
                        >
                          {getInitial(selectedInquiry.name)}
                        </div>
                        <span className="text-xs text-gray-900">
                          {selectedInquiry.name}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail size={10} className="text-blue-600" />
                        <span className="text-xs text-gray-900">
                          {selectedInquiry.email}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Phone
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone size={10} className="text-green-600" />
                        <span className="text-xs text-gray-900">
                          {selectedInquiry.phone}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Date Submitted
                      </label>
                      <div className="flex items-center gap-2">
                        <Calendar size={10} className="text-purple-600" />
                        <span className="text-xs text-gray-900">
                          {formatDate(selectedInquiry.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inquiry Details */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xs font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageSquare size={12} />
                    Inquiry Details
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Subject
                      </label>
                      <span className="text-xs font-medium text-gray-900">
                        {selectedInquiry.subject}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Description
                      </label>
                      <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-xs text-gray-900 whitespace-pre-wrap">
                          {selectedInquiry.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xs font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock size={12} />
                    Status Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">
                          Inquiry Received
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(selectedInquiry.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">
                          Pending Review
                        </div>
                        <div className="text-xs text-gray-500">
                          Waiting for admin action
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 flex justify-center gap-2">
                <button className="inline-flex items-center gap-2 px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg border">
                  <Mail size={12} />
                  Reply via Email
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg border">
                  <Phone size={12} />
                  Call Customer
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;
