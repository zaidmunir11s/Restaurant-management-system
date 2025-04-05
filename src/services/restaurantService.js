import api from '../utils/api';
import authService from './authService';

const restaurantService = {
  getAllRestaurants: async () => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      const response = await api.get('/restaurants');
      
      let processedData = [];
      if (Array.isArray(response.data)) {
        processedData = response.data.map(restaurant => {
          return {
            ...restaurant,
            id: restaurant._id || restaurant.id,
            _id: restaurant.id || restaurant._id
          };
        });
        
        if (currentUser && currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          processedData = processedData.filter(restaurant => 
            String(restaurant.id) === String(currentUser.restaurantId)
          );
        }
      }
      
      return processedData;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return [];
    }
  },

  getRestaurantById: async (id) => {
    try {
      const restaurantId = typeof id === 'object' ? (id._id || id.toString()) : String(id).trim();
      
      const response = await api.get(`/restaurants/${restaurantId}`);
      
      if (response.data && response.data._id && !response.data.id) {
        response.data.id = response.data._id;
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching restaurant' };
    }
  },

  createRestaurant: async (restaurantData) => {
    try {
      if (restaurantData.image) {
        const formData = new FormData();
        
        Object.keys(restaurantData).forEach(key => {
          if (key === 'image' && restaurantData[key]) {
            formData.append('image', restaurantData[key]);
          } else {
            formData.append(key, restaurantData[key]);
          }
        });
        
        const response = await api.post('/restaurants', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        return response.data;
      } 
      else {
        const response = await api.post('/restaurants', restaurantData);
        return response.data;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Server error when creating restaurant';
      throw { message: errorMessage, details: error.response?.data };
    }
  },

  updateRestaurant: async (id, restaurantData) => {
    try {
      if (restaurantData.image) {
        const formData = new FormData();
        
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
      throw error.response?.data || { message: 'Error updating restaurant' };
    }
  },

  deleteRestaurant: async (id) => {
    try {
      const response = await api.delete(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error deleting restaurant' };
    }
  }
};

export default restaurantService;