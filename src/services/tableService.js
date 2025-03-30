// src/services/tableService.js
import api from '../utils/api';

/**
 * Service for table-related API calls
 */
const tableService = {
  /**
   * Get all tables
   * @param {Object} params Query parameters like branchId, status, section
   * @returns {Promise} Promise with tables data
   */
  getTables: async (params = {}) => {
    try {
      // For demo: Get from localStorage with fallback to API
      const storedTables = JSON.parse(localStorage.getItem('tables') || '[]');
      
      // Filter tables based on params
      let filteredTables = storedTables;
      
      if (params.branchId) {
        filteredTables = filteredTables.filter(table => 
          table.branchId === parseInt(params.branchId)
        );
      }
      
      if (params.status) {
        filteredTables = filteredTables.filter(table => 
          table.status === params.status
        );
      }
      
      if (params.section) {
        filteredTables = filteredTables.filter(table => 
          table.section === params.section
        );
      }
      
      // If we have tables in localStorage, return them
      if (filteredTables.length > 0 || storedTables.length > 0) {
        return filteredTables;
      }
      
      // Fallback to API if no data in localStorage
      const response = await api.get('/tables', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error);
      
      // Return empty array as fallback
      return [];
    }
  },

  /**
   * Get a specific table by ID
   * @param {string} id Table ID
   * @returns {Promise} Promise with table data
   */
  getTableById: async (id) => {
    try {
      // For demo: Get from localStorage with fallback to API
      const storedTables = JSON.parse(localStorage.getItem('tables') || '[]');
      const foundTable = storedTables.find(table => table.id === parseInt(id));
      
      if (foundTable) {
        return foundTable;
      }
      
      // Fallback to API if not found in localStorage
      const response = await api.get(`/tables/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching table with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new table
   * @param {Object} tableData Table data object
   * @returns {Promise} Promise with created table data
   */
  createTable: async (tableData) => {
    try {
      // Try to use the API first
      try {
        const response = await api.post('/tables', tableData);
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Fallback to localStorage for demo
        const tables = JSON.parse(localStorage.getItem('tables') || '[]');
        const newTable = {
          ...tableData,
          id: Date.now(),
          branchId: parseInt(tableData.branchId)
        };
        
        const updatedTables = [...tables, newTable];
        localStorage.setItem('tables', JSON.stringify(updatedTables));
        
        return newTable;
      }
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  },

  /**
   * Update an existing table
   * @param {string} id Table ID
   * @param {Object} tableData Updated table data
   * @returns {Promise} Promise with updated table data
   */
  updateTable: async (id, tableData) => {
    try {
      // Try to use the API first
      try {
        const response = await api.put(`/tables/${id}`, tableData);
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Fallback to localStorage for demo
        const tables = JSON.parse(localStorage.getItem('tables') || '[]');
        const updatedTables = tables.map(table => {
          if (table.id === parseInt(id)) {
            return {
              ...table,
              ...tableData
            };
          }
          return table;
        });
        
        localStorage.setItem('tables', JSON.stringify(updatedTables));
        
        return updatedTables.find(table => table.id === parseInt(id));
      }
    } catch (error) {
      console.error(`Error updating table with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a table
   * @param {string} id Table ID
   * @returns {Promise} Promise with deletion result
   */
  deleteTable: async (id) => {
    try {
      // Try to use the API first
      try {
        const response = await api.delete(`/tables/${id}`);
        
        // Even if API succeeds, update localStorage for demo consistency
        const tables = JSON.parse(localStorage.getItem('tables') || '[]');
        const updatedTables = tables.filter(table => table.id !== parseInt(id));
        localStorage.setItem('tables', JSON.stringify(updatedTables));
        
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Fallback to localStorage for demo
        const tables = JSON.parse(localStorage.getItem('tables') || '[]');
        const updatedTables = tables.filter(table => table.id !== parseInt(id));
        localStorage.setItem('tables', JSON.stringify(updatedTables));
        
        return { success: true, message: "Table deleted successfully" };
      }
    } catch (error) {
      console.error(`Error deleting table with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get table availability counts for a branch
   * @param {number} branchId Branch ID
   * @returns {Object} Object with counts for different statuses
   */
  getTableCounts: async (branchId) => {
    try {
      // Try to use the API first
      try {
        const response = await api.get(`/tables/counts/${branchId}`);
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, calculating from localStorage:', apiError);
        
        // Calculate from localStorage
        const tables = JSON.parse(localStorage.getItem('tables') || '[]');
        const branchTables = tables.filter(table => table.branchId === parseInt(branchId));
        
        const counts = {
          total: branchTables.length,
          available: branchTables.filter(t => t.status === 'available').length,
          occupied: branchTables.filter(t => t.status === 'occupied').length,
          reserved: branchTables.filter(t => t.status === 'reserved').length,
          maintenance: branchTables.filter(t => t.status === 'maintenance').length
        };
        
        return counts;
      }
    } catch (error) {
      console.error(`Error getting table counts for branch ${branchId}:`, error);
      
      // Return zeros as fallback
      return {
        total: 0,
        available: 0,
        occupied: 0,
        reserved: 0,
        maintenance: 0
      };
    }
  }
};

export default tableService;