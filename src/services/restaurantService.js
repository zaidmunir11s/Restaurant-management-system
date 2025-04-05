// src/services/restaurantService.js
import api from '../utils/api';
import authService from './authService';
const restaurantService = {
  // Get all restaurants
 // In restaurantService.js
// Get all restaurants
// Update the getAllRestaurants function in restaurantService.js
// In restaurantService.js - update getAllRestaurants
// At the top of getAllRestaurants function in restaurantService.js
getAllRestaurants: async () => {
    try {
      // Diagnostic logging
      console.log('---BEGIN RESTAURANT FETCH---');
      console.log('Auth token in localStorage:', !!localStorage.getItem('token'));
      console.log('User info in localStorage:', !!localStorage.getItem('user'));
      
      if (localStorage.getItem('user')) {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('User role:', user.role);
      }
      
      // Make the API call
      console.log('About to call GET /restaurants API...');
      const response = await api.get('/restaurants');
      console.log('Raw API response:', response);
      
      // Process the data
      let processedData;
      if (Array.isArray(response.data)) {
        console.log('Response data is an array of length:', response.data.length);
        processedData = response.data.map(restaurant => {
          // Ensure both id and _id properties exist
          return {
            ...restaurant,
            id: restaurant._id || restaurant.id,
            _id: restaurant.id || restaurant._id
          };
        });
      } else {
        console.error('Response data is not an array! Type:', typeof response.data);
        processedData = [];
      }
      
      console.log('Processed restaurant data to return:', processedData);
      console.log('---END RESTAURANT FETCH---');
      
      return processedData;
    } catch (error) {
      console.error('---ERROR FETCHING RESTAURANTS---');
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Status text:', error.response.statusText);
        console.error('Response data:', error.response.data);
      }
      
      // Intentionally NOT throwing the error to avoid UI breakage
      console.log('Returning empty array to avoid UI breakage');
      return [];
    }
  },
  
  // Get a restaurant by ID
  // src/services/restaurantService.js - update getRestaurantById method

getRestaurantById: async (id) => {
    try {
      // Make sure we have a string ID
      const restaurantId = typeof id === 'object' ? (id._id || id.toString()) : String(id).trim();
      console.log(`Fetching restaurant with ID: ${restaurantId}`);
      
      const response = await api.get(`/restaurants/${restaurantId}`);
      
      // Ensure consistent id property
      if (response.data && response.data._id && !response.data.id) {
        response.data.id = response.data._id;
      }
      
      console.log(`Restaurant data fetched:`, response.data);
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