// src/components/restaurants/RestaurantDetail.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe, 
  FaUtensils,
  FaStore,
  FaListAlt,
  FaUsers,
  FaStar,
  FaChair,
  FaPlus
} from 'react-icons/fa';
import restaurantService from '../../services/restaurantService';

import branchService from '../../services/branchService';

const DetailContainer = styled(motion.div)`
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 1rem;
  
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

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
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
  
  &.danger {
    color: ${props => props.theme.colors.error};
    border: 1px solid ${props => props.theme.colors.error};
    
    &:hover {
      background-color: ${props => props.theme.colors.error}10;
    }
  }
  
  @media (max-width: 480px) {
    flex: 1;
    justify-content: center;
  }
`;

const DeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all ${props => props.theme.transitions.short};
  background: none;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.error}10;
  }
  
  @media (max-width: 480px) {
    flex: 1;
    justify-content: center;
  }
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.medium};
  position: relative;
  aspect-ratio: 16 / 9;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const CuisineTag = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;
const MenuCard = styled(Link)`
  position: relative;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 2rem 1.5rem;
  text-decoration: none;
  color: white;
  transition: all ${props => props.theme.transitions.short};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, ${props => props.theme.colors.primary}, ${props => `${props.theme.colors.primary}CC`});
    z-index: 1;
  }
  
  .card-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  svg {
    font-size: 3rem;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  p {
    font-size: 1rem;
    opacity: 0.9;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.large};
  }
`;
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: ${props => props.theme.colors.background.paper};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
`;

const InfoLabel = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const InfoValue = styled.div`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.6;
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.1rem;
  }
