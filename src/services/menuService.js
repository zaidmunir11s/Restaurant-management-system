// src/services/menuService.js
import api from '../utils/api';
import authService from './authService';

/**
 * Service for menu-related API calls
 */
const menuService = {
  /**
   * Get all menu items
   * @param {Object} params Query parameters like restaurantId, branchId, category, status
   * @returns {Promise} Promise with menu items data
   */
  getMenuItems: async (params = {}) => {
    try {
      // Get current user from storage
      const currentUser = authService.getUserFromStorage();
      
      // Check if the user has permission to access this branch's menu
      if (params.branchId && currentUser) {
        const branchId = params.branchId;
        
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          // If user has specific menu permissions, verify this branch is in the list
          if (currentUser.branchPermissions?.menu && 
              currentUser.branchPermissions.menu.length > 0 &&
              !currentUser.branchPermissions.menu.includes(branchId)) {
            console.warn("User doesn't have permission to access this branch's menu");
            return [];
          }
          
          // If user is assigned to this branch as a manager, they can access it
          if (currentUser.role === 'manager' && currentUser.branchId !== branchId) {
            console.warn("Manager doesn't have permission to access this branch's menu");
            return [];
          }
        }
      }
      
      const response = await api.get('/menu', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  /**
   * Get a specific menu item by ID
   * @param {string} id Menu item ID
   * @returns {Promise} Promise with menu item data
   */
  getMenuItemById: async (id) => {
    try {
      // Get current user to check permissions
      const currentUser = authService.getUserFromStorage();
      
      // Get the menu item from API
      const response = await api.get(`/menu/${id}`);
      const menuItem = response.data;
      
      // Check permissions if the item belongs to a branch
      if (menuItem && menuItem.branchId && currentUser) {
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          // Check if user has access to this branch's menu
          if (currentUser.branchPermissions?.menu && 
              currentUser.branchPermissions.menu.length > 0 && 
              !currentUser.branchPermissions.menu.includes(menuItem.branchId)) {
            console.warn("User doesn't have permission to access this menu item");
            throw new Error("Access denied to this menu item");
          }
        }
      }
      
      return menuItem;
    } catch (error) {
      console.error(`Error fetching menu item with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new menu item
   * @param {Object} menuItemData Menu item data object
   * @param {File} modelFile Optional 3D model file
   * @returns {Promise} Promise with created menu item data
   */
  createMenuItem: async (menuItemData, modelFile = null) => {
    try {
      // Get current user to check permissions
      const currentUser = authService.getUserFromStorage();
      
      // Check if user has permission to create menu items for this branch
      if (menuItemData.branchId && currentUser && 
          currentUser.role !== 'owner' && 
          !currentUser.permissions?.manageRestaurants) {
        
        const branchId = menuItemData.branchId;
        
        // If user has specific menu permissions, verify this branch is in the list
        if (currentUser.branchPermissions?.menu && 
            currentUser.branchPermissions.menu.length > 0 &&
            !currentUser.branchPermissions.menu.includes(branchId)) {
          console.warn("User doesn't have permission to create menu items for this branch");
          throw new Error("Access denied: You don't have permission to create menu items for this branch");
        }
      }
      
      let response;
      
      if (modelFile) {
        // If a file is provided, use FormData
        const formData = new FormData();
        
        // Add the menu item data as JSON
        Object.keys(menuItemData).forEach(key => {
          formData.append(key, menuItemData[key]);
        });
        
        // Add the file
        formData.append('modelUrl', modelFile);
        
        response = await api.post('/menu', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // If no file, just send the regular JSON data
        response = await api.post('/menu', menuItemData);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  /**
   * Update an existing menu item
   * @param {string} id Menu item ID
   * @param {Object} menuItemData Updated menu item data
   * @param {File} modelFile Optional 3D model file
   * @returns {Promise} Promise with updated menu item data
   */
  updateMenuItem: async (id, menuItemData, modelFile = null) => {
    try {
      // Get current user to check permissions
      const currentUser = authService.getUserFromStorage();
      
      // First get the item to check permissions
      const menuItem = await menuService.getMenuItemById(id);
      
      // Permission check for users with branch-specific menu permissions
      if (menuItem && menuItem.branchId && currentUser) {
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          // Check if user has access to this branch's menu
          if (currentUser.branchPermissions?.menu && 
              currentUser.branchPermissions.menu.length > 0 && 
              !currentUser.branchPermissions.menu.includes(menuItem.branchId)) {
            console.warn("User doesn't have permission to update this menu item");
            throw new Error("Access denied: You don't have permission to update this menu item");
          }
        }
      }
      
      let response;
      
      if (modelFile) {
        // If a file is provided, use FormData
        const formData = new FormData();
        
        // Add the menu item data as JSON
        Object.keys(menuItemData).forEach(key => {
          formData.append(key, menuItemData[key]);
        });
        
        // Add the file
        formData.append('modelUrl', modelFile);
        
        response = await api.put(`/menu/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // If no file, just send the regular JSON data
        response = await api.put(`/menu/${id}`, menuItemData);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating menu item with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a menu item
   * @param {string} id Menu item ID
   * @returns {Promise} Promise with deletion result
   */
  deleteMenuItem: async (id) => {
    try {
      // Get current user to check permissions
      const currentUser = authService.getUserFromStorage();
      
      // First get the item to check permissions
      const menuItem = await menuService.getMenuItemById(id);
      
      // Permission check for users with branch-specific menu permissions
      if (menuItem && menuItem.branchId && currentUser) {
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          // Check if user has access to this branch's menu
          if (currentUser.branchPermissions?.menu && 
              currentUser.branchPermissions.menu.length > 0 && 
              !currentUser.branchPermissions.menu.includes(menuItem.branchId)) {
            console.warn("User doesn't have permission to delete this menu item");
            throw new Error("Access denied: You don't have permission to delete this menu item");
          }
        }
      }
      
      const response = await api.delete(`/menu/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting menu item with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get menu categories
   * @param {Object} params Query parameters like restaurantId, branchId
   * @returns {Promise} Promise with categories data
   */
  getCategories: async (params = {}) => {
    try {
      // Get current user to check permissions
      const currentUser = authService.getUserFromStorage();
      
      // Check if the user has permission to access this branch's categories
      if (params.branchId && currentUser) {
        const branchId = params.branchId;
        
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          // If user has specific menu permissions, verify this branch is in the list
          if (currentUser.branchPermissions?.menu && 
              currentUser.branchPermissions.menu.length > 0 &&
              !currentUser.branchPermissions.menu.includes(branchId)) {
            console.warn("User doesn't have permission to access this branch's categories");
            return ['All']; // Return default
          }
        }
      }
      
      const response = await api.get('/menu/categories', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu categories:', error);
      throw error;
    }
  },

  /**
   * Update menu categories
   * @param {Object} categoriesData Categories data with restaurantId, branchId and categories array
   * @returns {Promise} Promise with updated categories data
   */
  updateCategories: async (categoriesData) => {
    try {
      // Get current user to check permissions
      const currentUser = authService.getUserFromStorage();
      
      // Check if user has permission to update categories for this branch
      if (categoriesData.branchId && currentUser) {
        const branchId = categoriesData.branchId;
        
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          // If user has specific menu permissions, verify this branch is in the list
          if (currentUser.branchPermissions?.menu && 
              currentUser.branchPermissions.menu.length > 0 &&
              !currentUser.branchPermissions.menu.includes(branchId)) {
            console.warn("User doesn't have permission to update categories for this branch");
            throw new Error("Access denied: You don't have permission to update categories for this branch");
          }
        }
      }
      
      const response = await api.post('/menu/categories', categoriesData);
      return response.data;
    } catch (error) {
      console.error('Error updating menu categories:', error);
      throw error;
    }
  }
};

export default menuService;