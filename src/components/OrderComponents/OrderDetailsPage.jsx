// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// import { Button, Card, Row, Col, Table, Typography, Space } from "antd";
// import {
//   PrinterOutlined,
//   EditOutlined,
//   ArrowLeftOutlined,
// } from "@ant-design/icons";
// import { Home, ArrowLeft } from "lucide-react";
// import { useOrderStore } from "../../store/CustomerOrderStore.js";
// import { toast } from "react-toastify";

// const { Text } = Typography;

// const OrderDetailsPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { fetchOrderById } = useOrderStore();
//   const [orderData, setOrderData] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const orderId = location.state?.id;

//   useEffect(() => {
//     if (orderId) {
//       const getOrderById = async () => {
//         setIsLoading(true);
//         try {
//           const data = await fetchOrderById(orderId);
//           setOrderData(data);
//         } catch (error) {
//           toast.error("Failed to load order details");
//         } finally {
//           setIsLoading(false);
//         }
//       };
//       getOrderById();
//     }
//   }, [orderId, fetchOrderById]);

//   const order =
//     location.state?.order || location.state?.orderData || orderData || {};

//   if (!order || Object.keys(order).length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center p-4">
//         <div className="text-center">
//           <p className="text-sm text-gray-500">
//             No order data available. Please select an order from the table.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const handleBack = () => navigate("/sales/orders");
//   const handlePrint = () => window.print();
//   const handleUpdate = () => {
//     const invoiceNo = order.invoiceDetails?.[0]?.invoiceNo;
//     if (invoiceNo) {
//       navigate(`/sales/orders/order-update/${invoiceNo}`, {
//         state: { orderData: order },
//       });
//     } else {
//       toast.error("Cannot navigate to update page: Invoice number is missing");
//     }
//   };

//   // Format currency
//   const formatINR = (amount) => `₹${parseFloat(amount || 0).toFixed(2)}`;

//   // Format date
//   const formatDate = (dateString) =>
//     dateString
//       ? new Date(dateString).toLocaleDateString("en-IN", {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//         })
//       : "N/A";

//   // Order Details Section
//   const OrderDetailsSection = () => (
//     <Card
//       className="bg-white rounded-lg border border-gray-200 shadow-sm"
//       title={
//         <h3 className="text-sm font-semibold text-gray-900">Order Details</h3>
//       }
//     >
//       <div className="space-y-2 text-xs">
//         <div className="flex justify-between">
//           <Text strong>Invoice No.:</Text>
//           <Text>{order.invoiceDetails?.[0]?.invoiceNo || "N/A"}</Text>
//         </div>
//         <div className="flex justify-between">
//           <Text strong>Invoice Date:</Text>
//           <Text>{formatDate(order.invoiceDetails?.[0]?.invoiceDate)}</Text>
//         </div>
//         <div className="flex justify-between">
//           <Text strong>Order Status:</Text>
//           <span
//             className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${
//               order.orderStatus === "Confirmed"
//                 ? "bg-green-50 text-green-700 border-green-200"
//                 : order.orderStatus === "Pending"
//                 ? "bg-blue-50 text-blue-700 border-blue-200"
//                 : order.orderStatus === "Cancelled"
//                 ? "bg-red-50 text-red-700 border-red-200"
//                 : "bg-gray-50 text-gray-700 border-gray-200"
//             }`}
//           >
//             {order.orderStatus || "N/A"}
//           </span>
//         </div>
//         <div className="flex justify-between">
//           <Text strong>Shipping Method:</Text>
//           <Text>{order.shippingMethod || "N/A"}</Text>
//         </div>
//         <div className="flex justify-between">
//           <Text strong>Payment Status:</Text>
//           <Text>{order.paymentStatus || "N/A"}</Text>
//         </div>
//       </div>
//     </Card>
//   );

