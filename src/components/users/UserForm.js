import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

// Replace ComponentName with the actual component name
const ComponentName = () => {
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
        <p>This component is currently unm,,m,der development.</p>
      </DevelopmentNotice>
    </ComponentContainer>
  );
};

export default ComponentName;