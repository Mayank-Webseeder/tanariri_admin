// import { Button } from "antd";
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// const ManageProfilePage = () => {
//   // Initial profile data from the image
//   const initialProfileData = {
//     email: "mahendranamkeen@gmail.com",
//     mobileNumber: "999999999",
//     firstName: "Mahendra",
//     lastName: "Namkeen",
//   };

//   const [profileData, setProfileData] = useState(initialProfileData);
//   const [isChanged, setIsChanged] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Check if data has changed compared to initial state
//   useEffect(() => {
//     const hasChanged = Object.keys(initialProfileData).some(
//       (key) => profileData[key] !== initialProfileData[key]
//     );
//     setIsChanged(hasChanged);
//   }, [profileData]);

//   // Handle input changes
//   const handleChange = (field, value) => {
//     setProfileData((prev) => ({ ...prev, [field]: value }));
//     // Clear any errors for this field when the user starts typing
//     setErrors((prev) => ({ ...prev, [field]: "" }));
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};
//     if (!profileData.email) newErrors.email = "Email is required";
//     if (!profileData.mobileNumber)
//       newErrors.mobileNumber = "Mobile number is required";
//     return newErrors;
//   };

//   // Handle form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formErrors = validateForm();
//     if (Object.keys(formErrors).length === 0) {
//       console.log("Profile updated:", profileData);
//       alert("Profile updated successfully!");
//       setProfileData({ ...profileData });
//       setIsChanged(false);
//       setErrors({});
//     } else {
//       setErrors(formErrors);
//     }
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-4 md:p-6 lg:p-8 ">
//       <div className=" mx-auto ">
//         <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
//           Manage Profile
//         </h1>

//         <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-200">
//           <form onSubmit={handleSubmit}>
//             {/* Email and Mobile Number Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block text-sm text-gray-500 mb-2">
//                   Email <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="email"
//                   className={`w-full p-3 border-b-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 ${
//                     errors.email ? "border-red-500" : ""
//                   }`}
//                   value={profileData.email}
//                   onChange={(e) => handleChange("email", e.target.value)}
//                   disabled
//                 />
//                 {errors.email && (
//                   <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-500 mb-2">
//                   Mobile Number <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex">
//                   <div className="flex items-center justify-center  border-b-2 border-gray-300 border-r-0 rounded-l p-2 w-12">
//                     <img
//                       src="https://flagcdn.com/24x18/in.png"
//                       alt="India flag"
//                       className="w-6 h-4"
//                     />
//                   </div>
//                   <input
//                     type="telephone"
//                     className={`w-full p-3 border-b-2 border-gray-300 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-200 ${
//                       errors.mobileNumber ? "border-red-500" : ""
//                     }`}
//                     value={profileData.mobileNumber}
//                     onChange={(e) =>
//                       handleChange("mobileNumber", e.target.value)
//                     }
//                     disabled // Disable the input field
//                   />
//                 </div>
//                 {errors.mobileNumber && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.mobileNumber}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* First Name and Last Name Row */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//               <div>
//                 <label className="block text-sm text-gray-500 mb-2">
//                   First Name
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full p-3 border-b-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
//                   value={profileData.firstName}
//                   onChange={(e) => handleChange("firstName", e.target.value)}
//                   disabled // Disable the input field
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-500 mb-2">
//                   Last Name
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full p-3 border-b-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
//                   value={profileData.lastName}
//                   onChange={(e) => handleChange("lastName", e.target.value)}
//                   disabled // Disable the input field
//                 />
//               </div>
//             </div>
//           </form>

//             <div className="flex justify-end gap-4">
//             <Link to='/statistics'>
//               <button
//                 type="button"
//                 className="bg-red-500 !text-white cursor-pointer px-4 py-2 rounded-lg hover:bg-red-600"
//               >
//                 Cancel
//               </button>
//               </Link>
//               </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManageProfilePage;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Save,
  X,
  Edit3,
  Camera,
  MapPin,
  Briefcase,
  Calendar,
  Shield,
} from "lucide-react";

