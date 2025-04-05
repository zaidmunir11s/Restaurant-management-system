// src/services/userService.js - updated to handle branch permissions
import api from '../utils/api';
import authService from './authService';

const userService = {
  // Get all users
  // In userService.js - modify getAllUsers function
// In userService.js - modify getAllUsers function further
getAllUsers: async () => {
    try {
      console.log('Fetching all users...');
      
      // Get current user to filter results
      const currentUser = authService.getUserFromStorage();
      
      // Add query parameters for filtering
      let params = {};
      
      // If current user is an owner, only fetch users created by this owner
      if (currentUser && currentUser.role === 'owner') {
        params.createdBy = currentUser._id || currentUser.id;
      } 
      // If current user has manageUsers permission, don't filter
      else if (currentUser && !currentUser.permissions?.manageUsers) {
        // For managers without manageUsers permission, only show users in their branch
        if (currentUser.role === 'manager' && currentUser.branchId) {
          params.branchId = currentUser.branchId;
        } else {
          // For all other users without manageUsers permission, only show themselves
          params.id = currentUser._id || currentUser.id;
        }
      }
      
      const response = await api.get('/users', { params });
      
      // Ensure consistent id format
      const users = response.data;
      if (Array.isArray(users)) {
        users.forEach(user => {
          if (user._id && !user.id) {
            user.id = user._id;
          }
        });
      }
      
      console.log('Users fetched successfully:', users.length);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      console.log('Response data:', error.response?.data);
      console.log('Status code:', error.response?.status);
      
      throw error;
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
  // In userService.js:
// In userService.js:
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
      
      // Only add restaurant and branch IDs if applicable
      if (userData.restaurantId) {
        userToCreate.restaurantId = String(userData.restaurantId);
      }
      
      if (userData.branchId) {
        userToCreate.branchId = String(userData.branchId);
      }
      
      // Always include permissions
      userToCreate.permissions = {
        manageUsers: userData.permissions?.manageUsers || false,
        manageRestaurants: userData.permissions?.manageRestaurants || false,
        manageBranches: userData.permissions?.manageBranches || false,
        accessPOS: userData.permissions?.accessPOS || false
      };
      
      // Include branch-specific permissions
      userToCreate.branchPermissions = {
        menu: Array.isArray(userData.branchPermissions?.menu) ? userData.branchPermissions.menu : [],
        tables: Array.isArray(userData.branchPermissions?.tables) ? userData.branchPermissions.tables : []
      };
      
      console.log('Sending user data to server:', userToCreate);
      
      const response = await api.post('/users', userToCreate);
      
      // Ensure consistent id property
      if (response.data && response.data._id && !response.data.id) {
        response.data.id = response.data._id;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },
  
  // Update user
  // In userService.js - update the updateUser function
updateUser: async (id, userData) => {
    try {
      console.log(`Updating user ${id} with data:`, userData);
      
      // Create a clean object to send to the backend
      const userToUpdate = { ...userData };
      
      // Make sure to send password only if it's provided
      if (!userToUpdate.password) {
        delete userToUpdate.password;
      }
      
      // Make sure permissions are properly formatted
      if (userToUpdate.permissions) {
        userToUpdate.permissions = {
          manageUsers: userData.permissions?.manageUsers || false,
          manageRestaurants: userData.permissions?.manageRestaurants || false,
          manageBranches: userData.permissions?.manageBranches || false,
          accessPOS: userData.permissions?.accessPOS || false
        };
      }
      
      // Make sure branch permissions are properly formatted
      if (userToUpdate.branchPermissions) {
        userToUpdate.branchPermissions = {
          menu: Array.isArray(userData.branchPermissions?.menu) ? userData.branchPermissions.menu : [],
          tables: Array.isArray(userData.branchPermissions?.tables) ? userData.branchPermissions.tables : []
        };
      }
      
      console.log('Sending update with data:', userToUpdate);
      
      const response = await api.put(`/users/${id}`, userToUpdate);
      
      // Ensure consistent id property
      if (response.data && response.data._id && !response.data.id) {
        response.data.id = response.data._id;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
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