import pricesData from "@/services/mockData/prices.json";

export const priceService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...pricesData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const price = pricesData.find(p => p.Id === parseInt(id));
    if (!price) throw new Error("Price data not found");
    return { ...price };
  },

  getPriceHistory: async (cropType = "all", timeRange = "30") => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let filteredData = [...pricesData];
    
    // Filter by crop type
    if (cropType !== "all") {
      filteredData = filteredData.filter(item => item.cropType === cropType);
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
    
    // Group data by crop type for chart series
    const cropGroups = {};
    
    filteredData.forEach(item => {
      item.priceHistory.forEach(price => {
        const priceDate = new Date(price.date);
        if (priceDate >= startDate) {
          if (!cropGroups[item.cropType]) {
            cropGroups[item.cropType] = [];
          }
          cropGroups[item.cropType].push({
            x: priceDate.getTime(),
            y: price.closePrice
          });
        }
      });
    });
    
    // Convert to chart series format
    const series = Object.keys(cropGroups).map(cropType => ({
      name: cropType,
      data: cropGroups[cropType].sort((a, b) => a.x - b.x)
    }));
    
    return series;
  },

  create: async (priceData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPrice = {
      ...priceData,
      Id: Math.max(...pricesData.map(p => p.Id)) + 1
    };
    pricesData.push(newPrice);
    return { ...newPrice };
  },

  update: async (id, priceData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = pricesData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Price data not found");
    pricesData[index] = { ...pricesData[index], ...priceData };
    return { ...pricesData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = pricesData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Price data not found");
    pricesData.splice(index, 1);
    return true;
  },

  getLatestPrices: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const latest = pricesData.map(crop => {
      const latestEntry = crop.priceHistory[crop.priceHistory.length - 1];
      return {
        cropType: crop.cropType,
        price: latestEntry.closePrice,
        change: latestEntry.change,
        changePercent: latestEntry.changePercent,
        date: latestEntry.date
      };
    });
    return latest;
  }
};