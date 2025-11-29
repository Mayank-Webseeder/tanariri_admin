/* eslint-disable no-undef */
import React, { useState } from "react";
import { Table, Checkbox, Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddVariation from "../../../pages/AddVariation";

const { Option } = Select;

const Variation = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [setName, setSetName] = useState("");
  const [data, setData] = useState([
    { SNo: "1", SetName: "Product Weight", date: "2023-03-02 17:25:52" },
  ]);

  // Function to handle "Add"
  const handleAdd = () => {
    if (setName.trim() === "") {
      alert("Set Name cannot be empty!");
      return;
    }

    const newSet = {
      SNo: String(data.length + 1),
      SetName: setName,
      date: new Date().toLocaleString(),
    };

    setData([...data, newSet]);
    setSetName("");
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = data.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
  };

  const columns = [
    {
      title: "",
      dataIndex: "select",
      width: 50,
      render: () => <Checkbox />,
    },
    {
      title: "S.No",
      dataIndex: "SNo",
      sorter: (a, b) => a.SNo.localeCompare(b.SNo),
    },
    {
      title: "Set Name",
      dataIndex: "SetName",
      sorter: (a, b) => a.SetName.localeCompare(b.SetName),
      render: (text, record) => (
        <a
          style={{ color: "#1890ff", cursor: "pointer" }}
          onClick={() => navigate(`/variation-list/${record.SNo}`)}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Created On",
      dataIndex: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: () => <FaTrash className="text-red-500 cursor-pointer" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-gray-800">Variation Options</h2>

      {/* Tabs */}
      <div className="flex my-4 justify-between">
        <div className="flex gap-2">
          <button 
          className="bg-gray-400 px-4 py-2 rounded-full text-white !text-white">
            Variation Set
          </button>
          <button
          className="bg-purple-600 px-4 py-2 rounded-full text-white !text-white">
            Variation
          </button>
        </div>
        <div>
        <button
  onClick={() => setIsOpen(true)}
  className="bg-gradient-to-r from-blue-400 to-blue-600 text-white !text-white px-4 py-2 rounded-lg"
>
  Add New
</button>

        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="flex justify-between items-center mb-4">
        <Space>
          <Select defaultValue="Filters" style={{ width: 120 }}>
            <Option value="all">All</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Confirmed">Confirmed</Option>
            <Option value="Shipped">Shipped</Option>
          </Select>
          <div className="relative">
            <Input
              placeholder="Search"
              style={{ width: 200 }}
              onChange={handleSearchChange}
              value={searchText}
            />
            <SearchOutlined className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </Space>
        <Select
          defaultValue="20"
          style={{ width: 80 }}
          onChange={handlePageSizeChange}
        >
          <Option value="10">10</Option>
          <Option value="20">20</Option>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize, showSizeChanger: false }}
          rowClassName={(record, index) =>
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          }
          className="shadow-md rounded w-full"
        />
      </div>

      {/* Add Variation Popup */}
      <AddVariation
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAdd={handleAdd}
        setName={setName}
        setSetName={setSetName}
      />
    </div>
  );
};

export default Variation;