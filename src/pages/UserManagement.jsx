// src/pages/UserManagement.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Search,
  ChevronDown,
  Download,
  RefreshCw,
  Users,
  UserCheck,
  Filter,
  X,
  Clock,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import useUserStore from "../store/useUserStore";

const menuItems = [
  { label: "Categories", path: "/categories" },
  { label: "Users", path: "/users" },
  { label: "Products", path: "/catalogue/product" },
  { label: "Orders", path: "/sales/orders" },
  { label: "Customers", path: "/customers" },
  { label: "Finance", path: "/finance" },
  { label: "Report", path: "/report" },
  { label: "Support", path: "/support" },
  { label: "Settings", path: "/settings" },
];

const UserManagement = () => {
  const navigate = useNavigate();
  const { users, loading, fetchUsers, toggleStatus, deleteUser } =
    useUserStore();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load data
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter & Sort
  useEffect(() => {
    let filtered = [...users];

    if (searchText) {
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy],
        bVal = b[sortBy];
      if (sortBy === "createdAt") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (sortBy === "modules") {
        aVal = (a.modules || []).length;
        bVal = (b.modules || []).length;
      } else if (typeof aVal === "string") {
        aVal = aVal?.toLowerCase();
        bVal = bVal?.toLowerCase();
      }
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchText, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = users.length - activeUsers;
  const usersWithModules = users.filter(
    (u) => (u.modules || []).length > 0
  ).length;

  // Handlers
  const handleExport = () => {
    const headers = ["Name", "Email", "Modules", "Status", "Created"];
    const rows = filteredUsers.map((u) => [
      u.name || "",
      u.email || "",
      (u.modules || []).length,
      u.isActive ? "Active" : "Inactive",
      new Date(u.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openAddUserPage = () => navigate("/users/add-user");

  const openEditUserPage = (userId) => navigate(`/users/edit-user/${userId}`);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handleStatusChange = async (record, newStatus) => {
    try {
      await toggleStatus(record._id, newStatus);
      toast.success(
        `User ${newStatus === "active" ? "activated" : "deactivated"
        } successfully`
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleClearFilters = () => {
    setSearchText("");
    setSortBy("name");
    setSortOrder("asc");
    setShowAdvancedFilters(false);
  };

  const handlePageSizeChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (isActive) => {
    if (isActive) {
      return "bg-green-50 text-green-700 border border-green-200";
    } else {
      return "bg-red-50 text-red-700 border border-red-200";
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading users...</p>
        </div>
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
            onClick={openAddUserPage}
            className="inline-flex items-center gap-2 bg-[#293a90] hover:bg-[#293a90]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add User
          </button>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 w-full">
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Users
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {totalUsers.toLocaleString()}
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
                  Active Users
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {activeUsers.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-green-50">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  With Modules
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {usersWithModules.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-md bg-[#eb0082]/10">
                <Users className="h-4 w-4 text-[#eb0082]" />
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
                    placeholder="Search by name, email..."
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
                  <option value="name">Sort by Name</option>
                  <option value="email">Sort by Email</option>
                  <option value="modules">Sort by Modules</option>
                  <option value="createdAt">Sort by Date</option>
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

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-visible w-full">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modules
                </th>
                <th className="text-left py-2 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
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
              {paginatedUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-4">
                    <div className="text-xs font-medium text-[#293a90]">
                      {user.firstName} {" "} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {user._id?.slice(-4).toUpperCase() || "N/A"}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-900">
                          {user.email || "N/A"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-xs font-medium text-gray-900">
                    {(user.modules || []).length}
                  </td>
                  <td className="py-2 px-4 text-xs text-gray-900">
                    {formatDate(user.createdAt)}
                  </td>
                  <td
                    className="py-2 px-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value={user.isActive ? "active" : "inactive"}
                      onChange={(e) => handleStatusChange(user, e.target.value)}
                      className={`px-2 py-1 text-xs rounded-full border transition-colors cursor-pointer ${getStatusColor(
                        user.isActive
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditUserPage(user._id)}
                        className="p-1 text-[#293a90] hover:bg-[#293a90]/10 rounded"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-1 text-[#eb0082] hover:bg-[#eb0082]/10 rounded"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedUsers.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-8 h-8 text-gray-300" />
                      <span className="text-xs">No users found</span>
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
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of{" "}
                {filteredUsers.length} results
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
                    className={`px-2 py-1 text-xs rounded ${currentPage === page
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

export default UserManagement;
