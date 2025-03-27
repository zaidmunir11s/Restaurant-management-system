// src/components/pos/components/MenuItemSelector.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUtensils, FaSearch, FaTimes } from 'react-icons/fa';

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.large};
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const SearchBox = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
  position: relative;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border-radius: ${props => props.theme.borderRadius.medium};
    border: 1px solid ${props => props.theme.colors.background.main};
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
  
  svg {
    position: absolute;
    left: 2rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const ItemsContainer = styled.div`
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
`;

const CategorySection = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 0.5rem;
  
  &:not(:first-child) {
    margin-top: 1rem;
  }
`;

const CategoryTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.primary};
  border-bottom: 1px dashed ${props => props.theme.colors.background.main};
  padding-bottom: 0.5rem;
`;

const MenuItem = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.main};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}10;
    transform: translateY(-3px);
    box-shadow: ${props => props.theme.shadows.small};
  }
`;

const ItemImage = styled.div`
  height: 80px;
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: #eee;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  margin-bottom: 0.75rem;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const MenuItemSelector = ({ menuItems, onAddItem, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Group menu items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
  
  // Filter items based on search term
  const filteredCategories = {};
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    Object.keys(groupedItems).forEach(category => {
      const filteredItems = groupedItems[category].filter(item => 
        item.name?.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        category.toLowerCase().includes(term)
      );
      
      if (filteredItems.length > 0) {
        filteredCategories[category] = filteredItems;
      }
    });
  } else {
    Object.assign(filteredCategories, groupedItems);
  }
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>
            <FaUtensils /> Add Menu Items
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <SearchBox>
          <FaSearch />
          <input 
            type="text" 
            placeholder="Search menu items..." 
            value={searchTerm}
            onChange={handleSearchChange}
            autoFocus
          />
        </SearchBox>
        
        <ItemsContainer>
          {Object.keys(filteredCategories).length === 0 ? (
            <EmptyState>
              {searchTerm ? 'No items match your search' : 'No menu items available'}
            </EmptyState>
          ) : (
            Object.keys(filteredCategories).map(category => (
              <React.Fragment key={category}>
                <CategorySection>
                  <CategoryTitle>{category}</CategoryTitle>
                </CategorySection>
                
                {filteredCategories[category].map(item => (
                  <MenuItem 
                    key={item.id}
                    onClick={() => onAddItem(item)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ItemImage image={item.image} />
                    <ItemName>{item.name}</ItemName>
                    <ItemPrice>{formatCurrency(item.price)}</ItemPrice>
                  </MenuItem>
                ))}
              </React.Fragment>
            ))
          )}
        </ItemsContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default MenuItemSelector;