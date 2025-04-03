// src/components/branch-specific/AssignedTables.js
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaChair, FaStore, FaEdit, FaPlus, FaSearch } from 'react-icons/fa';
import tableService from '../../services/tableService';
import branchService from '../../services/branchService';

const PageContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const ActionButton = styled(Link)`
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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const BranchCard = styled(Link)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  padding: 1.5rem;
  text-decoration: none;
  color: ${props => props.theme.colors.text.primary};
  transition: all ${props => props.theme.transitions.short};
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const BranchIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.8rem;
  }
`;

const BranchTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const BranchAddress = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const BranchItems = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  
  span {
    padding: 0.25rem 0.75rem;
    background-color: ${props => props.theme.colors.background.main};
    border-radius: ${props => props.theme.colors.borderRadius.small};
    font-size: 0.8rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const NoAccessMessage = styled.div`
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
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const AssignedTables = () => {
  const { currentUser } = useContext(AuthContext);
  const [assignedBranches, setAssignedBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAssignedBranches = async () => {
      setIsLoading(true);
      
      try {
        if (!currentUser || !currentUser.branchPermissions || !currentUser.branchPermissions.tables) {
          setAssignedBranches([]);
          return;
        }
        
        const branchIds = currentUser.branchPermissions.tables;
        
        // Fetch all branches
        const allBranches = await branchService.getAllBranches();
        
        // Filter to only include branches the user has table permissions for
        const userBranches = allBranches.filter(branch => {
          const branchId = branch._id || branch.id;
          return branchIds.includes(branchId);
        });
        
        setAssignedBranches(userBranches);
      } catch (err) {
        console.error("Error fetching assigned branches:", err);
        setError("Failed to load assigned branches.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAssignedBranches();
  }, [currentUser]);
  
  if (isLoading) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Loading assigned tables...</p>
        </div>
      </PageContainer>
    );
  }
  
  if (!currentUser || !currentUser.branchPermissions || !currentUser.branchPermissions.tables || currentUser.branchPermissions.tables.length === 0) {
    return (
      <PageContainer>
        <Header>
          <Title>
            <FaChair /> Branch Tables
          </Title>
        </Header>
        
        <NoAccessMessage>
          <h2>No Tables Access</h2>
          <p>You don't have permission to manage tables for any branches.</p>
        </NoAccessMessage>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>
          <FaChair /> Branch Tables
        </Title>
      </Header>
      
      <p>You have access to manage tables for the following branches:</p>
      
      <CardGrid>
        {assignedBranches.map(branch => (
          <BranchCard 
            key={branch._id || branch.id} 
            to={`/branches/${branch._id || branch.id}/tables`}
          >
            <BranchIcon>
              <FaStore />
            </BranchIcon>
            <BranchTitle>{branch.name}</BranchTitle>
            <BranchAddress>{branch.address}, {branch.city}</BranchAddress>
            <BranchItems>
              <span>Manage Tables</span>
            </BranchItems>
          </BranchCard>
        ))}
      </CardGrid>
    </PageContainer>
  );
};

export default AssignedTables;