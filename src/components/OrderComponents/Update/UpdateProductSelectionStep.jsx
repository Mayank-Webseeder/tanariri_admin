// UpdateProductSelectionStep.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  AutoComplete,
  Input,
  Button,
  Image,
  Table,
  Spin,
  Alert,
} from "antd";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { DeleteOutlined } from "@ant-design/icons";
import useProductStore from "../../../store/useProductStore";
import debounce from "lodash/debounce";

// UpdateQuantityControl component update
const UpdateQuantityControl = ({ value = 1, onChange }) => {
  const handleDecrease = () => value > 1 && onChange(value - 1);
  const handleIncrease = () => onChange(value + 1);

  return (
    <div className="flex items-center justify-center gap-3 bg-gray-100 rounded-full p-1">
      <button
        type="button"
        onClick={handleDecrease}
        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-200"
      >
        <AiOutlineMinus className="text-gray-700" />
      </button>
      <span className="w-8 text-center">{value}</span>
      <button
        type="button"
        onClick={handleIncrease}
        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-200"
      >
        <AiOutlinePlus className="text-gray-700" />
      </button>
    </div>
  );
};

const UpdateProductTable = ({ data = [], onRemove, onQuantityChange }) => {
  const columns = [
    {
      title: "Image",
      key: "image",
      render: (_, record) => (
        <Image
          src={record.product?.productImages?.[0] || "/default-image.jpg"}
          alt="product"
          width={50}
          preview={false}
          fallback="/default-image.jpg"
        />
      ),
    },
    {
      title: "Product",
      key: "name",
      render: (_, record) => (
        <span className="text-xs font-medium">
          {record.product?.productName || "Unknown Product"}
        </span>
      ),
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) => (
        <span className="text-xs">₹{Number(record.price || 0).toFixed(2)}</span>
      ),
    },
    {
      title: "Qty",
      key: "quantity",
      render: (_, record) => (
        <UpdateQuantityControl
          value={record.quantity || 1}
          onChange={(q) => onQuantityChange(record.key, q)}
        />
      ),
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => (
        <span className="text-xs font-medium">
          ₹{((record.price || 0) * (record.quantity || 0)).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(record.key);
          }}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      size="small"
      className="shadow-sm"
      scroll={{ x: "max-content" }}
      onRow={(record) => ({
        onClick: (e) => e.stopPropagation(), // Prevent row click propagation
      })}
    />
  );
};

const UpdateProductInput = ({ onAdd, products = [] }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [options, setOptions] = useState([]);

  const searchProducts = useCallback(
    debounce((value) => {
      if (!value.trim()) {
        setOptions([]);
        return;
      }
      const filtered = products
        .filter((p) =>
          p.productName?.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 10)
        .map((p) => ({
          value: p._id,
          label: p.productName,
        }));
      setOptions(filtered);
    }, 300),
    [products]
  );

  const handleSelect = (value) => {
    const product = products.find((p) => p._id === value);
    setSelectedProduct(product);
    setSearchValue(product?.productName || "");
  };

  const handleAdd = (e) => {
    e?.stopPropagation(); // Optional: if needed
    if (!selectedProduct) return;
    const price = Number(
      selectedProduct.discountPrice || selectedProduct.originalPrice || 0
    );
    onAdd({
      key: Date.now(),
      product: selectedProduct,
      price,
      quantity,
    });
    setSelectedProduct(null);
    setQuantity(1);
    setSearchValue("");
    setOptions([]);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <Form layout="vertical">
        <Form.Item label="Search Product">
          <AutoComplete
            options={options}
            onSearch={searchProducts}
            onSelect={handleSelect}
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Type product name..."
            allowClear
            style={{ width: "100%" }}
          >
            <Input />
          </AutoComplete>
        </Form.Item>

        {selectedProduct && (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Image
              src={selectedProduct.productImages?.[0] || "/default-image.jpg"}
              width={70}
              alt={selectedProduct.productName}
              preview={false}
            />
            <div className="flex-1">
              <div className="font-medium">{selectedProduct.productName}</div>
              <div className="text-sm text-gray-600">
                ₹
                {selectedProduct.discountPrice || selectedProduct.originalPrice}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                style={{ width: 80 }}
              />
              <Button type="primary" onClick={handleAdd}>
                Add
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

const UpdateProductSelectionStep = ({
  onProductSelect,
  initialProducts = [],
}) => {
  const { products, loading, error, fetchProducts } = useProductStore();
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Safely load initial products from existing order
  useEffect(() => {
    if (initialProducts.length > 0 && selectedProducts.length === 0) {
      const safeProducts = initialProducts.map((item) => {
        const product = item.product || {};
        const price =
          Number(item.price) ||
          product.discountPrice ||
          product.originalPrice ||
          0;

        return {
          key: item.key || Date.now() + Math.random(),
          product: {
            _id: product._id || "unknown",
            productName: product.productName || "Deleted Product",
            productImages: product.productImages || [],
          },
          price,
          quantity: Number(item.quantity) || 1,
        };
      });
      setSelectedProducts(safeProducts);
    }
  }, [initialProducts, selectedProducts.length]);

  useEffect(() => {
    onProductSelect(selectedProducts);
  }, [selectedProducts, onProductSelect]);

  const addProduct = (newItem) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.product._id === newItem.product._id);
      if (exists) {
        return prev.map((p) =>
          p.product._id === newItem.product._id
            ? { ...p, quantity: p.quantity + newItem.quantity }
            : p
        );
      }
      return [...prev, newItem];
    });
  };

  const removeProduct = (key) => {
    setSelectedProducts((prev) => prev.filter((p) => p.key !== key));
  };

  const updateQuantity = (key, qty) => {
    setSelectedProducts((prev) =>
      prev.map((p) => (p.key === key ? { ...p, quantity: qty } : p))
    );
  };

  const tableData = selectedProducts.map((p) => ({
    key: p.key,
    product: p.product,
    price: p.price,
    quantity: p.quantity,
  }));

  return (
    <div className="space-y-6">
      <style jsx>{`
        .ant-table-thead > tr > th {
          background: #f3f4f6 !important;
          font-weight: 600 !important;
          font-size: 12px;
        }
      `}</style>

      <h2 className="text-lg font-semibold text-gray-800">Product Selection</h2>

      {loading && (
        <div className="text-center py-12">
          <Spin size="large" tip="Loading products..." />
        </div>
      )}

      {error && (
        <Alert
          message="Failed to load products"
          description={error}
          type="error"
          showIcon
        />
      )}

      {!loading && products.length > 0 && (
        <>
          <UpdateProductInput
            onAdd={addProduct}
            products={products.filter((p) => p.isActive && !p.hideProduct)}
          />

          {selectedProducts.length > 0 && (
            <div className="mt-6">
              <UpdateProductTable
                data={tableData}
                onRemove={removeProduct}
                onQuantityChange={updateQuantity}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UpdateProductSelectionStep;
