// src/components/menu/components/MenuPagination.js
import React from 'react';
import styled from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PaginationContainer = styled.div`
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

const NavButton = styled.button`
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

const MenuPagination = ({ 
  currentPage, 
  totalPages, 
  paginate, 
  setCurrentPage 
}) => {
  if (totalPages <= 1) return null;

  return (
    <PaginationContainer>
      <NavButton 
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        <FaChevronLeft />
      </NavButton>
      
      {Array.from({ length: totalPages }, (_, i) => (
        <PageButton
          key={i + 1}
          active={currentPage === i + 1}
          onClick={() => paginate(i + 1)}
        >
          {i + 1}
        </PageButton>
      ))}
      
      <NavButton 
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        <FaChevronRight />
      </NavButton>
    </PaginationContainer>
  );
};

export default MenuPagination;