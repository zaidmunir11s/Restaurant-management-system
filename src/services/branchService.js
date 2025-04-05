import api from '../utils/api';
import authService from './authService';

const branchService = {
  getAllBranches: async (restaurantId = null) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      let params = {};
      if (restaurantId) {
        params.restaurantId = restaurantId;
      }
      
      if (currentUser && (currentUser.role === 'manager' || currentUser.role === 'waiter')) {
        if (currentUser.branchId) {
          params.branchId = currentUser.branchId;
        } else if (currentUser.restaurantId) {
          params.restaurantId = currentUser.restaurantId;
        }
      }
      
      const response = await api.get('/branches', { params });
      
      let branches = response.data;
      
      if (currentUser && 
          currentUser.role !== 'owner' && 
          !currentUser.permissions?.manageRestaurants && 
          !currentUser.permissions?.manageBranches) {
        
        if (currentUser.branchPermissions?.menu || currentUser.branchPermissions?.tables) {
          const accessibleBranchIds = [
            ...(currentUser.branchPermissions?.menu || []),
            ...(currentUser.branchPermissions?.tables || [])
          ].map(id => String(id));
          
          if (accessibleBranchIds.length > 0) {
            branches = branches.filter(branch => 
              accessibleBranchIds.includes(String(branch._id || branch.id))
            );
          }
        } else if (currentUser.branchId) {
          branches = branches.filter(branch => 
            String(branch._id || branch.id) === String(currentUser.branchId)
          );
        }
      }
      
      branches.forEach(branch => {
        if (branch._id && !branch.id) {
          branch.id = branch._id;
        }
      });
      
      return branches;
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    }
  },

  getBranchById: async (id) => {
    try {
      const branchId = String(id).trim(); 
      
      const currentUser = authService.getUserFromStorage();
      
      const response = await api.get(`/branches/${branchId}`);
      
      if (response.data && response.data._id) {
        response.data.id = response.data._id;
      }
      
      if (currentUser && 
          currentUser.role !== 'owner' && 
          !currentUser.permissions?.manageRestaurants && 
          !currentUser.permissions?.manageBranches) {
        
        const normalizedBranchId = String(branchId);
        
        const hasMenuAccess = currentUser.branchPermissions?.menu?.some(id => 
          String(id) === normalizedBranchId
        );
        
        const hasTableAccess = currentUser.branchPermissions?.tables?.some(id => 
          String(id) === normalizedBranchId
        );
        
        const isAssignedToBranch = String(currentUser.branchId) === normalizedBranchId;
        
        if (!hasMenuAccess && !hasTableAccess && !isAssignedToBranch) {
          console.warn("User doesn't have permission to access this branch");
        }
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching branch with ID ${id}:`, error);
      
      return { 
        _id: id,
        id: id,
        name: "Branch",
        address: "Address unavailable",
        city: "City unavailable",
        state: "State unavailable",
        zipCode: "",
        status: "active"
      };
    }
  },

  getRestaurantById: async (id) => {
    try {
      const restaurantId = typeof id === 'object' ? id.toString() : id;
      const response = await api.get(`/restaurants/${restaurantId}`);
      
      if (response.data && response.data._id && !response.data.id) {
        response.data.id = response.data._id;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching restaurant with ID ${id}:`, error);
      throw error;
    }
  },

  getManagers: async () => {
    try {
      const response = await api.get('/users?role=manager');
      
      if (Array.isArray(response.data)) {
        response.data.forEach(manager => {
          if (manager._id && !manager.id) {
            manager.id = manager._id;
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching managers:', error);
      return [];
    }
  },

  createBranch: async (branchData) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      if (currentUser && currentUser.role !== 'owner' && !currentUser.permissions?.manageBranches) {
        throw new Error("Access denied: You don't have permission to create branches");
      }
      
      const processedData = { ...branchData };
      
      if (processedData.restaurantId) {
        processedData.restaurantId = String(processedData.restaurantId);
      } else {
        throw { message: 'Restaurant ID is required' };
      }
      
      if (processedData.tableCount) {
        processedData.tableCount = Number(processedData.tableCount);
      }
      
      if (processedData.managerId) {
        processedData.managerId = String(processedData.managerId);
      }
      
      if (processedData.image) {
        const formData = new FormData();
        
        Object.keys(processedData).forEach(key => {
          if (key === 'image' && processedData[key]) {
            formData.append('image', processedData[key]);
          } else {
            formData.append(key, typeof processedData[key] === 'object' ? 
              JSON.stringify(processedData[key]) : processedData[key]);
          }
        });
        
        const response = await api.post('/branches', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data && response.data._id) {
          response.data.id = response.data._id;
        }
        
        return response.data;
      } else {
        const response = await api.post('/branches', processedData);
        
        if (response.data && response.data._id) {
          response.data.id = response.data._id;
        }
        
        return response.data;
      }
    } catch (error) {
      if (error.response) {
        throw error.response.data || { message: 'Error creating branch' };
      } else if (error.request) {
        throw { message: 'No response received from server' };
      } else {
        throw { message: error.message || 'Error creating branch' };
      }
    }
  },

  updateBranch: async (id, branchData) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      const branch = await branchService.getBranchById(id);
      
      if (currentUser && currentUser.role !== 'owner') {
        if (currentUser.role === 'manager') {
          if (!currentUser.permissions?.manageBranches || currentUser.branchId !== (branch._id || branch.id)) {
            throw new Error("Access denied: You don't have permission to update this branch");
          }
        } else {
          throw new Error("Access denied: You don't have permission to update branches");
        }
      }
      
      const processedData = { ...branchData };
      
      if (processedData.restaurantId) {
        processedData.restaurantId = String(processedData.restaurantId);
      }
      
      if (processedData.tableCount) {
        processedData.tableCount = Number(processedData.tableCount);
      }
      
      if (processedData.image) {
        const formData = new FormData();
        
        Object.keys(processedData).forEach(key => {
          if (key === 'image' && processedData[key]) {
            formData.append('image', processedData[key]);
          } else {
            formData.append(key, processedData[key]);
          }
        });
        
        const response = await api.put(`/branches/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data && response.data._id && !response.data.id) {
          response.data.id = response.data._id;
        }
        
        return response.data;
      } else {
        const response = await api.put(`/branches/${id}`, processedData);
        
        if (response.data && response.data._id && !response.data.id) {
          response.data.id = response.data._id;
        }
        
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  deleteBranch: async (id) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      const branch = await branchService.getBranchById(id);
      
      if (currentUser && currentUser.role !== 'owner') {
        throw new Error("Access denied: You don't have permission to delete branches");
      }
      
      const response = await api.delete(`/branches/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getBranchStats: async (id) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      if (currentUser && currentUser.role !== 'owner' && currentUser.role !== 'manager') {
        if (currentUser.branchPermissions) {
          const hasMenuAccess = currentUser.branchPermissions.menu?.includes(id);
          const hasTableAccess = currentUser.branchPermissions.tables?.includes(id);
          
          if (!hasMenuAccess && !hasTableAccess && currentUser.branchId !== id) {
            throw new Error("Access denied: You don't have permission to view branch stats");
          }
        } else if (currentUser.branchId !== id) {
          throw new Error("Access denied: You don't have permission to view branch stats");
        }
      }
      
      const response = await api.get(`/branches/${id}/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default branchService;