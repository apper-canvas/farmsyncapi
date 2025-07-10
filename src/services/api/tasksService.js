import tasksData from "@/services/mockData/tasks.json";

export const tasksService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...tasksData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = tasksData.find(t => t.Id === parseInt(id));
    if (!task) throw new Error("Task not found");
    return { ...task };
  },

  create: async (taskData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newTask = {
      ...taskData,
      Id: Math.max(...tasksData.map(t => t.Id)) + 1
    };
    tasksData.push(newTask);
    return { ...newTask };
  },

  update: async (id, taskData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = tasksData.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    tasksData[index] = { ...tasksData[index], ...taskData };
    return { ...tasksData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = tasksData.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    tasksData.splice(index, 1);
    return true;
  }
};