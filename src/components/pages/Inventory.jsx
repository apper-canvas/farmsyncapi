import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import InventoryTable from "@/components/organisms/InventoryTable";
import ApperIcon from "@/components/ApperIcon";

const Inventory = () => {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Track supplies, seeds, and equipment</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button variant="outline">
            <ApperIcon name="Download" size={20} className="mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable />
    </div>
  );
};

export default Inventory;