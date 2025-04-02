// src/services/restaurantService.js
import api from '../utils/api';

const restaurantService = {
  // Get all restaurants
  getAllRestaurants: async () => {
    try {
      const response = await api.get('/restaurants');
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      console.log('Response:', error.response?.data);
      console.log('Status:', error.response?.status);
      
      throw error.response?.data || { message: 'Error fetching restaurants. Please check the console for details.' };
    }
  },

  // Get a restaurant by ID
  getRestaurantById: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching restaurant with ID ${id}:`, error);
      console.log('Response:', error.response?.data);
      
      throw error.response?.data || { message: 'Error fetching restaurant. Please check the console for details.' };
    }
  },

  // Create a new restaurant
  createRestaurant: async (restaurantData) => {
    try {
      console.log('Creating restaurant with data:', restaurantData);
      
      // For debugging
      const token = localStorage.getItem('token');
      console.log('Auth token available:', !!token);
      
      // Method 1: Using FormData for mixed content with files
      if (restaurantData.image) {
        const formData = new FormData();
        
        // Add all form fields to formData
        Object.keys(restaurantData).forEach(key => {
          if (key === 'image' && restaurantData[key]) {
            formData.append('image', restaurantData[key]);
          } else {
            formData.append(key, restaurantData[key]);
          }
        });
        
        console.log('Sending FormData request');
        const response = await api.post('/restaurants', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data;
      } 
      // Method 2: Using JSON for data without files
      else {
        console.log('Sending JSON request');
        const response = await api.post('/restaurants', restaurantData);
        return response.data;
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      console.log('Response data:', error.response?.data);
      console.log('Status code:', error.response?.status);
      console.log('Headers:', error.response?.headers);
      
      // Show more detailed error
      const errorMessage = error.response?.data?.message || 'Server error when creating restaurant';
      throw { message: errorMessage, details: error.response?.data };
    }
  },

  // Update a restaurant
  updateRestaurant: async (id, restaurantData) => {
    try {
      // Create FormData for file upload if there's an image
      if (restaurantData.image) {
        const formData = new FormData();
        
        // Add all other form fields to formData
        Object.keys(restaurantData).forEach(key => {
          if (key === 'image' && restaurantData[key]) {
            formData.append('image', restaurantData[key]);
          } else {
            formData.append(key, restaurantData[key]);
          }
        });
        
        const response = await api.put(`/restaurants/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data;
      } else {
        const response = await api.put(`/restaurants/${id}`, restaurantData);
        return response.data;
      }
    } catch (error) {
      console.error(`Error updating restaurant with ID ${id}:`, error);
      console.log('Response:', error.response?.data);
      
      throw error.response?.data || { message: 'Error updating restaurant. Please check the console for details.' };
    }
  },

  // Delete a restaurant
  deleteRestaurant: async (id) => {
    try {
      const response = await api.delete(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting restaurant with ID ${id}:`, error);
      console.log('Response:', error.response?.data);
      
      throw error.response?.data || { message: 'Error deleting restaurant. Please check the console for details.' };
    }
  }
};

export default restaurantService;