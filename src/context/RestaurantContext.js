// src/context/RestaurantContext.js
import React, { createContext, useState, useEffect } from 'react';
import restaurantService from '../services/restaurantService';

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchRestaurants = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await restaurantService.getAllRestaurants();
      setRestaurants(data);
    } catch (err) {
      setError(err.message || 'Error fetching restaurants');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize data when component mounts
  useEffect(() => {
    fetchRestaurants();
  }, []);
  
  // Create a new restaurant
  const createRestaurant = async (restaurantData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newRestaurant = await restaurantService.createRestaurant(restaurantData);
      setRestaurants([...restaurants, newRestaurant]);
      return newRestaurant;
    } catch (err) {
      setError(err.message || 'Error creating restaurant');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update a restaurant
  const updateRestaurant = async (id, restaurantData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedRestaurant = await restaurantService.updateRestaurant(id, restaurantData);
      
      setRestaurants(restaurants.map(restaurant => 
        restaurant.id === id ? updatedRestaurant : restaurant
      ));
      
      return updatedRestaurant;
    } catch (err) {
      setError(err.message || 'Error updating restaurant');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete a restaurant
  const deleteRestaurant = async (id) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await restaurantService.deleteRestaurant(id);
      setRestaurants(restaurants.filter(restaurant => restaurant.id !== id));
    } catch (err) {
      setError(err.message || 'Error deleting restaurant');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get a single restaurant by ID
  const getRestaurantById = async (id) => {
    // First check if we already have it in state
    const existingRestaurant = restaurants.find(r => r.id === parseInt(id));
    
    if (existingRestaurant) {
      return existingRestaurant;
    }
    
    // Otherwise fetch from API
    setIsLoading(true);
    setError(null);
    
    try {
      const restaurant = await restaurantService.getRestaurantById(id);
      return restaurant;
    } catch (err) {
      setError(err.message || 'Error fetching restaurant');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset error state
  const clearError = () => {
    setError(null);
  };
  
  // Context value
  const value = {
    restaurants,
    isLoading,
    error,
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantById,
    clearError
  };
  
  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
};

export default RestaurantProvider;