// src/components/restaurants/RestaurantList.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaUtensils } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import restaurantService from '../../services/restaurantService';

const ListContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const RestaurantGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const RestaurantCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    box-shadow: ${props => props.theme.shadows.medium};
    transform: translateY(-5px);
  }
`;

const CardImage = styled.div`
  height: 180px;
  background-color: #e0e0e0;
  background-image: url(${props => props.src || 'https://via.placeholder.com/300x180?text=Restaurant+Image'});
  background-size: cover;
  background-position: center;
`;

const CardContent = styled.div`
  padding: 1.5rem;
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
  
  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  border-top: 1px solid ${props => props.theme.colors.background.main};
  padding-top: 1rem;
  margin-top: 0.5rem;
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

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useContext(AuthContext);
    
    useEffect(() => {
      // Load restaurants from API
      const loadRestaurants = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
          const fetchedRestaurants = await restaurantService.getAllRestaurants();
          console.log('Fetched restaurants:', fetchedRestaurants);
          setRestaurants(fetchedRestaurants);
        } catch (err) {
          console.error('Error loading restaurants:', err);
          setError(err.message || 'Failed to load restaurants');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadRestaurants();
    }, []);
  
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this restaurant?')) {
          try {
            // Call API to delete restaurant
            await restaurantService.deleteRestaurant(id);
            
            // Update state to remove the deleted restaurant
            setRestaurants(restaurants.filter(restaurant => restaurant._id !== id));
          } catch (err) {
            console.error('Error deleting restaurant:', err);
            setError(err.message || 'Failed to delete restaurant');
          }
        }
      };
  
  if (isLoading) {
    return (
      <ListContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Header>
          <Title>
            <FaUtensils /> Your Restaurants
          </Title>
        </Header>
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
            <p>Loading restaurants...</p>
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
          <Header>
            <Title>
              <FaUtensils /> Your Restaurants
            </Title>
            {currentUser?.role === 'owner' && (
              <AddButton to="/restaurants/new">
                <FaPlus /> Add Restaurant
              </AddButton>
            )}
          </Header>
          
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '50%', 
                  border: '3px solid #e0e0e0',
                  borderTopColor: '#FF5722',
                  margin: '0 auto 1rem' 
                }}
              />
              <p>Loading restaurants...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                style={{ 
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#FF5722',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
          ) : restaurants.length === 0 ? (
            <EmptyState>
              <FaUtensils />
              <h2>No Restaurants Yet</h2>
              <p>Get started by adding your first restaurant</p>
              <AddButton to="/restaurants/new">
                <FaPlus /> Add Restaurant
              </AddButton>
            </EmptyState>
          ) : (
            <RestaurantGrid>
              <AnimatePresence>
                {restaurants.map(restaurant => (
                  <RestaurantCard
                    key={restaurant._id}
                    variants={cardVariants}
                    exit="exit"
                    layout
                  >
                    <CardImage src={restaurant.imageUrl} />
                    <CardContent>
                      <CardTitle>{restaurant.name}</CardTitle>
                      <CardSubtitle>{restaurant.cuisine || 'Restaurant'} • {restaurant.city}, {restaurant.state}</CardSubtitle>
                      
                      <CardDetails>
                        <p>{restaurant.address}</p>
                        <p>{restaurant.phone}</p>
                      </CardDetails>
                      
                      <CardActions>
                        <ActionButton 
                          as={Link} 
                          to={`/restaurants/${restaurant._id}`}
                        >
                          <FaEye /> View
                        </ActionButton>
                        {currentUser?.role === 'owner' && (
                          <>
                            <ActionButton 
                              as={Link} 
                              to={`/restaurants/${restaurant._id}/edit`}
                            >
                              <FaEdit /> Edit
                            </ActionButton>
                            <ActionButton 
                              onClick={() => handleDelete(restaurant._id)}
                              color="#F44336"
                            >
                              <FaTrash /> Delete
                            </ActionButton>
                          </>
                        )}
                      </CardActions>
                    </CardContent>
                  </RestaurantCard>
                ))}
              </AnimatePresence>
            </RestaurantGrid>
          )}
        </ListContainer>
      );
    };
  export default RestaurantList;