// import React, { useState } from "react";
// import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
// import DashBoard from "../../pages/DashBoard";
// import { useNavigate } from 'react-router-dom';

// const orders = [
//   { status: "Pending", id: 577, total: 2844, date: "21 hours ago" },
//   { status: "Pending", id: 576, total: 1926, date: "a day ago" },
//   { status: "Pending", id: 575, total: 2520, date: "a day ago" },
//   { status: "Pending", id: 574, total: 2408, date: "a day ago" },
//   { status: "Delivered", id: 573, total: 1932, date: "3 days ago" },
//   { status: "Delivered", id: 572, total: 2315, date: "3 days ago" },
//   { status: "Shipped", id: 571, total: 4280, date: "4 days ago" },
//   { status: "Shipped", id: 570, total: 2003, date: "6 days ago" },
//   { status: "Shipped", id: 569, total: 3673, date: "6 days ago" },
// ];

// const statusCounts = orders.reduce((acc, order) => {
//   acc[order.status] = (acc[order.status] || 0) + 1;
//   return acc;
// }, {});

// const RecentOrders = () => {
//   const [filter, setFilter] = useState("Recent Orders");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8; // Change as needed

//   // Filter orders based on selected filter
//   const filteredOrders =
//     filter === "Recent Orders"
//       ? orders
//       : orders.filter((order) => order.status === filter);

//   // Calculate total pages based on filtered orders
//   const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

//   // Slice the filtered orders to show only the current page
//   const paginatedOrders = filteredOrders.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate('/sales/orders');
//   };

//   return (
//     <DashBoard>
//       <div className="p-6">
//         {/* Filters */}
//         <div className="flex justify-between items-center mb-4 cursor-pointer rounded shadow-md py-3 bg-gray-50 px-4">
//           <div className="flex overflow-x-auto whitespace-nowrap space-x-2 md:flex md:overflow-x-auto md:gap-3">
//             {[
//               "Recent Orders",
//               "Pending",
//               "Delivered",
//               "Shipped",
//               "Cancelled",
//             ].map((status) => (
//               <button
//                 key={status}
//                 className={`px-4 py-2 rounded-full text-sm md:text-base cursor-pointer ${filter === status
//                   ? "text-blue-800 border-b-2 border-[#1890ff]"
//                   : "text-blue-800"
//                   }`}
//                 onClick={() => {
//                   setFilter(status);
//                   setCurrentPage(1);
//                 }}
//               >
//                 {status} ({statusCounts[status] || 0})
//               </button>
//             ))}
//           </div>
//           <button
//             className="text-[#1890ff] ml-4 shrink-0 cursor-pointer hover:text-blue-600 hover:underline"
//             onClick={handleClick}
//           >
//             View more
//           </button>
//         </div>

//         {/* Orders Table */}
//         <div className="overflow-x-auto rounded shadow-md">
//           <table className="w-full min-w-[600px]">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-100 text-left ">
//                 <th className="p-3 text-md font-lg">Order Status</th>

//                 <th className="p-2 text-md font-lg">Id</th>
//                 <th className="p-2 text-md font-lg">Total</th>
//                 <th className="p-2 text-md font-lg ">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedOrders.map((order) => (
//                 <tr
//                   key={order.id}
//                   className="border-b border-gray-100 bg-white text-left hover:bg-gray-100"
//                 >
//                   <td className="p-3 text-m font-sm">{order.status}</td>
//                   <td className="p-2 text-m font-sm text-[#3498db]">Order #{order.id}</td>
//                   <td className="p-2 text-m font-sm ">₹{order.total.toFixed(2)}</td>
//                   <td className="p-2 text-m font-sm ">{order.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="flex justify-end items-center space-x-2 mt-6">
//             <button
//               className={`p-2 rounded ${currentPage === 1
//                 ? "opacity-50 cursor-not-allowed"
//                 : "hover:bg-gray-200"
//                 }`}
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((prev) => prev - 1)}
//             >
//               &lt;
//             </button>

//             <div className="flex space-x-1">
//               {Array.from({ length: totalPages }, (_, index) => (
//                 <button
//                   key={index + 1}
//                   onClick={() => setCurrentPage(index + 1)}
//                   className={`w-8 h-8 rounded flex items-center justify-center text-sm ${currentPage === index + 1
//                     ? "border-2 border-blue-500 text-black font-medium"
//                     : "hover:bg-gray-100"
//                     }`}
//                 >
//                   {index + 1}
//                 </button>
//               ))}
//             </div>

//             <button
//               className={`p-2 rounded ${currentPage === totalPages
//                 ? "opacity-50 cursor-not-allowed"
//                 : "hover:bg-gray-200"
//                 }`}
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//             >
//               &gt;
//             </button>
//           </div>
//         )}
//       </div>
//     </DashBoard>
//   );
// };

// export default RecentOrders;

import React, { useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import DashBoard from "../../pages/DashBoard";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  X,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

const orders = [
  { status: "Pending", id: 577, total: 2844, date: "21 hours ago" },
  { status: "Pending", id: 576, total: 1926, date: "a day ago" },
  { status: "Pending", id: 575, total: 2520, date: "a day ago" },
  { status: "Pending", id: 574, total: 2408, date: "a day ago" },
  { status: "Delivered", id: 573, total: 1932, date: "3 days ago" },
  { status: "Delivered", id: 572, total: 2315, date: "3 days ago" },
  { status: "Shipped", id: 571, total: 4280, date: "4 days ago" },
  { status: "Shipped", id: 570, total: 2003, date: "6 days ago" },
  { status: "Shipped", id: 569, total: 3673, date: "6 days ago" },
];

const statusCounts = orders.reduce((acc, order) => {
  acc[order.status] = (acc[order.status] || 0) + 1;
  return acc;
}, {});

const RecentOrders = () => {
  const [filter, setFilter] = useState("Recent Orders");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter orders based on selected filter
  const filteredOrders =
    filter === "Recent Orders"
      ? orders
      : orders.filter((order) => order.status === filter);

  // Calculate total pages based on filtered orders
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Slice the filtered orders to show only the current page
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/sales/orders");
  };

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

  return (
    <DashBoard>
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="p-4 w-full">
          {/* Header with Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex overflow-x-auto whitespace-nowrap space-x-2 w-full sm:w-auto">
                {[
                  "Recent Orders",
                  "Pending",
                  "Delivered",
                  "Shipped",
                  "Cancelled",
                ].map((status) => (
                  <button
                    key={status}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      filter === status
                        ? "bg-[#293a90] text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300"
                    }`}
                    onClick={() => {
                      setFilter(status);
                      setCurrentPage(1);
                    }}
                  >
                    {status} ({statusCounts[status] || 0})
                  </button>
                ))}
              </div>
              <button
                className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline transition-colors shrink-0"
                onClick={handleClick}
              >
                View more
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-visible w-full">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      <td className="py-3 px-4">
                        <div
                          className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-medium text-blue-600">
                          Order #{order.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-medium text-gray-900">
                          ₹{order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-gray-600">
                          {order.date}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {paginatedOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
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
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between w-full">
                <div className="text-xs text-gray-700">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredOrders.length)}{" "}
                  of {filteredOrders.length} results
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
    </DashBoard>
  );
};

export default RecentOrders;
