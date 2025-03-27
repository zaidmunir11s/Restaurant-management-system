// src/components/pos/components/TableGrid.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChair, FaSearch, FaFilter, FaClock, FaUsers } from 'react-icons/fa';

const GridContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const GridHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.theme.colors.background.main};
  background-color: ${props => props.theme.colors.background.main};
  color: ${props => props.theme.colors.text.primary};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.background.main};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 0 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 0.9rem;
  }
  
  input {
    border: none;
    background: transparent;
    padding: 0.5rem;
    width: 150px;
    color: ${props => props.theme.colors.text.primary};
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
    }
  }
`;

const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
`;

const Table = styled(motion.div)`
  aspect-ratio: 1/1;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => {
    if (props.selected) return `${props.theme.colors.primary}20`;
    
    switch (props.status) {
      case 'available':
        return '#4CAF5020';
      case 'occupied':
        return '#F4433620';
      case 'reserved':
        return '#FFC10720';
      default:
        return props.theme.colors.background.paper;
    }
  }};
  border: 2px solid ${props => {
    if (props.selected) return props.theme.colors.primary;
    
    switch (props.status) {
      case 'available':
        return '#4CAF50';
      case 'occupied':
        return '#F44336';
      case 'reserved':
        return '#FFC107';
      default:
        return props.theme.colors.background.main;
    }
  }};
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  transition: all ${props => props.theme.transitions.short};
  box-shadow: ${props => props.theme.shadows.small};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const TableNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const TableInfo = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const TableStatus = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => {
    switch (props.status) {
      case 'available':
        return '#4CAF50';
      case 'occupied':
        return '#F44336';
      case 'reserved':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  }};
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.status === 'occupied' ? '#F44336' : props.theme.colors.text.secondary};
  
  svg {
    font-size: 0.75rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  color: ${props => props.theme.colors.text.secondary};
  grid-column: 1 / -1;
`;

const TableGrid = ({ 
  tables, 
  selectedTable, 
  onTableSelect, 
  isLoading 
}) => {
  // State for filters
  const [filters, setFilters] = useState({
    status: 'all',
    section: 'all',
    search: ''
  });
  
  // Apply filters
  const filteredTables = tables.filter(table => {
    // Status filter
    if (filters.status !== 'all' && table.status !== filters.status) return false;
    
    // Section filter
    if (filters.section !== 'all' && table.section !== filters.section) return false;
    
    // Search filter (by table number)
    if (filters.search && !table.number.toString().includes(filters.search)) return false;
    
    return true;
  });
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Calculate time elapsed
  const getTimeElapsed = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };
  
  return (
    <GridContainer>
      <GridHeader>
        <FiltersContainer>
          <FilterSelect 
            name="status" 
            value={filters.status}
            onChange={handleFilterChange}
          >
           <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
          </FilterSelect>
          
          <FilterSelect 
            name="section" 
            value={filters.section}
            onChange={handleFilterChange}
          >
            <option value="all">All Sections</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
          </FilterSelect>
          
          <SearchBox>
            <FaSearch />
            <input 
              type="text" 
              placeholder="Table #"
              name="search"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </SearchBox>
        </FiltersContainer>
      </GridHeader>
      
      <TablesGrid>
        {isLoading ? (
          <EmptyState>Loading tables...</EmptyState>
        ) : filteredTables.length === 0 ? (
          <EmptyState>No tables match your filters</EmptyState>
        ) : (
          filteredTables.map(table => (
            <Table
              key={table.id}
              status={table.status}
              selected={selectedTable?.id === table.id}
              onClick={() => onTableSelect(table)}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <TableStatus status={table.status} />
              <TableNumber>{table.number}</TableNumber>
              <TableInfo>
                <div>{table.section}</div>
                <div><FaUsers size={10} /> {table.capacity}</div>
                {table.status === 'occupied' && table.occupiedSince && (
                  <TimeInfo status="occupied">
                    <FaClock />
                    {getTimeElapsed(table.occupiedSince)}
                  </TimeInfo>
                )}
              </TableInfo>
            </Table>
          ))
        )}
      </TablesGrid>
    </GridContainer>
  );
};

export default TableGrid;