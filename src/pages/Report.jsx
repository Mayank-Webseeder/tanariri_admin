import React, { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Download,
  Eye,
  TrendingUp,
  BarChart3,
  PieChart,
  Users,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet,
  FileBarChart,
} from "lucide-react";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock report data
  const mockReports = [
    {
      id: "RPT-001",
      name: "Monthly Sales Report",
      category: "Sales",
      description: "Comprehensive sales analysis for October 2025",
      status: "completed",
      type: "financial",
      generatedBy: "John Doe",
      createdDate: "2025-10-26T10:30:00Z",
      lastModified: "2025-10-26T14:15:00Z",
      size: "2.5 MB",
      downloads: 45,
      format: "PDF",
    },
    {
      id: "RPT-002",
      name: "Customer Analytics Dashboard",
      category: "Analytics",
      description: "Customer behavior and engagement metrics",
      status: "processing",
      type: "analytics",
      generatedBy: "Sarah Wilson",
      createdDate: "2025-10-25T09:15:00Z",
      lastModified: "2025-10-25T16:45:00Z",
      size: "1.8 MB",
      downloads: 23,
      format: "Excel",
    },
    {
      id: "RPT-003",
      name: "Inventory Status Report",
      category: "Operations",
      description: "Current inventory levels and stock analysis",
      status: "completed",
      type: "operational",
      generatedBy: "Mike Johnson",
      createdDate: "2025-10-24T14:20:00Z",
      lastModified: "2025-10-24T14:20:00Z",
      size: "945 KB",
      downloads: 67,
      format: "PDF",
    },
    {
      id: "RPT-004",
      name: "Financial Summary Q4",
      category: "Finance",
      description: "Quarterly financial performance overview",
      status: "completed",
      type: "financial",
      generatedBy: "Alex Brown",
      createdDate: "2025-10-23T11:30:00Z",
      lastModified: "2025-10-23T17:20:00Z",
      size: "3.2 MB",
      downloads: 89,
      format: "Excel",
    },
    {
      id: "RPT-005",
      name: "Employee Performance Report",
      category: "HR",
      description: "Team productivity and performance metrics",
      status: "failed",
      type: "analytics",
      generatedBy: "Lisa Davis",
      createdDate: "2025-10-22T16:45:00Z",
      lastModified: "2025-10-22T16:45:00Z",
      size: "0 KB",
      downloads: 0,
      format: "PDF",
    },
    {
      id: "RPT-006",
      name: "Marketing Campaign Analysis",
      category: "Marketing",
      description: "ROI analysis of recent marketing campaigns",
      status: "processing",
      type: "analytics",
      generatedBy: "Tom Anderson",
      createdDate: "2025-10-21T12:10:00Z",
      lastModified: "2025-10-21T12:10:00Z",
      size: "1.1 MB",
      downloads: 12,
      format: "PDF",
    },
    {
      id: "RPT-007",
      name: "Daily Operations Summary",
      category: "Operations",
      description: "Daily operational metrics and KPIs",
      status: "completed",
      type: "operational",
      generatedBy: "Emma Wilson",
      createdDate: "2025-10-20T08:30:00Z",
      lastModified: "2025-10-20T18:45:00Z",
      size: "756 KB",
      downloads: 134,
      format: "Excel",
    },
  ];

  // Load reports
  const loadReports = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReports(mockReports);
      applyFiltersAndSort(mockReports);
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  const applyFiltersAndSort = (sourceData) => {
    let filtered = [...sourceData];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (report) =>
          report.name.toLowerCase().includes(searchText.toLowerCase()) ||
          report.description.toLowerCase().includes(searchText.toLowerCase()) ||
          report.category.toLowerCase().includes(searchText.toLowerCase()) ||
          report.generatedBy.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (report) => report.category === filterCategory
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((report) => report.status === filterStatus);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    applyFiltersAndSort(reports);
  }, [searchText, filterCategory, filterStatus, reports]);

  // Calculate report metrics
  const totalReports = reports.length;
  const completedReports = reports.filter(
    (r) => r.status === "completed"
  ).length;
  const processingReports = reports.filter(
    (r) => r.status === "processing"
  ).length;
  const failedReports = reports.filter((r) => r.status === "failed").length;
  const totalDownloads = reports.reduce((sum, r) => sum + r.downloads, 0);

  // Get status styling
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "processing":
        return "bg-blue-50 text-[#293a90] border border-blue-200";
      case "failed":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3" />;
      case "processing":
        return <Clock className="w-3 h-3" />;
      case "failed":
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Sales":
        return <ShoppingCart className="w-4 h-4 text-green-600" />;
      case "Analytics":
        return <BarChart3 className="w-4 h-4 text-[#293a90]" />;
      case "Finance":
        return <DollarSign className="w-4 h-4 text-[#eb0082]" />;
      case "Operations":
        return <PieChart className="w-4 h-4 text-orange-600" />;
      case "HR":
        return <Users className="w-4 h-4 text-indigo-600" />;
      case "Marketing":
        return <TrendingUp className="w-4 h-4 text-[#eb0082]" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case "Excel":
        return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
      case "PDF":
        return <FileBarChart className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Report Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Reports */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  TOTAL REPORTS
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalReports}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    +15.2%
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-[#293a90]/10">
                <FileText className="h-4 w-4 text-[#293a90]" />
              </div>
            </div>
          </div>

          {/* Completed Reports */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  COMPLETED
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {completedReports}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    {Math.round((completedReports / totalReports) * 100)}%
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>

          {/* Processing Reports */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  PROCESSING
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {processingReports}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <RefreshCw className="w-3 h-3 text-[#293a90] animate-spin" />
                  <span className="text-xs font-medium text-[#293a90]">
                    In Progress
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-[#293a90]/10">
                <Clock className="h-4 w-4 text-[#293a90]" />
              </div>
            </div>
          </div>

          {/* Total Downloads */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  TOTAL DOWNLOADS
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalDownloads}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Download className="w-3 h-3 text-[#eb0082]" />
                  <span className="text-xs font-medium text-[#eb0082]">
                    This Month
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-[#eb0082]/10">
                <Download className="h-4 w-4 text-[#eb0082]" />
              </div>
            </div>
          </div>
        </div>

        {/* Report Categories Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Failed Reports
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {failedReports}
                </p>
              </div>
              <div className="p-2 rounded-md bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Most Downloaded
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Daily Operations Summary
                </p>
              </div>
              <div className="p-2 rounded-md bg-[#eb0082]/10">
                <Eye className="h-4 w-4 text-[#eb0082]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Average Size
                </p>
                <p className="text-lg font-bold text-gray-900">1.5 MB</p>
              </div>
              <div className="p-2 rounded-md bg-[#293a90]/10">
                <BarChart3 className="h-4 w-4 text-[#293a90]" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Reports Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Search and Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#293a90]"
              >
                <option value="all">All Categories</option>
                <option value="Sales">Sales</option>
                <option value="Analytics">Analytics</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
                <option value="Marketing">Marketing</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#293a90]"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>

              {/* Generate New Report Button */}
              <button className="flex items-center gap-2 px-3 py-2 text-xs bg-[#293a90] text-white rounded-lg hover:bg-[#293a90]/90 transition-colors">
                <FileText className="w-3 h-3" />
                Generate Report
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#293a90] mx-auto"></div>
                  <p className="text-gray-500 text-sm mt-2">
                    Loading reports...
                  </p>
                </div>
              </div>
            ) : paginatedReports.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No reports found</p>
                </div>
              </div>
            ) : (
              <div className="min-h-[400px]">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[250px]">
                        Report Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Format
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                        Size
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                        Downloads
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedReports.map((report) => (
                      <tr
                        key={report.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[220px]">
                              {report.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate max-w-[220px]">
                              {report.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              By {report.generatedBy}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-shrink-0">
                              {getCategoryIcon(report.category)}
                            </div>
                            <span className="text-sm text-gray-900 truncate">
                              {report.category}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              report.status
                            )}`}
                          >
                            {getStatusIcon(report.status)}
                            <span className="whitespace-nowrap capitalize">
                              {report.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {getFormatIcon(report.format)}
                            <span className="text-sm text-gray-900">
                              {report.format}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-900">
                            {report.size}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-900">
                            {report.downloads}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {new Date(
                                report.createdDate
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(report.createdDate).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {report.status === "completed" && (
                              <button className="p-1 text-[#293a90] hover:bg-[#293a90]/10 rounded transition-colors">
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-1 text-[#eb0082] hover:bg-[#eb0082]/10 rounded transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredReports.length)} of{" "}
                {filteredReports.length} reports
              </div>
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, index, array) => {
                    const showEllipsis =
                      index > 0 && page - array[index - 1] > 1;
                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <span className="px-3 py-1 text-sm text-gray-500">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm border rounded transition-colors ${
                            currentPage === page
                              ? "bg-[#293a90] text-white border-[#293a90]"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

export default Report;
