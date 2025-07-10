import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FieldGrid from "@/components/organisms/FieldGrid";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import { fieldsService } from "@/services/api/fieldsService";

const Fields = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    cropType: "",
    acres: "",
    location: "",
    status: "planted"
  });

  const handleAddField = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setFormData({
      name: "",
      cropType: "",
      acres: "",
      location: "",
      status: "planted"
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.cropType || !formData.acres || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const fieldData = {
        ...formData,
        acres: parseFloat(formData.acres),
        plantedDate: new Date().toISOString().split('T')[0],
        lastWatered: new Date().toISOString().split('T')[0]
      };

      await fieldsService.create(fieldData);
      toast.success("Field added successfully!");
      handleCloseModal();
      
      // Trigger re-render of FieldGrid by forcing a key change
      window.location.reload();
    } catch (error) {
      toast.error("Failed to add field. Please try again.");
      console.error("Error adding field:", error);
    } finally {
setLoading(false);
    }
  };
  
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Field Management</h1>
          <p className="text-gray-600">Monitor crop status and manage field operations</p>
        </div>
        <Button variant="primary" onClick={handleAddField}>
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

      {/* Add Field Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Add New Field</h2>
                <Button variant="ghost" onClick={handleCloseModal}>
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
                    placeholder="Enter field name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Type *
                  </label>
                  <input
                    type="text"
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
                    placeholder="Enter crop type"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acres *
                  </label>
                  <input
                    type="number"
                    name="acres"
                    value={formData.acres}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
                    placeholder="Enter field size in acres"
                    min="0"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
                    placeholder="Enter field location"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
                  >
                    <option value="planted">Planted</option>
                    <option value="growing">Growing</option>
                    <option value="ready">Ready</option>
                    <option value="harvested">Harvested</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Plus" size={16} className="mr-2" />
                        Add Field
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fields;