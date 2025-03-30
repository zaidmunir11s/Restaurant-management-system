// src/services/branchService.js
import api from '../utils/api';

/**
 * Service for branch-related API calls
 */
const branchService = {
  /**
   * Get all branches
   * @param {Object} params Query parameters like restaurantId
   * @returns {Promise} Promise with branches data
   */
  getAllBranches: async (params = {}) => {
    try {
      // For demo: Get from localStorage with fallback to API
      const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
      
      // If we have branches in localStorage and a restaurantId is specified, filter by that
      if (storedBranches.length > 0) {
        if (params.restaurantId) {
          return storedBranches.filter(b => b.restaurantId === parseInt(params.restaurantId));
        }
        return storedBranches;
      }
      
      // Fallback to API if no data in localStorage
      const response = await api.get('/branches', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching branches:', error);
      
      // Fallback to localStorage in case of API error
      const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
      if (params.restaurantId) {
        return storedBranches.filter(b => b.restaurantId === parseInt(params.restaurantId));
      }
      return storedBranches;
    }
  },

  /**
   * Get a specific branch by ID
   * @param {string} id Branch ID
   * @returns {Promise} Promise with branch data
   */
  getBranchById: async (id) => {
    try {
      // For demo: Get from localStorage with fallback to API
      const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
      const foundBranch = storedBranches.find(b => b.id === parseInt(id));
      
      if (foundBranch) {
        return foundBranch;
      }
      
      // Fallback to API if not found in localStorage
      const response = await api.get(`/branches/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching branch with ID ${id}:`, error);
      
      // Fallback to localStorage in case of API error
      const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
      return storedBranches.find(b => b.id === parseInt(id));
    }
  },

  /**
   * Create a new branch
   * @param {Object} branchData Branch data object
   * @returns {Promise} Promise with created branch data
   */
  createBranch: async (branchData) => {
    try {
      // Try to use the API first
      try {
        const response = await api.post('/branches', branchData);
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Fallback to localStorage for demo
        const branches = JSON.parse(localStorage.getItem('branches') || '[]');
        const newBranch = {
          ...branchData,
          id: Date.now(),
          restaurantId: parseInt(branchData.restaurantId),
          tableCount: parseInt(branchData.tableCount || 10),
          // Use the provided image or imageUrl, or set to null if neither exists
          imageUrl: branchData.image 
            ? URL.createObjectURL(branchData.image) 
            : (branchData.imageUrl || null)
        };
        
        const updatedBranches = [...branches, newBranch];
        localStorage.setItem('branches', JSON.stringify(updatedBranches));
        
        // Set up tables if tableCount is specified
        if (branchData.tableCount) {
          setupTablesForBranch(newBranch);
        }
        
        // Set up menu items if includeDefaultMenu is true
        if (branchData.includeDefaultMenu) {
          setupDefaultMenuForBranch(newBranch);
        }
        
        return newBranch;
      }
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  },

  /**
   * Update an existing branch
   * @param {string} id Branch ID
   * @param {Object} branchData Updated branch data
   * @returns {Promise} Promise with updated branch data
   */
  updateBranch: async (id, branchData) => {
    try {
      // Try to use the API first
      try {
        const response = await api.put(`/branches/${id}`, branchData);
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Fallback to localStorage for demo
        const branches = JSON.parse(localStorage.getItem('branches') || '[]');
        
        // Get the current branch
        const currentBranch = branches.find(b => b.id === parseInt(id));
        if (!currentBranch) {
          throw new Error('Branch not found');
        }
        
        // Check if table count changed
        const oldTableCount = currentBranch.tableCount || 0;
        const newTableCount = parseInt(branchData.tableCount) || oldTableCount;
        const tableCountChanged = newTableCount !== oldTableCount;
        
        // Update the branch
        const updatedBranches = branches.map(branch => {
          if (branch.id === parseInt(id)) {
            return {
              ...branch,
              ...branchData,
              restaurantId: parseInt(branchData.restaurantId || branch.restaurantId),
              tableCount: newTableCount,
              // Handle image update
              imageUrl: branchData.image 
                ? URL.createObjectURL(branchData.image) 
                : (branchData.imageUrl || branch.imageUrl)
            };
          }
          return branch;
        });
        
        localStorage.setItem('branches', JSON.stringify(updatedBranches));
        const updatedBranch = updatedBranches.find(b => b.id === parseInt(id));
        
        // Update tables if table count changed
        if (tableCountChanged) {
          updateTablesForBranch(updatedBranch, oldTableCount);
        }
        
        return updatedBranch;
      }
    } catch (error) {
      console.error(`Error updating branch with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a branch
   * @param {string} id Branch ID
   * @returns {Promise} Promise with deletion result
   */
  deleteBranch: async (id) => {
    try {
      // Try to use the API first
      try {
        const response = await api.delete(`/branches/${id}`);
        
        // Even if API succeeds, update localStorage for demo consistency
        const branches = JSON.parse(localStorage.getItem('branches') || '[]');
        const updatedBranches = branches.filter(b => b.id !== parseInt(id));
        localStorage.setItem('branches', JSON.stringify(updatedBranches));
        
        // Delete related tables
        const tables = JSON.parse(localStorage.getItem('tables') || '[]');
        const updatedTables = tables.filter(t => t.branchId !== parseInt(id));
        localStorage.setItem('tables', JSON.stringify(updatedTables));
        
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, using localStorage instead:', apiError);
        
        // Fallback to localStorage for demo
        const branches = JSON.parse(localStorage.getItem('branches') || '[]');
        const updatedBranches = branches.filter(b => b.id !== parseInt(id));
        localStorage.setItem('branches', JSON.stringify(updatedBranches));
        
        // Delete related tables
        const tables = JSON.parse(localStorage.getItem('tables') || '[]');
        const updatedTables = tables.filter(t => t.branchId !== parseInt(id));
        localStorage.setItem('tables', JSON.stringify(updatedTables));
        
        // Delete related menu items
        const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        const updatedMenuItems = menuItems.filter(item => item.branchId !== parseInt(id));
        localStorage.setItem('menuItems', JSON.stringify(updatedMenuItems));
        
        return { success: true, message: "Branch deleted successfully" };
      }
    } catch (error) {
      console.error(`Error deleting branch with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get branch statistics
   * @param {string} id Branch ID
   * @returns {Promise} Promise with branch statistics
   */
  getBranchStats: async (id) => {
    try {
      // Try to use the API first
      try {
        const response = await api.get(`/branches/${id}/stats`);
        return response.data;
      } catch (apiError) {
        console.warn('API call failed, generating mock stats:', apiError);
        
        // Generate mock stats for demo
        const tables = JSON.parse(localStorage.getItem('tables') || '[]');
        const branchTables = tables.filter(t => t.branchId === parseInt(id));
        
        const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        const branchMenuItems = menuItems.filter(item => item.branchId === parseInt(id));
        
        // Generate reasonable mock stats
        return {
          tableCount: branchTables.length,
          availableTables: branchTables.filter(t => t.status === 'available').length,
          occupiedTables: branchTables.filter(t => t.status === 'occupied').length,
          menuItemCount: branchMenuItems.length,
          employeeCount: 8, // Mock employee count
          dailyOrders: Math.floor(Math.random() * 30) + 20, // Random number between 20-50
          dailyRevenue: (Math.floor(Math.random() * 2000) + 1000).toFixed(2), // Random between 1000-3000
        };
      }
    } catch (error) {
      console.error(`Error fetching stats for branch with ID ${id}:`, error);
      
      // Return minimal mock data as fallback
      return {
        tableCount: 0,
        availableTables: 0,
        occupiedTables: 0,
        menuItemCount: 0,
        employeeCount: 0,
        dailyOrders: 0,
        dailyRevenue: 0
      };
    }
  }
};

/**
 * Helper function to set up tables for a new branch
 * @param {Object} branch Branch object
 */
function setupTablesForBranch(branch) {
  const tables = JSON.parse(localStorage.getItem('tables') || '[]');
  const newTables = [];
  
  for (let i = 1; i <= branch.tableCount; i++) {
    // Default capacity is based on table number
    const capacity = i % 3 === 0 ? 6 : (i % 2 === 0 ? 4 : 2);
    
    // By default, 60% of tables are indoor and 40% are outdoor
    const isIndoor = i <= Math.ceil(branch.tableCount * 0.6);
    
    // Skip indoor tables if includeIndoorTables is false
    if (isIndoor && branch.includeIndoorTables === false) continue;
    
    // Skip outdoor tables if includeOutdoorTables is false
    if (!isIndoor && branch.includeOutdoorTables === false) continue;
    
    newTables.push({
      id: branch.id * 100 + i, // Unique ID based on branch ID
      branchId: branch.id,
      number: i,
      capacity: capacity,
      status: 'available',
      location: isIndoor ? 'Indoor' : 'Outdoor'
    });
  }
  
  localStorage.setItem('tables', JSON.stringify([...tables, ...newTables]));
}

/**
 * Helper function to update tables when branch table count changes
 * @param {Object} branch Branch object
 * @param {number} oldTableCount Previous table count
 */
function updateTablesForBranch(branch, oldTableCount) {
  const tables = JSON.parse(localStorage.getItem('tables') || '[]');
  const newTableCount = branch.tableCount;
  
  // Remove existing tables for this branch
  const otherTables = tables.filter(t => t.branchId !== branch.id);
  
  // Create new tables with updated count
  const newTables = [];
  for (let i = 1; i <= newTableCount; i++) {
    const capacity = i % 3 === 0 ? 6 : (i % 2 === 0 ? 4 : 2);
    const isIndoor = i <= Math.ceil(newTableCount * 0.6);
    
    // Skip indoor tables if includeIndoorTables is false
    if (isIndoor && branch.includeIndoorTables === false) continue;
    
    // Skip outdoor tables if includeOutdoorTables is false
    if (!isIndoor && branch.includeOutdoorTables === false) continue;
    
    newTables.push({
      id: branch.id * 100 + i,
      branchId: branch.id,
      number: i,
      capacity: capacity,
      status: 'available',
      location: isIndoor ? 'Indoor' : 'Outdoor'
    });
  }
  
  localStorage.setItem('tables', JSON.stringify([...otherTables, ...newTables]));
}

/**
 * Helper function to set up default menu items for a branch
 * @param {Object} branch Branch object
 */
function setupDefaultMenuForBranch(branch) {
  const menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
  const newMenuItems = [];
  
  // Define categories for the default menu
  const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Specials'];
  
  // Create default menu items for each category
  categories.forEach((category, categoryIndex) => {
    const itemCount = category === 'Specials' ? 2 : 4; // Fewer special items
    
    for (let i = 1; i <= itemCount; i++) {
      // Base prices by category
      let basePrice;
      switch (category) {
        case 'Appetizers': basePrice = 8; break;
        case 'Main Courses': basePrice = 15; break;
        case 'Desserts': basePrice = 7; break; 
        case 'Beverages': basePrice = 4; break;
        case 'Specials': basePrice = 22; break;
        default: basePrice = 10;
      }
      
      // Add some variation to prices
      const price = (basePrice + (Math.random() * 5)).toFixed(2);
      
      newMenuItems.push({
        id: branch.id * 1000 + categoryIndex * 10 + i,
        branchId: branch.id,
        restaurantId: branch.restaurantId,
        title: `${category} Item ${i}`,
        description: `Delicious ${category.toLowerCase()} option ${i}`,
        price: `$${price}`,
        category: category,
        status: 'active',
        isVegetarian: i % 3 === 0,
        isVegan: i % 4 === 0,
        isGlutenFree: i % 5 === 0,
        modelUrl: 'https://menu-reality.com/fast_food_meal.glb' // Default 3D model
      });
    }
  });
  
  localStorage.setItem('menuItems', JSON.stringify([...menuItems, ...newMenuItems]));
}

export default branchService;