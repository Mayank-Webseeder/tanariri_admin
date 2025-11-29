import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import MdEditor from "@uiw/react-md-editor";
import useProductStore from "../../store/useProductStore.js";
import { useCategoryStore } from "../../store/CategoryStore.js";
import { toast } from "react-toastify";
import { ArrowLeft, Plus, X, Clock } from "lucide-react";

const IMAGE = import.meta.env.VITE_IMAGE;

const BreadcrumbNav = () => (
  <div className="flex items-center text-gray-500 mb-3 md:mb-4 text-xs sm:text-sm">
    <Link
      to="/catalogue/product"
      className="flex items-center hover:text-[#293a90]"
    >
      <span className="mr-1">🏠</span>
      <span>Products</span>
    </Link>
    <span className="mx-2">/</span>
    <span>Update Product</span>
  </div>
);

const ProductDetailsForm = ({
  productName,
  setProductName,
  description,
  setDescription,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Description *
          </label>
          <div data-color-mode="light">
            <MdEditor
              value={description}
              onChange={(v) => setDescription(v || "")}
              height={200}
              className="border border-gray-300 rounded-lg"
            />
          </div>
          <div className="text-right text-xs text-gray-500 mt-2">
            {description.split(/\s+/).filter(Boolean).length} WORDS
          </div>
        </div>
      </div>
    </div>
  );
};

const PriceFields = ({
  originalPrice,
  setOriginalPrice,
  discountedPrice,
  setDiscountedPrice,
  stock,
  setStock,
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
    <h3 className="text-xs font-semibold text-gray-900 mb-4 uppercase tracking-wide">
      Pricing
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Original Price *
        </label>
        <input
          type="number"
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Discount Price *
        </label>
        <input
          type="number"
          value={discountedPrice}
          onChange={(e) => setDiscountedPrice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
          placeholder="0.00"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Stock *
        </label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
          placeholder="0"
        />
      </div>
    </div>
  </div>
);

const ProductImages = ({ images, setImages }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="text-xs font-semibold text-gray-900 mb-4 uppercase tracking-wide">
        Product Images *
      </h3>

      <div className="flex flex-wrap gap-2">
        {images.map((file) => {
          // Same logic as ProductTable for proper URL construction
          let displayUrl;

          if (file.thumbUrl?.startsWith("blob:")) {
            // New uploaded file - use blob URL directly
            displayUrl = file.thumbUrl;
          } else if (file.url) {
            // Existing file - construct proper URL like ProductTable
            displayUrl = file.url.startsWith("http")
              ? file.url
              : `${IMAGE.replace(/\/$/, "")}/${file.url.replace(/^uploads[\\/]/, "")}`;
          } else {
            displayUrl = file.thumbUrl;
          }

          return (
            <div key={file.uid} className="relative">
              <img
                src={displayUrl}
                alt="Preview"
                className="w-20 h-20 object-cover rounded border border-gray-200"
                crossOrigin="anonymous"
              />
              <button
                type="button"
                onClick={() =>
                  setImages(images.filter((img) => img.uid !== file.uid))
                }
                className="absolute -top-2 -right-2 bg-[#eb0082] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-[#eb0082]/80"
              >
                <X size={10} />
              </button>
            </div>
          );
        })}

        <label className="w-20 h-20 border-2 border-dashed border-[#293a90]/30 rounded flex items-center justify-center cursor-pointer hover:border-[#293a90] transition-colors">
          <div className="flex flex-col items-center">
            <Plus size={20} className="text-[#293a90]" />
            <span className="text-xs text-[#293a90]">Upload</span>
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => {
              const newFiles = Array.from(e.target.files).map((file) => ({
                uid: Date.now() + Math.random(),
                originFileObj: file,
                thumbUrl: URL.createObjectURL(file),
                isNew: true, // Mark as new file
              }));
              setImages([...images, ...newFiles]);
            }}
            className="hidden"
            accept="image/*"
          />
        </label>
      </div>
    </div>
  );
};