//   // Customer Details Section
//   const CustomerDetailsSection = () => (
//     <Card
//       className="bg-white rounded-lg border border-gray-200 shadow-sm"
//       title={
//         <h3 className="text-sm font-semibold text-gray-900">
//           Customer Details
//         </h3>
//       }
//     >
//       <div className="space-y-2 text-xs">
//         <div className="flex justify-between">
//           <Text strong>Name:</Text>
//           <Text>
//             {order.customer?.firstName} {order.customer?.lastName}
//           </Text>
//         </div>
//         <div className="flex justify-between">
//           <Text strong>E-mail:</Text>
//           <Text>{order.customer?.email || "N/A"}</Text>
//         </div>
//         <div className="flex justify-between">
//           <Text strong>Mobile No.:</Text>
//           <Text>{order.customer?.phone || "N/A"}</Text>
//         </div>
//       </div>
//     </Card>
//   );

//   // Address Section (Billing and Shipping)
//   const AddressSection = ({ type, address }) => (
//     <Card
//       className="bg-white rounded-lg border border-gray-200 shadow-sm"
//       title={
//         <h3 className="text-sm font-semibold text-gray-900">{type} Address</h3>
//       }
//     >
//       <div className="space-y-1 text-xs">
//         <p>
//           {order.customer?.firstName} {order.customer?.lastName}
//         </p>
//         <p>{address?.address || "N/A"}</p>
//         <p>
//           {address?.city}, {address?.pincode || "N/A"}
//         </p>
//         <p>
//           {address?.state}, {address?.country || "N/A"}
//         </p>
//       </div>
//     </Card>
//   );

//   // Shopping Cart Table
//   const ShoppingCartTable = () => {
//     const columns = [
//       {
//         title: "Product",
//         render: (_, item) => (
//           <div className="text-xs">
//             <div className="font-medium">
//               {item.product?.productName || "Unknown Product"}
//             </div>
//             <Text type="secondary">
//               Weight: {item.variant?.weight || "N/A"}
//             </Text>
//           </div>
//         ),
//       },
//       {
//         title: "Quantity",
//         dataIndex: "quantity",
//         key: "quantity",
//         render: (text) => <span className="text-xs">{text}</span>,
//       },
//       {
//         title: "Price",
//         render: (_, item) => (
//           <span className="text-xs">{formatINR(item.variant?.price)}</span>
//         ),
//       },
//       {
//         title: "Total",
//         render: (_, item) => (
//           <span className="text-xs">
//             {formatINR(
//               item.variant?.price
//                 ? parseFloat(item.variant.price) * parseInt(item.quantity)
//                 : 0
//             )}
//           </span>
//         ),
//       },
//     ];

//     return (
//       <Card
//         className="bg-white rounded-lg border border-gray-200 shadow-sm"
//         title={
//           <h3 className="text-sm font-semibold text-gray-900">Shopping Cart</h3>
//         }
//       >
//         <Table
//           columns={columns}
//           dataSource={order.products || []}
//           pagination={false}
//           rowKey="_id"
//           className="overflow-x-auto font-sans"
//           rowClassName={(record, index) =>
//             index % 2 === 0 ? "bg-white" : "bg-gray-50"
//           }
//         />
//       </Card>
//     );
//   };

//   // Pricing Summary Section
//   const PricingSummarySection = () => {
//     const subTotal =
//       order?.products?.reduce(
//         (sum, p) =>
//           sum +
//           (p.variant?.price
//             ? parseFloat(p.variant.price) * parseInt(p.quantity)
//             : 0),
//         0
//       ) || 0;

//     const gstRate = 0.12; // 12% GST
//     const gstAmount = subTotal * gstRate;

//     const shippingCharges = parseFloat(
//       order?.additionalCharges?.[0]?.shippingCharges || 250
//     );
//     const packagingCharge = 200; // Fixed packaging charge
//     const baseForTransaction =
//       subTotal + gstAmount + shippingCharges + packagingCharge;
//     const transactionChargeRate = 0.025; // 2.5% transaction charge
//     const transactionCharge = baseForTransaction * transactionChargeRate;

//     const discountPercentage = order.discount || 0;
//     const discountAmount = (subTotal * discountPercentage) / 100;

//     const calculatedTotal =
//       baseForTransaction + transactionCharge - discountAmount;

