import React, { useState } from "react";
import { Button, Form, Card, Descriptions } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Download, Clock, AlertCircle } from "lucide-react";
import AddCustomerDetails from "./AddCustomerDetails";
import ShippingAndPaymentOptions from "./ShippingAndPaymentOptions";
import ProductSelectionStep from "./ProductSelectionStep";
import { useOrderStore } from "../../../store/CustomerOrderStore";
import { toast } from "react-toastify";

const BreadcrumbNav = () => (
  <div className="flex items-center text-gray-500 mb-3 md:mb-4 text-xs sm:text-sm">
    <Link to="/sales/orders" className="flex items-center hover:text-blue-600">
      <Home size={14} className="mr-1" />
      <span>Orders</span>
    </Link>
    <span className="mx-2">/</span>
    <span>Add Order</span>
  </div>
);

const FooterButtons = ({ onCancel, loading, disabled }) => (
  <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
    <button
      type="button"
      onClick={onCancel}
      disabled={loading}
      className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      Cancel
    </button>
    <button
      type="submit"
      disabled={loading || disabled}
      className="px-4 py-2 text-xs font-medium bg-[#293a90] hover:bg-[#293a90]/90 text-white rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? (
        <>
          <Clock size={12} className="animate-spin inline mr-2" />
          Creating...
        </>
      ) : (
        "Create Order"
      )}
    </button>
  </div>
);

const AddOrder = () => {
  const { createOrder } = useOrderStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [shippingAndPaymentData, setShippingAndPaymentData] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  const handleCustomerSelect = (customer) => {
    setCustomerData(customer);
    console.log("Selected customer in AddOrder:", customer);
  };

  const handleShippingAndPaymentChange = (data) => {
    setShippingAndPaymentData(data);
    console.log("Shipping and Payment Data:", data);
  };

  const handleProductSelect = (products) => {
    setSelectedProducts(products);
    console.log("Selected products in AddOrder:", products);
  };

  const calculateSummary = () => {
    const subtotal = selectedProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    const additionalChargesTotal = shippingAndPaymentData
      ? shippingAndPaymentData.additionalCharges.reduce(
          (total, charge) => total + Number(charge.amount || 0),
          0
        )
      : 0;

    const discountPercentage = shippingAndPaymentData
      ? shippingAndPaymentData.discount || 0
      : 0;
    const discountAmount = (subtotal * discountPercentage) / 100;
    const total = subtotal + additionalChargesTotal - discountAmount;

    return {
      subtotal: subtotal.toFixed(2),
      additionalChargesTotal: additionalChargesTotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const summary = calculateSummary();

  const isFormValid =
    customerData &&
    customerData.selectedBillingAddress &&
    customerData.selectedShippingAddress &&
    shippingAndPaymentData &&
    selectedProducts.length > 0;

  const onFinish = async () => {
    if (!isFormValid) {
      toast.error("Please complete all required fields");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customer: customerData._id,
        billingAddress: customerData.selectedBillingAddress._id,
        shippingAddress: customerData.selectedShippingAddress._id,
        products: selectedProducts.map((p) => ({
          product: p.product._id,
          quantity: p.quantity.toString(),
          price: Number(p.product.discountPrice || p.product.originalPrice), // FIXED: Added price
        })),
        shippingMethod:
          shippingAndPaymentData.shippingMethod.charAt(0).toUpperCase() +
          shippingAndPaymentData.shippingMethod.slice(1),
        orderStatus:
          shippingAndPaymentData.orderStatus.charAt(0).toUpperCase() +
          shippingAndPaymentData.orderStatus.slice(1),
        paymentStatus:
          shippingAndPaymentData.paymentStatus.charAt(0).toUpperCase() +
          shippingAndPaymentData.paymentStatus.slice(1),
        additionalCharges: [
          {
            packagingCharge:
              shippingAndPaymentData.additionalCharges[0]?.amount.toString() ||
              "0",
            shippingCharge:
              shippingAndPaymentData.additionalCharges[1]?.amount.toString() ||
              "0",
          },
        ],
        orderNote: shippingAndPaymentData.orderNote.toString(),
        discount: Number(shippingAndPaymentData.discount || 0),
        paymentTotal: Number(summary.total),
      };

      const response = await createOrder(orderData);
      toast.success("Order created successfully!");

      // Clear all fields
      form.resetFields();
      setCustomerData(null);
      setShippingAndPaymentData(null);
      setSelectedProducts([]);

      // Navigate to /sales/orders
      navigate("/sales/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCustomerData(null);
    setShippingAndPaymentData(null);
    setSelectedProducts([]);
    navigate("/sales/orders");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Top bar with breadcrumb and buttons */}
        <div className="flex justify-between items-center py-2 mb-0">
          {/* <BreadcrumbNav /> */}

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/sales/orders")}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-red-600 mr-2" />
                <span className="text-xs text-red-700">{error}</span>
              </div>
            </div>
          )} */}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
          >
            <div className="space-y-6">
              {/* Customer Selection Step */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Customer Details
                </h2>
                <AddCustomerDetails onCustomerSelect={handleCustomerSelect} />
              </div>

              {/* Product Selection Step */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Product Selection
                </h2>
                <ProductSelectionStep onProductSelect={handleProductSelect} />
              </div>

              {/* Shipping and Payment Options */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Shipping & Payment
                </h2>
                <ShippingAndPaymentOptions
                  onShippingAndPaymentChange={handleShippingAndPaymentChange}
                />
              </div>

              {/* Payment Summary */}
              {selectedProducts.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                    Payment Summary
                  </h2>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">₹{summary.subtotal}</span>
                    </div>
                    {shippingAndPaymentData &&
                      shippingAndPaymentData.additionalCharges.map(
                        (charge, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600">
                              {charge.name}:
                            </span>
                            <span className="font-medium">
                              ₹{Number(charge.amount).toFixed(2)}
                            </span>
                          </div>
                        )
                      )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Discount ({shippingAndPaymentData?.discount || 0}%):
                      </span>
                      <span className="font-medium text-red-600">
                        -₹{summary.discount}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                      <span className="text-sm font-semibold text-gray-900">
                        Total:
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        ₹{summary.total}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <FooterButtons
              onCancel={handleCancel}
              loading={loading}
              disabled={!isFormValid}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddOrder;
