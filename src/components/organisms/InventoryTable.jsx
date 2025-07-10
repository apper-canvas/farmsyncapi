import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { inventoryService } from "@/services/api/inventoryService";
import { format } from "date-fns";

const InventoryTable = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadInventory = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await inventoryService.getAll();
      setInventory(data);
      setFilteredInventory(data);
    } catch (err) {
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    let filtered = inventory;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredInventory(filtered);
  }, [inventory, searchTerm, selectedCategory]);

  const getStockStatus = (quantity, reorderPoint) => {
    if (quantity === 0) return { variant: "error", text: "Out of Stock" };
    if (quantity <= reorderPoint) return { variant: "warning", text: "Low Stock" };
    return { variant: "success", text: "In Stock" };
  };

  const categories = ["all", ...new Set(inventory.map(item => item.category))];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadInventory} />;
  if (inventory.length === 0) return (
    <Empty 
      title="No Inventory Items" 
      description="Start tracking your farm supplies, seeds, and equipment inventory."
      actionLabel="Add Item"
      icon="Package"
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inventory..."
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === "all" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Item</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Last Restocked</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item.quantity, item.reorderPoint);
                return (
                  <tr key={item.Id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{item.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600 capitalize">{item.category}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium">{item.quantity} {item.unit}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.text}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">
                        {format(new Date(item.lastRestocked), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <ApperIcon name="Plus" size={16} className="mr-1" />
                          Restock
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default InventoryTable;