//     return (
//       <Card
//         className="bg-white rounded-lg border border-gray-200 shadow-sm"
//         title={
//           <h3 className="text-sm font-semibold text-gray-900">
//             Pricing Summary
//           </h3>
//         }
//       >
//         <div className="space-y-2 text-xs">
//           <div className="flex justify-between">
//             <Text>Sub-Total:</Text>
//             <Text>{formatINR(subTotal)}</Text>
//           </div>
//           <div className="flex justify-between">
//             <Text>GST (12%):</Text>
//             <Text>{formatINR(gstAmount)}</Text>
//           </div>
//           <div className="flex justify-between">
//             <Text>Shipping Charges:</Text>
//             <Text>{formatINR(shippingCharges)}</Text>
//           </div>
//           <div className="flex justify-between">
//             <Text>Packaging Charges:</Text>
//             <Text>{formatINR(packagingCharge)}</Text>
//           </div>
//           <div className="flex justify-between">
//             <Text>Transaction Charges (2.5%):</Text>
//             <Text>{formatINR(transactionCharge)}</Text>
//           </div>
//           {discountPercentage > 0 && (
//             <div className="flex justify-between">
//               <Text>Discount ({discountPercentage}%):</Text>
//               <Text>-{formatINR(discountAmount)}</Text>
//             </div>
//           )}
//           <div className="flex justify-between font-semibold">
//             <Text>Total:</Text>
//             <Text>{formatINR(calculatedTotal)}</Text>
//           </div>
//         </div>
//       </Card>
//     );
//   };

//   // Printable Invoice Section
//   const PrintableInvoiceSection = () => {
//     const subTotal =
//       order.products?.reduce(
//         (sum, p) =>
//           sum +
//           (p.variant?.price
//             ? parseFloat(p.variant.price) * parseInt(p.quantity)
//             : 0),
//         0
//       ) || 0;

//     const gstRate = 0.12; // 12% GST
//     const gstAmount = subTotal * gstRate;

//     const shippingCharges = parseFloat(
//       order?.additionalCharges?.[0]?.shippingCharges || 250
//     );
//     const packagingCharge = 200; // Fixed packaging charge
//     const baseForTransaction =
//       subTotal + gstAmount + shippingCharges + packagingCharge;
//     const transactionChargeRate = 0.025; // 2.5% transaction charge
//     const transactionCharge = baseForTransaction * transactionChargeRate;

//     const discountPercentage = order.discount || 0;
//     const discountAmount = (subTotal * discountPercentage) / 100;

//     const total = baseForTransaction + transactionCharge - discountAmount;

//     return (
//       <div className="print-only hidden print:block text-xs font-sans p-5">
//         <div className="text-center mb-4">
//           <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
//             TAX INVOICE
//           </h3>
//         </div>

//         <Row gutter={[16, 8]} className="mb-4">
//           <Col span={12}>
//             <div className="space-y-1 text-xs">
//               <div className="flex justify-between">
//                 <Text strong>Invoice No.:</Text>
//                 <Text>{order.invoiceDetails?.[0]?.invoiceNo || "N/A"}</Text>
//               </div>
//               <div className="flex justify-between">
//                 <Text strong>Invoice Date:</Text>
//                 <Text>
//                   {formatDate(order.invoiceDetails?.[0]?.invoiceDate)}
//                 </Text>
//               </div>
//               <div className="flex justify-between">
//                 <Text strong>Shipping Method:</Text>
//                 <Text>{order.shippingMethod || "N/A"}</Text>
//               </div>
//               <div className="flex justify-between">
//                 <Text strong>Payment Status:</Text>
//                 <Text>{order.paymentStatus || "N/A"}</Text>
//               </div>
//             </div>
//           </Col>
//           <Col span={12} className="text-right">
//             <div className="space-y-1 text-xs">
//               <div className="flex justify-between">
//                 <Text strong>E-mail:</Text>
//                 <Text>{order.customer?.email || "N/A"}</Text>
//               </div>
//               <div className="flex justify-between">
//                 <Text strong>Mobile No.:</Text>
//                 <Text>{order.customer?.phone || "N/A"}</Text>
//               </div>
//             </div>
//           </Col>
//         </Row>

