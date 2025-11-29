import React, { useState, useEffect } from "react";
import {
  User,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  Upload,
  Phone,
  Mail,
  X,
} from "lucide-react";
import useUserStore from "../store/useUserStore"; // Import your store
import { toast } from "react-toastify";

const Setting = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get user info and updateUser function from store
  const { updateUser, loading } = useUserStore();

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  // Form state
  const [profileForm, setProfileForm] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@shopvii.com",
    phone: "+91 98765 43210",
    department: "Administration",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  });

  // Get current user ID from localStorage or context
  const currentUserId = localStorage.getItem("userId") || "your-user-id";

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle profile picture selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      setProfilePicture(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile picture
  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
  };

  // Handle profile form change
  const handleProfileFormChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle password form change
  const handlePasswordFormChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();

      // Add profile data
      formData.append("firstName", profileForm.firstName);
      formData.append("lastName", profileForm.lastName);
      formData.append("email", profileForm.email);
      formData.append("phone", profileForm.phone);
      formData.append("department", profileForm.department);

      // Add profile picture if changed
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      await updateUser(currentUserId, formData);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    // Validate passwords
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      await updateUser(currentUserId, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success("Password updated successfully");

      // Reset password form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={handleProfileFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={handleProfileFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    name="department"
                    value={profileForm.department}
                    onChange={handleProfileFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-sm"
                  >
                    <option>Administration</option>
                    <option>Sales</option>
                    <option>Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    value="Super Admin"
                    disabled
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#293a90] hover:bg-[#293a90]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Profile Picture Section */}
            {/* <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Picture
              </h3>
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 bg-[#293a90]/10 rounded-full flex items-center justify-center overflow-hidden">
                  {profilePicturePreview ? (
                    <>
                      <img
                        src={profilePicturePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleRemoveProfilePicture}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <User className="w-8 h-8 text-[#293a90]" />
                  )}
                </div>
                <div>
                  <label htmlFor="profile-picture-upload">
                    <span className="inline-flex items-center gap-2 bg-[#293a90] hover:bg-[#293a90]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload New Photo
                    </span>
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </div> */}

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Account Created:
                  </span>
                  <span className="text-sm font-medium">Jan 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Login:</span>
                  <span className="text-sm font-medium">Oct 22, 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sessions:</span>
                  <span className="text-sm font-medium">2 Active</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Order Alerts
                    </h4>
                    <p className="text-xs text-gray-500">
                      Get notified about new orders and updates
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("orderAlerts")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.orderAlerts ? "bg-[#293a90]" : "bg-gray-200"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.orderAlerts
                          ? "translate-x-6"
                          : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Email Notifications
                    </h4>
                    <p className="text-xs text-gray-500">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleNotificationChange("emailNotifications")
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.emailNotifications
                        ? "bg-[#293a90]"
                        : "bg-gray-200"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.emailNotifications
                          ? "translate-x-6"
                          : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      SMS Notifications
                    </h4>
                    <p className="text-xs text-gray-500">
                      Get SMS alerts for critical updates
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("smsNotifications")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.smsNotifications
                        ? "bg-[#293a90]"
                        : "bg-gray-200"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.smsNotifications
                          ? "translate-x-6"
                          : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      Marketing Emails
                    </h4>
                    <p className="text-xs text-gray-500">
                      Receive promotional and marketing emails
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange("marketingEmails")}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.marketingEmails
                        ? "bg-[#293a90]"
                        : "bg-gray-200"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.marketingEmails
                          ? "translate-x-6"
                          : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Email Frequency
              </h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    className="mr-3 text-[#293a90] focus:ring-[#293a90]"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700">
                    Immediate notifications
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    className="mr-3 text-[#293a90] focus:ring-[#293a90]"
                  />
                  <span className="text-sm text-gray-700">Daily digest</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    className="mr-3 text-[#293a90] focus:ring-[#293a90]"
                  />
                  <span className="text-sm text-gray-700">Weekly summary</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Channels
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-[#293a90]" />
                    <h4 className="text-sm font-medium text-gray-900">Email</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    admin@shopvii.com
                  </p>
                  <button className="text-xs text-[#293a90] hover:underline">
                    Change Email
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-[#293a90]" />
                    <h4 className="text-sm font-medium text-gray-900">Phone</h4>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">+91 98765 43210</p>
                  <button className="text-xs text-[#293a90] hover:underline">
                    Change Phone
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Change Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordFormChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-sm"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordFormChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-sm"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordForm.newPassword && passwordForm.newPassword.length < 8 && (
                    <p className="text-xs text-red-500 mt-1">
                      Password must be at least 8 characters
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordFormChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-sm"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {passwordForm.confirmPassword &&
                    passwordForm.newPassword !== passwordForm.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        Passwords do not match
                      </p>
                    )}
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleUpdatePassword}
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#293a90] hover:bg-[#293a90]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shield className="w-4 h-4" />
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-700">
                    Enhance your account security
                  </p>
                  <p className="text-xs text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Enable 2FA
                </button>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  Recovery Codes
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Generate backup codes in case you lose access to your
                  authenticator
                </p>
                <button className="text-sm text-[#293a90] hover:underline">
                  Generate Recovery Codes
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Login Sessions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Current Session
                    </p>
                    <p className="text-xs text-gray-500">
                      Chrome on Windows • India
                    </p>
                  </div>
                  <span className="text-xs text-green-600 font-medium">
                    Active Now
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Mobile Session
                    </p>
                    <p className="text-xs text-gray-500">
                      Safari on iPhone • India
                    </p>
                  </div>
                  <button className="text-xs text-[#eb0082] hover:underline">
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Settings Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 mb-4 p-4">
          <div className="flex flex-col sm:flex-row gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                      ? "bg-[#293a90] text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300"
                    }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Setting;
