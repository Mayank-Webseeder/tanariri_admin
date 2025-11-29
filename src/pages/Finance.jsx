import React, { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PiggyBank,
  Receipt,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown,
  Filter,
  Download,
  Eye,
} from "lucide-react";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Mock financial data
  const mockTransactions = [
    {
      id: "TXN-001",
      type: "income",
      category: "Sales Revenue",
      description: "Product sales - October batch",
      amount: 45000,
      status: "completed",
      date: "2025-10-26T10:30:00Z",
      paymentMethod: "Bank Transfer",
      reference: "REF-2025-001",
    },
    {
      id: "TXN-002",
      type: "expense",
      category: "Office Rent",
      description: "Monthly office rent payment",
      amount: 15000,
      status: "completed",
      date: "2025-10-25T09:15:00Z",
      paymentMethod: "Auto Debit",
      reference: "REF-2025-002",
    },
    {
      id: "TXN-003",
      type: "income",
      category: "Consulting",
      description: "Web development consultation",
      amount: 12000,
      status: "pending",
      date: "2025-10-24T14:20:00Z",
      paymentMethod: "UPI",
      reference: "REF-2025-003",
    },
    {
      id: "TXN-004",
      type: "expense",
      category: "Marketing",
      description: "Social media advertising",
      amount: 8500,
      status: "completed",
      date: "2025-10-23T11:30:00Z",
      paymentMethod: "Credit Card",
      reference: "REF-2025-004",
    },
    {
      id: "TXN-005",
      type: "income",
      category: "Investment",
      description: "Dividend payment",
      amount: 3200,
      status: "completed",
      date: "2025-10-22T16:45:00Z",
      paymentMethod: "Bank Transfer",
      reference: "REF-2025-005",
    },
    {
      id: "TXN-006",
      type: "expense",
      category: "Utilities",
      description: "Electricity and internet bill",
      amount: 4200,
      status: "pending",
      date: "2025-10-21T12:10:00Z",
      paymentMethod: "Net Banking",
      reference: "REF-2025-006",
    },
    {
      id: "TXN-007",
      type: "income",
      category: "Freelance",
      description: "React component development",
      amount: 25000,
      status: "completed",
      date: "2025-10-20T08:30:00Z",
      paymentMethod: "NEFT",
      reference: "REF-2025-007",
    },
  ];

  // Load transactions
  const loadTransactions = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTransactions(mockTransactions);
      applyFiltersAndSort(mockTransactions);
    } catch (error) {
      console.error("Failed to load transactions:", error);
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
        (transaction) =>
          transaction.description
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          transaction.category
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchText.toLowerCase()) ||
          transaction.paymentMethod
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.type === filterType
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (transaction) => transaction.status === filterStatus
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    applyFiltersAndSort(transactions);
  }, [searchText, filterType, filterStatus, transactions]);

  // Calculate financial metrics
  const totalIncome = transactions
    .filter((t) => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const pendingAmount = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  // Get styling functions
  const getTypeColor = (type) => {
    switch (type) {
      case "income":
        return "bg-green-50 text-green-700 border border-green-200";
      case "expense":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "income":
        return <ArrowUpRight className="w-3 h-3" />;
      case "expense":
        return <ArrowDownLeft className="w-3 h-3" />;
      default:
        return <Receipt className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border border-yellow-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Stats for summary
  const completedTransactions = transactions.filter(
    (t) => t.status === "completed"
  ).length;
  const pendingTransactions = transactions.filter(
    (t) => t.status === "pending"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  TOTAL REVENUE
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{totalIncome.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    +12.5%
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-green-50">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  TOTAL EXPENSES
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{totalExpenses.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-red-500" />
                  <span className="text-xs font-medium text-red-600">
                    +8.2%
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-red-50">
                <CreditCard className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </div>

          {/* Net Profit */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  NET PROFIT
                </p>
                <p
                  className={`text-lg font-bold ${
                    netProfit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{netProfit.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {netProfit >= 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      netProfit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {netProfit >= 0 ? "+15.3%" : "-5.1%"}
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-[#293a90]/10">
                <PiggyBank className="h-4 w-4 text-[#293a90]" />
              </div>
            </div>
          </div>

          {/* Pending Amount */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  PENDING AMOUNT
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{pendingAmount.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3 text-[#eb0082]" />
                  <span className="text-xs font-medium text-[#eb0082]">
                    {pendingTransactions} pending
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-[#eb0082]/10">
                <Receipt className="h-4 w-4 text-[#eb0082]" />
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Transactions
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {transactions.length}
                </p>
              </div>
              <div className="p-2 rounded-md bg-[#293a90]/10">
                <Receipt className="h-4 w-4 text-[#293a90]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Completed
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {completedTransactions}
                </p>
              </div>
              <div className="p-2 rounded-md bg-green-50">
                <Eye className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Pending
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {pendingTransactions}
                </p>
              </div>
              <div className="p-2 rounded-md bg-[#eb0082]/10">
                <Calendar className="h-4 w-4 text-[#eb0082]" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Transactions Table */}
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
                    placeholder="Search transactions..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#293a90]"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-[#293a90]"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>

              {/* Export Button */}
              <button className="flex items-center gap-2 px-3 py-2 text-xs bg-[#293a90] text-white rounded-lg hover:bg-[#293a90]/90 transition-colors">
                <Download className="w-3 h-3" />
                Export
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
                    Loading transactions...
                  </p>
                </div>
              </div>
            ) : paginatedTransactions.length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">No transactions found</p>
                </div>
              </div>
            ) : (
              <div className="min-h-[400px]">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                        Transaction
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                        Payment Method
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                              {transaction.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.category} • #{transaction.id}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                              transaction.type
                            )}`}
                          >
                            {getTypeIcon(transaction.type)}
                            <span className="whitespace-nowrap capitalize">
                              {transaction.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-sm font-medium ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}₹
                            {transaction.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            <span className="whitespace-nowrap capitalize">
                              {transaction.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-900">
                            {transaction.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.date).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
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
                {Math.min(
                  startIndex + itemsPerPage,
                  filteredTransactions.length
                )}{" "}
                of {filteredTransactions.length} transactions
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

export default Finance;
