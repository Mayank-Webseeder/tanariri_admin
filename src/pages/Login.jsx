// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import useAdminStore from "../store/useAdminStore"; // Adjust the path to your store
// import { FaSpinner } from "react-icons/fa"; // Import FaSpinner from react-icons

// export default function Login() {
//   const { checkAuth, user } = useAdminStore();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Array for 6 OTP digits
//   const [errors, setErrors] = useState({
//     email: "",
//     password: "",
//     otp: "",
//   });
//   const [loading, setLoading] = useState(false); // Add loading state

//   const otpInputs = useRef([]); // Refs for OTP input fields
//   const navigate = useNavigate();
//   const location = useLocation();
//   const sendOtp = useAdminStore((state) => state.sendOtp);
//   const verifyOtp = useAdminStore((state) => state.verifyOtp);
//   const loginAdmin = useAdminStore((state) => state.loginAdmin);

//   // Handle changes in email and password inputs
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   // Handle changes in OTP inputs
//   const handleOtpChange = (e, index) => {
//     const value = e.target.value;
//     if (/^[0-9]$/.test(value) || value === "") {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);
//       // Move to next input if a digit is entered
//       if (value && index < 5) {
//         otpInputs.current[index + 1].focus();
//       }
//     }
//     if (errors.otp) {
//       setErrors((prev) => ({ ...prev, otp: "" }));
//     }
//   };

//   // Handle backspace to move to previous input
//   const handleOtpKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       otpInputs.current[index - 1].focus();
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!otpSent) {
//       // Step 1: Validate and send OTP
//       let tempErrors = {};
//       if (!formData.email) {
//         tempErrors.email = "Email is required";
//       } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//         tempErrors.email = "Email is invalid";
//       }
//       if (!formData.password) {
//         tempErrors.password = "Password is required";
//       } else if (formData.password.length < 6) {
//         tempErrors.password = "Password must be at least 6 characters";
//       }

//       if (Object.keys(tempErrors).length > 0) {
//         setErrors(tempErrors);
//         return;
//       }

//       try {
//         setLoading(true); // Start loading
//         await sendOtp({ email: formData.email, password: formData.password });
//         setOtpSent(true);
//         setErrors({});
//       } catch (error) {
//         console.error("Send OTP Error:", error);
//         setErrors({ email: "Failed to send OTP. Check email and password." });
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     } else {
//       // Step 2: Verify OTP and login
//       const otpValue = otp.join("");
//       if (otpValue.length !== 6) {
//         setErrors({ otp: "Please enter a 6-digit OTP" });
//         return;
//       }

//       try {
//         setLoading(true); // Start loading
//         await verifyOtp({ email: formData.email, otp: otpValue });
//         await loginAdmin({
//           email: formData.email,
//           password: formData.password,
//         });

//         await checkAuth(); // Check authentication after login

//         navigate(location.state?.from?.pathname || "/statistics", {
//           replace: true,
//         });
//       } catch (error) {
//         console.error("Verify OTP or Login Error:", error);
//         setErrors({ otp: "Invalid OTP or login failed" });
//       } finally {
//         setLoading(false); // Stop loading
//       }
//     }
//   };

//   // Set focus on the first OTP input when OTP stage begins
//   useEffect(() => {
//     if (otpSent && otpInputs.current[0]) {
//       otpInputs.current[0].focus();
//     }
//   }, [otpSent]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden">
//         {/* Image Section */}
//         <div
//           className="hidden md:flex md:w-1/2 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://i.pinimg.com/originals/d0/53/f2/d053f2394d420d8d3712046f4e8f80cc.jpg')",
//           }}
//         ></div>

//         {/* Form Section */}
//         <div className="w-full md:w-1/2 bg-purple-200 p-8">
//           <div className="max-w-md mx-auto">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//               Admin Login
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Email Input */}
//               {!otpSent && (
//                 <div>
//                   <label
//                     htmlFor="email"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`mt-1 block w-full px-3 py-2 border ${
//                       errors.email ? "border-red-500" : "border-gray-300"
//                     } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//                     placeholder="you@example.com"
//                   />
//                   {errors.email && (
//                     <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//                   )}
//                 </div>
//               )}

