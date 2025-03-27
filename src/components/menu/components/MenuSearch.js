// src/components/menu/components/MenuSearch.js
import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const SearchContainer = styled.div`
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

const MenuSearch = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <SearchContainer>
      <SearchInput 
        type="text" 
        placeholder="Search menu items..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <SearchButton onClick={handleSearch}>
        <FaSearch /> Search
      </SearchButton>
    </SearchContainer>
  );
};

export default MenuSearch;