//         <Row gutter={[16, 8]} className="mb-4">
//           <Col span={12}>
//             <Text strong className="text-xs">
//               Billing Address
//             </Text>
//             <div className="space-y-1 text-xs">
//               <p>
//                 {order.customer?.firstName} {order.customer?.lastName}
//               </p>
//               <p>{order.billingAddress?.address || "N/A"}</p>
//               <p>
//                 {order.billingAddress?.city},{" "}
//                 {order.billingAddress?.pincode || "N/A"}
//               </p>
//               <p>
//                 {order.billingAddress?.state},{" "}
//                 {order.billingAddress?.country || "N/A"}
//               </p>
//             </div>
//           </Col>
//           <Col span={12}>
//             <Text strong className="text-xs">
//               Shipping Address
//             </Text>
//             <div className="space-y-1 text-xs">
//               <p>
//                 {order.customer?.firstName} {order.customer?.lastName}
//               </p>
//               <p>{order.shippingAddress?.address || "N/A"}</p>
//               <p>
//                 {order.shippingAddress?.city},{" "}
//                 {order.shippingAddress?.pincode || "N/A"}
//               </p>
//               <p>
//                 {order.shippingAddress?.state},{" "}
//                 {order.shippingAddress?.country || "N/A"}
//               </p>
//             </div>
//           </Col>
//         </Row>

//         <Table
//           columns={[
//             {
//               title: "Product",
//               render: (_, item) => (
//                 <span className="text-xs">
//                   {item.product?.productName || "N/A"} (Weight:{" "}
//                   {item.variant?.weight || "N/A"})
//                 </span>
//               ),
//             },
//             {
//               title: "Quantity",
//               dataIndex: "quantity",
//               render: (text) => <span className="text-xs">{text}</span>,
//             },
//             {
//               title: "Price",
//               render: (_, item) => (
//                 <span className="text-xs">
//                   {formatINR(item.variant?.price)}
//                 </span>
//               ),
//             },
//             {
//               title: "Total",
//               render: (_, item) => (
//                 <span className="text-xs">
//                   {formatINR(
//                     item.variant?.price
//                       ? parseFloat(item.variant.price) * parseInt(item.quantity)
//                       : 0
//                   )}
//                 </span>
//               ),
//             },
//           ]}
//           dataSource={order.products || []}
//           pagination={false}
//           rowKey="_id"
//           className="mb-4 font-sans"
//           rowClassName={(record, index) =>
//             index % 2 === 0 ? "bg-white" : "bg-gray-50"
//           }
//         />

//         <div className="space-y-2 text-xs">
//           <div className="flex justify-between">
//             <Text>Sub-Total:</Text>
//             <Text>{formatINR(subTotal)}</Text>
//           </div>
//           <div className="flex justify-between">
//             <Text>GST (12%):</Text>
//             <Text>{formatINR(gstAmount)}</Text>
//           </div>
//           <div className="flex justify-between">
//             <Text>Shipping Charges:</Text>
//             <Text>{formatINR(shippingCharges)}</Text>
//           </div>
//           <div className="flex justify-between">
//             <Text>Packaging Charges:</Text>
//             <Text>{formatINR(packagingCharge)}</Text>
//           </div>
//           <div className="flex justify-between">
//             <Text>Transaction Charges (2.5%):</Text>
//             <Text>{formatINR(transactionCharge)}</Text>
//           </div>
//           {discountPercentage > 0 && (
//             <div className="flex justify-between">
//               <Text>Discount ({discountPercentage}%):</Text>
//               <Text>-{formatINR(discountAmount)}</Text>
//             </div>
//           )}
//           <div className="flex justify-between font-semibold">
//             <Text>Total:</Text>
//             <Text>{formatINR(total)}</Text>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       <div className="p-4 w-full">
//         {/* Normal Screen View */}
//         <div className="print:hidden">
//           {/* <div className="flex items-center text-gray-500 mb-3 md:mb-4 text-xs sm:text-sm">
//             <Link
//               to="/sales/orders"
//               className="flex items-center hover:text-blue-600"
//             >
//               <Home size={14} className="mr-1" />
//               <span>Orders</span>
//             </Link>
//             <span className="mx-2">/</span>
//             <span>Order Details</span>
//           </div> */}
//           <div className="flex justify-between items-center mb-4">
//             <button
//               onClick={handleBack}
//               className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               <ArrowLeft size={14} />
//               Back
//             </button>

