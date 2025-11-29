import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCategoryStore } from "../store/CategoryStore";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Home,
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

const AddCategoryPage = () => {
  const navigate = useNavigate();
  const { createCategory } = useCategoryStore();
  // Local state for form fields and UI control
  const [name, setName] = useState("");
  const [subCategories, setSubCategories] = useState([{ name: "", label: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Handlers for form inputs
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
    }
  };
  const handleSave = async () => {
    if (!name.trim()) {
      setError("Category name is required");
      toast.error("Category name is required");
      return;
    }
    if (subCategories.length === 0 || subCategories.every(sc => !sc.name.trim())) {
      setError("At least one subcategory with a name is required");
      toast.error("At least one subcategory with a name is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const validSubCategories = subCategories
        .map(sc => ({
          name: sc.name.trim(),
          label: sc.label.trim() || undefined, // Optional label
        }))
        .filter(sc => sc.name); // Only include if name is provided
      if (validSubCategories.length === 0) {
        throw new Error("At least one subcategory with a name is required");
      }
      const categoryData = {
        name: name.trim(),
        subCategories: validSubCategories,
      };
      await createCategory(categoryData);
      toast.success(`Category "${name}" added successfully!`);
      // Reset form and navigate back
      setName("");
      setSubCategories([{ name: "", label: "" }]);
      navigate("/catalogue/categories");
    } catch (err) {
      setError(err.message || "Failed to create category");
      toast.error(err.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    navigate("/catalogue/categories");
  };
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-4 w-full">
        {/* Top bar with breadcrumb and buttons */}
        <div className="flex justify-between items-center py-2 mb-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/catalogue/categories")}
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          </div>
        </div>
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-red-600 mr-2" />
                <span className="text-xs text-red-700">{error}</span>
              </div>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs bg-white"
                        placeholder="Enter category name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Subcategories *
                      </label>
                      <div className="space-y-2">
                        {subCategories.map((sc, index) => (
                          <div key={index} className="flex gap-2 items-end">
                            <input
                              type="text"
                              placeholder="Subcategory name *"
                              value={sc.name}
                              onChange={(e) => handleSubNameChange(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Label (optional)"
                              value={sc.label}
                              onChange={(e) => handleSubLabelChange(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => removeSubCategory(index)}
                              className="p-1 text-red-500 hover:text-red-700"
                              disabled={subCategories.length <= 1}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addSubCategory}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          <Plus size={12} />
                          Add Subcategory
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Provide at least one subcategory with a name. Label is optional.</p>
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
export default AddCategoryPage;