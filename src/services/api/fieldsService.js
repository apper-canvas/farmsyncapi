import fieldsData from "@/services/mockData/fields.json";

export const fieldsService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...fieldsData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const field = fieldsData.find(f => f.Id === parseInt(id));
    if (!field) throw new Error("Field not found");
    return { ...field };
  },

  create: async (fieldData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newField = {
      ...fieldData,
      Id: Math.max(...fieldsData.map(f => f.Id)) + 1
    };
    fieldsData.push(newField);
    return { ...newField };
  },

  update: async (id, fieldData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = fieldsData.findIndex(f => f.Id === parseInt(id));
    if (index === -1) throw new Error("Field not found");
    fieldsData[index] = { ...fieldsData[index], ...fieldData };
    return { ...fieldsData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = fieldsData.findIndex(f => f.Id === parseInt(id));
    if (index === -1) throw new Error("Field not found");
    fieldsData.splice(index, 1);
    return true;
  }
};