import api from '../utils/api';
import authService from './authService';

const menuService = {
  getMenuItems: async (params = {}) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      if (params.branchId && currentUser) {
        const branchId = String(params.branchId);
        
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          if (currentUser.branchPermissions?.menu && 
              currentUser.branchPermissions.menu.length > 0) {
            
            const hasBranchAccess = currentUser.branchPermissions.menu.some(id => 
              String(id) === branchId
            );
            
            if (!hasBranchAccess && String(currentUser.branchId) !== branchId) {
              console.warn("User doesn't have permission to access this branch's menu");
              return [];
            }
          } else if (String(currentUser.branchId) !== branchId) {
            console.warn("User doesn't have permission to access this branch's menu");
            return [];
          }
        }
      }
      
      const response = await api.get('/menu', { params });
      
      if (Array.isArray(response.data)) {
        response.data.forEach(item => {
          if (item._id && !item.id) {
            item.id = item._id;
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  },

  getMenuItemById: async (id) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      const response = await api.get(`/menu/${id}`);
      const menuItem = response.data;
      
      if (menuItem && menuItem._id && !menuItem.id) {
        menuItem.id = menuItem._id;
      }
      
      if (menuItem && currentUser && currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
        if (menuItem.branchId) {
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
      throw error;
    }
  },

  createMenuItem: async (menuItemData, modelFile = null) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      if (menuItemData.branchId && currentUser && 
          currentUser.role !== 'owner' && 
          !currentUser.permissions?.manageRestaurants) {
        
        const branchId = menuItemData.branchId;
        
        if (currentUser.branchPermissions?.menu && 
            currentUser.branchPermissions.menu.length > 0 &&
            !currentUser.branchPermissions.menu.includes(branchId)) {
          throw new Error("Access denied: You don't have permission to create menu items for this branch");
        }
      }
      
      let response;
      
      if (modelFile) {
        const formData = new FormData();
        
        Object.keys(menuItemData).forEach(key => {
          formData.append(key, menuItemData[key]);
        });
        
        formData.append('modelUrl', modelFile);
        
        response = await api.post('/menu', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.post('/menu', menuItemData);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateMenuItem: async (id, menuItemData, modelFile = null) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      const menuItem = await menuService.getMenuItemById(id);
      
      if (menuItem && menuItem.branchId && currentUser) {
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          if (currentUser.branchPermissions?.menu && 
              currentUser.branchPermissions.menu.length > 0 && 
              !currentUser.branchPermissions.menu.includes(menuItem.branchId)) {
            throw new Error("Access denied: You don't have permission to update this menu item");
          }
        }
      }
      
      let response;
      
      if (modelFile) {
        const formData = new FormData();
        
        Object.keys(menuItemData).forEach(key => {
          formData.append(key, menuItemData[key]);
        });
        
        formData.append('modelUrl', modelFile);
        
        response = await api.put(`/menu/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await api.put(`/menu/${id}`, menuItemData);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteMenuItem: async (id) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      const menuItem = await menuService.getMenuItemById(id);
      
      if (menuItem && menuItem.branchId && currentUser) {
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          if (currentUser.branchPermissions?.menu && 
              currentUser.branchPermissions.menu.length > 0 && 
              !currentUser.branchPermissions.menu.includes(menuItem.branchId)) {
            throw new Error("Access denied: You don't have permission to delete this menu item");
          }
        }
      }
      
      const response = await api.delete(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCategories: async (params = {}) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      if (params.branchId && currentUser) {
        const branchId = params.branchId;
        
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          if (currentUser.branchPermissions?.menu && 
              currentUser.branchPermissions.menu.length > 0 &&
              !currentUser.branchPermissions.menu.includes(branchId)) {
            return ['All'];
          }
        }
      }
      
      const response = await api.get('/menu/categories', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCategories: async (categoriesData) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      if (categoriesData.branchId && currentUser) {
        const branchId = categoriesData.branchId;
        
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          if (currentUser.branchPermissions?.menu && 
              currentUser.branchPermissions.menu.length > 0 &&
              !currentUser.branchPermissions.menu.includes(branchId)) {
            throw new Error("Access denied: You don't have permission to update categories for this branch");
          }
        }
      }
      
      const response = await api.post('/menu/categories', categoriesData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default menuService;