import api from '../utils/api';
import authService from './authService';

const tableService = {
  getAllTables: async (filters = {}) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      let url = '/tables';
      const queryParams = new URLSearchParams();
      
      if (filters.branchId) {
        queryParams.append('branchId', filters.branchId);
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      if (filters.section) {
        queryParams.append('section', filters.section);
      }
      
      if (currentUser && (currentUser.role === 'manager' || currentUser.role === 'waiter')) {
        if (currentUser.branchId) {
          queryParams.set('branchId', currentUser.branchId);
        }
      }
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      const response = await api.get(url);
      
      if (Array.isArray(response.data)) {
        response.data.forEach(table => {
          if (table._id && !table.id) {
            table.id = table._id;
          }
        });
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getTablesByBranch: async (branchId) => {
    try {
      if (!branchId) {
        throw new Error('Branch ID is required');
      }
      
      const currentUser = authService.getUserFromStorage();
      
      const normalizedBranchId = String(branchId);
      
      if (currentUser && currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
        if (String(currentUser.branchId) !== normalizedBranchId) {
          const hasBranchAccess = currentUser.branchPermissions?.tables?.some(id => 
            String(id) === normalizedBranchId
          );
          
          if (!hasBranchAccess) {
            console.warn("User doesn't have permission to access this branch's tables");
            return [];
          }
        }
      }
      
      const response = await api.get(`/tables?branchId=${normalizedBranchId}`);
      
      if (Array.isArray(response.data)) {
        response.data.forEach(table => {
          if (table._id && !table.id) {
            table.id = table._id;
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching tables for branch ${branchId}:`, error);
      return [];
    }
  },
  
  getTableById: async (id) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      const response = await api.get(`/tables/${id}`);
      const table = response.data;
      
      if (table && table._id && !table.id) {
        table.id = table._id;
      }
      
      if (table && currentUser && currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
        if (currentUser.branchId !== table.branchId) {
          if (currentUser.branchPermissions?.tables && 
              currentUser.branchPermissions.tables.length > 0 &&
              !currentUser.branchPermissions.tables.includes(table.branchId)) {
            throw new Error("Access denied: You don't have permission to access this table");
          }
        }
      }
      
      return table;
    } catch (error) {
      throw error;
    }
  },
  
  createTable: async (tableData) => {
    try {
      const currentUser = authService.getUserFromStorage();
      
      if (tableData.branchId && currentUser) {
        const branchId = tableData.branchId;
        
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          if (currentUser.role === 'manager') {
            if (!currentUser.permissions?.manageTables || currentUser.branchId !== branchId) {
              throw new Error("Access denied: You don't have permission to create tables for this branch");
            }
          } else if (currentUser.branchPermissions?.tables) {
            if (!currentUser.branchPermissions.tables.includes(branchId)) {
              throw new Error("Access denied: You don't have permission to create tables for this branch");
            }
          } else {
            throw new Error("Access denied: You don't have permission to create tables");
          }
        }
      }
      
      const response = await api.post('/tables', tableData);
     
      if (response.data && response.data._id && !response.data.id) {
        response.data.id = response.data._id;
      }
     
      return response.data;
   } catch (error) {
     throw error;
   }
 },
 
 updateTable: async (id, tableData) => {
   try {
     const currentUser = authService.getUserFromStorage();
     
     const table = await tableService.getTableById(id);
     
     if (currentUser && currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
       const branchId = table.branchId;
       
       if (currentUser.role === 'manager') {
         if (!currentUser.permissions?.manageTables || currentUser.branchId !== branchId) {
           throw new Error("Access denied: You don't have permission to update this table");
         }
       } else if (currentUser.branchPermissions?.tables) {
         if (!currentUser.branchPermissions.tables.includes(branchId)) {
           throw new Error("Access denied: You don't have permission to update this table");
         }
       } else if (currentUser.role === 'waiter') {
         if (Object.keys(tableData).some(key => key !== 'status')) {
           throw new Error("Access denied: You can only update table status");
         }
         
         if (currentUser.branchId !== branchId) {
           throw new Error("Access denied: You don't have permission to update tables in this branch");
         }
       } else {
         throw new Error("Access denied: You don't have permission to update tables");
       }
     }
     
     const response = await api.put(`/tables/${id}`, tableData);
     
     if (response.data && response.data._id && !response.data.id) {
       response.data.id = response.data._id;
     }
     
     return response.data;
   } catch (error) {
     throw error;
   }
 },
 
 deleteTable: async (id) => {
   try {
     const currentUser = authService.getUserFromStorage();
     
     const table = await tableService.getTableById(id);
     
     if (currentUser && currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
       const branchId = table.branchId;
       
       if (currentUser.role === 'manager') {
         if (!currentUser.permissions?.manageTables || currentUser.branchId !== branchId) {
           throw new Error("Access denied: You don't have permission to delete this table");
         }
       } else if (currentUser.branchPermissions?.tables) {
         if (!currentUser.branchPermissions.tables.includes(branchId)) {
           throw new Error("Access denied: You don't have permission to delete this table");
         }
       } else {
         throw new Error("Access denied: You don't have permission to delete tables");
       }
     }
     
     const response = await api.delete(`/tables/${id}`);
     return response.data;
   } catch (error) {
     throw error;
   }
 },
 
 updateTableStatus: async (id, status) => {
   try {
     return await tableService.updateTable(id, { status });
   } catch (error) {
     throw error;
   }
 }
};

export default tableService;