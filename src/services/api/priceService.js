import { toast } from "react-toastify";

const { ApperClient } = window.ApperSDK;

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const priceService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "crop_type" } },
          { field: { Name: "current_price" } },
          { field: { Name: "unit" } },
          { field: { Name: "price_history" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('price', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching price data:", error?.response?.data?.message);
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
          { field: { Name: "crop_type" } },
          { field: { Name: "current_price" } },
          { field: { Name: "unit" } },
          { field: { Name: "price_history" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('price', id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching price data with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  getPriceHistory: async (cropType = "all", timeRange = "30") => {
    try {
      let params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "crop_type" } },
          { field: { Name: "current_price" } },
          { field: { Name: "unit" } },
          { field: { Name: "price_history" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      // Filter by crop type if specified
      if (cropType !== "all") {
        params.where = [{
          FieldName: "crop_type",
          Operator: "EqualTo",
          Values: [cropType]
        }];
      }
      
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('price', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      const data = response.data || [];
      
      // Process price history data for chart format
      const series = data.map(item => {
        let priceHistory = [];
        try {
          priceHistory = typeof item.price_history === 'string' 
            ? JSON.parse(item.price_history) 
            : item.price_history || [];
        } catch (e) {
          console.warn('Failed to parse price history for', item.crop_type);
          priceHistory = [];
        }
        
        // Filter by time range
        const now = new Date();
        let startDate = new Date();
        
        switch (timeRange) {
          case "7":
            startDate.setDate(now.getDate() - 7);
            break;
          case "30":
            startDate.setDate(now.getDate() - 30);
            break;
          case "90":
            startDate.setDate(now.getDate() - 90);
            break;
          case "365":
            startDate.setFullYear(now.getFullYear() - 1);
            break;
          case "all":
          default:
            startDate = new Date("2024-01-01");
            break;
        }
        
        const filteredHistory = priceHistory
          .filter(price => new Date(price.date) >= startDate)
          .map(price => ({
            x: new Date(price.date).getTime(),
            y: price.closePrice || price.price || item.current_price
          }))
          .sort((a, b) => a.x - b.x);
        
        return {
          name: item.crop_type,
          data: filteredHistory
        };
      });
      
      return series;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching price history:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  create: async (priceData) => {
    try {
      const params = {
        records: [{
          Name: priceData.name || priceData.crop_type,
          crop_type: priceData.crop_type,
          current_price: priceData.current_price,
          unit: priceData.unit,
          price_history: JSON.stringify(priceData.price_history || []),
          Tags: priceData.tags || "",
          Owner: priceData.owner || null
        }]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('price', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} price records:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating price data:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  update: async (id, priceData) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid ID provided');
    }
    
    try {
      const params = {
        records: [{
          Id: id,
          Name: priceData.name || priceData.crop_type,
          crop_type: priceData.crop_type,
          current_price: priceData.current_price,
          unit: priceData.unit,
          price_history: JSON.stringify(priceData.price_history || []),
          Tags: priceData.tags || "",
          Owner: priceData.owner || null
        }]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('price', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} price records:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating price data:", error?.response?.data?.message);
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
      const response = await apperClient.deleteRecord('price', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} price records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting price data:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  getLatestPrices: async () => {
    try {
      const data = await this.getAll();
      return data.map(crop => ({
        cropType: crop.crop_type,
        price: crop.current_price,
        change: 0, // Would need to calculate from price history
        changePercent: 0, // Would need to calculate from price history
        date: new Date().toISOString().split('T')[0]
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching latest prices:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};