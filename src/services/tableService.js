// src/services/tableService.js
import api from '../utils/api';

const tableService = {
  // Get all tables with optional branch filter
  getAllTables: async (filters = {}) => {
    try {
      let url = '/tables';
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (filters.branchId) {
        queryParams.append('branchId', filters.branchId);
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      if (filters.section) {
        queryParams.append('section', filters.section);
      }
      
      // Append query params to URL if they exist
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error.response?.data || { message: 'Error fetching tables' };
    }
  },
  
  // Get tables for a specific branch
 // In tableService.js
// Get tables for a specific branch
getTablesByBranch: async (branchId) => {
    try {
      if (!branchId) {
        throw new Error('Branch ID is required');
      }
      
      const formattedBranchId = String(branchId).trim();
      console.log(`Fetching tables for branch ID: ${formattedBranchId}`);
      
      const response = await api.get(`/tables?branchId=${formattedBranchId}`);
      
      // Ensure consistent id properties
      if (Array.isArray(response.data)) {
        response.data.forEach(table => {
          if (table._id && !table.id) {
            table.id = table._id;
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching tables for branch ${branchId}:`, error);
      throw error.response?.data || { message: 'Error fetching tables' };
    }
  },
  
  // Get a table by ID
  getTableById: async (id) => {
    try {
      const response = await api.get(`/tables/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching table with ID ${id}:`, error);
      throw error.response?.data || { message: 'Error fetching table' };
    }
  },
  
  // Create a new table
  createTable: async (tableData) => {
    try {
      const response = await api.post('/tables', tableData);
      return response.data;
    } catch (error) {
      console.error('Error creating table:', error);
      throw error.response?.data || { message: 'Error creating table' };
    }
  },
  
  // Update a table
  updateTable: async (id, tableData) => {
    try {
      const response = await api.put(`/tables/${id}`, tableData);
      return response.data;
    } catch (error) {
      console.error(`Error updating table with ID ${id}:`, error);
      throw error.response?.data || { message: 'Error updating table' };
    }
  },
  
  // Delete a table
  deleteTable: async (id) => {
    try {
      const response = await api.delete(`/tables/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting table with ID ${id}:`, error);
      throw error.response?.data || { message: 'Error deleting table' };
    }
  },
  
  // Update table status
  updateTableStatus: async (id, status) => {
    try {
      const response = await api.patch(`/tables/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for table with ID ${id}:`, error);
      throw error.response?.data || { message: 'Error updating table status' };
    }
  }
};

export default tableService;