//               {/* Password Input */}
//               {!otpSent && (
//                 <div>
//                   <label
//                     htmlFor="password"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     id="password"
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`mt-1 block w-full px-3 py-2 border ${
//                       errors.password ? "border-red-500" : "border-gray-300"
//                     } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//                     placeholder="••••••••"
//                   />
//                   {errors.password && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.password}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {/* OTP Inputs */}
//               {otpSent && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">
//                     Enter OTP
//                   </label>
//                   <div className="flex space-x-2 mt-1">
//                     {otp.map((digit, index) => (
//                       <input
//                         key={index}
//                         type="text"
//                         maxLength="1"
//                         value={digit}
//                         onChange={(e) => handleOtpChange(e, index)}
//                         onKeyDown={(e) => handleOtpKeyDown(e, index)}
//                         ref={(el) => (otpInputs.current[index] = el)}
//                         className={`w-12 h-12 text-center px-3 py-2 border ${
//                           errors.otp ? "border-red-500" : "border-gray-300"
//                         } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//                       />
//                     ))}
//                   </div>
//                   {errors.otp && (
//                     <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
//                   )}
//                   <p className="mt-2 text-sm text-gray-600">
//                     OTP sent to {formData.email}
//                   </p>
//                 </div>
//               )}

//               {/* Submit Button with Loading */}
//               <button
//                 type="submit"
//                 disabled={loading} // Disable button during loading
//                 className={`w-full flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ${
//                   loading ? "opacity-75 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {loading ? (
//                   <FaSpinner className="animate-spin mr-2" />
//                 ) : otpSent ? (
//                   "Verify OTP"
//                 ) : (
//                   "Send OTP"
//                 )}
//               </button>
//             </form>

//             {/* Additional Links */}
//             <div className="mt-4 text-center text-sm text-gray-600">
//               <p>
//                 Forgot your password?{" "}
//                 <a href="#" className="text-indigo-600 hover:text-indigo-800">
//                   Reset it
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import useAdminStore from "../store/useAdminStore"; // Adjust the path to your store
// import { FaSpinner } from "react-icons/fa"; // Import FaSpinner from react-icons

// export default function Login() {
//   const { checkAuth, user } = useAdminStore();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false); // Add loading state

//   const navigate = useNavigate();
//   const location = useLocation();
//   const loginAdmin = useAdminStore((state) => state.loginAdmin);

//   // Handle changes in email and password inputs
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   // Handle form submission - Direct login without OTP
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate form inputs
//     let tempErrors = {};
//     if (!formData.email) {
//       tempErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       tempErrors.email = "Email is invalid";
//     }
//     if (!formData.password) {
//       tempErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       tempErrors.password = "Password must be at least 6 characters";
//     }

//     if (Object.keys(tempErrors).length > 0) {
//       setErrors(tempErrors);
//       return;
//     }

//     try {
//       setLoading(true); // Start loading

//       // Direct login API call
//       await loginAdmin({
//         email: formData.email,
//         password: formData.password,
//       });

//       // Check authentication after successful login
//       await checkAuth();

//       // Navigate to dashboard or intended route
//       navigate(location.state?.from?.pathname || "/statistics", {
//         replace: true,
//       });

//       setErrors({}); // Clear any previous errors
//     } catch (error) {
//       console.error("Login Error:", error);
//       setErrors({
//         email: "Invalid email or password. Please try again.",
//       });
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden">
//         {/* Image Section */}
//         <div
//           className="hidden md:flex md:w-1/2 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://i.pinimg.com/originals/d0/53/f2/d053f2394d420d8d3712046f4e8f80cc.jpg')",
//           }}
//         ></div>

//         {/* Form Section */}
//         <div className="w-full md:w-1/2 bg-purple-200 p-8">
//           <div className="max-w-md mx-auto">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//               Admin Login
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Email Input */}
//               <div>
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Email
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`mt-1 block w-full px-3 py-2 border ${
//                     errors.email ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//                   placeholder="you@example.com"
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//                 )}
//               </div>

//               {/* Password Input */}
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`mt-1 block w-full px-3 py-2 border ${
//                     errors.password ? "border-red-500" : "border-gray-300"
//                   } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
//                   placeholder="••••••••"
//                 />
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//                 )}
//               </div>

//               {/* Submit Button with Loading */}
//               <button
//                 type="submit"
//                 disabled={loading} // Disable button during loading
//                 className={`w-full flex justify-center items-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ${
//                   loading ? "opacity-75 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {loading ? (
//                   <>
//                     <FaSpinner className="animate-spin mr-2" />
//                     Logging in...
//                   </>
//                 ) : (
//                   "Login"
//                 )}
//               </button>
//             </form>

//             {/* Additional Links */}
//             <div className="mt-4 text-center text-sm text-gray-600">
//               <p>
//                 Forgot your password?{" "}
//                 <a href="#" className="text-indigo-600 hover:text-indigo-800">
//                   Reset it
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import useAdminStore from "../store/useAdminStore";
// import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
// import { Mail, Lock, Shield, ArrowRight } from "lucide-react";

// export default function Login() {
//   const { checkAuth, user, initializeAuth } = useAdminStore();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const loginAdmin = useAdminStore((state) => state.loginAdmin);

//   // Initialize authentication on component mount
//   useEffect(() => {
//     initializeAuth();
//     // If user is already logged in, redirect to dashboard
//     if (user) {
//       navigate(location.state?.from?.pathname || "/statistics", {
//         replace: true,
//       });
//     }
//   }, [user, navigate, location.state?.from?.pathname, initializeAuth]);

//   // Handle changes in email and password inputs
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate form inputs
//     let tempErrors = {};
//     if (!formData.email) {
//       tempErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       tempErrors.email = "Email is invalid";
//     }
//     if (!formData.password) {
//       tempErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       tempErrors.password = "Password must be at least 6 characters";
//     }

//     if (Object.keys(tempErrors).length > 0) {
//       setErrors(tempErrors);
//       return;
//     }

//     try {
//       setLoading(true);

//       const loginResponse = await loginAdmin({
//         email: formData.email,
//         password: formData.password,
//       });

//       // Store user data in localStorage after successful login
//       if (loginResponse.admin) {
//         localStorage.setItem("adminUser", JSON.stringify(loginResponse.admin));
//       }

//       await checkAuth();

//       navigate(location.state?.from?.pathname || "/statistics", {
//         replace: true,
//       });

//       setErrors({});
//     } catch (error) {
//       console.error("Login Error:", error);
//       setErrors({
//         email: "Invalid email or password. Please try again.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl w-full">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="flex flex-col lg:flex-row">
//             {/* Left Section */}
//             <div className="hidden lg:block lg:w-1/2 relative">
//               <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
//                 <div className="flex items-center justify-center h-full">
//                   <div className="text-center text-white">
//                     <h1 className="text-4xl font-bold">shopvii</h1>
//                     <p className="text-blue-100 text-lg mt-2">Admin Portal</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Form Section */}
//             <div className="w-full lg:w-1/2 p-8 lg:p-12">
//               <div className="max-w-md mx-auto">
//                 {/* Mobile Header */}
//                 <div className="text-center mb-8 lg:hidden">
//                   <h1 className="text-2xl font-bold text-gray-900">shopvii</h1>
//                 </div>

//                 {/* Login Header */}
//                 <div className="mb-8">
//                   <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                     Welcome back
//                   </h2>
//                   <p className="text-gray-600 text-sm">
//                     Sign in to your admin account
//                   </p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Email Input */}
//                   <div>
//                     <label
//                       htmlFor="email"
//                       className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                       Email address
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Mail className="h-4 w-4 text-gray-400" />
//                       </div>
//                       <input
//                         type="email"
//                         id="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-sm transition-colors ${
//                           errors.email
//                             ? "border-red-300 focus:ring-red-500 focus:border-red-500"
//                             : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                         } focus:outline-none focus:ring-2`}
//                         placeholder="admin@shopvii.com"
//                       />
//                     </div>
//                     {errors.email && (
//                       <p className="mt-2 text-sm text-red-600">
//                         {errors.email}
//                       </p>
//                     )}
//                   </div>

//                   {/* Password Input */}
//                   <div>
//                     <label
//                       htmlFor="password"
//                       className="block text-sm font-medium text-gray-700 mb-2"
//                     >
//                       Password
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Lock className="h-4 w-4 text-gray-400" />
//                       </div>
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         id="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         className={`block w-full pl-10 pr-10 py-3 border rounded-lg text-sm transition-colors ${
//                           errors.password
//                             ? "border-red-300 focus:ring-red-500 focus:border-red-500"
//                             : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                         } focus:outline-none focus:ring-2`}
//                         placeholder="Enter your password"
//                       />
//                       <button
//                         type="button"
//                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? (
//                           <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
//                         ) : (
//                           <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
//                         )}
//                       </button>
//                     </div>
//                     {errors.password && (
//                       <p className="mt-2 text-sm text-red-600">
//                         {errors.password}
//                       </p>
//                     )}
//                   </div>

//                   {/* Remember Me & Forgot Password */}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <input
//                         id="remember-me"
//                         name="remember-me"
//                         type="checkbox"
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                       <label
//                         htmlFor="remember-me"
//                         className="ml-2 block text-sm text-gray-700"
//                       >
//                         Remember me
//                       </label>
//                     </div>
//                     <div className="text-sm">
//                       <a
//                         href="/forgot-password"
//                         className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
//                       >
//                         Forgot password?
//                       </a>
//                     </div>
//                   </div>

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className={`w-full flex justify-center items-center gap-2 bg-[#293a90] hover:bg-[#293a90]/90 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
//                       loading
//                         ? "opacity-75 cursor-not-allowed"
//                         : "hover:shadow-md"
//                     }`}
//                   >
//                     {loading ? (
//                       <>
//                         <FaSpinner className="animate-spin w-4 h-4" />
//                         Signing in...
//                       </>
//                     ) : (
//                       <>
//                         Sign in
//                         <ArrowRight className="w-4 h-4" />
//                       </>
//                     )}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAdminStore from "../store/useAdminStore";
import { FaSpinner, FaEye, FaEyeSlash } from "react-icons/fa";
import { Mail, Lock, Shield, ArrowRight } from "lucide-react";

export default function Login() {
  const { checkAuth, user, initializeAuth, clearAuth } = useAdminStore(); // ✅ Add clearAuth
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const loginAdmin = useAdminStore((state) => state.loginAdmin);

  // ✅ Get error message from navigation state (from Statistics redirect)
  const errorFromRedirect = location.state?.error;

  // Carousel slides with professional images
  const carouselSlides = [
    {
      title: "Admin Dashboard",
      subtitle: "Manage your e-commerce platform with powerful tools",
      image:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=faces",
    },
    {
      title: "Analytics & Reports",
      subtitle: "Track performance and gain insights with detailed analytics",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=faces",
    },
    {
      title: "Secure Access",
      subtitle: "Your data is protected with enterprise-grade security",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&crop=faces",
    },
  ];

  // Initialize authentication on component mount
  useEffect(() => {
    initializeAuth();
    // If user is already logged in with valid role, redirect to dashboard
    if (user && (user.role === "admin" || user.role === "userpannel")) {
      navigate(location.state?.from?.pathname || "/statistics", {
        replace: true,
      });
    }
  }, [user, navigate, location.state?.from?.pathname, initializeAuth]);

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  // Handle changes in email and password inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    try {
      setLoading(true);

      const loginResponse = await loginAdmin({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login Response:", loginResponse); // Debug

      // Check if login was successful
      if (loginResponse?.data?.user) {
        const userRole = loginResponse.data.user.role;

        // ✅ Check if user role is authorized
        if (userRole === "admin" || userRole === "userpannel") {
          // Authorized - Clear errors and navigate
          setErrors({});
          navigate(location.state?.from?.pathname || "/statistics", {
            replace: true,
          });
        } else {
          // ❌ Unauthorized role - clear everything
          setErrors({
            email: `Access denied. Role '${userRole}' is not authorized for this portal.`,
          });

          // ✅ Clear store and localStorage
          clearAuth();
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrors({
        email:
          error?.response?.data?.message ||
          "Invalid email or password. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Side - Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {carouselSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-700 ease-in-out ${index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                  ? "-translate-x-full"
                  : "translate-x-full"
              }`}
          >
            <div className="h-full relative">
              {/* Background Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8 z-10">
                  <h2 className="text-5xl font-bold text-white mb-6">
                    {slide.title}
                  </h2>
                  <p className="text-xl text-gray-200 max-w-md mx-auto leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/60"
                }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-10">
            <img
              src="/TanaRiri_Logo.png"
              alt="E-com"
              className="h-12 mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your admin account to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ✅ Show error from redirect (Statistics page) */}
            {errorFromRedirect && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errorFromRedirect}
              </div>
            )}

            {/* General Error Display */}
            {errors.email && !formData.email && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {errors.email}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 ${errors.email && formData.email
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                    }`}
                  placeholder="Enter your email"
                  required
                  autoFocus
                />
              </div>
              {errors.email && formData.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500 ${errors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                    }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-[#293a90] text-white font-semibold rounded-lg hover:bg-[#293a90]/90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 ${loading ? "opacity-75 cursor-not-allowed" : ""
                }`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin w-4 h-4" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Secured by WebSeeder Technology
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
