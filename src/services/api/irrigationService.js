import irrigationData from "@/services/mockData/irrigation.json";
import { weatherService } from "@/services/api/weatherService";

let nextId = Math.max(...irrigationData.map(item => item.Id)) + 1;

export const irrigationService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...irrigationData];
  },

  getById: async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid ID provided');
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    const event = irrigationData.find(item => item.Id === id);
    return event ? { ...event } : null;
  },

  getByDate: async (date) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return irrigationData
      .filter(item => item.date === date)
      .map(item => ({ ...item }));
  },

  getByField: async (fieldId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return irrigationData
      .filter(item => item.fieldId === fieldId)
      .map(item => ({ ...item }));
  },

  create: async (eventData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newEvent = {
      ...eventData,
      Id: nextId++,
      status: 'scheduled',
      soilMoisture: eventData.soilMoisture || Math.floor(Math.random() * 40) + 30
    };
    irrigationData.push(newEvent);
    return { ...newEvent };
  },

  update: async (id, eventData) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid ID provided');
    }
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = irrigationData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error('Irrigation event not found');
    }
    irrigationData[index] = { ...irrigationData[index], ...eventData, Id: id };
    return { ...irrigationData[index] };
  },

  delete: async (id) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid ID provided');
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = irrigationData.findIndex(item => item.Id === id);
    if (index === -1) {
      throw new Error('Irrigation event not found');
    }
    const deleted = irrigationData.splice(index, 1)[0];
    return { ...deleted };
  },

  getRecommendations: async (date, fieldId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
    await new Promise(resolve => setTimeout(resolve, 200));
    // Simulate soil moisture reading
    const baseLevel = Math.floor(Math.random() * 40) + 30;
    return {
      fieldId,
      moisture: baseLevel,
      lastUpdated: new Date().toISOString(),
      status: baseLevel < 30 ? 'low' : baseLevel > 70 ? 'high' : 'normal'
    };
  }
};