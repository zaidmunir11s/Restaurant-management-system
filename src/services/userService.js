import api from '../utils/api';
import authService from './authService';

const userService = {
  getAllUsers: async () => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      let params = {};
      
      if (currentUser && currentUser.role === 'owner') {
        params.createdBy = currentUser._id || currentUser.id;
      } 
      else if (currentUser && !currentUser.permissions?.manageUsers) {
        if (currentUser.role === 'manager' && currentUser.branchId) {
          params.branchId = currentUser.branchId;
        } else {
          params.id = currentUser._id || currentUser.id;
        }
      }
      
      const response = await api.get('/users', { params });
      
      const users = response.data;
      if (Array.isArray(users)) {
        users.forEach(user => {
          if (user._id && !user.id) {
            user.id = user._id;
          }
        });
      }
      
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching user' };
    }
  },

  createUser: async (userData) => {
    try {
      const userToCreate = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role
      };
      
      if (userData.restaurantId) {
        userToCreate.restaurantId = String(userData.restaurantId);
      }
      
      if (userData.branchId) {
        userToCreate.branchId = String(userData.branchId);
      }
      
      userToCreate.permissions = {
        manageUsers: userData.permissions?.manageUsers || false,
        manageRestaurants: userData.permissions?.manageRestaurants || false,
        manageBranches: userData.permissions?.manageBranches || false,
        accessPOS: userData.permissions?.accessPOS || false
      };
      
      userToCreate.branchPermissions = {
        menu: Array.isArray(userData.branchPermissions?.menu) ? userData.branchPermissions.menu : [],
        tables: Array.isArray(userData.branchPermissions?.tables) ? userData.branchPermissions.tables : []
      };
      
      const response = await api.post('/users', userToCreate);
      
      if (response.data && response.data._id && !response.data.id) {
        response.data.id = response.data._id;
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },
  
  updateUser: async (id, userData) => {
    try {
      const userToUpdate = { ...userData };
      
      if (!userToUpdate.password) {
        delete userToUpdate.password;
      }
      
      if (userToUpdate.permissions) {
        userToUpdate.permissions = {
          manageUsers: userData.permissions?.manageUsers || false,
          manageRestaurants: userData.permissions?.manageRestaurants || false,
          manageBranches: userData.permissions?.manageBranches || false,
          accessPOS: userData.permissions?.accessPOS || false
        };
      }
      
      if (userToUpdate.branchPermissions) {
        userToUpdate.branchPermissions = {
          menu: Array.isArray(userData.branchPermissions?.menu) ? userData.branchPermissions.menu : [],
          tables: Array.isArray(userData.branchPermissions?.tables) ? userData.branchPermissions.tables : []
        };
      }
      
      const response = await api.put(`/users/${id}`, userToUpdate);
      
      if (response.data && response.data._id && !response.data.id) {
        response.data.id = response.data._id;
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error deleting user' };
    }
  },

  getUsersByRestaurant: async (restaurantId) => {
    try {
      const response = await api.get(`/users/restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching users for restaurant' };
    }
  }
};

export default userService;