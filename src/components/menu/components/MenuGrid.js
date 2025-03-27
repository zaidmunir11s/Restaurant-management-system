// src/components/menu/components/MenuGrid.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import MenuItemCard from './MenuItemCard';
import NoItemsMessage from './NoItemsMessage';

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

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
    transition: { duration: 0.3 }
  }
};

const MenuGrid = ({ 
  items, 
  toggleItemStatus, 
  openChangeCategoryModal, 
  clearFilters,
  searchQuery,
  activeCategory
}) => {
  return (
    <Grid 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible"
    >
      {items.length === 0 ? (
        <NoItemsMessage 
          searchQuery={searchQuery}
          clearFilters={clearFilters}
        />
      ) : (
        items.map(item => (
          <MenuItemCard 
            key={item.id}
            item={item}
            toggleItemStatus={toggleItemStatus}
            openChangeCategoryModal={openChangeCategoryModal}
            variants={itemVariants}
          />
        ))
      )}
    </Grid>
  );
};

export default MenuGrid;