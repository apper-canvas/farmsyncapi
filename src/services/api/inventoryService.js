import { toast } from "react-toastify";

const { ApperClient } = window.ApperSDK;

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const inventoryService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "quantity" } },
          { field: { Name: "unit" } },
          { field: { Name: "reorder_point" } },
          { field: { Name: "last_restocked" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('inventory', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching inventory:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getById: async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid ID provided');
    }
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "category" } },
          { field: { Name: "quantity" } },
          { field: { Name: "unit" } },
          { field: { Name: "reorder_point" } },
          { field: { Name: "last_restocked" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('inventory', id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching inventory item with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  create: async (itemData) => {
    try {
      const params = {
        records: [{
          Name: itemData.name,
          category: itemData.category,
          quantity: itemData.quantity,
          unit: itemData.unit,
          reorder_point: itemData.reorderPoint,
          last_restocked: itemData.lastRestocked,
          Tags: itemData.tags || "",
          Owner: itemData.owner || null
        }]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('inventory', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} inventory items:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating inventory item:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  update: async (id, itemData) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid ID provided');
    }
    
    try {
      const params = {
        records: [{
          Id: id,
          Name: itemData.name,
          category: itemData.category,
          quantity: itemData.quantity,
          unit: itemData.unit,
          reorder_point: itemData.reorderPoint,
          last_restocked: itemData.lastRestocked,
          Tags: itemData.tags || "",
          Owner: itemData.owner || null
        }]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('inventory', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} inventory items:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating inventory item:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  delete: async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid ID provided');
    }
    
    try {
      const params = {
        RecordIds: [id]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('inventory', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} inventory items:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting inventory item:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};