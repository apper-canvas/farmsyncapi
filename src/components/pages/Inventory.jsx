import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import InventoryTable from "@/components/organisms/InventoryTable";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import { inventoryService } from "@/services/api/inventoryService";
import { toast } from "react-toastify";
const Inventory = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    location: "",
    supplier: "",
    cost: "",
    reorderPoint: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      location: "",
      supplier: "",
      cost: "",
      reorderPoint: ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error("Item name is required");
      return;
    }
    if (!formData.category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      toast.error("Valid quantity is required");
      return;
    }
    if (!formData.unit.trim()) {
      toast.error("Unit is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const newItem = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit.trim(),
        location: formData.location.trim(),
        supplier: formData.supplier.trim(),
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        reorderPoint: formData.reorderPoint ? parseInt(formData.reorderPoint) : 0,
        lastUpdated: new Date().toISOString()
      };

      await inventoryService.create(newItem);
      toast.success("Item added successfully");
      setShowAddModal(false);
      resetForm();
      // Trigger table refresh by forcing re-render
      window.location.reload();
    } catch (error) {
      toast.error("Failed to add item. Please try again.");
      console.error("Error adding item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
  };

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
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable />

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-none">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Add New Item</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                    className="w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Seeds">Seeds</option>
                    <option value="Fertilizer">Fertilizer</option>
                    <option value="Pesticide">Pesticide</option>
                    <option value="Tools">Tools</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity *
                    </label>
                    <Input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.1"
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit *
                    </label>
                    <Input
                      type="text"
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      placeholder="kg, pcs, L"
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Storage location"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <Input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    placeholder="Supplier name"
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost per Unit
                    </label>
                    <Input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reorder Point
                    </label>
                    <Input
                      type="number"
                      name="reorderPoint"
                      value={formData.reorderPoint}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Plus" size={16} className="mr-2" />
                        Add Item
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;