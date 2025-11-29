// import React, { useState, useRef, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   FaBars,
//   FaUserCircle,
//   FaCog,
//   FaLock,
//   FaPowerOff,
// } from "react-icons/fa";
// import useAdminStore from "../store/useAdminStore";

// // Define menu items (same as in Sidebar) to map paths to labels
// const menuItems = [
//   { label: "Dashboard", icon: FaBars, path: "/dashboard" },
//   {
//     label: "Sales",
//     icon: FaBars,
//     subItems: [
//       { label: "Orders", icon: FaBars, path: "/sales/orders" },
//       { label: "Abandoned Cart", icon: FaBars, path: "/sales/abandoned-cart" },
//       {
//         label: "Cancelled Orders",
//         icon: FaBars,
//         path: "/sales/cancelled-orders",
//       },
//       { label: "Wishlist", icon: FaBars, path: "/sales/wishlist" },
//     ],
//   },
//   {
//     label: "Catalogue",
//     icon: FaBars,
//     subItems: [
//       { label: "Products", icon: FaBars, path: "/catalogue/product" },
//       { label: "Categories", icon: FaBars, path: "/catalogue/categories" },
//     ],
//   },
//   { label: "Customers", icon: FaBars, path: "/customers" },
//   { label: "Distributor", icon: FaBars, path: "/distributor" },
//   { label: "Inquiry", icon: FaBars, path: "/inquiry" },
//   { label: "Settings", icon: FaBars, path: "/settings" },
//   { label: "Help", icon: FaBars, path: "/help" },
// ];

// export default function Navbar({ toggleSidebar }) {
//   const { adminLogout } = useAdminStore();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // Function to get the active label based on the current path
//   const getActiveLabel = () => {
//     // Flatten the menuItems array to include subItems for easier lookup
//     const allItems = menuItems.flatMap((item) =>
//       item.subItems ? [item, ...item.subItems] : [item]
//     );

//     // Find the matching item based on the current pathname
//     const activeItem = allItems.find((item) => {
//       // Handle nested routes (e.g., /sales/orders/addOrder should still show "Orders")
//       return location.pathname.startsWith(item.path);
//     });

//     // Return the label of the active item, or a fallback if no match
//     return activeItem ? activeItem.label : "Dashboard"; // Default to "Dashboard" if no match
//   };

//   const toggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handlelogout = async () => {
//     try {
//       await adminLogout();
//       navigate("/");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <nav className="w-full border-b-2 border-red-600  text-black p-4 flex justify-between items-center">
//       {/* Left Section */}
//       <div className="flex items-center">
//         <FaBars
//           className="mr-4 cursor-pointer md:hidden"
//           size={20}
//           onClick={toggleSidebar}
//         />
//         <span className="text-xl font-semibold">{getActiveLabel()}</span>
//       </div>

//       {/* Right Section */}
//       <div className="relative" ref={dropdownRef}>
//         <div
//           className="flex items-center cursor-pointer"
//           onClick={toggleDropdown}
//         >
//           <FaUserCircle className="w-8 h-8 mr-2" />
//           <span className="hidden sm:inline">Admin</span>
//         </div>

//         {isDropdownOpen && (
//           <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
//             <ul>
//               <li className="p-2 hover:bg-gray-100">
//                 <Link to="/manage-profile" className="flex items-center">
//                   <FaCog className="mr-2" />
//                   Manage Profile
//                 </Link>
//               </li>
//               <li className="p-2 hover:bg-gray-100">
//                 <Link to="/change-password" className="flex items-center">
//                   <FaLock className="mr-2" />
//                   Change Password
//                 </Link>
//               </li>
//               <li
//                 className="p-2 hover:bg-gray-100"
//                 onClick={
//                   () => handlelogout() // Call your logout function heres
//                 }
//               >
//                 <div className="flex items-center">
//                   <FaPowerOff className="mr-2" />
//                   Log Out
//                 </div>
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUserCircle,
  FaCog,
  FaLock,
  FaPowerOff,
  FaChevronDown,
} from "react-icons/fa";
import { User, Settings, Lock, LogOut } from "lucide-react";
import useAdminStore from "../store/useAdminStore";

// Define menu items (flattened to match the updated sidebar)
const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Orders", path: "/sales/orders" },
  { label: "Abandoned Cart", path: "/sales/abandoned-cart" },
  { label: "Cancelled Orders", path: "/sales/cancelled-orders" },
  { label: "Wishlist", path: "/sales/wishlist" },
  { label: "Products", path: "/catalogue/product" },
  { label: "Categories", path: "/catalogue/categories" },
  { label: "Customers", path: "/customers" },
  { label: "Distributor", path: "/distributor" },
  { label: "Inquiry", path: "/inquiry" },
  { label: "Settings", path: "/settings" },
  { label: "Support", path: "/support" },
  { label: "Help", path: "/help" },
  { label: "Manage Profile", path: "/manage-profile" },
  { label: "Change Password", path: "/change-password" },
  { label: "Reports", path: "/report" },
  { label: "Finances", path: "/finance" },
];

export default function Navbar({ toggleSidebar }) {
  const { adminLogout } = useAdminStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Function to get the active label based on the current path
  const getActiveLabel = () => {
    // Find the matching item based on the current pathname
    const activeItem = menuItems.find((item) => {
      // Handle nested routes (e.g., /sales/orders/addOrder should still show "Orders")
      return location.pathname.startsWith(item.path);
    });

    // Return the label of the active item, or a fallback if no match
    return activeItem ? activeItem.label : "Dashboard"; // Default to "Dashboard" if no match
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlelogout = async () => {
    try {
      await adminLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="pr-4 pl-2 py-2 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center ">
          <button
            className="mr-4 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden transition-colors"
            onClick={toggleSidebar}
          >
            <FaBars className="text-gray-600" size={16} />
          </button>

          <img src="/TanaRiri_Logo.png" alt="Logo" className="h-8 w-auto mr-4 " />
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              {getActiveLabel()}
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50  transition-colors"
            onClick={toggleDropdown}
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">Admin</span>
              {/* <FaChevronDown
                className={`text-gray-500 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                size={12}
              /> */}
            </div>
          </button>

          {/* {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="py-1">
                <Link
                  to="/manage-profile"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                  Manage Profile
                </Link>
                <Link
                  to="/change-password"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Lock className="w-4 h-4 text-gray-500" />
                  Change Password
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handlelogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Log Out
                </button>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </nav>
  );
}
