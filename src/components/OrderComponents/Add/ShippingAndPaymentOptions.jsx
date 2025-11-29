import React, { useState } from "react";
import { Select, InputNumber, Input, Button } from "antd";
import { PlusCircleOutlined, CloseOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const ShippingAndPaymentOptions = ({ onShippingAndPaymentChange }) => {
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [discount, setDiscount] = useState(0); // Percentage value (0-100)
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [additionalCharges, setAdditionalCharges] = useState([
    { name: "Packaging Charges (Inc. GST)", amount: 0 },
    { name: "Transaction Charges", amount: 0 },
  ]);
  const [newChargeName, setNewChargeName] = useState("");
  const [newChargeAmount, setNewChargeAmount] = useState(0);

  const updateParent = () => {
    const data = {
      shippingMethod,
      orderStatus,
      paymentStatus,
      discount,
      orderNote: deliveryInstructions,
      additionalCharges: [
        {
          name: "Packaging Charges (Inc. GST)",
          amount: Number(additionalCharges[0]?.amount || 0),
        },
        {
          name: "Transaction Charges",
          amount: Number(additionalCharges[1]?.amount || 0),
        },
      ],
    };
    onShippingAndPaymentChange(data);
  };

  const handleShippingMethodChange = (value) => {
    setShippingMethod(value);
    updateParent();
  };

  const handleOrderStatusChange = (value) => {
    setOrderStatus(value);
    updateParent();
  };

  const handlePaymentStatusChange = (value) => {
    setPaymentStatus(value);
    updateParent();
  };

  const handleDiscountChange = (value) => {
    const percentage = Math.min(100, Math.max(0, value || 0));
    setDiscount(percentage);
    updateParent();
  };

  const handleDeliveryInstructionsChange = (e) => {
    setDeliveryInstructions(e.target.value);
    updateParent();
  };

  const handleChargeAmountChange = (index, value) => {
    const updatedCharges = [...additionalCharges];
    updatedCharges[index].amount = value || 0;
    setAdditionalCharges(updatedCharges);
    updateParent();
  };

  const handleAddCharge = () => {
    if (!newChargeName || newChargeAmount < 0) {
      return;
    }
    const newCharge = { name: newChargeName, amount: newChargeAmount };
    setAdditionalCharges([...additionalCharges, newCharge]);
    setNewChargeName("");
    setNewChargeAmount(0);
    updateParent();
  };

  const handleRemoveCharge = (index) => {
    const updatedCharges = additionalCharges.filter((_, i) => i !== index);
    setAdditionalCharges(updatedCharges);
    updateParent();
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* <h1 className="text-2xl font-bold mb-6">Shipping and Payment Options</h1> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Shipping Method</label>
          <Select
            value={shippingMethod}
            onChange={handleShippingMethodChange}
            className="w-full"
          >
            <Option value="standard">Standard</Option>
            <Option value="express">Express</Option>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Order Status</label>
          <Select
            value={orderStatus}
            onChange={handleOrderStatusChange}
            className="w-full"
          >
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
            {/* <Option value="cancelled">Cancelled</Option> */}
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Payment Status</label>
          <Select
            value={paymentStatus}
            onChange={handlePaymentStatusChange}
            className="w-full"
          >
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="failed">Failed</Option>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Discount (%)</label>
          <InputNumber
            min={0}
            max={100}
            value={discount}
            onChange={handleDiscountChange}
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace("%", "")}
            className="w-full"
          />
        </div>

        <div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-3">
          <label className="text-sm font-medium mb-1">
            Delivery Instructions
          </label>
          <TextArea
            rows={4}
            value={deliveryInstructions}
            onChange={handleDeliveryInstructionsChange}
            placeholder="Enter any special delivery instructions"
            className="w-full text-sm"
          />
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-3">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold">Additional Charges</h2>
          </div>

          {additionalCharges.map((charge, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded mb-2"
            >
              <div className="flex-1 mr-4">
                <p className="text-xs font-medium">{charge.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <InputNumber
                  min={0}
                  value={charge.amount}
                  onChange={(value) => handleChargeAmountChange(index, value)}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  className="w-32"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingAndPaymentOptions;
