import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategoryStore } from "../store/CategoryStore";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";

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
        "Save"
      )}
    </button>
  </div>
);

const UpdateCategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCategoryById, updateCategory } = useCategoryStore();

  const [name, setName] = useState("");
  const [subCategories, setSubCategories] = useState([{ name: "", label: "" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchCategoryById(id);

        console.log("Fetch Category Response:", response);

        // Validate response
        if (!response) {
          throw new Error("No data returned from server");
        }

        // Handle different response structures
        let categoryData = response;

        // If response has a data property, use it
        if (response.data) {
          categoryData = response.data;
        }

        // Validate categoryData has required properties
        if (!categoryData || typeof categoryData !== 'object') {
          throw new Error("Invalid category data received");
        }

        console.log("Category Data to Use:", categoryData);

        // Set name with fallback
        setName(categoryData.name || "");

        // Better subcategories handling
        if (
          categoryData.subCategories &&
          Array.isArray(categoryData.subCategories) &&
          categoryData.subCategories.length > 0
        ) {
          setSubCategories(
            categoryData.subCategories.map((sc) => ({
              name: sc.name || "",
              label: sc.label || "",
              _id: sc._id || undefined,
            }))
          );
        } else {
          setSubCategories([{ name: "", label: "" }]);
        }
      } catch (err) {
        console.error("Fetch Category Error:", err);
        const errorMessage = err.message || "Failed to load category";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError("No category ID provided");
      setLoading(false);
    }
  }, [id, fetchCategoryById]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubNameChange = (index, value) => {
    const updated = [...subCategories];
    updated[index].name = value;
    setSubCategories(updated);
  };

  const handleSubLabelChange = (index, value) => {
    const updated = [...subCategories];
    updated[index].label = value;
    setSubCategories(updated);
  };

  const addSubCategory = () => {
    setSubCategories([...subCategories, { name: "", label: "" }]);
  };

  const removeSubCategory = (index) => {
    if (subCategories.length > 1) {
      const updated = subCategories.filter((_, i) => i !== index);
      setSubCategories(updated);
    } else {
      toast.warning("At least one subcategory is required");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      setError("Category name is required");
      toast.error("Category name is required");
      return;
    }

    // Filter valid subcategories and REMOVE _id
    const validSubCategories = subCategories
      .filter((sc) => sc.name.trim())
      .map((sc) => ({
        name: sc.name.trim(),
        label: sc.label.trim() || sc.name.trim(),
      }));

    if (validSubCategories.length === 0) {
      setError("At least one subcategory with a name is required");
      toast.error("At least one subcategory with a name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData = {
        name: name.trim(),
        subCategories: validSubCategories,
      };

      console.log("Update Payload:", updateData);

      await updateCategory(id, updateData);

      toast.success(`Category "${name}" updated successfully!`);
      navigate("/catalogue/categories");
    } catch (err) {
      console.error("Update Category Error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to update category"
      );
      toast.error(
        err.response?.data?.message || err.message || "Failed to update category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/catalogue/categories");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#293a90]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Header & Breadcrumb */}
        <div className="flex justify-between items-center py-2 mb-0">
          <div>
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
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-red-600 mr-2" />
                <span className="text-xs text-red-700">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="space-y-4">
                    {/* Category Name */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs bg-white"
                        placeholder="Enter category name"
                      />
                    </div>

                    {/* Subcategories */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Subcategories *
                      </label>
                      <div className="space-y-2">
                        {subCategories.map((sc, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="Subcategory name *"
                                value={sc.name}
                                onChange={(e) =>
                                  handleSubNameChange(index, e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
                                required
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type="text"
                                placeholder="Label (optional)"
                                value={sc.label}
                                onChange={(e) =>
                                  handleSubLabelChange(index, e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#293a90] focus:border-[#293a90] text-xs"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSubCategory(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              disabled={subCategories.length <= 1}
                              title="Remove subcategory"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addSubCategory}
                          className="flex items-center gap-1 text-xs text-[#293a90] hover:text-[#293a90]/80 font-medium"
                        >
                          <Plus size={14} />
                          Add Subcategory
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Provide at least one subcategory with a name. Label is
                        optional and will default to the name if not provided.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Summary */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Summary
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <p className="font-medium text-gray-900 mt-1">
                        {name || "Not set"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Subcategories:</span>
                      <p className="font-medium text-gray-900 mt-1">
                        {subCategories.filter((sc) => sc.name.trim()).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <FooterButtons onCancel={handleCancel} loading={loading} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategoryPage;
