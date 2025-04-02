// src/services/branchService.js
import api from '../utils/api';

const branchService = {
  // Get all branches
  getAllBranches: async (restaurantId = null) => {
    try {
      const url = restaurantId ? `/branches?restaurantId=${restaurantId}` : '/branches';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error.response?.data || { message: 'Error fetching branches' };
    }
  },

  // Get a branch by ID
  getBranchById: async (id) => {
    try {
      console.log(`Fetching branch with ID: ${id}`);
      const response = await api.get(`/branches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching branch with ID ${id}:`, error);
      throw error.response?.data || { message: 'Error fetching branch' };
    }
  },

  // Get a restaurant by ID (added this method)
// In your branchService.js
getRestaurantById: async (id) => {
    try {
      console.log(`Making API call to get restaurant with ID: ${id}`);
      const response = await api.get(`/restaurants/${id}`);
      console.log("Restaurant API response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching restaurant with ID ${id}:`, error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      throw error.response?.data || { message: 'Error fetching restaurant' };
    }
  },

  // Get all managers (optional, returns empty array if fails)
  getManagers: async () => {
    try {
      const response = await api.get('/users?role=manager');
      return response.data;
    } catch (error) {
      console.error('Error fetching managers:', error);
      return []; // Return empty array instead of throwing error
    }
  },

  // Create a new branch
  createBranch: async (branchData) => {
    try {
      console.log('Creating branch with data:', branchData);
      
      // Create a new object to avoid mutating the original
      const processedData = { ...branchData };
      
      // Ensure restaurantId is handled correctly - keeping it as a string for MongoDB ObjectId
      if (processedData.restaurantId) {
        processedData.restaurantId = String(processedData.restaurantId);
        console.log('Using restaurant ID:', processedData.restaurantId);
      } else {
        console.error('Missing restaurantId in branch data');
        throw { message: 'Restaurant ID is required' };
      }
      
      // For all numeric fields, ensure they're properly formatted
      if (processedData.tableCount) {
        processedData.tableCount = Number(processedData.tableCount);
      }
      
      if (processedData.managerId) {
        // Keep managerId as string if it's a MongoDB ObjectId
        processedData.managerId = String(processedData.managerId);
      }
      
      // Handle image upload if present
      if (processedData.image) {
        const formData = new FormData();
        
        // Add all other fields to formData
        Object.keys(processedData).forEach(key => {
          if (key === 'image' && processedData[key]) {
            formData.append('image', processedData[key]);
          } else {
            formData.append(key, processedData[key]);
          }
        });
        
        console.log('Sending form data with image, restaurantId:', formData.get('restaurantId'));
        
        const response = await api.post('/branches', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Branch created successfully:', response.data);
        return response.data;
      } else {
        // Regular JSON request without image
        console.log('Sending JSON data without image, restaurantId:', processedData.restaurantId);
        
        const response = await api.post('/branches', processedData);
        console.log('Branch created successfully:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Error creating branch:', error);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        // Log any validation errors from the server
        if (error.response.data && error.response.data.errors) {
          console.error('Validation errors:', error.response.data.errors);
        }
        
        throw error.response.data || { message: 'Error creating branch' };
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw { message: 'No response received from server' };
      } else {
        console.error('Error details:', error.message);
        throw { message: error.message || 'Error creating branch' };
      }
    }
  },

  // Update a branch
  updateBranch: async (id, branchData) => {
    try {
      // Create a new object to avoid mutating the original
      const processedData = { ...branchData };
      
      // Handle numeric fields
      if (processedData.restaurantId) {
        processedData.restaurantId = Number(processedData.restaurantId);
      }
      
      if (processedData.tableCount) {
        processedData.tableCount = Number(processedData.tableCount);
      }
      
      // Similar handling for FormData if image exists
      if (processedData.image) {
        const formData = new FormData();
        
        Object.keys(processedData).forEach(key => {
          if (key === 'image' && processedData[key]) {
            formData.append('image', processedData[key]);
          } else {
            formData.append(key, processedData[key]);
          }
        });
        
        const response = await api.put(`/branches/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data;
      } else {
        const response = await api.put(`/branches/${id}`, processedData);
        return response.data;
      }
    } catch (error) {
      console.error(`Error updating branch with ID ${id}:`, error);
      console.error('Response data:', error.response?.data);
      throw error.response?.data || { message: 'Error updating branch' };
    }
  },

  // Delete a branch
  deleteBranch: async (id) => {
    try {
      const response = await api.delete(`/branches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting branch with ID ${id}:`, error);
      throw error.response?.data || { message: 'Error deleting branch' };
    }
  }
};

export default branchService;