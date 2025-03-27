// src/components/branches/BranchMenu.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaUtensils, 
  FaPause,
  FaPlay,
  FaEdit,
  FaTags,
  FaPlus,
  FaChevronRight,
  FaChevronLeft,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import "@google/model-viewer";

// Styled Components
const MenuViewContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color ${props => props.theme.transitions.short};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Subtitle = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: stretch;
  }
`;

const Button = styled(Link)`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all ${props => props.theme.transitions.short};
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${props => {
        const hexColor = props.theme.colors.primary.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r * 0.9}, ${g * 0.9}, ${b * 0.9}, 1)`;
      }};
    }
  }
  
  &.secondary {
    color: ${props => props.theme.colors.text.primary};
    border: 1px solid #e0e0e0;
    
    &:hover {
      background-color: ${props => props.theme.colors.background.main};
    }
  }
  
  @media (max-width: 480px) {
    flex: 1;
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${props => {
        const hexColor = props.theme.colors.primary.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r * 0.9}, ${g * 0.9}, ${b * 0.9}, 1)`;
      }};
    }
  }
  
  &.secondary {
    color: ${props => props.theme.colors.text.primary};
    border: 1px solid #e0e0e0;
    
    &:hover {
      background-color: ${props => props.theme.colors.background.main};
    }
  }
`;

const SearchBar = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  overflow: hidden;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  font-size: 1rem;
  color: ${props => props.theme.colors.text.primary};
  
  &:focus {
    outline: none;
  }
`;

const SearchButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.primary}50;
    border-radius: 4px;
  }
`;

const CategoryTab = styled.button`
  background: ${props => props.active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : '#e0e0e0'};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.main};
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const MenuItemCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  ${props => props.status === 'inactive' && `
    opacity: 0.7;
  `}
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 2;
  
  background-color: ${props => {
    switch (props.status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#F44336';
      case 'featured':
        return '#FFB74D';
      default:
        return '#9E9E9E';
    }
  }};
  color: white;
`;

const ModelViewerContainer = styled.div`
  width: 100%;
  height: 180px;
  background-color: rgba(0, 0, 0, 0.1);
  position: relative;
`;

const LoaderOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${props => props.theme.colors.background.main};
  border-top-color: ${props => props.theme.colors.primary};
`;

const MenuItemContent = styled.div`
  padding: 1rem;
`;

const MenuItemTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

const MenuItemDescription = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceAndCategory = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Price = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const Category = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
  background-color: ${props => props.theme.colors.background.main};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconActionButton = styled.button`
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
    color: ${props => props.color || props.theme.colors.primary};
  }
`;

const NoItemsMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  grid-column: 1 / -1;
  
  h3 {
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
  }
  
  p {
    margin-bottom: 2rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const CategoryActionModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: ${props => props.theme.shadows.large};
`;

const ModalTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.primary}50;
    border-radius: 4px;
  }
`;

const CategoryOption = styled.div`
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
  }
  
  ${props => props.selected && `
    background-color: ${props.theme.colors.primary}20;
    font-weight: 500;
  `}
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 1rem;
`;

const PageButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  ${props => props.active ? `
    background-color: ${props.theme.colors.primary};
    color: white;
  ` : `
    background-color: ${props.theme.colors.background.paper};
    color: ${props.theme.colors.text.primary};
  `}
  
  &:hover {
    transform: scale(1.1);
  }
`;

const PaginationNavButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.background.paper};
  color: ${props => props.disabled ? props.theme.colors.text.disabled : props.theme.colors.text.primary};
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.colors.primary}20;
  }
`;

const ModelLoaderAnimation = () => (
  <LoadingSpinner 
    animate={{
      rotate: 360
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

// Main Component
const BranchMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showChangeCategory, setShowChangeCategory] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modelLoadingStates, setModelLoadingStates] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  
  // Refs for model viewers
  const modelViewerRefs = useRef({});
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch branch data
        const branches = JSON.parse(localStorage.getItem('branches') || '[]');
        const foundBranch = branches.find(b => b.id === parseInt(id));
        
        if (foundBranch) {
          setBranch(foundBranch);
          
          // Fetch restaurant data
          const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
          const foundRestaurant = restaurants.find(r => r.id === foundBranch.restaurantId);
          setRestaurant(foundRestaurant);
          
          // Get or generate menu items
          const storedMenuItems = JSON.parse(localStorage.getItem(`restaurant_menu_${foundBranch.restaurantId}`) || '[]');
          
          if (storedMenuItems.length === 0) {
            // Create sample menu items
            const sampleCategories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
            const sampleMenuItems = [];
            
            // Generate 15 sample menu items
            for (let i = 1; i <= 15; i++) {
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
            
            localStorage.setItem(`restaurant_menu_${foundBranch.restaurantId}`, JSON.stringify(sampleMenuItems));
            setMenuItems(sampleMenuItems);
            setFilteredItems(sampleMenuItems);
            
            // Extract unique categories
            setCategories(['All', ...new Set(sampleMenuItems.map(item => item.category))]);
          } else {
            setMenuItems(storedMenuItems);
            setFilteredItems(storedMenuItems);
            
            // Extract unique categories
            setCategories(['All', ...new Set(storedMenuItems.map(item => item.category))]);
          }
        }
      } catch (error) {
        console.error('Error fetching branch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Handle model loading states
  useEffect(() => {
    // Initialize loading states for all menu items
    const initialLoadingStates = {};
    menuItems.forEach(item => {
      initialLoadingStates[item.id] = true;
    });
    setModelLoadingStates(initialLoadingStates);
  }, [menuItems]);
  
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
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Handle model load event
  const handleModelLoad = (itemId) => {
    setModelLoadingStates(prev => ({
      ...prev,
      [itemId]: false
    }));
  };
  
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
    localStorage.setItem(`restaurant_menu_${branch.restaurantId}`, JSON.stringify(updatedItems));
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
    localStorage.setItem(`restaurant_menu_${branch.restaurantId}`, JSON.stringify(updatedItems));
    setShowChangeCategory(false);
    
    // Update categories list
    setCategories(['All', ...new Set(updatedItems.map(item => item.category))]);
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // The filtering is handled in the useEffect
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
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
  
  if (!branch || !restaurant) {
    return (
      <MenuViewContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Branch Not Found</h2>
          <p>The branch you are looking for does not exist or has been removed.</p>
          <Button to="/branches" className="primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
            View All Branches
          </Button>
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
      <BackButton to={`/branches/${id}/tables`}>
        <FaArrowLeft /> Back to Tables
      </BackButton>
      
      <Header>
        <TitleSection>
          <Title>
            <FaUtensils />
            {branch.name} Menu
          </Title>
          <Subtitle>
            Manage menu items for {restaurant.name}
          </Subtitle>
        </TitleSection>
        
        <ActionButtons>
          <Button to={`/restaurants/${branch.restaurantId}/menu/new`} className="primary">
            <FaPlus /> Add Menu Item
          </Button>
        </ActionButtons>
      </Header>
      
      {/* Search Bar */}
      <SearchBar>
        <SearchInput 
          type="text" 
          placeholder="Search menu items..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>
          <FaSearch /> Search
        </SearchButton>
      </SearchBar>
      
      {/* Category Tabs */}
      <CategoryTabs>
        {categories.map(category => (
          <CategoryTab 
            key={category}
            active={activeCategory === category.toLowerCase()}
            onClick={() => setActiveCategory(category.toLowerCase())}
          >
            {category}
          </CategoryTab>
        ))}
      </CategoryTabs>
      
      {/* Menu Items Grid */}
      <MenuGrid as={motion.div} variants={containerVariants} initial="hidden" animate="visible">
        {currentItems.length === 0 ? (
          <NoItemsMessage>
            <h3>No menu items found</h3>
            <p>{searchQuery ? 'No results match your search.' : 'There are no menu items in this category.'}</p>
            <ActionButton 
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="primary"
            >
              View All Menu Items
            </ActionButton>
          </NoItemsMessage>
        ) : (
          currentItems.map(item => (
            <MenuItemCard 
              key={item.id}
              variants={itemVariants}
              status={item.status}
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            >
              <StatusBadge status={item.status}>
                {item.status}
              </StatusBadge>
              
              {/* 3D Model Viewer */}
              <ModelViewerContainer>
                <AnimatePresence>
                  {modelLoadingStates[item.id] && (
                    <LoaderOverlay
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <ModelLoaderAnimation />
                    </LoaderOverlay>
                  )}
                </AnimatePresence>
                
                <model-viewer
                  ref={el => modelViewerRefs.current[item.id] = el}
                  src={item.modelUrl}
                  auto-rotate
                  camera-controls="false"
                  disable-zoom
                  disable-pan
                  interaction-prompt="none"
                  style={{ width: '100%', height: '100%' }}
                  onLoad={() => handleModelLoad(item.id)}
                ></model-viewer>
              </ModelViewerContainer>
              
              <MenuItemContent>
                <MenuItemTitle>{item.title}</MenuItemTitle>
                <MenuItemDescription>{item.description}</MenuItemDescription>
                
                <PriceAndCategory>
                  <Price>{item.price}</Price>
                  <Category>{item.category}</Category>
                </PriceAndCategory>
                
                <ActionButtonsContainer>
                  <IconActionButton onClick={() => toggleItemStatus(item.id)} color={item.status === 'active' ? '#F44336' : '#4CAF50'}>
                    {item.status === 'active' ? <FaPause /> : <FaPlay />}
                  </IconActionButton>
                  
                  <IconActionButton onClick={() => openChangeCategoryModal(item)} color="#FFB74D">
                    <FaTags />
                  </IconActionButton>
                  
                  <IconActionButton as={Link} to={`/restaurants/${branch.restaurantId}/menu/${item.id}/edit`} color="#2196F3">
                    <FaEdit />
                  </IconActionButton>
                </ActionButtonsContainer>
              </MenuItemContent>
            </MenuItemCard>
          ))
        )}
      </MenuGrid>
      
      {/* Pagination */}
      {filteredItems.length > itemsPerPage && (
        <Pagination>
          <PaginationNavButton 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </PaginationNavButton>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </PageButton>
          ))}
          
          <PaginationNavButton 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </PaginationNavButton>
        </Pagination>
      )}
      
      {/* Change Category Modal */}
      <AnimatePresence>
        {showChangeCategory && (
          <CategoryActionModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowChangeCategory(false);
            }}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalTitle>Change Category for {selectedItem?.title}</ModalTitle>
              
              <CategoryList>
                {categories
                  .filter(cat => cat !== 'All')
                  .map(category => (
                    <CategoryOption 
                      key={category}
                      selected={selectedItem && selectedItem.category === category}
                      onClick={() => changeItemCategory(category)}
                    >
                      {category}
                    </CategoryOption>
                  ))}
              </CategoryList>
              
              <ModalActions>
                <ActionButton className="secondary" onClick={() => setShowChangeCategory(false)}>
                  Cancel
                </ActionButton>
                <ActionButton className="primary" onClick={() => {
                  // Close modal without changes
                  setShowChangeCategory(false);
                }}>
                  Done
                </ActionButton>
              </ModalActions>
            </ModalContent>
          </CategoryActionModal>
        )}
      </AnimatePresence>
    </MenuViewContainer>
  );
};

export default BranchMenu;