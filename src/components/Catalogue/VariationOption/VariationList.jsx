import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import { FaTrash, FaGripLines } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const VariationList = () => {
  const navigate = useNavigate()
  const [values, setValues] = useState([
    { id: "1", text: "100 gm", value: "1" },
    { id: "2", text: "200 gm", value: "2" },
    { id: "3", text: "250 gm", value: "3" },
    { id: "4", text: "500 gm", value: "4" },
    { id: "5", text: "1kg", value: "4" },
  ]);

  // Function to handle drag-and-drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedValues = [...values];
    const [movedItem] = reorderedValues.splice(result.source.index, 1);
    reorderedValues.splice(result.destination.index, 0, movedItem);
    setValues(reorderedValues);
  };

  // Function to add a new value
  const handleAddMore = () => {
    // const newValue = { id: Date.now().toString(), text: "New Value" };
    setValues([...values, {id: Date.now().toString(), text:"", value:""}]);
  };

  // Function to remove a value
  const handleRemove = (id) => {
    setValues(values.filter((item) => item.id !== id));
  };

  const [formData, setFormData] = useState({
    variationName: "Product Weight",
    displayText: "Weight",
    feedLabel: "Weight",
    variationType: "Dropdown",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleInputChange = (id, newText) => {
    setValues(values.map(item => 
      item.id === id ? { ...item, text: newText } : item
    ));
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
    
       
        <h2 className="text-2xl font-semibold ">Update Variation</h2>
     <div className=" flex flex-col md:flex-col lg:flex-row gap-6 mt-4">
     
      <div className="w-full md:w-full lg:w-2/3 bg-white shadow-md rounded-lg p-4 md:p-6">
        {/* Form Fields */}
        <div className="space-y-11 ">
          {/* Variation Name */}
          <div>
            <label className="block text-gray-400 font-sm mb-1">
              Variation Name (For Internal Use) *
            </label>
            <input
              type="text"
              name="variationName"
              value={formData.variationName}
              onChange={handleChange}
              className="w-full py-1 border-b focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Display Text */}
          <div>
            <label className="block text-gray-400 font-sm mb-1">
              Display Text *
            </label>
            <input
              type="text"
              name="displayText"
              value={formData.displayText}
              onChange={handleChange}
              className="w-full py-1 border-b focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Feed Label */}
          <div>
            <label className="block text-gray-400 font-sm mb-1">
              Feed Label *
            </label>
            <input
              type="text"
              name="feedLabel"
              value={formData.feedLabel}
              onChange={handleChange}
              className="w-full py-1 border-b focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Variation Type Dropdown */}
          <div className="mb-8">
            <label className="block text-gray-400 font-sm mb-1">
              Variation Type *
            </label>
            <select
              name="variationType"
              value={formData.variationType}
              onChange={handleChange}
              className="w-full py-1 border-b bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Dropdown">Dropdown</option>
              <option value="Radio">Radio</option>
              <option value="Checkbox">Checkbox</option>
            </select>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="h-[10vh] flex justify-center md:justify-center items-center gap-4 bg-white p-4 md:p-5 text-white shadow-md rounded-lg">
            
           <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md cursor-pointer">
              SAVE
            </button>
            <button 
            onClick={()=> navigate('/catalogue/variation-options')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-md cursor-pointer">
              CANCEL
            </button>
          </div>
    </div>


      <div className="w-full mt-8 md:w-full lg:w-2/3 bg-white shadow-md rounded-lg p-4 md:p-6">
        {/* Button to Add More */}
        <div className="flex justify-start">
          <button
            onClick={handleAddMore}
            className="px-4 py-2 text-white !text-white bg-gradient-to-r from-blue-400 to-blue-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer rounded-lg"
          >
            Add More
          </button>
        </div>

        {/* Draggable List */}
        <div className="p-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="variationList">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="w-full">
                  {values.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center justify-between mb-4 p-4 w-full "
                        >
                          {/* Drag Icon */}
                          <span {...provided.dragHandleProps} className="mr-3 cursor-grab">
                            <FaGripLines className="text-gray-500" />
                          </span>

                          {/* Input Field */}
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e)=> handleInputChange(item.id, e.target.value)}
                            className="flex-grow border-b-2 border-gray-300 outline-none p-1 text-lg bg-transparent"
                            
                          />

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-2 rounded-full bg-gray-300 text-white hover:bg-red-500 transition"
                            disabled={values.length === 1}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default VariationList;
