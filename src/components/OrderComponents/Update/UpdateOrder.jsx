import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form } from "antd";
import UpdateCustomerDetails from "./UpdateCustomerDetails";
import UpdateProductSelectionStep from "./UpdateProductSelectionStep";
import UpdateShippingAndPaymentOptions from "./UpdateShippingAndPaymentOptions";
import { useOrderStore } from "../../../store/CustomerOrderStore";
import { toast } from "react-toastify";
import { Home, ArrowLeft, Download, Clock, AlertCircle } from "lucide-react";

const BreadcrumbNav = () => (
  <div className="flex items-center text-gray-500 mb-3 md:mb-4 text-xs sm:text-sm">
    <Link to="/sales/orders" className="flex items-center hover:text-blue-600">
      <Home size={14} className="mr-1" />
      <span>Orders</span>
    </Link>
    <span className="mx-2">/</span>
    <span>Update Order</span>
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
          Saving...
        </>
      ) : (
        "Update Order"
      )}
    </button>
  </div>
);

const UpdateOrder = () => {
  const location = useLocation();
  const orderDetails = location.state?.order || location.state?.orderData || {};
  const { fetchOrderById, updateOrder } = useOrderStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [customerData, setCustomerData] = useState(null);
  const [shippingAndPaymentData, setShippingAndPaymentData] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch order details once when orderDetails._id is available.
  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (!orderDetails?._id) return;
        const order = await fetchOrderById(orderDetails._id);
        console.log("Fetched order:", order);

        setCustomerData({
          ...order?.customer,
          _id: order?.customer?._id || null,
          selectedBillingAddress: order?.billingAddress || null,
          selectedShippingAddress: order?.shippingAddress || null,
        });

        setSelectedProducts(
          order?.products.map((p, index) => ({
            key: Date.now() + index,
            product: p.product || {
              productName: "N/A",
              _id: null,
              images: ["/default-image.jpg"],
            },
            variant: p.variant || { weight: "N/A", price: 0, _id: null },
            quantity: parseInt(p.quantity) || 1,
            price: Number(p.price), // ← CRITICAL: Save price from DB
          }))
        );

        const discountPercentage = order?.discount
          ? parseFloat(order.discount)
          : 0;

        setShippingAndPaymentData({
          shippingMethod: order?.shippingMethod?.toLowerCase() || "standard",
          orderStatus: order?.orderStatus?.toLowerCase() || "pending",
          paymentStatus: order?.paymentStatus?.toLowerCase() || "pending",
          discount: discountPercentage,
          orderNote: order?.orderNote || "",
          additionalCharges: [
            {
              name: "Packaging Charges (Inc. GST)",
              amount: parseFloat(
                order?.additionalCharges?.[0]?.packagingCharge || 0
              ),
            },
            {
              name: "Transaction Charges",
              amount: parseFloat(
                order?.additionalCharges?.[0]?.shippingCharge || 0 // ← Fixed: was transactionCharge
              ),
            },
          ],
        });

        setFetching(false);
      } catch (error) {
        toast.error("Failed to fetch order: " + error.message);
        setFetching(false);
      }
    };

    loadOrder();
  }, [orderDetails?._id, fetchOrderById]);

  const handleCustomerSelect = useCallback((customer) => {
    setCustomerData(customer);
  }, []);

  const handleShippingAndPaymentChange = useCallback((data) => {
    setShippingAndPaymentData(data);
  }, []);

  const handleProductSelect = useCallback((products) => {
    setSelectedProducts(products);
  }, []);

  const calculateSummary = useCallback(() => {
    const subtotal = selectedProducts.reduce((total, product) => {
      const price = product.price || product.variant?.price || 0;
      return total + price * (product.quantity || 0);
    }, 0);

    const discountPercentage = shippingAndPaymentData?.discount || 0;
    const discountAmount = (subtotal * discountPercentage) / 100;
    const additionalChargesTotal = shippingAndPaymentData
      ? shippingAndPaymentData.additionalCharges.reduce(
          (total, charge) => total + Number(charge.amount || 0),
          0
        )
      : 0;
    const total = subtotal - discountAmount + additionalChargesTotal;

    return {
      subtotal: subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      additionalChargesTotal: additionalChargesTotal.toFixed(2),
      total: total < 0 ? "0.00" : total.toFixed(2),
    };
  }, [selectedProducts, shippingAndPaymentData]);

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
        billingAddress: customerData.selectedBillingAddress._id || null,
        shippingAddress: customerData.selectedShippingAddress._id || null,
        products: selectedProducts.map((p) => ({
          product: p.product?._id || null,
          variant: p.variant?._id || null,
          quantity: p.quantity.toString(),
          price: Number(p.price || p.variant?.price || 0), // ← FIXED: Send price!
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
            // ← FIXED: was transactionCharge
            shippingCharge:
              shippingAndPaymentData.additionalCharges[1]?.amount.toString() ||
              "0",
          },
        ],
        orderNote: shippingAndPaymentData.orderNote || "",
        discount: Number(shippingAndPaymentData.discount || 0),
        paymentTotal: Number(summary.total),
      };

      await updateOrder(orderDetails._id, orderData);
      toast.success("Order updated successfully!");
      navigate("/sales/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
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

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        <div className="flex justify-between items-center py-2 mb-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="space-y-6"
          >
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Customer Information
                </h2>
                <UpdateCustomerDetails
                  onCustomerSelect={handleCustomerSelect}
                  initialCustomer={customerData}
                />
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Product Selection
                </h2>
                <UpdateProductSelectionStep
                  onProductSelect={handleProductSelect}
                  initialProducts={selectedProducts}
                />
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                  Shipping & Payment
                </h2>
                <UpdateShippingAndPaymentOptions
                  onShippingAndPaymentChange={handleShippingAndPaymentChange}
                  initialData={shippingAndPaymentData}
                />
              </div>

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
                              ₹{Number(charge.amount || 0).toFixed(2)}
                            </span>
                          </div>
                        )
                      )}
                    <div className="flex justify-between text-red-600 font-medium">
                      <span>
                        Discount ({shippingAndPaymentData?.discount || 0}%):
                      </span>
                      <span>-₹{summary.discount}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-sm">
                      <span>Total:</span>
                      <span>₹{summary.total}</span>
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

export default UpdateOrder;