const ManageProfilePage = () => {
  // Initial profile data
  const initialProfileData = {
    email: "mahendranamkeen@gmail.com",
    mobileNumber: "999999999",
    firstName: "Mahendra",
    lastName: "Namkeen",
    department: "Administration",
    role: "Super Admin",
    joinDate: "Jan 15, 2024",
    lastLogin: "Oct 23, 2025",
  };

  const [profileData, setProfileData] = useState(initialProfileData);
  const [isChanged, setIsChanged] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Check if data has changed compared to initial state
  useEffect(() => {
    const hasChanged = Object.keys(initialProfileData).some(
      (key) => profileData[key] !== initialProfileData[key]
    );
    setIsChanged(hasChanged);
  }, [profileData]);

  // Handle input changes
  const handleChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!profileData.email) newErrors.email = "Email is required";
    if (!profileData.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required";
    if (!profileData.firstName) newErrors.firstName = "First name is required";
    if (!profileData.lastName) newErrors.lastName = "Last name is required";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      console.log("Profile updated:", profileData);
      // TODO: Add API call here
      setIsChanged(false);
      setIsEditing(false);
      setErrors({});
    } else {
      setErrors(formErrors);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setProfileData(initialProfileData);
    setIsEditing(false);
    setIsChanged(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Header */}
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Manage Profile
          </h1>
          <p className="text-gray-600 text-sm">
            Update your personal information and account settings
          </p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                {/* Profile Picture */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-blue-600" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-[#293a90] text-white rounded-full hover:bg-[#293a90]/90 transition-colors">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{profileData.role}</p>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 bg-[#293a90] hover:bg-[#293a90]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Account Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Account Information
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {profileData.department}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Joined {profileData.joinDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Last login: {profileData.lastLogin}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h2>
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                        errors.firstName
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } ${
                        !isEditing ? "bg-gray-50" : ""
                      } focus:outline-none focus:ring-2`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                        errors.lastName
                          ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                          : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      } ${
                        !isEditing ? "bg-gray-50" : ""
                      } focus:outline-none focus:ring-2`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        disabled={!isEditing}
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-colors ${
                          errors.email
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        } ${
                          !isEditing ? "bg-gray-50" : ""
                        } focus:outline-none focus:ring-2`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <div className="flex items-center justify-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                        <img
                          src="https://flagcdn.com/24x18/in.png"
                          alt="India flag"
                          className="w-5 h-4"
                        />
                        <span className="ml-2 text-sm text-gray-600">+91</span>
                      </div>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={profileData.mobileNumber}
                          onChange={(e) =>
                            handleChange("mobileNumber", e.target.value)
                          }
                          disabled={!isEditing}
                          className={`block w-full pl-10 pr-3 py-2 border border-l-0 rounded-r-lg text-sm transition-colors ${
                            errors.mobileNumber
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                          } ${
                            !isEditing ? "bg-gray-50" : ""
                          } focus:outline-none focus:ring-2`}
                        />
                      </div>
                    </div>
                    {errors.mobileNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Work Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={profileData.department}
                      onChange={(e) =>
                        handleChange("department", e.target.value)
                      }
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg text-sm transition-colors ${
                        !isEditing ? "bg-gray-50" : ""
                      } border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:ring-2`}
                    >
                      <option value="Administration">Administration</option>
                      <option value="Sales">Sales</option>
                      <option value="Operations">Operations</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Contact administrator to change role
                    </p>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={!isChanged}
                      className={`inline-flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isChanged
                          ? "bg-[#293a90] hover:bg-[#293a90]/90 text-white"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/change-password"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Change Password
                    </h4>
                    <p className="text-xs text-gray-500">
                      Update your account password
                    </p>
                  </div>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Account Settings
                    </h4>
                    <p className="text-xs text-gray-500">
                      Manage your preferences
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProfilePage;
