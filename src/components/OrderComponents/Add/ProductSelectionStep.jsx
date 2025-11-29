import React, { useState, useEffect } from "react";
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

const QuantityControl = ({ value, onChange }) => {
  const handleDecrease = () => {
    if (value > 1) onChange(value - 1);
  };

  const handleIncrease = () => {
    onChange(value + 1);
  };

  return (
    <div className="flex items-center justify-center gap-3 bg-gray-100 rounded-full p-1">
      <button
        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-200"
        onClick={handleDecrease}
        aria-label="Decrease quantity"
      >
        <AiOutlineMinus className="text-gray-700" />
      </button>
      <span className="w-8 text-center">{value}</span>
      <button
        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full hover:bg-gray-200"
        onClick={handleIncrease}
        aria-label="Increase quantity"
      >
        <AiOutlinePlus className="text-gray-700" />
      </button>
    </div>
  );
};

const ProductTable = ({ data, onRemove, onQuantityChange }) => {
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image src={image || ''} alt="Product" width={50} preview={false} />
      ),
    },
    {
      title: "Product",
      dataIndex: "title",
      key: "productName",
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) => `₹${record.price}`,
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) => (
        <QuantityControl
          value={record.quantity}
          onChange={(newQuantity) => onQuantityChange(record.key, newQuantity)}
        />
      ),
    },
    {
      title: "Total Price",
      key: "total",
      render: (_, record) =>
        `₹${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          icon={<DeleteOutlined className="text-red-500" />}
          onClick={() => onRemove(record.key)}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      rowClassName={(record, index) =>
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }
      className="rounded-lg shadow-md"
      scroll={{ x: "max-content" }}
    />
  );
};

const ProductInput = ({ onAdd, products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value) => {
    setSearchValue(value);
    let filtered = [];
    if (!value) {
      filtered = products.map((p) => ({
        value: p._id,
        label: p.productName,
      }));
    } else {
      filtered = products
        .filter((p) =>
          p.productName.toLowerCase().includes(value.toLowerCase())
        )
        .map((p) => ({ value: p._id, label: p.productName }));
    }
    setOptions(filtered);
  };

  const handleSelect = (value) => {
    const product = products.find((p) => p._id === value);
    setSelectedProduct(product);
    setQuantity(1);
    setSearchValue(product.productName);
  };

  const handleAdd = () => {
    if (selectedProduct && quantity) {
      const price = selectedProduct.discountPrice || selectedProduct.originalPrice || 0;
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
    }
  };

  const handleFocus = () => {
    if (!searchValue) handleSearch("");
  };

  return (
    <div className="bg-white p-6 px-9 rounded-lg shadow-md">
      <Form layout="vertical" className="space-y-4">
        <Form.Item label="Search Product">
          <AutoComplete
            options={options}
            onSearch={handleSearch}
            onSelect={handleSelect}
            placeholder="Type to search product..."
            value={searchValue}
            onChange={(value) => setSearchValue(value)}
            allowClear
            onFocus={handleFocus}
            className="w-full"
            disabled={!products.length}
          >
            <Input className="border border-gray-300 rounded-md" />
          </AutoComplete>
        </Form.Item>
        {selectedProduct && (
          <div>
            <div className="flex items-center space-x-4 mb-4">
              <Image
                src={selectedProduct.productImages?.[0] || ''}
                width={100}
                alt={selectedProduct.productName}
                preview={false}
              />
              <div>
                <span className="font-medium text-gray-800 block">
                  {selectedProduct.productName}
                </span>
                <span className="text-sm text-gray-600">
                  ₹{selectedProduct.discountPrice || selectedProduct.originalPrice || 0}
                </span>
              </div>
            </div>
            <Form.Item label="Quantity">
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md"
                placeholder="Enter quantity"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={handleAdd}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-[#293a90]"
              >
                Add Product
              </Button>
            </Form.Item>
          </div>
        )}
      </Form>
    </div>
  );
};

const ProductSelectionStep = ({ onProductSelect }) => {
  const { products, loading, error, fetchProducts } = useProductStore();
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    onProductSelect(selectedProducts);
  }, [selectedProducts, onProductSelect]);

  const addProduct = (productData) => {
    // Check if product already exists, if yes, increase quantity
    const existingIndex = selectedProducts.findIndex(p => p.product._id === productData.product._id);
    if (existingIndex > -1) {
      const updated = [...selectedProducts];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + productData.quantity
      };
      setSelectedProducts(updated);
    } else {
      setSelectedProducts([...selectedProducts, productData]);
    }
  };

  const removeProduct = (key) => {
    setSelectedProducts(selectedProducts.filter((p) => p.key !== key));
  };

  const updateQuantity = (key, newQuantity) => {
    setSelectedProducts(
      selectedProducts.map((product) =>
        product.key === key ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const tableData = selectedProducts.map(p => ({
    key: p.key,
    image: p.product.productImages?.[0] || '',
    title: p.product.productName,
    price: p.price,
    quantity: p.quantity,
  }));

  return (
    <div className=" font-sans">
      <style>{`
                .ant-table-thead > tr > th {
                    background-color: #f3f4f6;
                    font-weight: bold;
                }
            `}</style>
      {/* <h2 className="text-xl font-semibold mb-4">Product Selection</h2> */}

      {loading && (
        <div className="text-center my-6">
          <Spin size="large" tip="Loading products..." />
        </div>
      )}

      {error && !loading && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          className="mb-6"
        />
      )}

      {!loading && !error && (
        <>
          <ProductInput onAdd={addProduct} products={products.filter(p => p.isActive && !p.hideProduct)} />
          {selectedProducts.length > 0 && (
            <div className="mt-6">
              <ProductTable
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

export default ProductSelectionStep;