// src/services/restaurantService.js
import api from '../utils/api';

/**
 * Service for restaurant-related API calls
 */
const restaurantService = {
  /**
   * Get all restaurants
   * @returns {Promise} Promise with restaurants data
   */
  getAllRestaurants: async () => {
    try {
      const response = await api.get('/restaurants');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      
      // Fallback to localStorage if API fails
      const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      return storedRestaurants;
    }
  },

  /**
   * Get a specific restaurant by ID
   * @param {string} id Restaurant ID
   * @returns {Promise} Promise with restaurant data
   */
  getRestaurantById: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching restaurant with ID ${id}:`, error);
      
      // Fallback to localStorage if API fails
      const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      const restaurant = storedRestaurants.find(r => r.id === parseInt(id));
      
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }
      
      return restaurant;
    }
  },

  /**
   * Create a new restaurant
   * @param {Object} restaurantData Restaurant data object
   * @returns {Promise} Promise with created restaurant data
   */
  createRestaurant: async (restaurantData) => {
    try {
      let response;
      
      // Check if we have an image file
      if (restaurantData.image) {
        // Create a FormData object for file upload
        const formData = new FormData();
        
        // Add all form fields except the image
        Object.keys(restaurantData).forEach(key => {
          if (key !== 'image') {
            formData.append(key, restaurantData[key]);
          }
        });
        
        // Add the image file
        formData.append('imageUrl', restaurantData.image);
        
        // Send the request with FormData
        response = await api.post('/restaurants', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Regular JSON request without files
        response = await api.post('/restaurants', restaurantData);
      }
      
      // If we have localStorage data, update it for consistency
      try {
        const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        storedRestaurants.push(response.data);
        localStorage.setItem('restaurants', JSON.stringify(storedRestaurants));
      } catch (storageError) {
        console.warn('Could not update localStorage:', storageError);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating restaurant:', error);
      throw error;
    }
  },

  /**
   * Update an existing restaurant
   * @param {string} id Restaurant ID
   * @param {Object} restaurantData Updated restaurant data
   * @returns {Promise} Promise with updated restaurant data
   */
  updateRestaurant: async (id, restaurantData) => {
    try {
      let response;
      
      // Check if we have an image file
      if (restaurantData.image) {
        // Create a FormData object for file upload
        const formData = new FormData();
        
        // Add all form fields except the image
        Object.keys(restaurantData).forEach(key => {
          if (key !== 'image') {
            formData.append(key, restaurantData[key]);
          }
        });
        
        // Add the image file
        formData.append('imageUrl', restaurantData.image);
        
        // Send the request with FormData
        response = await api.put(`/restaurants/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Regular JSON request without files
        response = await api.put(`/restaurants/${id}`, restaurantData);
      }
      
      // If we have localStorage data, update it for consistency
      try {
        const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        const updatedRestaurants = storedRestaurants.map(restaurant => 
          restaurant.id === parseInt(id) ? { ...response.data, id: parseInt(id) } : restaurant
        );
        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
      } catch (storageError) {
        console.warn('Could not update localStorage:', storageError);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating restaurant with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a restaurant
   * @param {string} id Restaurant ID
   * @returns {Promise} Promise with deletion result
   */
  deleteRestaurant: async (id) => {
    try {
      const response = await api.delete(`/restaurants/${id}`);
      
      // If we have localStorage data, update it for consistency
      try {
        const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        const updatedRestaurants = storedRestaurants.filter(r => r.id !== parseInt(id));
        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
        
        // Also clean up related branches
        const branches = JSON.parse(localStorage.getItem('branches') || '[]');
        const updatedBranches = branches.filter(b => b.restaurantId !== parseInt(id));
        localStorage.setItem('branches', JSON.stringify(updatedBranches));
      } catch (storageError) {
        console.warn('Could not update localStorage:', storageError);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting restaurant with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get restaurant statistics
   * @param {string} id Restaurant ID
   * @returns {Promise} Promise with restaurant statistics
   */
  getRestaurantStats: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching stats for restaurant with ID ${id}:`, error);
      
      // Return basic stats object if API fails
      return {
        branchCount: 0,
        menuItemCount: 0,
        employeeCount: 0,
        tableCount: 0,
        totalOrders: 0,
        totalRevenue: 0
      };
    }
  }
};

export default restaurantService;