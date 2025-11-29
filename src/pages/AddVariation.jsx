import React from "react";

const AddVariation = ({ isOpen, onClose, onAdd, setName, setSetName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50 z-50 backdrop-blur-sm ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Enter Set Name</h2>

        {/* Input Field */}
        <input
          type="text"
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          placeholder="Enter name..."
        />

        {/* Buttons */}
        <div className="flex justify-end mt-4 space-x-3 gap-2">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md"
          >
            Cancel
          </button>

          {/* Add Button */}
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVariation;