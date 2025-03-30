// src/services/menuService.js
import api from '../utils/api';

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
      // For demo: Get from localStorage with fallback to API
      let storedMenuItems = [];
      
      // Try to find branch-specific menu first
      if (params.branchId) {
        storedMenuItems = JSON.parse(localStorage.getItem(`branch_menu_${params.branchId}`) || '[]');
      } 
      
      // If no branch-specific menu or no branch ID specified, check restaurant menu
      if (storedMenuItems.length === 0 && params.restaurantId) {
        storedMenuItems = JSON.parse(localStorage.getItem(`restaurant_menu_${params.restaurantId}`) || '[]');
      }
      
      // If still no items, check all menu items (legacy format)
      if (storedMenuItems.length === 0) {
        storedMenuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        
        // Filter by restaurant or branch if specified
        if (params.restaurantId) {
          storedMenuItems = storedMenuItems.filter(item => 
            item.restaurantId === parseInt(params.restaurantId)
          );
        }
        
        if (params.branchId) {
          storedMenuItems = storedMenuItems.filter(item => 
            item.branchId === parseInt(params.branchId)
          );
        }
      }
      
      // Apply category filter if specified
      if (params.category && params.category !== 'all' && params.category !== 'All') {
        storedMenuItems = storedMenuItems.filter(item => 
          item.category.toLowerCase() === params.category.toLowerCase()
        );
      }
      
      // Apply status filter if specified
      if (params.status) {
        storedMenuItems = storedMenuItems.filter(item => 
          item.status === params.status
        );
      }
      
      // If we have items in localStorage, return them
      if (storedMenuItems.length > 0) {
        return storedMenuItems;
      }
      
      // Fallback to API if no data in localStorage
      const response = await api.get('/menu', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      
      // Return empty array as fallback
      return [];
    }
  },

  /**
   * Get a specific menu item by ID
   * @param {string} id Menu item ID
   * @returns {Promise} Promise with menu item data
   */
  getMenuItemById: async (id) => {
    try {
      // For demo: Check all possible localStorage locations
      const storageKeys = Object.keys(localStorage);
      const menuKeys = storageKeys.filter(key => 
        key.startsWith('restaurant_menu_') || key.startsWith('branch_menu_') || key === 'menuItems'
      );
      
      let foundItem = null;
      
      // Search in all menu storage
      for (const key of menuKeys) {
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        const item = items.find(item => item.id === parseInt(id));
        
        if (item) {
          foundItem = item;
          break;
        }
      }
      
      if (foundItem) {
        return foundItem;
      }
      
      // Fallback to API if not found in localStorage
      const response = await api.get(`/menu/${id}`);
      return response.data;
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
      // Try to use the API first
      try {
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
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Fallback to localStorage for demo
        const restaurantId = parseInt(menuItemData.restaurantId);
        const branchId = menuItemData.branchId ? parseInt(menuItemData.branchId) : null;
        
        const newMenuItem = {
          ...menuItemData,
          id: Date.now(),
          restaurantId: restaurantId,
          branchId: branchId,
          // If a model file is provided, use a default model URL
          modelUrl: modelFile ? 'https://menu-reality.com/fast_food_meal.glb' : (menuItemData.modelUrl || null)
        };
        
        // Determine where to store the menu item
        let storageKey;
        if (branchId) {
          storageKey = `branch_menu_${branchId}`;
        } else {
          storageKey = `restaurant_menu_${restaurantId}`;
        }
        
        const menuItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updatedMenuItems = [...menuItems, newMenuItem];
        localStorage.setItem(storageKey, JSON.stringify(updatedMenuItems));
        
        return newMenuItem;
      }
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
      // Try to use the API first
      try {
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
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Find the menu item in localStorage
        const storageKeys = Object.keys(localStorage);
        const menuKeys = storageKeys.filter(key => 
          key.startsWith('restaurant_menu_') || key.startsWith('branch_menu_') || key === 'menuItems'
        );
        
        let storageKeyWithItem = null;
        let currentItems = [];
        
        // Find which storage key contains this item
        for (const key of menuKeys) {
          const items = JSON.parse(localStorage.getItem(key) || '[]');
          if (items.some(item => item.id === parseInt(id))) {
            storageKeyWithItem = key;
            currentItems = items;
            break;
          }
        }
        
        if (!storageKeyWithItem) {
          throw new Error('Menu item not found');
        }
        
        // Update the item
        const updatedItems = currentItems.map(item => {
          if (item.id === parseInt(id)) {
            return {
              ...item,
              ...menuItemData,
              // If a model file is provided, use a default model URL
              modelUrl: modelFile ? 'https://menu-reality.com/fast_food_meal.glb' : (menuItemData.modelUrl || item.modelUrl)
            };
          }
          return item;
        });
        
        localStorage.setItem(storageKeyWithItem, JSON.stringify(updatedItems));
        
        return updatedItems.find(item => item.id === parseInt(id));
      }
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
      // Try to use the API first
      try {
        const response = await api.delete(`/menu/${id}`);
        
        // Even if API succeeds, update localStorage for demo consistency
        const storageKeys = Object.keys(localStorage);
        const menuKeys = storageKeys.filter(key => 
          key.startsWith('restaurant_menu_') || key.startsWith('branch_menu_') || key === 'menuItems'
        );
        
        // Remove the item from all possible storage locations
        for (const key of menuKeys) {
          const items = JSON.parse(localStorage.getItem(key) || '[]');
          const updatedItems = items.filter(item => item.id !== parseInt(id));
          
          if (items.length !== updatedItems.length) {
            localStorage.setItem(key, JSON.stringify(updatedItems));
          }
        }
        
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Find and remove the item from localStorage
        const storageKeys = Object.keys(localStorage);
        const menuKeys = storageKeys.filter(key => 
          key.startsWith('restaurant_menu_') || key.startsWith('branch_menu_') || key === 'menuItems'
        );
        
        for (const key of menuKeys) {
          const items = JSON.parse(localStorage.getItem(key) || '[]');
          const updatedItems = items.filter(item => item.id !== parseInt(id));
          
          if (items.length !== updatedItems.length) {
            localStorage.setItem(key, JSON.stringify(updatedItems));
          }
        }
        
        return { success: true, message: "Menu item deleted successfully" };
      }
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
      // Try to use API first
      try {
        const response = await api.get('/menu/categories', { params });
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, generating categories from menu items:', apiError);
        
        // Get menu items for the restaurant or branch
        let menuItems = [];
        
        if (params.branchId) {
          menuItems = JSON.parse(localStorage.getItem(`branch_menu_${params.branchId}`) || '[]');
        } else if (params.restaurantId) {
          menuItems = JSON.parse(localStorage.getItem(`restaurant_menu_${params.restaurantId}`) || '[]');
        } else {
          const allMenuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
          menuItems = allMenuItems;
        }
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(menuItems.map(item => item.category))];
        
        return uniqueCategories;
      }
    } catch (error) {
      console.error('Error fetching menu categories:', error);
      return ['All']; // Default fallback
    }
  },

  /**
   * Update menu categories
   * @param {Object} categoriesData Categories data with restaurantId, branchId and categories array
   * @returns {Promise} Promise with updated categories data
   */
  updateCategories: async (categoriesData) => {
    try {
      // Try to use the API first
      try {
        const response = await api.post('/menu/categories', categoriesData);
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, updating menu items with new categories:', apiError);
        
        // Get menu items for the restaurant or branch
        let storageKey;
        if (categoriesData.branchId) {
          storageKey = `branch_menu_${categoriesData.branchId}`;
        } else if (categoriesData.restaurantId) {
          storageKey = `restaurant_menu_${categoriesData.restaurantId}`;
        } else {
          throw new Error('Either restaurantId or branchId is required');
        }
        
        const menuItems = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // Ensure "All" is included in categories (if not already)
        const categories = categoriesData.categories.includes('All') 
          ? categoriesData.categories 
          : ['All', ...categoriesData.categories];
        
        // Update items with invalid categories to use the first non-All category
        const defaultCategory = categories.find(c => c !== 'All') || 'Main Courses';
        
        const validCategories = new Set(categories);
        const updatedItems = menuItems.map(item => {
          if (!validCategories.has(item.category)) {
            return { ...item, category: defaultCategory };
          }
          return item;
        });
        
        localStorage.setItem(storageKey, JSON.stringify(updatedItems));
        
        return categories;
      }
    } catch (error) {
      console.error('Error updating menu categories:', error);
      throw error;
    }
  }
};

export default menuService;