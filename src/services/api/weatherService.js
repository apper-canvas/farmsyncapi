import { toast } from "react-toastify";

const { ApperClient } = window.ApperSDK;

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const weatherService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "temperature" } },
          { field: { Name: "precipitation" } },
          { field: { Name: "wind_speed" } },
          { field: { Name: "humidity" } },
          { field: { Name: "conditions" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('weather', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching weather data:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getCurrent: async () => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "temperature" } },
          { field: { Name: "precipitation" } },
          { field: { Name: "wind_speed" } },
          { field: { Name: "humidity" } },
          { field: { Name: "conditions" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('weather', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching current weather:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  getForecast: async (days = 7) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "date" } },
          { field: { Name: "temperature" } },
          { field: { Name: "precipitation" } },
          { field: { Name: "wind_speed" } },
          { field: { Name: "humidity" } },
          { field: { Name: "conditions" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        pagingInfo: {
          limit: days,
          offset: 0
        }
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('weather', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching weather forecast:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};