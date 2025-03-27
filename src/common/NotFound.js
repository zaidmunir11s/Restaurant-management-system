import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 6rem;
  margin: 0;
  color: ${props => props.theme.colors.primary};
`;

const Subtitle = styled.h2`
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text.primary};
`;

const Text = styled.p`
  margin-bottom: 2rem;
  max-width: 500px;
  color: ${props => props.theme.colors.text.secondary};
`;

const BackButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 500;
  transition: all ${props => props.theme.transitions.short};
  
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

const NotFound = () => {
  return (
    <NotFoundContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Title>404</Title>
      <Subtitle>Page Not Found</Subtitle>
      <Text>
        The page you are looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </Text>
      <BackButton to="/">Back to Dashboard</BackButton>
    </NotFoundContainer>
  );
};

export default NotFound;