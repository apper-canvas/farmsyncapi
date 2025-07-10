import { toast } from "react-toastify";

const { ApperClient } = window.ApperSDK;

const getApperClient = () => {
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

export const pestReportsService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "field_id" } },
          { field: { Name: "issue_type" } },
          { field: { Name: "pest_name" } },
          { field: { Name: "severity" } },
          { field: { Name: "location" } },
          { field: { Name: "description" } },
          { field: { Name: "images" } },
          { field: { Name: "date_reported" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.fetchRecords('pest_report', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching pest reports:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid ID provided');
    }
    
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "field_id" } },
          { field: { Name: "issue_type" } },
          { field: { Name: "pest_name" } },
          { field: { Name: "severity" } },
          { field: { Name: "location" } },
          { field: { Name: "description" } },
          { field: { Name: "images" } },
          { field: { Name: "date_reported" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.getRecordById('pest_report', id, params);
      
      if (!response || !response.data) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching pest report with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async getByFieldId(fieldId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "field_id" } },
          { field: { Name: "issue_type" } },
          { field: { Name: "pest_name" } },
          { field: { Name: "severity" } },
          { field: { Name: "location" } },
          { field: { Name: "description" } },
          { field: { Name: "images" } },
          { field: { Name: "date_reported" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } },
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
      const response = await apperClient.fetchRecords('pest_report', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching pest reports by field:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async create(reportData) {
    try {
      const params = {
        records: [{
          Name: `${reportData.pestName} - ${reportData.issueType}`,
          field_id: reportData.fieldId ? parseInt(reportData.fieldId) : null,
          issue_type: reportData.issueType,
          pest_name: reportData.pestName,
          severity: reportData.severity,
          location: reportData.location,
          description: reportData.description || "",
          images: JSON.stringify(reportData.images || []),
          date_reported: reportData.dateReported,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          Tags: reportData.tags || "",
          Owner: reportData.owner || null
        }]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.createRecord('pest_report', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} pest reports:${JSON.stringify(failedRecords)}`);
          
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
        console.error("Error creating pest report:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, updateData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid ID provided');
    }
    
    try {
      const params = {
        records: [{
          Id: id,
          Name: `${updateData.pestName} - ${updateData.issueType}`,
          field_id: updateData.fieldId ? parseInt(updateData.fieldId) : null,
          issue_type: updateData.issueType,
          pest_name: updateData.pestName,
          severity: updateData.severity,
          location: updateData.location,
          description: updateData.description || "",
          images: JSON.stringify(updateData.images || []),
          date_reported: updateData.dateReported,
          updated_at: new Date().toISOString(),
          Tags: updateData.tags || "",
          Owner: updateData.owner || null
        }]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.updateRecord('pest_report', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} pest reports:${JSON.stringify(failedUpdates)}`);
          
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
        console.error("Error updating pest report:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid ID provided');
    }
    
    try {
      const params = {
        RecordIds: [id]
      };
      
      const apperClient = getApperClient();
      const response = await apperClient.deleteRecord('pest_report', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} pest reports:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting pest report:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};