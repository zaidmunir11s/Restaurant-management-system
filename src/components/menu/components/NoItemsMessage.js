// src/components/menu/components/NoItemsMessage.js
import React from 'react';
import styled from 'styled-components';

const Message = styled.div`
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

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  
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

const NoItemsMessage = ({ searchQuery, clearFilters }) => {
  return (
    <Message>
      <h3>No menu items found</h3>
      <p>
        {searchQuery 
          ? 'No results match your search.' 
          : 'There are no menu items in this category.'}
      </p>
      <ActionButton onClick={clearFilters}>
        View All Menu Items
      </ActionButton>
    </Message>
  );
};

export default NoItemsMessage;