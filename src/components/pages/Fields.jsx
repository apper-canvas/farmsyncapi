import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import FieldGrid from "@/components/organisms/FieldGrid";
import ApperIcon from "@/components/ApperIcon";

const Fields = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Field Management</h1>
          <p className="text-gray-600">Monitor crop status and manage field operations</p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Add Field
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fields..."
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="planted">Planted</option>
          <option value="growing">Growing</option>
          <option value="ready">Ready</option>
          <option value="harvested">Harvested</option>
        </select>
        <Button variant="outline">
          <ApperIcon name="Filter" size={20} className="mr-2" />
          Filters
        </Button>
      </div>

      {/* Field Grid */}
      <FieldGrid />
    </div>
  );
};

export default Fields;