`;

const Description = styled.div`
  background-color: ${props => props.theme.colors.background.paper};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
    font-weight: 600;
  }
  
  p {
    line-height: 1.6;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const ModuleCard = styled(Link)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  padding: 1.5rem;
  text-decoration: none;
  color: ${props => props.theme.colors.text.primary};
  transition: all ${props => props.theme.transitions.short};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  
  svg {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primary};
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  p {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 0.9rem;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  margin: 2rem 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
  
  &:after {
    content: '';
    display: block;
    height: 1px;
    background-color: ${props => props.theme.colors.background.main};
    flex: 1;
    margin-left: 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  
  h2 {
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
  }
  
  p {
    margin-bottom: 2rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const StatCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
  text-align: center;
  
  .icon {
    font-size: 1.8rem;
    color: ${props => props.color || props.theme.colors.primary};
    margin-bottom: 0.75rem;
  }
  
  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const BranchesList = styled.div`
  margin-top: 1rem;
`;

const BranchSummary = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: 1rem;
  background-color: ${props => props.theme.colors.background.paper};
  box-shadow: ${props => props.theme.shadows.small};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    transform: translateX(5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const BranchIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const BranchInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 1rem;
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.25rem;
  }
  
  p {
    font-size: 0.85rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const BranchStatus = styled.div`
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

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
// In RestaurantDetail.js
useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Get restaurant from API
        const fetchedRestaurant = await restaurantService.getRestaurantById(id);
        
        // Ensure consistent id property
        if (fetchedRestaurant._id && !fetchedRestaurant.id) {
          fetchedRestaurant.id = fetchedRestaurant._id;
        }
        
        setRestaurant(fetchedRestaurant);
        
        // Get branches for this restaurant from API
        const restaurantBranches = await branchService.getAllBranches(id);
        
        // Ensure consistent id properties for branches
        const processedBranches = restaurantBranches.map(branch => {
          if (branch._id && !branch.id) {
            branch.id = branch._id;
          }
          return branch;
        });
        
        setBranches(processedBranches);
      } catch (error) {
        console.error('Error fetching restaurant details:', error);
        setError(error.message || 'Error loading restaurant details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this restaurant? This will also delete all associated branches.')) {
      try {
        // Get current restaurants and branches
        const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        const branches = JSON.parse(localStorage.getItem('branches') || '[]');
        
        // Filter out the deleted restaurant
        const updatedRestaurants = restaurants.filter(r => r.id !== parseInt(id));
        
        // Filter out branches associated with this restaurant
        const updatedBranches = branches.filter(b => b.restaurantId !== parseInt(id));
        
        // Update localStorage
        localStorage.setItem('restaurants', JSON.stringify(updatedRestaurants));
        localStorage.setItem('branches', JSON.stringify(updatedBranches));
        
        // Navigate back to list
        navigate('/restaurants');
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <DetailContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <BackButton to="/restaurants">
          <FaArrowLeft /> Back to Restaurants
        </BackButton>
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
          <p>Loading restaurant details...</p>
        </div>
      </DetailContainer>
    );
  }
  
  if (error || !restaurant) {
    return (
      <DetailContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <BackButton to="/restaurants">
          <FaArrowLeft /> Back to Restaurants
        </BackButton>
        <NoDataMessage>
          <h2>Restaurant Not Found</h2>
          <p>{error || 'The restaurant you are looking for does not exist or has been removed.'}</p>
          <Button to="/restaurants" className="primary">
            View All Restaurants
          </Button>
        </NoDataMessage>
      </DetailContainer>
    );
  }
  
  return (
    <DetailContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BackButton to="/restaurants">
        <FaArrowLeft /> Back to Restaurants
      </BackButton>
      
      <Header>
        <TitleSection>
          <Title>
            <FaUtensils />
            {restaurant.name}
            <StatusBadge status={restaurant.status}>
              {restaurant.status || 'Active'}
            </StatusBadge>
          </Title>
          <Subtitle>
            {restaurant.city}, {restaurant.state}
          </Subtitle>
        </TitleSection>
        
        <ActionButtons>
          <Button to={`/restaurants/${id}/edit`} className="primary">
            <FaEdit /> Edit
          </Button>
          <Button to={`/restaurants/${id}/branches`} className="secondary">
            <FaStore /> Branches ({branches.length})
          </Button>
          <DeleteButton onClick={handleDelete} className="danger">
            <FaTrash /> Delete
          </DeleteButton>
        </ActionButtons>
        <MenuCard to={`/restaurants/${id}/menu`}>
  <div className="card-content">
    <FaUtensils />
    <h3>Restaurant Menu</h3>
    <p>View and manage the entire menu catalog for all branches</p>
  </div>
</MenuCard>
      </Header>
      
      <Content>
        <ImageSection>
          <img 
            src={restaurant.imageUrl || 'https://via.placeholder.com/800x450?text=Restaurant+Image'} 
            alt={restaurant.name} 
          />
          {restaurant.cuisine && (
            <CuisineTag>
              <FaUtensils /> {restaurant.cuisine}
            </CuisineTag>
          )}
        </ImageSection>
        
        <InfoSection>
          <InfoGroup>
            <InfoLabel>
              <FaMapMarkerAlt /> Location
            </InfoLabel>
            <InfoValue>
              {restaurant.address}<br />
              {restaurant.city}, {restaurant.state} {restaurant.zipCode}
            </InfoValue>
          </InfoGroup>
          
          <InfoGroup>
            <InfoLabel>
              <FaPhone /> Contact Information
            </InfoLabel>
            <InfoItem>
              <FaPhone />
              <InfoValue>{restaurant.phone}</InfoValue>
            </InfoItem>
            {restaurant.email && (
              <InfoItem>
                <FaEnvelope />
                <InfoValue>
                  <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
                </InfoValue>
              </InfoItem>
            )}
            {restaurant.website && (
              <InfoItem>
                <FaGlobe />
                <InfoValue>
                  <a 
                    href={restaurant.website.startsWith('http') ? restaurant.website : `http://${restaurant.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {restaurant.website}
                  </a>
                </InfoValue>
              </InfoItem>
            )}
          </InfoGroup>
        </InfoSection>
      </Content>
      
      {restaurant.description && (
        <Description>
          <h3>About {restaurant.name}</h3>
          <p>{restaurant.description}</p>
        </Description>
      )}
      
      <StatCards>
        <StatCard>
          <div className="icon">
            <FaStore />
          </div>
          <div className="value">{branches.length}</div>
          <div className="label">Branches</div>
        </StatCard>
        
        <StatCard color="#2196F3">
          <div className="icon" style={{ color: '#2196F3' }}>
            <FaUsers />
          </div>
          <div className="value">{branches.length > 0 ? branches.length * 5 : 0}</div>
          <div className="label">Employees</div>
        </StatCard>
        
        <StatCard color="#8BC34A">
          <div className="icon" style={{ color: '#8BC34A' }}>
            <FaListAlt />
          </div>
          <div className="value">{branches.length > 0 ? branches.length * 12 : 0}</div>
          <div className="label">Menu Items</div>
        </StatCard>
        
        <StatCard color="#9C27B0">
          <div className="icon" style={{ color: '#9C27B0' }}>
            <FaChair />
          </div>
          <div className="value">{branches.reduce((sum, branch) => sum + (branch.tableCount || 10), 0)}</div>
          <div className="label">Total Tables</div>
        </StatCard>
      </StatCards>
      
      <SectionHeader>
        <SectionTitle>
          <FaStore /> Branches
        </SectionTitle>
        <Button to={`/restaurants/${id}/branches/new`} className="primary">
          <FaPlus /> Add Branch
        </Button>
      </SectionHeader>
      
      {branches.length === 0 ? (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p>No branches have been added yet.</p>
          <Button to={`/restaurants/${id}/branches/new`} className="primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
            Add First Branch
          </Button>
        </div>
      ) : (
        <BranchesList>
          {branches.map(branch => (
            <BranchSummary to={`/branches/${branch.id}`} key={branch.id}>
              <BranchIcon>
                <FaStore />
              </BranchIcon>
              <BranchInfo>
                <h3>{branch.name}</h3>
                <p>{branch.address}, {branch.city}</p>
              </BranchInfo>
              <BranchStatus status={branch.status}>
                {branch.status}
              </BranchStatus>
            </BranchSummary>
          ))}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Button to={`/restaurants/${id}/branches`} className="secondary">
              Manage All Branches
            </Button>
          </div>
        </BranchesList>
      )}
      
      <SectionTitle>
        <FaListAlt /> Management
      </SectionTitle>
      
      <ModulesGrid>
        <ModuleCard to={`/restaurants/${id}/branches`}>
          <FaStore />
          <h3>Branch Management</h3>
          <p>Add and manage restaurant branches</p>
        </ModuleCard>
        
        <ModuleCard to={`/restaurants/${id}/branches`}>
          <FaListAlt />
          <h3>Menu Management</h3>
          <p>Create and edit menu items</p>
        </ModuleCard>
        
        <ModuleCard to={`/users`}>
          <FaUsers />
          <h3>Staff Management</h3>
          <p>Manage restaurant staff and roles</p>
        </ModuleCard>
      </ModulesGrid>
    </DetailContainer>
  );
};

export default RestaurantDetail;