import mockPestReports from "@/services/mockData/pestReports.json";

let pestReportsData = [...mockPestReports];
let nextId = Math.max(...pestReportsData.map(r => r.Id)) + 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const pestReportsService = {
  async getAll() {
    await delay(300);
    return [...pestReportsData];
  },

  async getById(id) {
    await delay(200);
    const report = pestReportsData.find(r => r.Id === parseInt(id));
    if (!report) {
      throw new Error(`Pest report with ID ${id} not found`);
    }
    return { ...report };
  },

  async getByFieldId(fieldId) {
    await delay(250);
    return pestReportsData.filter(r => r.fieldId === parseInt(fieldId));
  },

  async create(reportData) {
    await delay(400);
    const newReport = {
      ...reportData,
      Id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    pestReportsData.push(newReport);
    return { ...newReport };
  },

  async update(id, updateData) {
    await delay(350);
    const index = pestReportsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Pest report with ID ${id} not found`);
    }
    
    const updatedReport = {
      ...pestReportsData[index],
      ...updateData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    pestReportsData[index] = updatedReport;
    return { ...updatedReport };
  },

  async delete(id) {
    await delay(300);
    const index = pestReportsData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Pest report with ID ${id} not found`);
    }
    
    const deletedReport = pestReportsData[index];
    pestReportsData.splice(index, 1);
    return { ...deletedReport };
  }
};