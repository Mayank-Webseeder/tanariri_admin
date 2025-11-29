import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { FiHome } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const CreateBrands = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState(""); 

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleIconClick = () => {
    document.getElementById("imageInput").click();
  };

  const handleDeleteImage = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Breadcrumb */}
      <div className="flex gap-2 text-gray-400 text-sm md:text-base">
        <FiHome />
        <p>Brands / Create Brand</p>
      </div>

      {/* Page Header */}
      <p className="text-xl md:text-2xl font-bold text-gray-800 mt-2">Create Brand</p>

      {/* Main Container */}
      <div className="flex flex-col md:flex-col lg:flex-row gap-6 mt-4">
        {/* Left Side: Form Container */}
        <div className="w-full md:w-full lg:w-2/3 bg-white shadow-md rounded-lg p-4 md:p-6">
          {/* Brand Name Input */}
          <div className="mb-6">
            <input
              type="text"
              className="w-full border-b border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" Brand Name *"
            />
          </div>

          {/* Description (MDEditor) */}
          <div className="mb-4">
            <label className="block text-gray-400 font-medium">Description</label>
            <MDEditor
              value={description}
              onChange={setDescription} // Update the description state
              height={200} // Set the height of the editor
              preview="edit" // Show both edit and preview panes
            />
          </div>
        </div>

        {/* Right Side: Status Toggle & Action Buttons */}
        <div className="w-full md:w-full lg:w-1/3 flex flex-col">
          {/* Status Toggle */}
          <div className="p-4 md:p-6 bg-white shadow-md rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Status</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={status}
                  onChange={() => setStatus(!status)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center md:justify-center items-center gap-4 bg-white p-4 md:p-5 text-white mt-2 shadow-md rounded-lg">
            <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md">
              SAVE
            </button>
            <button 
            onClick={()=>navigate('/catalogue/brands')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md">
              CANCEL
            </button>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-4 md:p-6 w-full md:w-full lg:w-2/3">
        {/* Title */}
        <p className="text-lg font-bold text-gray-800">Images</p>

        {/* Upload Box */}
        <div
          className="mt-3 flex items-center justify-center border-dashed border-2 border-gray-300 rounded-lg p-6 cursor-pointer relative"
          onClick={!selectedImage ? handleIconClick : undefined}
        >
          {selectedImage ? (
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected"
                className="h-20 w-20 object-cover rounded-lg"
              />
              {/* Delete Button */}
              <div
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 cursor-pointer"
                onClick={handleDeleteImage}
              >
                <FaTrash size={14} />
              </div>
            </div>
          ) : (
            <span className="text-gray-400 border border-dashed rounded-full h-10 w-10 flex items-center justify-center text-xl">
              +
            </span>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default CreateBrands;