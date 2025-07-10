import { toast } from "react-toastify";
import { weatherService } from "@/services/api/weatherService";

const { ApperClient } = window.ApperSDK;

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const irrigationService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "field_name" } },
          { field: { Name: "date" } },
          { field: { Name: "time" } },
          { field: { Name: "duration" } },
          { field: { Name: "water_amount" } },
          { field: { Name: "soil_moisture" } },
          { field: { Name: "status" } },
          { field: { Name: "type" } },
          { field: { Name: "weather_condition" } },
          { field: { Name: "temperature" } },
          { field: { Name: "notes" } },
          { field: { Name: "field_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('irrigation', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching irrigation data:", error?.response?.data?.message);
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
          { field: { Name: "field_name" } },
          { field: { Name: "date" } },
          { field: { Name: "time" } },
          { field: { Name: "duration" } },
          { field: { Name: "water_amount" } },
          { field: { Name: "soil_moisture" } },
          { field: { Name: "status" } },
          { field: { Name: "type" } },
          { field: { Name: "weather_condition" } },
          { field: { Name: "temperature" } },
          { field: { Name: "notes" } },
          { field: { Name: "field_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('irrigation', id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching irrigation event with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  getByDate: async (date) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "field_name" } },
          { field: { Name: "date" } },
          { field: { Name: "time" } },
          { field: { Name: "duration" } },
          { field: { Name: "water_amount" } },
          { field: { Name: "soil_moisture" } },
          { field: { Name: "status" } },
          { field: { Name: "type" } },
          { field: { Name: "weather_condition" } },
          { field: { Name: "temperature" } },
          { field: { Name: "notes" } },
          { field: { Name: "field_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [{
          FieldName: "date",
          Operator: "EqualTo",
          Values: [date]
        }]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('irrigation', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching irrigation by date:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  getByField: async (fieldId) => {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "field_name" } },
          { field: { Name: "date" } },
          { field: { Name: "time" } },
          { field: { Name: "duration" } },
          { field: { Name: "water_amount" } },
          { field: { Name: "soil_moisture" } },
          { field: { Name: "status" } },
          { field: { Name: "type" } },
          { field: { Name: "weather_condition" } },
          { field: { Name: "temperature" } },
          { field: { Name: "notes" } },
          { field: { Name: "field_id" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        where: [{
          FieldName: "field_id",
          Operator: "EqualTo",
          Values: [fieldId]
        }]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('irrigation', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching irrigation by field:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  create: async (eventData) => {
    try {
      const params = {
        records: [{
          Name: eventData.fieldName || `Irrigation ${eventData.date}`,
          field_name: eventData.fieldName,
          date: eventData.date,
          time: eventData.time,
          duration: eventData.duration,
          water_amount: eventData.waterAmount,
          soil_moisture: eventData.soilMoisture || 50,
          status: eventData.status || 'scheduled',
          type: eventData.type,
          weather_condition: eventData.weatherCondition,
          temperature: eventData.temperature,
          notes: eventData.notes || "",
          field_id: eventData.fieldId ? parseInt(eventData.fieldId) : null,
          Tags: eventData.tags || "",
          Owner: eventData.owner || null
        }]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('irrigation', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} irrigation events:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating irrigation event:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  update: async (id, eventData) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid ID provided');
    }
    
    try {
      const params = {
        records: [{
          Id: id,
          Name: eventData.fieldName || `Irrigation ${eventData.date}`,
          field_name: eventData.fieldName,
          date: eventData.date,
          time: eventData.time,
          duration: eventData.duration,
          water_amount: eventData.waterAmount,
          soil_moisture: eventData.soilMoisture,
          status: eventData.status,
          type: eventData.type,
          weather_condition: eventData.weatherCondition,
          temperature: eventData.temperature,
          notes: eventData.notes || "",
          field_id: eventData.fieldId ? parseInt(eventData.fieldId) : null,
          Tags: eventData.tags || "",
          Owner: eventData.owner || null
        }]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('irrigation', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} irrigation events:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating irrigation event:", error?.response?.data?.message);
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
      const response = await apperClient.deleteRecord('irrigation', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} irrigation events:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting irrigation event:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  getRecommendations: async (date, fieldId) => {
    try {
      const weather = await weatherService.getForecast(7);
      const dayWeather = weather.find(w => w.date === date) || weather[0];
      
      const recommendations = {
        recommended: true,
        bestTime: '06:00',
        duration: 30,
        waterAmount: 15,
        reason: 'Standard irrigation cycle',
        soilMoisture: Math.floor(Math.random() * 40) + 30,
        priority: 'medium'
      };

      if (dayWeather) {
        // Weather-based adjustments
        if (dayWeather.precipitation > 0.5) {
          recommendations.recommended = false;
          recommendations.reason = 'Rain expected - irrigation not needed';
          recommendations.priority = 'low';
        } else if (dayWeather.temperature > 85) {
          recommendations.bestTime = '05:30';
          recommendations.duration = 40;
          recommendations.waterAmount = 25;
          recommendations.reason = 'High temperature - early and extended irrigation recommended';
          recommendations.priority = 'high';
        } else if (dayWeather.temperature < 70) {
          recommendations.duration = 20;
          recommendations.waterAmount = 10;
          recommendations.reason = 'Cool conditions - reduced irrigation needed';
        }
      }

      // Soil moisture adjustments
      if (recommendations.soilMoisture > 70) {
        recommendations.recommended = false;
        recommendations.reason = 'Soil moisture adequate - skip irrigation';
        recommendations.priority = 'low';
      } else if (recommendations.soilMoisture < 30) {
        recommendations.duration = 45;
        recommendations.waterAmount = 30;
        recommendations.reason = 'Low soil moisture - extended irrigation needed';
        recommendations.priority = 'high';
      }

      return recommendations;
    } catch (error) {
      // Fallback recommendations if weather service fails
      return {
        recommended: true,
        bestTime: '06:00',
        duration: 30,
        waterAmount: 15,
        reason: 'Standard irrigation cycle',
        soilMoisture: 50,
        priority: 'medium'
      };
    }
  },

  getSoilMoisture: async (fieldId) => {
    try {
      // Simulate soil moisture reading
      const baseLevel = Math.floor(Math.random() * 40) + 30;
      return {
        fieldId,
        moisture: baseLevel,
        lastUpdated: new Date().toISOString(),
        status: baseLevel < 30 ? 'low' : baseLevel > 70 ? 'high' : 'normal'
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error getting soil moisture:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return {
        fieldId,
        moisture: 50,
        lastUpdated: new Date().toISOString(),
        status: 'normal'
      };
    }
  }
};