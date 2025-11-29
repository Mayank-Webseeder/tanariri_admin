import React from "react";
import { Modal, Button, Table } from "antd";


const AbandonedPopup = ({ isOpen, onClose, customer }) => {
  if (!customer) return null; // Prevent crashing if no customer data

  // Sample product data (If customer contains product list, replace this)
  const productData = [
    {
      key: "1",
      image: "/dal2.jpg",
      name:"Namkin Dal",
      quantity: 1,
      cost: "₹250",
    },
  ];

  // Table Columns
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (img) => <img src={img} alt="Product" style={{ width: 50, height: 50, borderRadius: 5 }} />,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Cost", dataIndex: "cost", key: "cost" },
  ];

  return (
    <Modal
      title="Abandoned View"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button 
        key="cancel" onClick={onClose} danger>
          Cancel
        </Button>,
        <Button key="send" type="primary">
          Send Abandoned Cart Mail
        </Button>,
      ]}
      width={700}
    >
      {/* Customer Details */}
      <div className="border border-gray-300 rounded-md mt-8">
        <h3 className="bg-gray-200 p-2 font-semibold">Customer Details</h3>
        <div className="grid grid-cols-2 gap-4 p-2 mt-3">
          <div>
            <p><strong>Customer Name:</strong> {customer.customerName || "N/A"}</p>
            <p><strong>Email:</strong> {customer.Mail || "N/A"}</p>
            <p><strong>Email Subscription:</strong> {customer.EmailSubscription || "N/A"}</p>
            <p><strong>Date:</strong> {customer.date || "N/A"}</p>
          </div>
          <div>
            <p><strong>Address:</strong> {customer.address || "N/A"}</p>
            <p><strong>City:</strong> {customer.city || "N/A"}</p>
            <p><strong>Pin Code:</strong> {customer.pinCode || "N/A"}</p>
            <p><strong>Country:</strong> {customer.country || "N/A"}</p>
            <p><strong>Region State:</strong> {customer.state || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Product Details Table */}
      <Table columns={columns} dataSource={productData} pagination={false} className="mt-4" />
    </Modal>
  );
};

export default AbandonedPopup;
