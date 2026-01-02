import React, { useEffect, useState } from "react";
import { Save, Shield, Eye, EyeOff, User, Smartphone, Globe, Clock, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import useAuthStore from "../store/useAuthStore";
import useUserStore from "../store/useUserStore";

const Setting = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { fetchUserById, updateUser, loading } = useUserStore();
  const { changePassword, loading: passwordLoading, clearMessages } = useAuthStore();

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [accountInfo, setAccountInfo] = useState({
    createdAt: "",
    lastLogin: "",
    isActive: true,
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const adminUserStr = localStorage.getItem("adminUser");
        if (!adminUserStr) return;

        const adminUser = JSON.parse(adminUserStr);
        const userId = adminUser?._id;
        if (!userId) return;

        const userData = await fetchUserById(userId);

        setProfileForm({
          firstName: userData?.firstName || "",
          lastName: userData?.lastName || "",
          email: userData?.email || "",
          phone: userData?.phone || "",
        });

        setAccountInfo({
          createdAt: userData?.createdAt || "",
          lastLogin: userData?.lastLogin || "",
          isActive: userData?.isActive !== undefined ? userData.isActive : true,
        });
      } catch {
        toast.error("Failed to load user data");
      }
    };

    loadUserData();
  }, [fetchUserById]);

  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const adminUserStr = localStorage.getItem("adminUser");
      if (!adminUserStr) return toast.error("User not found");

      const adminUser = JSON.parse(adminUserStr);
      const userId = adminUser?._id;
      if (!userId) return toast.error("User ID not found");

      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        ...(profileForm.phone?.trim() ? { phone: profileForm.phone } : {}),
      };

      const result = await updateUser(userId, payload);
      const updatedUser = result?.data || result;

      setProfileForm({
        firstName: updatedUser?.firstName || "",
        lastName: updatedUser?.lastName || "",
        email: updatedUser?.email || "",
        phone: updatedUser?.phone || "",
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update profile";
      const validationErrors = error?.response?.data?.errors;
      if (Array.isArray(validationErrors) && validationErrors.length) {
        toast.error(validationErrors.join(", "));
      } else {
        toast.error(msg);
      }
    }
  };

  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword } = passwordForm;

    if (!currentPassword || !newPassword) {
      return toast.error("Please fill all password fields");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    try {
      clearMessages();
      await changePassword({ currentPassword, newPassword });
      setPasswordForm({ currentPassword: "", newPassword: "" });
      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your personal information and security preferences.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

          {/* LEFT COLUMN - Profile Information */}
          <div className="lg:col-span-2 h-full">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <User className="w-5 h-5 text-[#293a90]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Personal Profile</h2>
                  <p className="text-xs text-gray-500">
                    Update your photo and personal details here.
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileFormChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#293a90]/20 focus:border-[#293a90] transition-all text-sm outline-none"
                      placeholder="Jane"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileFormChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#293a90]/20 focus:border-[#293a90] transition-all text-sm outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileFormChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#293a90]/20 focus:border-[#293a90] transition-all text-sm outline-none"
                    placeholder="jane@example.com"
                  />
                </div>

                <div className="pt-4 flex justify-end border-t border-gray-100 mt-auto">
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#293a90] hover:bg-[#212f75] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-indigo-100 hover:shadow-lg disabled:opacity-70"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Security */}
          <div className="lg:col-span-1 h-full">
            <div className="sticky top-6 h-full">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <Shield className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                    <p className="text-xs text-gray-500">
                      Secure your account with a strong password.
                    </p>
                  </div>
                </div>

                <div className="p-6 space-y-5 flex-1">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="pt-4 mt-auto border-t border-gray-100">
                    <button className="w-full bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-sm font-medium">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Setting;