//             <div className="flex items-center gap-2">
//               <Button
//                 onClick={handleUpdate}
//                 className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-sans"
//                 icon={<EditOutlined />}
//               >
//                 Update
//               </Button>

//               <Button
//                 onClick={handlePrint}
//                 className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors font-sans"
//                 icon={<PrinterOutlined />}
//               >
//                 Print
//               </Button>
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="flex items-center justify-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             </div>
//           ) : (
//             <Row gutter={[16, 16]}>
//               <Col xs={24} lg={12}>
//                 <OrderDetailsSection />
//               </Col>
//               <Col xs={24} lg={12}>
//                 <CustomerDetailsSection />
//               </Col>
//               <Col xs={24} lg={12}>
//                 <AddressSection type="Billing" address={order.billingAddress} />
//               </Col>
//               <Col xs={24} lg={12}>
//                 <AddressSection
//                   type="Shipping"
//                   address={order.shippingAddress}
//                 />
//               </Col>
//               <Col xs={24} lg={12}>
//                 <ShoppingCartTable />
//               </Col>
//               <Col xs={24} lg={12}>
//                 <PricingSummarySection />
//               </Col>
//             </Row>
//           )}
//         </div>

//         {/* Print View */}
//         <PrintableInvoiceSection />
//       </div>
//     </div>
//   );
// };

