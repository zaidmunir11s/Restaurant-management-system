import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaChair, 
  FaSpinner, 
  FaExclamationTriangle,
  FaArrowLeft,
  FaStore,
  FaFilter,
  FaSearch 
} from 'react-icons/fa';

import tableService from '../../services/tableService';
import branchService from '../../services/branchService';

const ComponentContainer = styled(motion.div)`
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
  
  &:hover {
    opacity: 0.9;
  }
`;

const DevelopmentNotice = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  text-align: center;
`;
const TableList = () => {
    const { branchId } = useParams();
    const navigate = useNavigate();
    
    const [tables, setTables] = useState([]);
    const [branch, setBranch] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Load branch, restaurant, and tables
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Fetch branch data
          const fetchedBranch = await branchService.getBranchById(branchId);
          
          if (fetchedBranch) {
            // Ensure consistent id format
            if (fetchedBranch._id && !fetchedBranch.id) {
              fetchedBranch.id = fetchedBranch._id;
            }
            
            setBranch(fetchedBranch);
            
            // Fetch restaurant data
            if (fetchedBranch.restaurantId) {
              const fetchedRestaurant = await branchService.getRestaurantById(fetchedBranch.restaurantId);
              
              // Ensure consistent id format
              if (fetchedRestaurant._id && !fetchedRestaurant.id) {
                fetchedRestaurant.id = fetchedRestaurant._id;
              }
              
              setRestaurant(fetchedRestaurant);
            }
            
            // Fetch tables
            const fetchedTables = await tableService.getTablesByBranch(branchId);
            
            // Ensure consistent id format for each table
            const processedTables = fetchedTables.map(table => {
              if (table._id && !table.id) {
                table.id = table._id;
              }
              return table;
            });
            
            setTables(processedTables);
          } else {
            setError('Branch not found');
          }
        } catch (err) {
          console.error("Error fetching tables data:", err);
          setError(err.message || 'Failed to load tables');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }, [branchId]);
    
    // Filter tables based on status and search query
    const filteredTables = tables
      .filter(table => {
        if (filter === 'all') return true;
        return table.status === filter;
      })
      .filter(table => {
        if (!searchQuery) return true;
        const tableNumber = table.number.toString();
        return tableNumber.includes(searchQuery);
      });
      
    // Handle table status change
    const handleStatusChange = async (tableId, newStatus) => {
      try {
        await tableService.updateTableStatus(tableId, newStatus);
        
        // Update the table in the local state
        const updatedTables = tables.map(table => {
          if (table.id === tableId || table._id === tableId) {
            return { ...table, status: newStatus };
          }
          return table;
        });
        
        setTables(updatedTables);
      } catch (err) {
        console.error("Error updating table status:", err);
        // Display error notification
      }
    };
    
    // Handle table deletion
    const handleDeleteTable = async (tableId) => {
      if (window.confirm('Are you sure you want to delete this table?')) {
        try {
          await tableService.deleteTable(tableId);
          
          // Remove the table from local state
          const updatedTables = tables.filter(table => 
            table.id !== tableId && table._id !== tableId);
          
          setTables(updatedTables);
        } catch (err) {
          console.error("Error deleting table:", err);
          // Display error notification
        }
      }
    };
// Replace ComponentName with the actual component name

  return (
    <ComponentContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>Component Title</Title>
        <AddButton to="/path-to-add">Add New</AddButton>
      </Header>
      
      <DevelopmentNotice>
        <h2>Under Development</h2>
        <p>This component is currently under development.</p>
      </DevelopmentNotice>
    </ComponentContainer>
  );
};

export default TableList;