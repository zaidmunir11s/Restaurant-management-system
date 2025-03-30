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
      // For demo: Get from localStorage with fallback to API
      const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      
      if (storedRestaurants.length > 0) {
        return storedRestaurants;
      }
      
      // Fallback to API if no data in localStorage
      const response = await api.get('/restaurants');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      
      // Fallback to localStorage in case of API error
      return JSON.parse(localStorage.getItem('restaurants') || '[]');
    }
  },

  /**
   * Get a specific restaurant by ID
   * @param {string} id Restaurant ID
   * @returns {Promise} Promise with restaurant data
   */
  getRestaurantById: async (id) => {
    try {
      // For demo: Get from localStorage with fallback to API
      const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      const foundRestaurant = storedRestaurants.find(r => r.id === parseInt(id));
      
      if (foundRestaurant) {
        return foundRestaurant;
      }
      
      // Fallback to API if not found in localStorage
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching restaurant with ID ${id}:`, error);
      
      // Fallback to localStorage in case of API error
      const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
      return storedRestaurants.find(r => r.id === parseInt(id));
    }
  },

  /**
   * Create a new restaurant
   * @param {Object} restaurantData Restaurant data object
   * @returns {Promise} Promise with created restaurant data
   */
  createRestaurant: async (restaurantData) => {
    try {
      // Try to use the API first
      try {
        const response = await api.post('/restaurants', restaurantData);
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Fallback to localStorage for demo
        const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        const newRestaurant = {
          ...restaurantData,
          id: Date.now(),
          // Use the provided image or imageUrl, or set to null if neither exists
          imageUrl: restaurantData.image 
            ? URL.createObjectURL(restaurantData.image) 
            : (restaurantData.imageUrl || null)
        };
        
        const updatedRestaurants = [...restaurants, newRestaurant];
        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
        
        return newRestaurant;
      }
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
      // Try to use the API first
      try {
        const response = await api.put(`/restaurants/${id}`, restaurantData);
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Fallback to localStorage for demo
        const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        const updatedRestaurants = restaurants.map(restaurant => {
          if (restaurant.id === parseInt(id)) {
            return {
              ...restaurant,
              ...restaurantData,
              // Handle image update
              imageUrl: restaurantData.image 
                ? URL.createObjectURL(restaurantData.image) 
                : (restaurantData.imageUrl || restaurant.imageUrl)
            };
          }
          return restaurant;
        });
        
        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
        
        return updatedRestaurants.find(r => r.id === parseInt(id));
      }
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
      // Try to use the API first
      try {
        const response = await api.delete(`/restaurants/${id}`);
        
        // Even if API succeeds, update localStorage for demo consistency
        const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        const updatedRestaurants = restaurants.filter(r => r.id !== parseInt(id));
        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
        
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Fallback to localStorage for demo
        const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        const updatedRestaurants = restaurants.filter(r => r.id !== parseInt(id));
        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
        
        // Also delete related branches
        const branches = JSON.parse(localStorage.getItem('branches') || '[]');
        const updatedBranches = branches.filter(b => b.restaurantId !== parseInt(id));
        localStorage.setItem('branches', JSON.stringify(updatedBranches));
        
        return { success: true, message: "Restaurant deleted successfully" };
      }
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
      // Try to use the API first
      try {
        const response = await api.get(`/restaurants/${id}/stats`);
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, generating mock stats:', apiError);
        
        // Generate mock stats for demo
        const branches = JSON.parse(localStorage.getItem('branches') || '[]');
        const restaurantBranches = branches.filter(b => b.restaurantId === parseInt(id));
        
        // Generate reasonable mock stats
        return {
          branchCount: restaurantBranches.length,
          menuItemCount: restaurantBranches.length * 15, // Approx 15 items per branch
          employeeCount: restaurantBranches.length * 8,  // Approx 8 employees per branch
          tableCount: restaurantBranches.length * 12,    // Approx 12 tables per branch
          totalOrders: restaurantBranches.length * 120,  // Some arbitrary number
          totalRevenue: restaurantBranches.length * 25000, // Some arbitrary revenue
        };
      }
    } catch (error) {
      console.error(`Error fetching stats for restaurant with ID ${id}:`, error);
      
      // Return minimal mock data as fallback
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