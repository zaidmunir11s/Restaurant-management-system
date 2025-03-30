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
      const response = await api.get('/tables', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error);
      
      // Fallback to localStorage if API fails
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
      
      return filteredTables;
    }
  },

  /**
   * Get a specific table by ID
   * @param {string} id Table ID
   * @returns {Promise} Promise with table data
   */
  getTableById: async (id) => {
    try {
      const response = await api.get(`/tables/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching table with ID ${id}:`, error);
      
      // Fallback to localStorage if API fails
      const storedTables = JSON.parse(localStorage.getItem('tables') || '[]');
      const table = storedTables.find(table => table.id === parseInt(id));
      
      if (!table) {
        throw new Error('Table not found');
      }
      
      return table;
    }
  },

  /**
   * Create a new table
   * @param {Object} tableData Table data object
   * @returns {Promise} Promise with created table data
   */
  createTable: async (tableData) => {
    try {
      const response = await api.post('/tables', tableData);
      
      // If we have localStorage data, update it for consistency
      try {
        const storedTables = JSON.parse(localStorage.getItem('tables') || '[]');
        storedTables.push(response.data);
        localStorage.setItem('tables', JSON.stringify(storedTables));
      } catch (storageError) {
        console.warn('Could not update localStorage:', storageError);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating table:', error);
      throw error;
    }
  },

  /**
   * Create multiple tables at once
   * @param {Array} tablesData Array of table data objects
   * @returns {Promise} Promise with created tables data
   */
  createBulkTables: async (tablesData) => {
    try {
      const response = await api.post('/tables/bulk', { tables: tablesData });
      
      // If we have localStorage data, update it for consistency
      try {
        const storedTables = JSON.parse(localStorage.getItem('tables') || '[]');
        const updatedTables = [...storedTables, ...response.data];
        localStorage.setItem('tables', JSON.stringify(updatedTables));
      } catch (storageError) {
        console.warn('Could not update localStorage:', storageError);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating bulk tables:', error);
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
      const response = await api.put(`/tables/${id}`, tableData);
      
      // If we have localStorage data, update it for consistency
      try {
        const storedTables = JSON.parse(localStorage.getItem('tables') || '[]');
        const updatedTables = storedTables.map(table => 
          table.id === parseInt(id) ? { ...response.data, id: parseInt(id) } : table
        );
        localStorage.setItem('tables', JSON.stringify(updatedTables));
      } catch (storageError) {
        console.warn('Could not update localStorage:', storageError);
      }
      
      return response.data;
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
      const response = await api.delete(`/tables/${id}`);
      
      // If we have localStorage data, update it for consistency
      try {
        const storedTables = JSON.parse(localStorage.getItem('tables') || '[]');
        const updatedTables = storedTables.filter(table => table.id !== parseInt(id));
        localStorage.setItem('tables', JSON.stringify(updatedTables));
      } catch (storageError) {
        console.warn('Could not update localStorage:', storageError);
      }
      
      return response.data;
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
      const response = await api.get(`/tables/counts/${branchId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting table counts for branch ${branchId}:`, error);
      
      // Calculate from localStorage if API fails
      try {
        const tables = JSON.parse(localStorage.getItem('tables') || '[]');
        const branchTables = tables.filter(table => table.branchId === parseInt(branchId));
        
        return {
          total: branchTables.length,
          available: branchTables.filter(t => t.status === 'available').length,
          occupied: branchTables.filter(t => t.status === 'occupied').length,
          reserved: branchTables.filter(t => t.status === 'reserved').length,
          maintenance: branchTables.filter(t => t.status === 'maintenance').length
        };
      } catch (countError) {
        console.error('Error calculating table counts from localStorage:', countError);
        return {
          total: 0,
          available: 0,
          occupied: 0,
          reserved: 0,
          maintenance: 0
        };
      }
    }
  },
  
  /**
   * Update table status
   * @param {string} id Table ID
   * @param {string} status New status
   * @returns {Promise} Promise with updated table data
   */
  updateTableStatus: async (id, status) => {
    try {
      const response = await api.patch(`/tables/${id}/status`, { status });
      
      // If we have localStorage data, update it for consistency
      try {
        const storedTables = JSON.parse(localStorage.getItem('tables') || '[]');
        const updatedTables = storedTables.map(table => {
          if (table.id === parseInt(id)) {
            return { ...table, status };
          }
          return table;
        });
        localStorage.setItem('tables', JSON.stringify(updatedTables));
      } catch (storageError) {
        console.warn('Could not update localStorage:', storageError);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating table status for ID ${id}:`, error);
      throw error;
    }
  }
};

export default tableService;