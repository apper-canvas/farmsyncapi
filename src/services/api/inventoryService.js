import inventoryData from "@/services/mockData/inventory.json";

export const inventoryService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...inventoryData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const item = inventoryData.find(i => i.Id === parseInt(id));
    if (!item) throw new Error("Inventory item not found");
    return { ...item };
  },

  create: async (itemData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newItem = {
      ...itemData,
      Id: Math.max(...inventoryData.map(i => i.Id)) + 1
    };
    inventoryData.push(newItem);
    return { ...newItem };
  },

  update: async (id, itemData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = inventoryData.findIndex(i => i.Id === parseInt(id));
    if (index === -1) throw new Error("Inventory item not found");
    inventoryData[index] = { ...inventoryData[index], ...itemData };
    return { ...inventoryData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = inventoryData.findIndex(i => i.Id === parseInt(id));
    if (index === -1) throw new Error("Inventory item not found");
    inventoryData.splice(index, 1);
    return true;
  }
};