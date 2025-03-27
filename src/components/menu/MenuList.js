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
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching data for restaurantId:", restaurantId, "branchId:", branchId);
        
        // If we have a restaurantId, fetch restaurant data
        if (restaurantId) {
          const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
          const foundRestaurant = restaurants.find(r => r.id === parseInt(restaurantId));
          
          if (foundRestaurant) {
            setRestaurant(foundRestaurant);
            
            // Get all branches for this restaurant
            const allBranches = JSON.parse(localStorage.getItem('branches') || '[]');
            const restaurantBranches = allBranches.filter(b => b.restaurantId === parseInt(restaurantId));
            setBranches(restaurantBranches);
            
            // If no specific branch is selected, use the first branch
            if (!selectedBranchId && restaurantBranches.length > 0) {
              setSelectedBranchId(restaurantBranches[0].id);
            }
          }
        }
        
        // If we have a branchId, fetch branch data
        if (branchId) {
          const branches = JSON.parse(localStorage.getItem('branches') || '[]');
          const foundBranch = branches.find(b => b.id === parseInt(branchId));
          
          if (foundBranch) {
            setBranch(foundBranch);
            setSelectedBranchId(parseInt(branchId));
            
            // Get restaurant data for this branch
            const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
            const foundRestaurant = restaurants.find(r => r.id === foundBranch.restaurantId);
            if (foundRestaurant) {
              setRestaurant(foundRestaurant);
            }
          }
        }
        
        // Fetch menu items for the selected branch or restaurant
        let targetId;
        
        if (branchId) {
          targetId = parseInt(branchId);
        } else if (selectedBranchId) {
          targetId = selectedBranchId;
        } else if (restaurantId) {
          targetId = parseInt(restaurantId);
        }
        
        console.log("Target ID for menu items:", targetId);
        
        if (targetId) {
          // First try to get branch-specific menu
          let storedMenuItems = JSON.parse(localStorage.getItem(`branch_menu_${targetId}`) || '[]');
          
          // If no branch-specific menu, try restaurant menu
          if (storedMenuItems.length === 0 && branchId) {
            const branches = JSON.parse(localStorage.getItem('branches') || '[]');
            const foundBranch = branches.find(b => b.id === parseInt(branchId));
            
            if (foundBranch && foundBranch.restaurantId) {
              storedMenuItems = JSON.parse(localStorage.getItem(`restaurant_menu_${foundBranch.restaurantId}`) || '[]');
            }
          }
          
          // Finally, if still no menu items, create some sample ones
          if (storedMenuItems.length === 0) {
            // Create sample menu items
            const sampleCategories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
            const sampleMenuItems = [];
            
            // Generate regular menu items
            for (let i = 1; i <= 12; i++) {
              const category = sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
              sampleMenuItems.push({
                id: i,
                title: `Menu Item ${i}`,
                description: `Description for menu item ${i}. This is a delicious dish that customers love.`,
                price: `$${(Math.random() * 20 + 5).toFixed(2)}`,
                category: category,
                status: Math.random() > 0.2 ? 'active' : 'inactive',
                featured: Math.random() > 0.8,
                modelUrl: 'https://menu-reality.com/fast_food_meal.glb'
              });
            }
            
            // Add deal items
            for (let i = 13; i <= 15; i++) {
              sampleMenuItems.push({
                id: i,
                title: `Deal Package ${i-12}`,
                description: `Special deal package with multiple items at a discounted price.`,
                price: `$${(Math.random() * 30 + 15).toFixed(2)}`,
                category: 'Deals',
                status: 'active',
                featured: true,
                modelUrl: 'https://menu-reality.com/fast_food_meal.glb'
              });
            }
            
            // Add exclusive offer items
            for (let i = 16; i <= 18; i++) {
              sampleMenuItems.push({
                id: i,
                title: `Exclusive Offer ${i-15}`,
                description: `Limited time exclusive offer only available at select locations.`,
                price: `$${(Math.random() * 25 + 10).toFixed(2)}`,
                category: 'Exclusive Offers',
                status: 'active',
                featured: true,
                modelUrl: 'https://menu-reality.com/fast_food_meal.glb'
              });
            }
            
            // For Restaurant view, store as restaurant menu
            if (isRestaurantView && restaurantId) {
              localStorage.setItem(`restaurant_menu_${restaurantId}`, JSON.stringify(sampleMenuItems));
            } 
            // For Branch view, store as branch menu
            else if (isBranchView && branchId) {
              localStorage.setItem(`branch_menu_${branchId}`, JSON.stringify(sampleMenuItems));
            }
            
            setMenuItems(sampleMenuItems);
            setFilteredItems(sampleMenuItems);
            
            // Extract unique categories and ensure "Deals" and "Exclusive Offers" are included
            const uniqueCategories = ['All', ...new Set(sampleMenuItems.map(item => item.category))];
            setCategories(uniqueCategories);
          } else {
            console.log("Found stored menu items:", storedMenuItems.length);
            
            // Check if Deals and Exclusive Offers categories exist
            // If not, add some sample items for those categories
            const hasDeals = storedMenuItems.some(item => item.category === 'Deals');
            const hasExclusives = storedMenuItems.some(item => item.category === 'Exclusive Offers');
            
            let updatedItems = [...storedMenuItems];
            
            if (!hasDeals) {
              // Add deal items
              for (let i = 1; i <= 3; i++) {
                updatedItems.push({
                  id: storedMenuItems.length + i,
                  title: `Deal Package ${i}`,
                  description: `Special deal package with multiple items at a discounted price.`,
                  price: `$${(Math.random() * 30 + 15).toFixed(2)}`,
                  category: 'Deals',
                  status: 'active',
                  featured: true,
                  modelUrl: 'https://menu-reality.com/fast_food_meal.glb'
                });
              }
            }
            
            if (!hasExclusives) {
              // Add exclusive offer items
              for (let i = 1; i <= 3; i++) {
                updatedItems.push({
                  id: storedMenuItems.length + (hasDeals ? 3 : 0) + i,
                  title: `Exclusive Offer ${i}`,
                  description: `Limited time exclusive offer only available at select locations.`,
                  price: `$${(Math.random() * 25 + 10).toFixed(2)}`,
                  category: 'Exclusive Offers',
                  status: 'active',
                  featured: true,
                  modelUrl: 'https://menu-reality.com/fast_food_meal.glb'
                });
              }
            }
            
            // If we added new items, update localStorage
            if (updatedItems.length > storedMenuItems.length) {
              if (isRestaurantView && restaurantId) {
                localStorage.setItem(`restaurant_menu_${restaurantId}`, JSON.stringify(updatedItems));
              } else if (isBranchView && branchId) {
                localStorage.setItem(`branch_menu_${branchId}`, JSON.stringify(updatedItems));
              }
            }
            
            setMenuItems(updatedItems);
            setFilteredItems(updatedItems);
            
            // Extract unique categories and ensure they are in the right order
            const uniqueCategories = ['All', ...new Set(updatedItems.map(item => item.category))];
            setCategories(uniqueCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
    const newBranchId = parseInt(e.target.value);
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