const CategorySubCategorySelect = ({
  allCategories,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedSubCategoryId,
  setSelectedSubCategoryId,
}) => {
  const selectedCategory = allCategories.find(
    (c) => c._id === selectedCategoryId
  );
  const subCategories = selectedCategory?.subCategories || [];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h3 className="text-xs font-semibold text-gray-900 mb-4 uppercase tracking-wide">
        Category & Subcategory *
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setSelectedSubCategoryId("");
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
          >
            <option value="">Select Category</option>
            {allCategories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategoryId && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subcategory *
            </label>
            <select
              value={selectedSubCategoryId}
              onChange={(e) => setSelectedSubCategoryId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
            >
              <option value="">Select Subcategory</option>
              {subCategories.map((sc) => (
                <option key={sc._id} value={sc._id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

const VisibilityFields = ({
  isActive,
  setIsActive,
  bestSeller,
  setBestSeller,
  hideProduct,
  setHideProduct,
}) => (
  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
    <h3 className="text-xs font-semibold text-gray-900 mb-4 uppercase tracking-wide">
      Status & Visibility
    </h3>

    <div className="space-y-3">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-4 w-4 text-[#293a90] focus:ring-[#293a90] border-gray-300 rounded"
        />
        <label className="ml-2 text-xs text-gray-900">Active</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={bestSeller}
          onChange={(e) => setBestSeller(e.target.checked)}
          className="h-4 w-4 text-[#293a90] focus:ring-[#293a90] border-gray-300 rounded"
        />
        <label className="ml-2 text-xs text-gray-900">Best Seller</label>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={hideProduct}
          onChange={(e) => setHideProduct(e.target.checked)}
          className="h-4 w-4 text-[#293a90] focus:ring-[#293a90] border-gray-300 rounded"
        />
        <label className="ml-2 text-xs text-gray-900">Hide from Shop</label>
      </div>
    </div>
  </div>
);

const FooterButtons = ({ onCancel, loading }) => (
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
      disabled={loading}
      className="px-4 py-2 text-xs font-medium bg-[#293a90] hover:bg-[#293a90]/90 text-white rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? (
        <>
          <Clock size={12} className="animate-spin inline mr-2" />
          Saving...
        </>
      ) : (
        "Save & Close"
      )}
    </button>
  </div>
);

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById, updateProduct, loading } = useProductStore();
  const { fetchCategories } = useCategoryStore();

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [bestSeller, setBestSeller] = useState(false);
  const [hideProduct, setHideProduct] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetchCategories();
        const categories = categoriesResponse?.data || categoriesResponse || [];
        setAllCategories(categories);

        // Fetch product details
        const product = await fetchProductById(id);

        if (product) {
          setProductName(product.productName || "");
          setDescription(product.description || "");
          setOriginalPrice(product.originalPrice?.toString() || "");
          setDiscountedPrice(product.discountPrice?.toString() || "");
          setStock(product.stock?.toString() || "");
          setIsActive(product.isActive ?? true);
          setBestSeller(product.bestSeller ?? false);
          setHideProduct(product.hideProduct ?? false);

          // Handle existing images - same as ProductTable
          if (product.productImages && Array.isArray(product.productImages)) {
            const existingImages = product.productImages.map((img, index) => {
              const imageUrl = img.startsWith("http")
                ? img
                : `${IMAGE.replace(/\/$/, "")}/${img.replace(/^uploads[\\/]/, "")}`;

              return {
                uid: `existing-${index}`,
                url: img, // Original URL from backend
                thumbUrl: imageUrl, // Display URL
                isNew: false, // Mark as existing file
              };
            });
            setImages(existingImages);
          }

          // Set category and subcategory
          if (product.category?._id) {
            setSelectedCategoryId(product.category._id);

            // Find and set subcategory
            if (product.subCategoryId) {
              const subCatId = product.subCategoryId._id || product.subCategoryId;
              setSelectedSubCategoryId(subCatId);
            }
          }
        }

        setIsDataLoaded(true);
      } catch (err) {
        console.error("Error loading product data:", err);
        toast.error("Failed to load product data");
        setIsDataLoaded(true);
      }
    };

    if (id) {
      getData();
    }
  }, [id, fetchProductById, fetchCategories]);

  const onFinish = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !productName.trim() ||
      !description.trim() ||
      !originalPrice ||
      !discountedPrice ||
      !stock ||
      !selectedCategoryId ||
      !selectedSubCategoryId ||
      images.length === 0
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      // Create FormData for Multer
      const formData = new FormData();

      // Append text fields
      formData.append("productName", productName.trim());
      formData.append("description", description.trim());
      formData.append("originalPrice", parseFloat(originalPrice));
      formData.append("discountPrice", parseFloat(discountedPrice));
      formData.append("stock", parseInt(stock));
      formData.append("category", selectedCategoryId);
      formData.append("subCategoryId", selectedSubCategoryId);
      formData.append("isActive", isActive);
      formData.append("bestSeller", bestSeller);
      formData.append("hideProduct", hideProduct);

      // Separate new files and existing URLs
      const newFiles = images.filter((img) => img.isNew && img.originFileObj);
      const existingUrls = images
        .filter((img) => !img.isNew && img.url)
        .map((img) => img.url);

      // Append new files to FormData
      newFiles.forEach((file) => {
        formData.append("productImages", file.originFileObj);
      });

      // Append existing image URLs as JSON string
      if (existingUrls.length > 0) {
        formData.append("existingImages", JSON.stringify(existingUrls));
      }

      // Debug log
      console.log("FormData contents:");
      console.log("- New files:", newFiles.length);
      console.log("- Existing URLs:", existingUrls.length);

      await updateProduct(id, formData);

      toast.success("Product updated successfully!");
      navigate("/catalogue/product");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update product: " + (err.message || "Unknown error"));
    }
  };

  const onCancel = () => navigate("/catalogue/product");

  if (!isDataLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#293a90]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        <BreadcrumbNav />

        <div className="flex justify-between items-center py-2 mb-0">
          <div>
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>
        </div>

        <div className="space-y-6 mt-4">
          <form onSubmit={onFinish} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ProductDetailsForm
                  productName={productName}
                  setProductName={setProductName}
                  description={description}
                  setDescription={setDescription}
                />

                <PriceFields
                  originalPrice={originalPrice}
                  setOriginalPrice={setOriginalPrice}
                  discountedPrice={discountedPrice}
                  setDiscountedPrice={setDiscountedPrice}
                  stock={stock}
                  setStock={setStock}
                />

                <ProductImages images={images} setImages={setImages} />
              </div>

              <div className="space-y-6">
                <CategorySubCategorySelect
                  allCategories={allCategories}
                  selectedCategoryId={selectedCategoryId}
                  setSelectedCategoryId={setSelectedCategoryId}
                  selectedSubCategoryId={selectedSubCategoryId}
                  setSelectedSubCategoryId={setSelectedSubCategoryId}
                />

                <VisibilityFields
                  isActive={isActive}
                  setIsActive={setIsActive}
                  bestSeller={bestSeller}
                  setBestSeller={setBestSeller}
                  hideProduct={hideProduct}
                  setHideProduct={setHideProduct}
                />

                <FooterButtons onCancel={onCancel} loading={loading} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
