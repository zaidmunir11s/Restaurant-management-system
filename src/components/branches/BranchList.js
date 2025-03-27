// src/components/branches/BranchList.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaStore, 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaPhone,
  FaFilter,
  FaSearch,
  FaChair,
  FaUtensils,
  FaListAlt,
  FaTableList
} from 'react-icons/fa';

const ListContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BreadcrumbNavigation = styled.div`
  margin-bottom: 2rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
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
  
  &.danger {
    color: ${props => props.theme.colors.error};
    border: 1px solid ${props => props.theme.colors.error};
    
    &:hover {
      background-color: ${props => props.theme.colors.error}10;
    }
  }
`;
const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const RestaurantInfo = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const RestaurantLogo = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.5rem;
  }
`;

const RestaurantDetails = styled.div`
  flex: 1;
`;

const RestaurantName = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const RestaurantMeta = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const RestaurantButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 0.5rem 1rem;
  flex: 1;
  max-width: 400px;
  
  svg {
    color: ${props => props.theme.colors.text.secondary};
    margin-right: 0.5rem;
  }
  
  input {
    border: none;
    background: none;
    outline: none;
    color: ${props => props.theme.colors.text.primary};
    width: 100%;
    font-size: 0.9rem;
    
    &::placeholder {
      color: ${props => props.theme.colors.text.secondary};
    }
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const FilterButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.background.paper};
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
  
  &:hover {
    background: ${props => props.theme.colors.background.main};
  }
`;

const AddButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.small};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => {
      const hexColor = props.theme.colors.primary.replace('#', '');
      const r = parseInt(hexColor.substring(0, 2), 16);
      const g = parseInt(hexColor.substring(2, 4), 16);
      const b = parseInt(hexColor.substring(4, 6), 16);
      return `rgba(${r * 0.9}, ${g * 0.9}, ${b * 0.9}, 1)`;
    }};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  
  h2 {
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
  }
  
  p {
    margin-bottom: 2rem;
    color: ${props => props.theme.colors.text.secondary};
  }
  
  svg {
    font-size: 3rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1.5rem;
  }
`;

const BranchGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const BranchCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  transition: all ${props => props.theme.transitions.short};
  display: flex;
  flex-direction: column;
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.medium};
    transform: translateY(-5px);
  }
`;

const CardImage = styled.div`
  height: 180px;
  background-color: #e0e0e0;
  background-image: url(${props => props.src || 'https://via.placeholder.com/300x180?text=Branch+Image'});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#F44336';
      case 'maintenance':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  }};
  color: white;
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const CardSubtitle = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const CardDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex: 1;
  
  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    svg {
      color: ${props => props.theme.colors.primary};
      font-size: 1rem;
    }
  }
`;

const CardStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.colors.background.main};
`;

const CardStat = styled.div`
  flex: 1;
  text-align: center;
  
  .value {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text.primary};
  }
  
  .label {
    font-size: 0.75rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  border-top: 1px solid ${props => props.theme.colors.background.main};
  padding-top: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.color || props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.9rem;
  transition: background-color ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
  }
