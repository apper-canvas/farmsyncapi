import weatherData from "@/services/mockData/weather.json";

export const weatherService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...weatherData];
  },

  getCurrent: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...weatherData[0] };
  },

  getForecast: async (days = 7) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return weatherData.slice(0, days).map(day => ({ ...day }));
  }
};