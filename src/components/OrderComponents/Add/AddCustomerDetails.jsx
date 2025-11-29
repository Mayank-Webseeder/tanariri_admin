import React, { useState, useEffect } from "react";
import { Select, Modal, Button, Spin } from "antd";
import {
  PlusCircleOutlined,
  CloseOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import useCustomerStore from "../../../store/useCustomerStore";

const { Option } = Select;

const AddressModal = ({
  visible,
  onClose,
  addresses,
  type,
  selectedAddress,
  onAddressSelect,
}) => {
  return (
    <Modal
      title={`Select ${type} Address`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={onClose}
          disabled={!selectedAddress}
        >
          Save
        </Button>,
      ]}
      className="address-modal"
    >
      <div className="max-h-96 overflow-y-auto space-y-4">
        {(addresses || []).map((address) => {
          const isSelected =
            selectedAddress &&
            (selectedAddress._id || selectedAddress.id) ===
              (address._id || address.id);
          return (
            <div
              key={address._id || address.id}
              className={`p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer relative ${
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => onAddressSelect(address)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium">{address.address}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.pincode}, {address.country}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircleFilled
                    className="text-green-600 absolute top-2 right-2"
                    style={{ fontSize: "24px" }}
                  />
                )}
              </div>
            </div>
          );
        })}
        {!addresses?.length && (
          <p className="text-gray-500 text-center">No addresses available</p>
        )}
      </div>
    </Modal>
  );
};

const AddCustomerDetails = ({ onCustomerSelect }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isBillingModalVisible, setIsBillingModalVisible] = useState(false);
  const [isShippingModalVisible, setIsShippingModalVisible] = useState(false);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);

  const { fetchCustomers, loading } = useCustomerStore();

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const fetchedCustomers = await fetchCustomers();
        console.log("Fetched customers:", fetchedCustomers);
        setCustomers(Array.isArray(fetchedCustomers) ? fetchedCustomers : []);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([]);
      }
    };

    loadCustomers();
  }, [fetchCustomers]);

  const validCustomers = customers.filter(
    (c) =>
      c &&
      c._id &&
      typeof c._id === "string" &&
      c.firstName &&
      c.lastName &&
      c.email
  );
  console.log("Valid customers:", validCustomers);

  const selectedCustomer =
    validCustomers.find((c) => c._id === selectedCustomerId) || null;

  const handleCustomerSelect = (customerId) => {
    const customer = validCustomers.find((c) => c._id === customerId);
    if (!customer) {
      console.warn("No customer found for ID:", customerId);
      return;
    }

    setSelectedCustomerId(customerId);
    setSelectedBillingAddress(null);
    setSelectedShippingAddress(null);
    onCustomerSelect({
      ...customer,
      selectedBillingAddress: null,
      selectedShippingAddress: null,
    });
    console.log("Selected customer:", customer);
  };

  const handleClearCustomer = () => {
    setSelectedCustomerId(null);
    setSelectedBillingAddress(null);
    setSelectedShippingAddress(null);
    onCustomerSelect(null);
  };

  const handleAddressSelect = (address, type) => {
    if (!address || !selectedCustomer) return;

    if (type === "billing") {
      setSelectedBillingAddress(address);
      onCustomerSelect({
        ...selectedCustomer,
        selectedBillingAddress: address,
        selectedShippingAddress,
      });
    } else {
      setSelectedShippingAddress(address);
      onCustomerSelect({
        ...selectedCustomer,
        selectedBillingAddress,
        selectedShippingAddress: address,
      });
    }
  };

  const handleClearAddress = (type) => {
    if (type === "billing") {
      setSelectedBillingAddress(null);
      onCustomerSelect({
        ...selectedCustomer,
        selectedBillingAddress: null,
        selectedShippingAddress,
      });
    } else {
      setSelectedShippingAddress(null);
      onCustomerSelect({
        ...selectedCustomer,
        selectedBillingAddress,
        selectedShippingAddress: null,
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        {/* <h1 className="text-xl font-semibold mb-2">Customer Information</h1> */}
        <div className="relative">
          <Select
            showSearch
            placeholder="Search and select customer"
            optionFilterProp="children"
            onChange={handleCustomerSelect}
            value={selectedCustomerId}
            className="w-full"
            loading={loading}
            filterOption={(input, option) =>
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={
              loading ? <Spin size="small" /> : "No customers found"
            }
          >
            {validCustomers.length > 0 ? (
              validCustomers.map((customer) => (
                <Option key={customer._id} value={customer._id}>
                  {`${customer.firstName} ${customer.lastName} (${customer.email})`}
                </Option>
              ))
            ) : (
              <Option key="no-data" value="" disabled>
                No customers available
              </Option>
            )}
          </Select>
          {selectedCustomer && (
            <CloseOutlined
              className="absolute top-1/2 right-10 transform -translate-y-1/2 text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={handleClearCustomer}
            />
          )}
        </div>

        {selectedCustomer && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p>
              <strong>Name:</strong>{" "}
              {`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
            </p>
            <p>
              <strong>Email:</strong> {selectedCustomer.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedCustomer.phone || "N/A"}
            </p>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Billing Address</h2>
              <PlusCircleOutlined
                className="text-2xl cursor-pointer text-blue-500"
                onClick={() => setIsBillingModalVisible(true)}
              />
            </div>
            {selectedBillingAddress && (
              <div className="p-4 bg-gray-50 rounded relative">
                <p>
                  {selectedBillingAddress.address},{" "}
                  {selectedBillingAddress.city}
                </p>
                <p>
                  {selectedBillingAddress.state},{" "}
                  {selectedBillingAddress.pincode}
                </p>
                <CloseOutlined
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer"
                  onClick={() => handleClearAddress("billing")}
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <PlusCircleOutlined
                className="text-2xl cursor-pointer text-blue-500"
                onClick={() => setIsShippingModalVisible(true)}
              />
            </div>
            {selectedShippingAddress && (
              <div className="p-4 bg-gray-50 rounded relative">
                <p>
                  {selectedShippingAddress.address},{" "}
                  {selectedShippingAddress.city}
                </p>
                <p>
                  {selectedShippingAddress.state},{" "}
                  {selectedShippingAddress.pincode}
                </p>
                <CloseOutlined
                  className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer"
                  onClick={() => handleClearAddress("shipping")}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <AddressModal
        visible={isBillingModalVisible}
        onClose={() => setIsBillingModalVisible(false)}
        addresses={selectedCustomer?.addresses}
        type="billing"
        selectedAddress={selectedBillingAddress}
        onAddressSelect={(address) => handleAddressSelect(address, "billing")}
      />
      <AddressModal
        visible={isShippingModalVisible}
        onClose={() => setIsShippingModalVisible(false)}
        addresses={selectedCustomer?.addresses}
        type="shipping"
        selectedAddress={selectedShippingAddress}
        onAddressSelect={(address) => handleAddressSelect(address, "shipping")}
      />

      {loading && (
        <Spin className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      )}
    </div>
  );
};

export default AddCustomerDetails;
