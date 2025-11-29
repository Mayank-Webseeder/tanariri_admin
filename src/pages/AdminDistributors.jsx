import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Download,
  RefreshCw,
  Eye,
  X,
  Home,
  Mail,
  Phone,
  MapPin,
  Building2,
  Package,
  Truck,
  DollarSign,
  User,
  Users,
  CheckCircle,
  MoreHorizontal,
  Filter,
} from "lucide-react";
import useDistributorStore from "../store/useDistributorStore.js";

const AdminDistributors = () => {
  const navigate = useNavigate();
  // Local state for table data and search/filter functionality
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Get distributors and fetch action from the distributor store
  const { distributors, fetchDistributors } = useDistributorStore();

  // Fetch distributors on mount
  useEffect(() => {
    handleRefresh();
  }, [fetchDistributors]);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetchDistributors();
      setData(res);
      setFilteredData(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  // Handle search change to filter distributors by name, email, phone, or company name
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (!value) {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (dist) =>
          (dist.name &&
            dist.name.toLowerCase().includes(value.toLowerCase())) ||
          (dist.email &&
            dist.email.toLowerCase().includes(value.toLowerCase())) ||
          (dist.phone && dist.phone.toString().includes(value)) ||
          (dist.companyName &&
            dist.companyName.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle page size change
  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page on size change
  };

  // Open the modal with the selected distributor details
  const handleOpenModal = (record) => {
    setSelectedDistributor(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Export functionality
  const handleExport = (format = "csv") => {
    const headers = ["Name", "Company Name", "Email", "Phone", "City", "State"];
    const exportData = filteredData.length > 0 ? filteredData : data;
    const dataRows = exportData.map((dist) => [
      dist.name,
      dist.companyName,
      dist.email,
      dist.phone,
      dist.city || "",
      dist.state || "",
    ]);

    let content, mimeType, fileName;

    if (format === "csv") {
      content = [headers, ...dataRows]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");
      mimeType = "text/csv";
      fileName = `distributors-${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      content = [headers, ...dataRows].map((row) => row.join("\t")).join("\n");
      mimeType = "text/tab-separated-values";
      fileName = `distributors-${new Date().toISOString().split("T")[0]}.xls`;
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

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (Math.max(1, currentPage) - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  // Function to render status tag
  const renderFacilityTag = (value) => {
    if (value === true || value === "Yes") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-50 text-green-700">
          Available
        </span>
      );
    } else if (value === false || value === "No") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-50 text-red-700">
          Not Available
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
        {value}
      </span>
    );
  };

  // Calculate summary stats
  const totalDistributors = data.length;
  const activeDistributors = data.length;
  const withStorage = data.filter((d) => d.storageFacility).length;
  const withTransport = data.filter((d) => d.transportFacility).length;

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 w-full">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Distributors
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalDistributors.toLocaleString()}
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
                  Active Distributors
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {activeDistributors.toLocaleString()}
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
                  With Storage
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {withStorage.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  With Transport
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {withTransport.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">
                <Truck className="h-4 w-4 text-blue-600" />
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
                    onChange={handleSearchChange}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-600">Show:</label>
                <select
                  value={pageSize}
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

        {/* Items per page selector */}
        <div className="flex items-center justify-end mb-4 w-full"></div>

        {/* Distributors Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-visible w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Distributor
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
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
                    <div
                      className="cursor-pointer"
                      onClick={() => handleOpenModal(record)}
                    >
                      <div className="text-xs font-medium text-blue-600">
                        {record.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: DIST-{record._id.slice(-4).toUpperCase()}
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="space-y-1">
                      {record.email && (
                        <div className="flex items-center gap-1">
                          <Mail size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-900">
                            {record.email}
                          </span>
                        </div>
                      )}
                      {record.phone && (
                        <div className="flex items-center gap-1">
                          <Phone size={10} className="text-gray-400" />
                          <span className="text-xs text-gray-900">
                            {record.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} className="text-gray-400" />
                      <span className="text-xs text-gray-900">
                        {`${record.city || ""}, ${record.state || ""}`.trim()}
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
                            onClick={() => handleOpenModal(record)}
                            className="block w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-100 rounded"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-gray-300" />
                      <span className="text-xs">No distributors found</span>
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
                {Math.min(startIndex + pageSize, filteredData.length)} of{" "}
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

        {/* Modal to display distributor details */}
        {isModalVisible && selectedDistributor && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Header with avatar and name */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-t-lg text-white text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-purple-600">
                    {getInitial(selectedDistributor.name)}
                  </span>
                </div>
                <h2 className="text-lg font-semibold mb-1">
                  {selectedDistributor.name}
                </h2>
                <p className="text-xs text-blue-100">
                  {selectedDistributor.companyName}
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Personal Info Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xs font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={12} />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail size={10} className="text-blue-600" />
                        <span className="text-xs text-gray-900">
                          {selectedDistributor.email}
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
                          {selectedDistributor.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xs font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Home size={12} />
                    Address Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Address
                      </label>
                      <span className="text-xs text-gray-900 pl-2">
                        {selectedDistributor.address}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        City
                      </label>
                      <span className="text-xs text-gray-900 pl-2">
                        {selectedDistributor.city}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        State
                      </label>
                      <span className="text-xs text-gray-900 pl-2">
                        {selectedDistributor.state}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Country
                      </label>

                      {/* <Building2 size={10} className="text-blue-600" /> */}
                      <span className="text-xs text-gray-900 pl-2">
                        {selectedDistributor.country}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Pincode
                      </label>
                      <span className="text-xs text-gray-900 pl-2">
                        {selectedDistributor.pincode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Business Details Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xs font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 size={12} />
                    Business Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Storage Facility
                      </label>
                      <div className="flex items-center gap-2">
                        <Package size={10} className="text-orange-600" />
                        {renderFacilityTag(selectedDistributor.storageFacility)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Transport Facility
                      </label>
                      <div className="flex items-center gap-2">
                        <Truck size={10} className="text-green-600" />
                        {renderFacilityTag(
                          selectedDistributor.transportFacility
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Godown Size
                      </label>
                      <span className="text-xs text-gray-900 pl-2">
                        {selectedDistributor.godownSize}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-700">
                        Investment Capacity
                      </label>
                      <div className="flex items-center gap-2">
                        <DollarSign size={10} className="text-pink-600" />
                        <span className="text-xs font-medium text-gray-900">
                          {selectedDistributor.investmentCapacity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 flex justify-center">
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

export default AdminDistributors;
