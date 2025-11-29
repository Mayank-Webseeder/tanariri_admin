import React from "react";
import { useNavigate } from "react-router-dom";

const BrandsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 16h8M8 12h8m-8-4h4m-2-4a8 8 0 11-8 8 8 8 0 018-8z"
            ></path>
          </svg>
        </div>
        <span className="text-xl font-bold ">
          Your Brands will show up here
        </span>
        <div className="mt-3">
        <h3 className="text-gray-500 text-sm">
          Click 'Add New' button to add your first Brand here.
        </h3></div>
        <div className="mt-6 flex justify-center gap-4">
        <button onClick={()=>navigate('/brands/createBrands')}
        className="px-4 py-2 text-white bg-gradient-to-r from-blue-700  to-blue-400 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer">
            Add New
          </button>
          <button className="px-4 py-2 text-white bg-gradient-to-r from-blue-400 to-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer">
            Import
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
