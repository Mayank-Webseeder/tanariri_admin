import React, { useState, useEffect } from "react";
import { Select, InputNumber, Input } from "antd";

const { Option } = Select;
const { TextArea } = Input;

const UpdateShippingAndPaymentOptions = ({
  onShippingAndPaymentChange,
  initialData,
}) => {
  const [shippingMethod, setShippingMethod] = useState(
    initialData?.shippingMethod || "standard"
  );
  const [orderStatus, setOrderStatus] = useState(
    initialData?.orderStatus || "pending"
  );
  const [paymentStatus, setPaymentStatus] = useState(
    initialData?.paymentStatus || "pending"
  );
  const [discount, setDiscount] = useState(initialData?.discount || 0);
  const [deliveryInstructions, setDeliveryInstructions] = useState(
    initialData?.orderNote || ""
  );
  const [additionalCharges, setAdditionalCharges] = useState(
    initialData?.additionalCharges || [
      { name: "Packaging Charges (Inc. GST)", amount: 0 },
      { name: "Transaction Charges", amount: 0 },
    ]
  );

  // Whenever any field changes, update the parent with the latest values.
  useEffect(() => {
    onShippingAndPaymentChange({
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
    });
  }, [
    shippingMethod,
    orderStatus,
    paymentStatus,
    discount,
    deliveryInstructions,
    additionalCharges,
    onShippingAndPaymentChange,
  ]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-lg font-bold mb-6">
        Update Shipping and Payment Options
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-2">Shipping Method</label>
          <Select
            value={shippingMethod}
            onChange={setShippingMethod}
            className="w-full"
          >
            <Option value="standard">Standard</Option>
            <Option value="express">Express</Option>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-2">Order Status</label>
          <Select
            value={orderStatus}
            onChange={setOrderStatus}
            className="w-full"
          >
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="shipped">Shipped</Option>
            <Option value="delivered">Delivered</Option>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-2">Payment Status</label>
          <Select
            value={paymentStatus}
            onChange={setPaymentStatus}
            className="w-full"
          >
            <Option value="pending">Pending</Option>
            <Option value="confirmed">Confirmed</Option>
            <Option value="failed">Failed</Option>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold mb-2">Discount (%)</label>
          <InputNumber
            min={0}
            max={100}
            value={discount}
            onChange={(value) =>
              setDiscount(Math.min(100, Math.max(0, value || 0)))
            }
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace("%", "")}
            className="w-full"
          />
        </div>

        <div className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-3">
          <label className="text-sm font-semibold mb-2">
            Delivery Instructions
          </label>
          <TextArea
            rows={4}
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            placeholder="Enter any special delivery instructions"
            className="w-full"
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
                <p className="text-sm font-medium">{charge.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <InputNumber
                  min={0}
                  value={charge.amount}
                  onChange={(value) => {
                    const updatedCharges = [...additionalCharges];
                    updatedCharges[index].amount = value || 0;
                    setAdditionalCharges(updatedCharges);
                  }}
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

export default UpdateShippingAndPaymentOptions;