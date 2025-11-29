// import React from "react";
// import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ComposedChart } from "recharts";
// import { FiBarChart, FiCalendar, FiImage, FiShoppingCart } from "react-icons/fi";
// import { AiFillBuild, AiFillContacts, AiOutlineRise } from "react-icons/ai";
// import { ResponsiveContainer } from 'recharts';
// import DashBoard from "../../pages/DashBoard";

// const data = [
//   { date: "2025-02-25", orders: 3, amount: 5000 },
//   { date: "2025-02-26", orders: 1, amount: 0 },
//   { date: "2025-02-27", orders: 2, amount: 3000 },
//   { date: "2025-02-28", orders: 2, amount: 7000 },
//   { date: "2025-03-01", orders: 1, amount: 1000 },
//   { date: "2025-03-02", orders: 4, amount: 12000 },
//   { date: "2025-03-03", orders: 0, amount: 0 },
// ];

// const Statistics = () => {
//   return (
//     <DashBoard>
//       <div className="p-6">

//         {/* Cards Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 mb-6">
//           <div className="p-4 bg-white shadow-md rounded-lg flex flex-col ">
//             <p className="text-sm w-35">NO. OF ORDER(S) / AVG ORDER AMOUNT</p>
//             <div className="flex items-center gap-2 mt-2">
//               <FiShoppingCart className="text-white bg-red-500 text-3xl px-2" />
//               <h2 className="text-lg font-semibold">9</h2>
//               <div className="flex-col">
//                 <AiOutlineRise className="text-green-500 text-lg " />
//                 <p className="text-green-500 flex items-center text-sm mb-3"> 300%</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <FiImage className="text-white bg-yellow-500 text-3xl px-2" />
//               <h3 className="text-md font-semibold">₹2,655.67</h3>
//             </div>
//           </div>
//           <div className="p-4 bg-white shadow-md rounded-lg">
//             <p className="text-sm">ORDER AMOUNT</p>
//             <div className="flex  items-center gap-2 mt-2">
//               <FiBarChart className="bg-green-300 text-white text-3xl px-2" />
//               <h2 className="text-lg font-semibold">₹23,901.00</h2>
//             </div>
//             <div className="flex-col ml-9">
//               <AiOutlineRise className="text-green-500 text-lg " />
//               <p className="text-green-500  text-sm">350.3%</p>
//             </div>
//           </div>

//           <div className="p-4 bg-white shadow-md rounded-lg">
//             <p className="text-sm">TOP SELLER</p>
//             <div className="flex items-center gap-2 mt-2">
//               <AiFillContacts className="bg-blue-500 text-2xl text-white" />
//               <div className="flex-col">
//                 <p className="text-xs">Ratlami Sev 250grm (4)</p>
//                 <p className="text-xs">Khatta Meetha Mixture 250grm (4)</p>
//               </div>
//             </div>
//           </div>
//           <div className="p-4 bg-white shadow-md rounded-lg">
//             <p className="text-sm ">RETURN ($)</p>
//             <div className="flex items-center gap-2 mt-2">
//               <FiCalendar className="bg-blue-500 text-2xl text-white" />
//               <h2 className="text-lg font-bold">0 Request(s)</h2>
//             </div>
//           </div>
//         </div>

//         {/* Chart Section */}
//         <div className="bg-white p-6 shadow-md rounded-lg w-full">
//           <ResponsiveContainer width="100%" height={350}>
//             <ComposedChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis yAxisId="left" orientation="left" />
//               <YAxis yAxisId="right" orientation="right" />
//               <Tooltip />
//               <Legend />

//               {/* Bar for Order Amount */}
//               <Bar yAxisId="left" dataKey="amount" fill="#82ca9d" barSize={30} />

//               {/* Line for No. of Orders */}
//               <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#00bcd4" strokeWidth={2} dot={{ r: 5 }} />
//             </ComposedChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </DashBoard>
//   );
// };

// export default Statistics;


import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from "recharts";
import {
  FiBarChart,
  FiCalendar,
  FiImage,
  FiShoppingCart,
} from "react-icons/fi";
import { AiFillBuild, AiFillContacts, AiOutlineRise } from "react-icons/ai";
import { ResponsiveContainer } from "recharts";
import { ShoppingBag, TrendingUp, Users, RefreshCw } from "lucide-react";
import DashBoard from "../../pages/DashBoard";
import useAdminStore from "../../store/useAdminStore";
// import useAdminStore from "../store/useAdminStore"; 

const data = [
  { date: "2025-02-25", orders: 3, amount: 5000 },
  { date: "2025-02-26", orders: 1, amount: 0 },
  { date: "2025-02-27", orders: 2, amount: 3000 },
  { date: "2025-02-28", orders: 2, amount: 7000 },
  { date: "2025-03-01", orders: 1, amount: 1000 },
  { date: "2025-03-02", orders: 4, amount: 12000 },
  { date: "2025-03-03", orders: 0, amount: 0 },
];

const Statistics = () => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAdminStore(); // Get user from store

  //  Auto redirect effect - check user role on mount
  useEffect(() => {
    // If no user, redirect to login
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    // If user role is not admin or userpannel, clear auth and redirect
    if (user.role !== "admin" && user.role !== "userpannel") {
      console.log("Unauthorized role detected:", user.role);
      clearAuth(); // Clear localStorage and state
      navigate("/login", {
        replace: true,
        state: {
          error: `Access denied. Role '${user.role}' is not authorized.`
        }
      });
    }
  }, [user, navigate, clearAuth]);

  //  Don't render anything if user is unauthorized
  if (!user || (user.role !== "admin" && user.role !== "userpannel")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <DashBoard>
      <div className="w-full">
        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 w-full">
          {/* Orders & Average Order Amount Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  NO. OF ORDERS / AVG ORDER AMOUNT
                </p>
              </div>
              <div className="p-2 rounded-md bg-blue-50">
                <ShoppingBag className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">9</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    300%
                  </span>
                </div>
              </div>
              <div className="pt-1 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-900">
                  ₹2,655.67
                </span>
                <span className="text-xs text-gray-500 ml-1">avg</span>
              </div>
            </div>
          </div>

          {/* Order Amount Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  ORDER AMOUNT
                </p>
                <p className="text-lg font-bold text-gray-900">₹23,901.00</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    350.3%
                  </span>
                </div>
              </div>
              <div className="p-2 rounded-md bg-green-50">
                <FiBarChart className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>

          {/* Top Seller Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  TOP SELLER
                </p>
              </div>
              <div className="p-2 rounded-md bg-purple-50">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-900">
                Ratlami Sev 250grm (4)
              </p>
              <p className="text-xs text-gray-600">
                Khatta Meetha Mixture 250grm (4)
              </p>
            </div>
          </div>

          {/* Returns Card */}
          <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  RETURNS
                </p>
                <p className="text-lg font-bold text-gray-900">0 Request(s)</p>
              </div>
              <div className="p-2 rounded-md bg-orange-50">
                <RefreshCw className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 w-full">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              Orders & Revenue Analytics
            </h3>
            <p className="text-xs text-gray-600">
              Track your order volume and revenue trends
            </p>
          </div>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />

                {/* Bar for Order Amount */}
                <Bar
                  yAxisId="left"
                  dataKey="amount"
                  fill="#3b82f6"
                  name="Order Amount (₹)"
                  barSize={30}
                  radius={[2, 2, 0, 0]}
                />

                {/* Line for No. of Orders */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#10b981" }}
                  name="Number of Orders"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashBoard>
  );
};

export default Statistics;