// export default OrderDetailsPage;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button, Card, Row, Col, Table, Typography, Space } from "antd";
import {
  PrinterOutlined,
  EditOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { Home, ArrowLeft } from "lucide-react";
import { useOrderStore } from "../../store/CustomerOrderStore.js";
import { toast } from "react-toastify";

const { Text } = Typography;

const OrderDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchOrderById } = useOrderStore();
  const [orderData, setOrderData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const orderId = location.state?.id;

  useEffect(() => {
    if (orderId) {
      const getOrderById = async () => {
        setIsLoading(true);
        try {
          const data = await fetchOrderById(orderId);
          setOrderData(data);
        } catch (error) {
          toast.error("Failed to load order details");
        } finally {
          setIsLoading(false);
        }
      };
      getOrderById();
    }
  }, [orderId, fetchOrderById]);

  const order =
    location.state?.order || location.state?.orderData || orderData || {};

  if (!order || Object.keys(order).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            No order data available. Please select an order from the table.
          </p>
        </div>
      </div>
    );
  }

  const handleBack = () => navigate("/sales/orders");
  const handlePrint = () => window.print();
  const handleUpdate = () => {
    const invoiceNo = order.invoiceDetails?.[0]?.invoiceNo;
    if (invoiceNo) {
      navigate(`/sales/orders/order-update/${invoiceNo}`, {
        state: { orderData: order },
      });
    } else {
      toast.error("Cannot navigate to update page: Invoice number is missing");
    }
  };

  // Format currency
  const formatINR = (amount) => `₹${parseFloat(amount || 0).toFixed(2)}`;

  // Format date
  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  // Order Details Section
  const OrderDetailsSection = () => (
    <Card
      className="bg-white rounded-lg border border-gray-200 shadow-sm"
      title={
        <h3 className="text-sm font-semibold text-gray-900">Order Details</h3>
      }
    >
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <Text strong>Invoice No.:</Text>
          <Text className="text-[#293a90] font-medium">
            {order.invoiceDetails?.[0]?.invoiceNo || "N/A"}
          </Text>
        </div>
        <div className="flex justify-between">
          <Text strong>Invoice Date:</Text>
          <Text>{formatDate(order.invoiceDetails?.[0]?.invoiceDate)}</Text>
        </div>
        <div className="flex justify-between">
          <Text strong>Order Status:</Text>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${
              order.orderStatus === "Confirmed"
                ? "bg-green-50 text-green-700 border-green-200"
                : order.orderStatus === "Pending"
                ? "bg-[#eb0082]/10 text-[#eb0082] border-[#eb0082]/20"
                : order.orderStatus === "Cancelled"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-gray-50 text-gray-700 border-gray-200"
            }`}
          >
            {order.orderStatus || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <Text strong>Shipping Method:</Text>
          <Text>{order.shippingMethod || "N/A"}</Text>
        </div>
        <div className="flex justify-between">
          <Text strong>Payment Status:</Text>
          <Text>{order.paymentStatus || "N/A"}</Text>
        </div>
      </div>
    </Card>
  );

  // Customer Details Section
  const CustomerDetailsSection = () => (
    <Card
      className="bg-white rounded-lg border border-gray-200 shadow-sm"
      title={
        <h3 className="text-sm font-semibold text-gray-900">
          Customer Details
        </h3>
      }
    >
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <Text strong>Name:</Text>
          <Text className="text-[#293a90] font-medium">
            {order.customer?.firstName} {order.customer?.lastName}
          </Text>
        </div>
        <div className="flex justify-between">
          <Text strong>E-mail:</Text>
          <Text>{order.customer?.email || "N/A"}</Text>
        </div>
        <div className="flex justify-between">
          <Text strong>Mobile No.:</Text>
          <Text>{order.customer?.phone || "N/A"}</Text>
        </div>
      </div>
    </Card>
  );

  // Address Section (Billing and Shipping)
  const AddressSection = ({ type, address }) => (
    <Card
      className="bg-white rounded-lg border border-gray-200 shadow-sm"
      title={
        <h3 className="text-sm font-semibold text-gray-900">{type} Address</h3>
      }
    >
      <div className="space-y-1 text-xs">
        <p className="text-[#293a90] font-medium">
          {order.customer?.firstName} {order.customer?.lastName}
        </p>
        <p>{address?.address || "N/A"}</p>
        <p>
          {address?.city}, {address?.pincode || "N/A"}
        </p>
        <p>
          {address?.state}, {address?.country || "N/A"}
        </p>
      </div>
    </Card>
  );

  // Shopping Cart Table
  const ShoppingCartTable = () => {
    const columns = [
      {
        title: "Product",
        render: (_, item) => (
          <div className="text-xs">
            <div className="font-medium text-[#293a90]">
              {item.product?.productName || "Unknown Product"}
            </div>
            <Text type="secondary">
              Weight: {item.variant?.weight || "N/A"}
            </Text>
          </div>
        ),
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        render: (text) => <span className="text-xs font-medium">{text}</span>,
      },
      {
        title: "Price",
        render: (_, item) => (
          <span className="text-xs font-medium text-green-600">
            {formatINR(item.variant?.price)}
          </span>
        ),
      },
      {
        title: "Total",
        render: (_, item) => (
          <span className="text-xs font-bold text-[#293a90]">
            {formatINR(
              item.variant?.price
                ? parseFloat(item.variant.price) * parseInt(item.quantity)
                : 0
            )}
          </span>
        ),
      },
    ];

    return (
      <Card
        className="bg-white rounded-lg border border-gray-200 shadow-sm"
        title={
          <h3 className="text-sm font-semibold text-gray-900">Shopping Cart</h3>
        }
      >
        <Table
          columns={columns}
          dataSource={order.products || []}
          pagination={false}
          rowKey="_id"
          className="overflow-x-auto font-sans"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }
        />
      </Card>
    );
  };

  // Pricing Summary Section
  const PricingSummarySection = () => {
    const subTotal =
      order?.products?.reduce(
        (sum, p) =>
          sum +
          (p.variant?.price
            ? parseFloat(p.variant.price) * parseInt(p.quantity)
            : 0),
        0
      ) || 0;

    const gstRate = 0.12; // 12% GST
    const gstAmount = subTotal * gstRate;

    const shippingCharges = parseFloat(
      order?.additionalCharges?.[0]?.shippingCharges || 250
    );
    const packagingCharge = 200; // Fixed packaging charge
    const baseForTransaction =
      subTotal + gstAmount + shippingCharges + packagingCharge;
    const transactionChargeRate = 0.025; // 2.5% transaction charge
    const transactionCharge = baseForTransaction * transactionChargeRate;

    const discountPercentage = order.discount || 0;
    const discountAmount = (subTotal * discountPercentage) / 100;

    const calculatedTotal =
      baseForTransaction + transactionCharge - discountAmount;

    return (
      <Card
        className="bg-white rounded-lg border border-gray-200 shadow-sm"
        title={
          <h3 className="text-sm font-semibold text-gray-900">
            Pricing Summary
          </h3>
        }
      >
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <Text>Sub-Total:</Text>
            <Text className="font-medium">{formatINR(subTotal)}</Text>
          </div>
          <div className="flex justify-between">
            <Text>GST (12%):</Text>
            <Text className="font-medium">{formatINR(gstAmount)}</Text>
          </div>
          <div className="flex justify-between">
            <Text>Shipping Charges:</Text>
            <Text className="font-medium">{formatINR(shippingCharges)}</Text>
          </div>
          <div className="flex justify-between">
            <Text>Packaging Charges:</Text>
            <Text className="font-medium">{formatINR(packagingCharge)}</Text>
          </div>
          <div className="flex justify-between">
            <Text>Transaction Charges (2.5%):</Text>
            <Text className="font-medium">{formatINR(transactionCharge)}</Text>
          </div>
          {discountPercentage > 0 && (
            <div className="flex justify-between">
              <Text>Discount ({discountPercentage}%):</Text>
              <Text className="font-medium text-[#eb0082]">
                -{formatINR(discountAmount)}
              </Text>
            </div>
          )}
          <div className="flex justify-between font-semibold border-t pt-2 mt-2">
            <Text className="text-[#293a90] font-bold">Total:</Text>
            <Text className="text-[#293a90] font-bold text-base">
              {formatINR(calculatedTotal)}
            </Text>
          </div>
        </div>
      </Card>
    );
  };

  // Printable Invoice Section
  const PrintableInvoiceSection = () => {
    const subTotal =
      order.products?.reduce(
        (sum, p) =>
          sum +
          (p.variant?.price
            ? parseFloat(p.variant.price) * parseInt(p.quantity)
            : 0),
        0
      ) || 0;

    const gstRate = 0.12; // 12% GST
    const gstAmount = subTotal * gstRate;

    const shippingCharges = parseFloat(
      order?.additionalCharges?.[0]?.shippingCharges || 250
    );
    const packagingCharge = 200; // Fixed packaging charge
    const baseForTransaction =
      subTotal + gstAmount + shippingCharges + packagingCharge;
    const transactionChargeRate = 0.025; // 2.5% transaction charge
    const transactionCharge = baseForTransaction * transactionChargeRate;

    const discountPercentage = order.discount || 0;
    const discountAmount = (subTotal * discountPercentage) / 100;

    const total = baseForTransaction + transactionCharge - discountAmount;

    return (
      <div className="print-only hidden print:block text-xs font-sans p-5">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
            TAX INVOICE
          </h3>
        </div>

        <Row gutter={[16, 8]} className="mb-4">
          <Col span={12}>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <Text strong>Invoice No.:</Text>
                <Text>{order.invoiceDetails?.[0]?.invoiceNo || "N/A"}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Invoice Date:</Text>
                <Text>
                  {formatDate(order.invoiceDetails?.[0]?.invoiceDate)}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Shipping Method:</Text>
                <Text>{order.shippingMethod || "N/A"}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Payment Status:</Text>
                <Text>{order.paymentStatus || "N/A"}</Text>
              </div>
            </div>
          </Col>
          <Col span={12} className="text-right">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <Text strong>E-mail:</Text>
                <Text>{order.customer?.email || "N/A"}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Mobile No.:</Text>
                <Text>{order.customer?.phone || "N/A"}</Text>
              </div>
            </div>
          </Col>
        </Row>

        <Row gutter={[16, 8]} className="mb-4">
          <Col span={12}>
            <Text strong className="text-xs">
              Billing Address
            </Text>
            <div className="space-y-1 text-xs">
              <p>
                {order.customer?.firstName} {order.customer?.lastName}
              </p>
              <p>{order.billingAddress?.address || "N/A"}</p>
              <p>
                {order.billingAddress?.city},{" "}
                {order.billingAddress?.pincode || "N/A"}
              </p>
              <p>
                {order.billingAddress?.state},{" "}
                {order.billingAddress?.country || "N/A"}
              </p>
            </div>
          </Col>
          <Col span={12}>
            <Text strong className="text-xs">
              Shipping Address
            </Text>
            <div className="space-y-1 text-xs">
              <p>
                {order.customer?.firstName} {order.customer?.lastName}
              </p>
              <p>{order.shippingAddress?.address || "N/A"}</p>
              <p>
                {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.pincode || "N/A"}
              </p>
              <p>
                {order.shippingAddress?.state},{" "}
                {order.shippingAddress?.country || "N/A"}
              </p>
            </div>
          </Col>
        </Row>

        <Table
          columns={[
            {
              title: "Product",
              render: (_, item) => (
                <span className="text-xs">
                  {item.product?.productName || "N/A"} (Weight:{" "}
                  {item.variant?.weight || "N/A"})
                </span>
              ),
            },
            {
              title: "Quantity",
              dataIndex: "quantity",
              render: (text) => <span className="text-xs">{text}</span>,
            },
            {
              title: "Price",
              render: (_, item) => (
                <span className="text-xs">
                  {formatINR(item.variant?.price)}
                </span>
              ),
            },
            {
              title: "Total",
              render: (_, item) => (
                <span className="text-xs">
                  {formatINR(
                    item.variant?.price
                      ? parseFloat(item.variant.price) * parseInt(item.quantity)
                      : 0
                  )}
                </span>
              ),
            },
          ]}
          dataSource={order.products || []}
          pagination={false}
          rowKey="_id"
          className="mb-4 font-sans"
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }
        />

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <Text>Sub-Total:</Text>
            <Text>{formatINR(subTotal)}</Text>
          </div>
          <div className="flex justify-between">
            <Text>GST (12%):</Text>
            <Text>{formatINR(gstAmount)}</Text>
          </div>
          <div className="flex justify-between">
            <Text>Shipping Charges:</Text>
            <Text>{formatINR(shippingCharges)}</Text>
          </div>
          <div className="flex justify-between">
            <Text>Packaging Charges:</Text>
            <Text>{formatINR(packagingCharge)}</Text>
          </div>
          <div className="flex justify-between">
            <Text>Transaction Charges (2.5%):</Text>
            <Text>{formatINR(transactionCharge)}</Text>
          </div>
          {discountPercentage > 0 && (
            <div className="flex justify-between">
              <Text>Discount ({discountPercentage}%):</Text>
              <Text>-{formatINR(discountAmount)}</Text>
            </div>
          )}
          <div className="flex justify-between font-semibold">
            <Text>Total:</Text>
            <Text>{formatINR(total)}</Text>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Normal Screen View */}
        <div className="print:hidden">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#293a90] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleUpdate}
                className="inline-flex items-center gap-1.5 text-xs text-[#293a90] hover:text-[#293a90]/80 px-3 py-2 rounded-lg hover:bg-[#293a90]/10 transition-colors font-sans border-[#293a90]"
                icon={<EditOutlined />}
              >
                Update
              </Button>

              <Button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 text-xs text-[#eb0082] hover:text-[#eb0082]/80 px-3 py-2 rounded-lg hover:bg-[#eb0082]/10 transition-colors font-sans border-[#eb0082]"
                icon={<PrinterOutlined />}
              >
                Print
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#293a90]"></div>
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <OrderDetailsSection />
              </Col>
              <Col xs={24} lg={12}>
                <CustomerDetailsSection />
              </Col>
              <Col xs={24} lg={12}>
                <AddressSection type="Billing" address={order.billingAddress} />
              </Col>
              <Col xs={24} lg={12}>
                <AddressSection
                  type="Shipping"
                  address={order.shippingAddress}
                />
              </Col>
              <Col xs={24} lg={12}>
                <ShoppingCartTable />
              </Col>
              <Col xs={24} lg={12}>
                <PricingSummarySection />
              </Col>
            </Row>
          )}
        </div>

        {/* Print View */}
        <PrintableInvoiceSection />
      </div>
    </div>
  );
};

export default OrderDetailsPage;
