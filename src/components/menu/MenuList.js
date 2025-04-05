// src/components/menu/MenuList.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

// Import components
import MenuHeader from './components/MenuHeader';
import InfoBanner from './components/InfoBanner';
import BranchSelector from './components/BranchSelector';
import MenuSearch from './components/MenuSearch';
import CategoryTabs from './components/CategoryTabs';
import MenuGrid from './components/MenuGrid';
import MenuPagination from './components/MenuPagination';
import CategoryModal from './components/CategoryModal';
import CategoryManager from './components/CategoryManager';
import branchService from '../../services/branchService';
import restaurantService from '../../services/restaurantService';
import menuService from '../../services/menuService';

// Styled Components
const MenuViewContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

// Main Component
const MenuList = () => {
  const { restaurantId, branchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [restaurant, setRestaurant] = useState(null);
  const [branch, setBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showChangeCategory, setShowChangeCategory] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedBranchId, setSelectedBranchId] = useState(branchId ? parseInt(branchId) : null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  
  // Determine view type (restaurant or branch view)
  const isRestaurantView = Boolean(restaurantId && !branchId);
  const isBranchView = Boolean(branchId);
  
 // In MenuList.js
// In the useEffect where you fetch data
// In src/components/menu/MenuList.js - update the useEffect section

useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching data for restaurantId:", restaurantId, "branchId:", branchId);
        let fetchedBranch = null;
        let fetchedRestaurant = null;
        
        // If we have a branchId, fetch branch data first
        if (branchId) {
          try {
            fetchedBranch = await branchService.getBranchById(branchId);
            console.log("Fetched branch:", fetchedBranch);
            
            if (fetchedBranch) {
              setBranch(fetchedBranch);
              setSelectedBranchId(fetchedBranch.id || fetchedBranch._id);
              
              // Get restaurant data for this branch
              if (fetchedBranch.restaurantId) {
                console.log("Fetching restaurant with ID from branch:", fetchedBranch.restaurantId);
                try {
                  fetchedRestaurant = await restaurantService.getRestaurantById(fetchedBranch.restaurantId);
                  console.log("Fetched restaurant:", fetchedRestaurant);
                  if (fetchedRestaurant) {
                    setRestaurant(fetchedRestaurant);
                  }
                } catch (restError) {
                  console.error("Error fetching restaurant from branch:", restError);
                }
              }
            }
          } catch (branchError) {
            console.error("Error fetching branch:", branchError);
          }
        }
        // If we have a restaurantId directly, fetch restaurant data
        else if (restaurantId) {
          try {
            fetchedRestaurant = await restaurantService.getRestaurantById(restaurantId);
            console.log("Fetched restaurant directly:", fetchedRestaurant);
            
            if (fetchedRestaurant) {
              setRestaurant(fetchedRestaurant);
              
              // Get all branches for this restaurant
              const allBranches = await branchService.getAllBranches(restaurantId);
              setBranches(allBranches);
              
              // If no specific branch is selected, use the first branch
              if (!selectedBranchId && allBranches.length > 0) {
                const firstBranchId = allBranches[0].id || allBranches[0]._id;
                setSelectedBranchId(firstBranchId);
                
                // Fetch the first branch to set it as the selected one
                try {
                  fetchedBranch = await branchService.getBranchById(firstBranchId);
                  if (fetchedBranch) {
                    setBranch(fetchedBranch);
                  }
                } catch (branchError) {
                  console.error("Error fetching first branch:", branchError);
                }
              }
            }
          } catch (restError) {
            console.error("Error fetching restaurant directly:", restError);
          }
        }
        
        // Now fetch menu items based on the branch we have
        if (fetchedBranch) {
          try {
            const branchId = fetchedBranch.id || fetchedBranch._id;
            console.log(`Fetching menu items for branch: ${branchId}`);
            
            // Use menuService to get items for this branch
            const items = await menuService.getMenuItems({ branchId: branchId });
            console.log(`Fetched ${items.length} menu items:`, items);
            
            // Set menu items state
            setMenuItems(items);
            
            // Extract categories from menu items
            const allCategories = items.map(item => item.category);
            const uniqueCategories = ['All', ...new Set(allCategories)];
            setCategories(uniqueCategories);
          } catch (menuError) {
            console.error("Error fetching menu items:", menuError);
          }
        } else if (fetchedRestaurant && !fetchedBranch) {
          // If we have a restaurant but no branch, try to get restaurant-level menu items
          try {
            const restaurantId = fetchedRestaurant.id || fetchedRestaurant._id;
            console.log(`Fetching menu items for restaurant: ${restaurantId}`);
            
            // Use menuService to get items for this restaurant
            const items = await menuService.getMenuItems({ restaurantId: restaurantId });
            console.log(`Fetched ${items.length} menu items for restaurant:`, items);
            
            // Set menu items state
            setMenuItems(items);
            
            // Extract categories from menu items
            const allCategories = items.map(item => item.category);
            const uniqueCategories = ['All', ...new Set(allCategories)];
            setCategories(uniqueCategories);
          } catch (menuError) {
            console.error("Error fetching restaurant menu items:", menuError);
          }
        }
        
      } catch (error) {
        console.error('Error in fetchData:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [restaurantId, branchId, selectedBranchId]);
  
  // Filter items when category or search changes
  useEffect(() => {
    let filtered = menuItems;
    
    // Apply category filter
    if (activeCategory !== 'all' && activeCategory !== 'All') {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeCategory, searchQuery, menuItems]);
  
  // Handle branch selection change
  const handleBranchChange = (e) => {
    const newBranchId = e.target.value;
    setSelectedBranchId(newBranchId);
    
    // Navigate to the selected branch's menu if we're in restaurant view
    if (isRestaurantView) {
        navigate(`/branches/${newBranchId}/menu`);
      }
  };
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Toggle item status (active/inactive)
  const toggleItemStatus = (itemId) => {
    const updatedItems = menuItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: item.status === 'active' ? 'inactive' : 'active'
        };
      }
      return item;
    });
    
    setMenuItems(updatedItems);
    
    // Determine where to save the updated menu
    if (isBranchView && branchId) {
      localStorage.setItem(`branch_menu_${branchId}`, JSON.stringify(updatedItems));
    } else if (isRestaurantView && restaurantId) {
      localStorage.setItem(`restaurant_menu_${restaurantId}`, JSON.stringify(updatedItems));
    }
  };
  
  // Change category modal handlers
  const openChangeCategoryModal = (item) => {
    setSelectedItem(item);
    setShowChangeCategory(true);
  };
  
  const changeItemCategory = (newCategory) => {
    const updatedItems = menuItems.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          category: newCategory
        };
      }
      return item;
    });
    
    setMenuItems(updatedItems);
    
    // Determine where to save the updated menu
    if (isBranchView && branchId) {
      localStorage.setItem(`branch_menu_${branchId}`, JSON.stringify(updatedItems));
    } else if (isRestaurantView && restaurantId) {
      localStorage.setItem(`restaurant_menu_${restaurantId}`, JSON.stringify(updatedItems));
    }
    
    setShowChangeCategory(false);
    
    // Update categories list
    setCategories(['All', ...new Set(updatedItems.map(item => item.category))]);
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering is handled in the useEffect
  };
  
  // Clear all filters
  const clearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
  };
  
  // Handle category updates
  const handleUpdateCategories = (updatedCategories) => {
    setCategories(updatedCategories);
    
    // Update all menu items that have categories that no longer exist
    const validCategories = new Set(updatedCategories);
    const defaultCategory = updatedCategories.find(c => c !== 'All') || 'Main Courses';
    
    const updatedItems = menuItems.map(item => {
      // If the item's category no longer exists in the updated categories list
      // (and is not "Deals" or "Exclusive Offers" which are special)
      if (!validCategories.has(item.category) && 
          item.category !== 'Deals' && 
          item.category !== 'Exclusive Offers') {
        return {
          ...item,
          category: defaultCategory
        };
      }
      return item;
    });
    
    setMenuItems(updatedItems);
    
    // Determine where to save the updated menu
    if (isBranchView && branchId) {
      localStorage.setItem(`branch_menu_${branchId}`, JSON.stringify(updatedItems));
    } else if (isRestaurantView && restaurantId) {
      localStorage.setItem(`restaurant_menu_${restaurantId}`, JSON.stringify(updatedItems));
    }
    
    // Reset to show all items
    setActiveCategory('all');
  };
  
  // Determine back button destination
  const getBackLink = () => {
    if (isBranchView) {
      return `/branches/${branchId}`;
    } else if (isRestaurantView) {
      return `/restaurants/${restaurantId}`;
    } else {
      return '/';
    }
  };
  
  // Get title text
  const getTitleText = () => {
    if (isBranchView && branch) {
      return `${branch.name} Menu`;
    } else if (isRestaurantView && restaurant) {
      return `${restaurant.name} Menu`;
    } else {
      return 'Menu Management';
    }
  };
  
  // Get subtitle text
  const getSubtitleText = () => {
    if (isBranchView && branch && restaurant) {
      return `Manage menu items for ${branch.name} - ${restaurant.name}`;
    } else if (isRestaurantView && restaurant) {
      return `Manage menu items across all branches of ${restaurant.name}`;
    } else {
      return 'View and manage menu items';
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <MenuViewContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '3px solid #e0e0e0',
              borderTopColor: '#FF5722',
              margin: '0 auto 1rem'
            }}
          />
          <p>Loading menu information...</p>
        </div>
      </MenuViewContainer>
    );
  }
  
  // Not found state
  if ((!restaurant && isRestaurantView) || (!branch && isBranchView)) {
    return (
      <MenuViewContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Not Found</h2>
          <p>The requested restaurant or branch could not be found.</p>
          <button 
            onClick={() => navigate('/')}
            style={{ 
              display: 'inline-flex', 
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#FF5722',
              color: 'white',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Return to Dashboard
          </button>
        </div>
      </MenuViewContainer>
    );
  }
  
  return (
    <MenuViewContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <MenuHeader
        title={getTitleText()}
        subtitle={getSubtitleText()}
        backLink={getBackLink()}
        backText={isBranchView ? 'Back to Branch' : 'Back to Restaurant'}
      />
      
      {/* Info Banner */}
      <InfoBanner 
        message="You can manage menu items from this page. To create new menu items or change 3D models, please use the iOS app." 
      />
      
      {/* Category Manager */}
      <CategoryManager 
        categories={categories}
        onUpdateCategories={handleUpdateCategories}
        onCancel={() => setShowCategoryManager(false)}
      />
      
      {/* Branch Selector (only in restaurant view) */}
      {isRestaurantView && branches.length > 0 && (
        <BranchSelector
          branches={branches}
          selectedBranchId={selectedBranchId}
          onChange={handleBranchChange}
        />
      )}
      
      {/* Search Bar */}
      <MenuSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />
      
      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        hasDeals={categories.includes('Deals')}
        hasExclusiveOffers={categories.includes('Exclusive Offers')}
      />
      
      {/* Menu Items Grid */}
      <MenuGrid
        items={currentItems}
        toggleItemStatus={toggleItemStatus}
        openChangeCategoryModal={openChangeCategoryModal}
        clearFilters={clearFilters}
        searchQuery={searchQuery}
        activeCategory={activeCategory}
      />
      
      {/* Pagination */}
      <MenuPagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        setCurrentPage={setCurrentPage}
      />
      
      {/* Category Change Modal */}
      <CategoryModal
        show={showChangeCategory}
        onClose={() => setShowChangeCategory(false)}
        selectedItem={selectedItem}
        categories={categories}
        changeItemCategory={changeItemCategory}
      />
    </MenuViewContainer>
  );
};

export default MenuList;