`;

const LinkButton = styled(Link)`
  background: none;
  border: none;
  color: ${props => props.color || props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.9rem;
  text-decoration: none;
  transition: background-color ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borderRadius.small};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.active ? props.theme.colors.primary : '#e0e0e0'};
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => props.active ? 'white' : props.theme.colors.primary};
  }
  
  &:disabled {
    color: ${props => props.theme.colors.text.disabled};
    border-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

const BranchList = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      
      try {
        // Load restaurant details
        const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        const foundRestaurant = restaurants.find(r => r.id === parseInt(restaurantId));
        
        if (foundRestaurant) {
          setRestaurant(foundRestaurant);
        } else {
          console.error('Restaurant not found');
          // If restaurant doesn't exist, redirect back to restaurants list
          navigate('/restaurants');
          return;
        }
        
        // Load branches for this restaurant
        const allBranches = JSON.parse(localStorage.getItem('branches') || '[]');
        const restaurantBranches = allBranches.filter(
          branch => branch.restaurantId === parseInt(restaurantId)
        );
        
        setBranches(restaurantBranches);
        setFilteredBranches(restaurantBranches);
        
        // Load tables and menu items to show counts on branch cards
        const allTables = JSON.parse(localStorage.getItem('tables') || '[]');
        setTables(allTables);
        
        const allMenuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        setMenuItems(allMenuItems);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [restaurantId, navigate]);
  
  // Update filtered branches when search or filter changes
  useEffect(() => {
    let result = [...branches];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(branch => 
        branch.name.toLowerCase().includes(lowerSearchTerm) || 
        branch.address.toLowerCase().includes(lowerSearchTerm) ||
        branch.city.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(branch => branch.status === statusFilter);
    }
    
    setFilteredBranches(result);
  }, [branches, searchTerm, statusFilter]);
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this branch? This will also delete all associated tables and menu items.')) {
      try {
        // Filter out the deleted branch
        const updatedBranches = branches.filter(branch => branch.id !== id);
        setBranches(updatedBranches);
        
        // Update localStorage
        const allBranches = JSON.parse(localStorage.getItem('branches') || '[]');
        const remainingBranches = allBranches.filter(branch => branch.id !== id);
        localStorage.setItem('branches', JSON.stringify(remainingBranches));
        
        // Delete associated tables
        const allTables = JSON.parse(localStorage.getItem('tables') || '[]');
        const remainingTables = allTables.filter(table => table.branchId !== id);
        localStorage.setItem('tables', JSON.stringify(remainingTables));
        
        // Delete associated menu items
        const allMenuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        const remainingMenuItems = allMenuItems.filter(item => item.branchId !== id);
        localStorage.setItem('menuItems', JSON.stringify(remainingMenuItems));
        
        // Update state
        setFilteredBranches(updatedBranches.filter(branch => {
          const matchesSearch = !searchTerm || 
            branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.city.toLowerCase().includes(searchTerm.toLowerCase());
            
          const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
          
          return matchesSearch && matchesStatus;
        }));
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };
  
  // Get table count for a branch
  const getTableCount = (branchId) => {
    return tables.filter(table => table.branchId === branchId).length;
  };
  
  // Get menu item count for a branch
  const getMenuItemCount = (branchId) => {
    return menuItems.filter(item => item.branchId === branchId).length;
  };
  
  if (isLoading) {
    return (
      <ListContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <BreadcrumbNavigation>
          <BackLink to="/restaurants">
            <FaArrowLeft /> Back to Restaurants
          </BackLink>
        </BreadcrumbNavigation>
        
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
          <p>Loading branches...</p>
        </div>
      </ListContainer>
    );
  }
  
  return (
    <ListContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <BreadcrumbNavigation>
        <BackLink to={`/restaurants/${restaurantId}`}>
          <FaArrowLeft /> Back to {restaurant?.name || 'Restaurant'}
        </BackLink>
      </BreadcrumbNavigation>
      
      <RestaurantInfo>
        <RestaurantLogo>
          <FaUtensils />
        </RestaurantLogo>
        <RestaurantDetails>
          <RestaurantName>{restaurant?.name}</RestaurantName>
          <RestaurantMeta>
            {restaurant?.cuisine || 'Restaurant'} • {restaurant?.city}, {restaurant?.state}
          </RestaurantMeta>
        </RestaurantDetails>
        <RestaurantButtons>
          <Button to={`/restaurants/${restaurantId}/edit`} className="secondary">
            <FaEdit /> Edit Restaurant
          </Button>
        </RestaurantButtons>
      </RestaurantInfo>
      
      <Header>
        <Title>
          <FaStore /> Branch Locations ({filteredBranches.length})
        </Title>
        <AddButton to={`/restaurants/${restaurantId}/branches/new`}>
          <FaPlus /> Add Branch
        </AddButton>
      </Header>
      
      <ActionBar>
        <SearchBox>
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search branches..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBox>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <FilterButton
            onClick={() => setStatusFilter('all')}
            style={{ 
              backgroundColor: statusFilter === 'all' ? '#f0f0f0' : '',
              fontWeight: statusFilter === 'all' ? '500' : 'normal'
            }}
          >
            <FaFilter /> All
          </FilterButton>
          <FilterButton
            onClick={() => setStatusFilter('active')}
            style={{ 
              backgroundColor: statusFilter === 'active' ? '#4CAF5020' : '',
              fontWeight: statusFilter === 'active' ? '500' : 'normal',
              color: statusFilter === 'active' ? '#4CAF50' : ''
            }}
          >
            Active
          </FilterButton>
          <FilterButton
            onClick={() => setStatusFilter('inactive')}
            style={{ 
              backgroundColor: statusFilter === 'inactive' ? '#F4433620' : '',
              fontWeight: statusFilter === 'inactive' ? '500' : 'normal',
              color: statusFilter === 'inactive' ? '#F44336' : ''
            }}
          >
            Inactive
          </FilterButton>
        </div>
      </ActionBar>
      
      {filteredBranches.length === 0 ? (
        <EmptyState>
          <FaStore />
          <h2>No Branches Found</h2>
          {branches.length === 0 ? (
            <p>Get started by adding your first branch for this restaurant</p>
          ) : (
            <p>No branches match your current search or filter criteria</p>
          )}
          <AddButton to={`/restaurants/${restaurantId}/branches/new`}>
            <FaPlus /> Add Branch
          </AddButton>
        </EmptyState>
      ) : (
        <BranchGrid>
          <AnimatePresence>
            {filteredBranches.map(branch => (
              <BranchCard
                key={branch.id}
                variants={cardVariants}
                exit="exit"
                layout
              >
                <CardImage src={branch.imageUrl}>
                  <StatusBadge status={branch.status}>
                    {branch.status}
                  </StatusBadge>
                </CardImage>
                <CardContent>
                  <CardTitle>{branch.name}</CardTitle>
                  <CardSubtitle>
                    {branch.city}, {branch.state}
                  </CardSubtitle>
                  
                  <CardDetails>
                    <p><FaMapMarkerAlt /> {branch.address}</p>
                    <p><FaPhone /> {branch.phone}</p>
                  </CardDetails>
                  
                  <CardStats>
                    <CardStat>
                      <div className="value">{getTableCount(branch.id)}</div>
                      <div className="label">Tables</div>
                    </CardStat>
                    <CardStat>
                      <div className="value">{getMenuItemCount(branch.id)}</div>
                      <div className="label">Menu Items</div>
                    </CardStat>
                  </CardStats>
                  
                  <CardActions>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <LinkButton 
                        to={`/branches/${branch.id}/menu`}
                        title="Manage Menu"
                      >
                        <FaUtensils />
                      </LinkButton>
                      <LinkButton 
                        to={`/branches/${branch.id}/tables`}
                        title="Manage Tables"
                      >
                        <FaChair />
                      </LinkButton>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <LinkButton 
                        to={`/branches/${branch.id}`}
                        title="View Details"
                      >
                        <FaEye />
                      </LinkButton>
                      <LinkButton 
                        to={`/branches/${branch.id}/edit`}
                        title="Edit Branch"
                      >
                        <FaEdit />
                      </LinkButton>
                      <ActionButton 
                        onClick={() => handleDelete(branch.id)}
                        color="#F44336"
                        title="Delete Branch"
                      >
                        <FaTrash />
                      </ActionButton>
                    </div>
                  </CardActions>
                </CardContent>
              </BranchCard>
            ))}
          </AnimatePresence>
        </BranchGrid>
      )}
      
      {filteredBranches.length > 0 && filteredBranches.length < branches.length && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666' }}>
          Showing {filteredBranches.length} of {branches.length} branches
        </div>
      )}
    </ListContainer>
  );
};

export default BranchList;