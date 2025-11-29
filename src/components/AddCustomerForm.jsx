import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCustomerStore from "../store/useCustomerStore.js";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Download,
  Home,
  Plus,
  Edit,
  X,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Clock,
  Lock,
} from "lucide-react";

const BreadcrumbNav = () => (
  <div className="flex items-center text-gray-500 mb-3 md:mb-4 text-xs sm:text-sm">
    <Link to="/customers" className="flex items-center hover:text-blue-600">
      <Home size={14} className="mr-1" />
      <span>Customers</span>
    </Link>
    <span className="mx-2">/</span>
    <span>Add Customer</span>
  </div>
);

const AddCustomerForm = () => {
  const navigate = useNavigate();
  const { createCustomer, loading, error } = useCustomerStore();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressFormData, setAddressFormData] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerData = {
        ...formData,
        addresses: savedAddresses,
      };
      await createCustomer(customerData);
      toast.success("Customer created successfully");
      setFormData({
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        password: "",
      });
      setSavedAddresses([]);
      navigate("/customers");
    } catch (err) {
      console.error("Error during form submission:", err);
      toast.error("Failed to create customer. Please try again.");
    }
  };

  const handleCancel = () => {
    setFormData({
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      password: "",
    });
    setSavedAddresses([]);
    navigate("/customers");
  };

  const handleOpenModal = (editMode = false, address = null) => {
    setIsModalVisible(true);
    setIsEditing(editMode);

    if (editMode && address) {
      setEditingAddressId(address.id);
      setAddressFormData(address);
    } else {
      setAddressFormData({});
      setEditingAddressId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    setEditingAddressId(null);
    setAddressFormData({});
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const newAddress = {
      id: isEditing ? editingAddressId : Date.now(),
      ...addressFormData,
    };

    if (isEditing) {
      setSavedAddresses((prev) =>
        prev.map((addr) => (addr.id === editingAddressId ? newAddress : addr))
      );
    } else {
      setSavedAddresses((prev) => [...prev, newAddress]);
    }

    // Update primary address display if needed
    if (savedAddresses.length === 0 || !isEditing) {
      setFormData((prev) => ({
        ...prev,
        address: `${newAddress.address}, ${newAddress.city}, ${newAddress.state}, ${newAddress.country}, ${newAddress.pincode}`,
      }));
    }

    toast.success("Address added successfully");
    handleCloseModal();
  };

  const handleDeleteAddress = (id) => {
    setSavedAddresses((prev) => prev.filter((addr) => addr.id !== id));
    if (savedAddresses.length <= 1) {
      setFormData((prev) => ({ ...prev, address: "" }));
    }
    toast.success("Address deleted successfully");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const FooterButtons = ({ onCancel, loading }) => (
    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 text-xs font-medium bg-[#293a90] hover:bg-[#293a90]/90 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? (
          <>
            <Clock size={12} className="animate-spin inline mr-2" />
            Saving...
          </>
        ) : (
          "Save"
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Top bar with breadcrumb and buttons */}
        <div className="flex justify-between items-center py-2 mb-0">
          {/* <BreadcrumbNav /> */}

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/customers")}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-red-600 mr-2" />
                <span className="text-xs text-red-700">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main Form Fields */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    placeholder="Enter first name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    placeholder="Enter email"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <div className="flex">
                    <div className="flex items-center px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50">
                      <span className="text-xs text-gray-500">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin size={16} />
                  Addresses
                </h3>
                <button
                  type="button"
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 px-3 py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Plus size={12} />
                  Add Address
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="relative border border-gray-200 hover:shadow-md transition-shadow rounded-lg p-4"
                    >
                      {/* Edit/Delete buttons */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(true, address)}
                          className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <X size={12} />
                        </button>
                      </div>

                      {/* Address content */}
                      <div className="text-xs text-gray-700 space-y-1">
                        <p className="font-medium">{address.address}</p>
                        <p>City: {address.city}</p>
                        <p>Pincode: {address.pincode}</p>
                        <p>State: {address.state}</p>
                        <p>Country: {address.country}</p>
                      </div>
                    </div>
                  ))}
                  {savedAddresses.length === 0 && (
                    <div className="col-span-full text-center text-gray-500 py-8">
                      <MapPin
                        size={32}
                        className="mx-auto mb-2 text-gray-300"
                      />
                      <p className="text-xs">No addresses added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <FooterButtons onCancel={handleCancel} loading={loading} />
          </form>
        </div>

        {/* Address Modal */}
        {isModalVisible && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  {isEditing ? "Edit Address" : "Add New Address"}
                </h3>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
              <form onSubmit={handleModalSubmit} className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={addressFormData.address || ""}
                    onChange={(e) =>
                      setAddressFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    placeholder="Enter address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={addressFormData.city || ""}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={addressFormData.pincode || ""}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          pincode: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="Enter pincode"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={addressFormData.state || ""}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={addressFormData.country || ""}
                      onChange={(e) =>
                        setAddressFormData((prev) => ({
                          ...prev,
                          country: e.target.value,
                        }))
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium bg-[#293a90] hover:bg-[#293a90]/90 text-white rounded-lg transition-colors"
                  >
                    {isEditing ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCustomerForm;
