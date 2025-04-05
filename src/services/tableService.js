// src/services/tableService.js
import api from '../utils/api';
import authService from './authService';

const tableService = {
  // Get all tables with optional branch filter
  getAllTables: async (filters = {}) => {
    try {
      // Get current user to check permissions
      const currentUser = authService.getUserFromStorage();
      
      let url = '/tables';
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      if (filters.branchId) {
        queryParams.append('branchId', filters.branchId);
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      if (filters.section) {
        queryParams.append('section', filters.section);
      }
      
      // For managers and waiters, restrict to their branch
      if (currentUser && (currentUser.role === 'manager' || currentUser.role === 'waiter')) {
        if (currentUser.branchId) {
          queryParams.set('branchId', currentUser.branchId);
        }
      }
      
      // Append query params to URL if they exist
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      const response = await api.get(url);
      
      // Ensure consistent id properties for each table
      if (Array.isArray(response.data)) {
        response.data.forEach(table => {
          if (table._id && !table.id) {
            table.id = table._id;
          }
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching tables:', error);
      throw error;
    }
  },
  
  // Get tables for a specific branch
  getTablesByBranch: async (branchId) => {
    try {
      if (!branchId) {
        throw new Error('Branch ID is required');
      }
      
      // Get current user to check permissions
      const currentUser = authService.getUserFromStorage();
      
      // Check if the user has permission to access this branch's tables
      if (currentUser && currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
        // Check if user is assigned to this branch
        if (currentUser.branchId !== branchId) {
          // Check for branch-specific table permissions
          if (currentUser.branchPermissions?.tables && 
              currentUser.branchPermissions.tables.length > 0 &&
              !currentUser.branchPermissions.tables.includes(branchId)) {
            console.warn("User doesn't have permission to access this branch's tables");
            throw new Error("Access denied: You don't have permission to access this branch's tables");
          }
        }
      }
      
      const formattedBranchId = String(branchId).trim();
      console.log(`Fetching tables for branch ID: ${formattedBranchId}`);
      
      const response = await api.get(`/tables?branchId=${formattedBranchId}`);
      
      // Ensure consistent id properties
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
      throw error;
    }
  },
  
  // Get a table by ID
  getTableById: async (id) => {
    try {
      // Get current user to check permissions
      const currentUser = authService.getUserFromStorage();
      
      const response = await api.get(`/tables/${id}`);
      const table = response.data;
      
      // Ensure consistent id format
      if (table && table._id && !table.id) {
        table.id = table._id;
      }
      
      // Check if the user has permission to access this table
      if (table && currentUser && currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
        // If user not assigned to this table's branch
        if (currentUser.branchId !== table.branchId) {
          // Check for branch-specific table permissions
          if (currentUser.branchPermissions?.tables && 
              currentUser.branchPermissions.tables.length > 0 &&
              !currentUser.branchPermissions.tables.includes(table.branchId)) {
            console.warn("User doesn't have permission to access this table");
            throw new Error("Access denied: You don't have permission to access this table");
          }
        }
      }
      
      return table;
    } catch (error) {
      console.error(`Error fetching table with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new table
  createTable: async (tableData) => {
    try {
      // Get current user to check permissions
      const currentUser = authService.getUserFromStorage();
      
      // Check if user has permission to create tables for this branch
      if (tableData.branchId && currentUser) {
        const branchId = tableData.branchId;
        
        if (currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
          // Manager can only create tables for their assigned branch
          if (currentUser.role === 'manager') {
            if (!currentUser.permissions?.manageTables || currentUser.branchId !== branchId) {
              console.warn("Manager doesn't have permission to create tables for this branch");
              throw new Error("Access denied: You don't have permission to create tables for this branch");
            }
          } 
          // Users with branch-specific table permissions
          else if (currentUser.branchPermissions?.tables) {
            if (!currentUser.branchPermissions.tables.includes(branchId)) {
              console.warn("User doesn't have permission to create tables for this branch");
              throw new Error("Access denied: You don't have permission to create tables for this branch");
            }
          } else {
            console.warn("User doesn't have permission to create tables");
            throw new Error("Access denied: You don't have permission to create tables");
          }
        }
      }
      
      const response = await api.post('/tables', tableData);
     
     // Ensure consistent id format
     if (response.data && response.data._id && !response.data.id) {
       response.data.id = response.data._id;
     }
     
     return response.data;
   } catch (error) {
     console.error('Error creating table:', error);
     throw error;
   }
 },
 
 // Update a table
 updateTable: async (id, tableData) => {
   try {
     // Get current user to check permissions
     const currentUser = authService.getUserFromStorage();
     
     // First get the table to check permissions
     const table = await tableService.getTableById(id);
     
     // Check if user has permission to update this table
     if (currentUser && currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
       const branchId = table.branchId;
       
       // Manager can only update tables in their branch and must have permission
       if (currentUser.role === 'manager') {
         if (!currentUser.permissions?.manageTables || currentUser.branchId !== branchId) {
           console.warn("Manager doesn't have permission to update this table");
           throw new Error("Access denied: You don't have permission to update this table");
         }
       } 
       // Users with branch-specific table permissions
       else if (currentUser.branchPermissions?.tables) {
         if (!currentUser.branchPermissions.tables.includes(branchId)) {
           console.warn("User doesn't have permission to update this table");
           throw new Error("Access denied: You don't have permission to update this table");
         }
       } 
       // Waiter can only update table status
       else if (currentUser.role === 'waiter') {
         // Only allow status updates
         if (Object.keys(tableData).some(key => key !== 'status')) {
           console.warn("Waiter can only update table status");
           throw new Error("Access denied: You can only update table status");
         }
         
         // Must be assigned to this branch
         if (currentUser.branchId !== branchId) {
           console.warn("Waiter doesn't have permission to update tables in this branch");
           throw new Error("Access denied: You don't have permission to update tables in this branch");
         }
       } else {
         console.warn("User doesn't have permission to update tables");
         throw new Error("Access denied: You don't have permission to update tables");
       }
     }
     
     const response = await api.put(`/tables/${id}`, tableData);
     
     // Ensure consistent id format
     if (response.data && response.data._id && !response.data.id) {
       response.data.id = response.data._id;
     }
     
     return response.data;
   } catch (error) {
     console.error(`Error updating table with ID ${id}:`, error);
     throw error;
   }
 },
 
 // Delete a table
 deleteTable: async (id) => {
   try {
     // Get current user to check permissions
     const currentUser = authService.getUserFromStorage();
     
     // First get the table to check permissions
     const table = await tableService.getTableById(id);
     
     // Check if user has permission to delete this table
     if (currentUser && currentUser.role !== 'owner' && !currentUser.permissions?.manageRestaurants) {
       const branchId = table.branchId;
       
       // Manager can only delete tables in their branch and must have permission
       if (currentUser.role === 'manager') {
         if (!currentUser.permissions?.manageTables || currentUser.branchId !== branchId) {
           console.warn("Manager doesn't have permission to delete this table");
           throw new Error("Access denied: You don't have permission to delete this table");
         }
       } 
       // Users with branch-specific table permissions
       else if (currentUser.branchPermissions?.tables) {
         if (!currentUser.branchPermissions.tables.includes(branchId)) {
           console.warn("User doesn't have permission to delete this table");
           throw new Error("Access denied: You don't have permission to delete this table");
         }
       } else {
         console.warn("User doesn't have permission to delete tables");
         throw new Error("Access denied: You don't have permission to delete tables");
       }
     }
     
     const response = await api.delete(`/tables/${id}`);
     return response.data;
   } catch (error) {
     console.error(`Error deleting table with ID ${id}:`, error);
     throw error;
   }
 },
 
 // Update table status - convenience method for waiters
 updateTableStatus: async (id, status) => {
   try {
     return await tableService.updateTable(id, { status });
   } catch (error) {
     console.error(`Error updating status for table with ID ${id}:`, error);
     throw error;
   }
 }
};

export default tableService;