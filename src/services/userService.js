// src/services/userService.js
import api from '../utils/api';

const userService = {
  // Get all users
  getAllUsers: async () => {
    try {
      console.log('Fetching all users...');
      const response = await api.get('/users');
      console.log('Users fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      console.log('Response data:', error.response?.data);
      console.log('Status code:', error.response?.status);
      
      throw error.response?.data || { message: 'Error fetching users. Please check the console for details.' };
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      console.log('Response:', error.response?.data);
      
      throw error.response?.data || { message: 'Error fetching user. Please check the console for details.' };
    }
  },

  // Create a new user
 // Updated createUser function in userService
// In userService.js
createUser: async (userData) => {
    try {
      console.log('Creating user with data:', userData);
      
      // Create a clean object with only the necessary fields
      const userToCreate = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role
      };
      
      // Only add restaurant and branch IDs if applicable and ensure they're strings for MongoDB
      if (['manager', 'waiter'].includes(userData.role)) {
        if (userData.restaurantId) {
          userToCreate.restaurantId = String(userData.restaurantId);
        }
        
        if (userData.branchId) {
          userToCreate.branchId = String(userData.branchId);
        }
      }
      
      // Always include permissions
      userToCreate.permissions = userData.permissions || {
        manageUsers: false,
        manageMenu: false,
        manageTables: false,
        accessPOS: false
      };
      
      // This ensures default access to POS for waiters if not specified
      if (userData.role === 'waiter' && !userToCreate.permissions.accessPOS) {
        userToCreate.permissions.accessPOS = true;
      }
      
      console.log('Sending user data to server:', userToCreate);
      
      const response = await api.post('/users', userToCreate);
      
      // Ensure consistent id property
      if (response.data && response.data._id && !response.data.id) {
        response.data.id = response.data._id;
      }
      
      console.log('User created successfully:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },

  // Update a user
  updateUser: async (id, userData) => {
    try {
      console.log(`Updating user ${id} with data:`, userData);
      const response = await api.put(`/users/${id}`, userData);
      console.log('User updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      console.log('Response data:', error.response?.data);
      console.log('Status code:', error.response?.status);
      
      throw error.response?.data || { message: 'Error updating user. Please check the console for details.' };
    }
  },

  // Delete a user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      console.log('Response:', error.response?.data);
      
      throw error.response?.data || { message: 'Error deleting user. Please check the console for details.' };
    }
  },

  // Get users by restaurant
  getUsersByRestaurant: async (restaurantId) => {
    try {
      const response = await api.get(`/users/restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for restaurant ${restaurantId}:`, error);
      console.log('Response:', error.response?.data);
      
      throw error.response?.data || { message: 'Error fetching users for restaurant. Please check the console for details.' };
    }
  }
};

export default userService;