// src/services/branchService.js
import api from '../utils/api';

/**
 * Service for branch-related API calls
 */
const branchService = {
  /**
   * Get all branches
   * @param {Object} params Query parameters like restaurantId
   * @returns {Promise} Promise with branches data
   */
  getAllBranches: async (params = {}) => {
    try {
      const response = await api.get('/branches', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      
      // Fallback to localStorage if API fails
      const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
      if (params.restaurantId) {
        return storedBranches.filter(b => b.restaurantId === parseInt(params.restaurantId));
      }
      return storedBranches;
    }
  },

  /**
   * Get a specific branch by ID
   * @param {string} id Branch ID
   * @returns {Promise} Promise with branch data
   */
  getBranchById: async (id) => {
    try {
      const response = await api.get(`/branches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching branch with ID ${id}:`, error);
      
      // Fallback to localStorage if API fails
      const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
      const branch = storedBranches.find(b => b.id === parseInt(id));
      
      if (!branch) {
        throw new Error('Branch not found');
      }
      
      return branch;
    }
  },

  /**
   * Create a new branch
   * @param {Object} branchData Branch data object
   * @returns {Promise} Promise with created branch data
   */
  createBranch: async (branchData) => {
    try {
      let response;
      
      // Check if we have an image file
      if (branchData.image) {
        // Create a FormData object for file upload
        const formData = new FormData();
        
        // Add all form fields except the image
        Object.keys(branchData).forEach(key => {
          if (key !== 'image') {
            formData.append(key, branchData[key]);
          }
        });
        
        // Add the image file
        formData.append('imageUrl', branchData.image);
        
        // Send the request with FormData
        response = await api.post('/branches', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Regular JSON request without files
        response = await api.post('/branches', branchData);
      }
      
      // If we have localStorage data, update it for consistency
      try {
        const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
        storedBranches.push(response.data);
        localStorage.setItem('branches', JSON.stringify(storedBranches));
      } catch (storageError) {
        console.warn('Could not update localStorage:', storageError);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  },

  /**
   * Update an existing branch
   * @param {string} id Branch ID
   * @param {Object} branchData Updated branch data
   * @returns {Promise} Promise with updated branch data
   */
  updateBranch: async (id, branchData) => {
    try {
      let response;
      
      // Check if we have an image file
      if (branchData.image) {
        // Create a FormData object for file upload
        const formData = new FormData();
        
        // Add all form fields except the image
        Object.keys(branchData).forEach(key => {
          if (key !== 'image') {
            formData.append(key, branchData[key]);
          }
        });
        
        // Add the image file
        formData.append('imageUrl', branchData.image);
        
        // Send the request with FormData
        response = await api.put(`/branches/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Regular JSON request without files
        response = await api.put(`/branches/${id}`, branchData);
      }
      
      // If we have localStorage data, update it for consistency
      try {
        const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
        const updatedBranches = storedBranches.map(branch => 
          branch.id === parseInt(id) ? { ...response.data, id: parseInt(id) } : branch
        );
        localStorage.setItem('branches', JSON.stringify(updatedBranches));
      } catch (storageError) {
        console.warn('Could not update localStorage:', storageError);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating branch with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a branch
   * @param {string} id Branch ID
   * @returns {Promise} Promise with deletion result
   */
  deleteBranch: async (id) => {
    try {
      const response = await api.delete(`/branches/${id}`);
      
      // If we have localStorage data, update it for consistency
      try {
        const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
        const updatedBranches = storedBranches.filter(b => b.id !== parseInt(id));
        localStorage.setItem('branches', JSON.stringify(updatedBranches));
        
        // Also clean up related tables
        const tables = JSON.parse(localStorage.getItem('tables') || '[]');
        const updatedTables = tables.filter(t => t.branchId !== parseInt(id));
        localStorage.setItem('tables', JSON.stringify(updatedTables));
      } catch (storageError) {
        console.warn('Could not update localStorage:', storageError);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting branch with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get branch statistics
   * @param {string} id Branch ID
   * @returns {Promise} Promise with branch statistics
   */
  getBranchStats: async (id) => {
    try {
      const response = await api.get(`/branches/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stats for branch with ID ${id}:`, error);
      
      // Return basic stats object if API fails
      return {
        tableCount: 0,
        availableTables: 0,
        occupiedTables: 0,
        menuItemCount: 0,
        employeeCount: 0
      };
    }
  }
};

export default branchService;