// src/components/menu/components/InfoBanner.js
import React from 'react';
import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';

const Banner = styled.div`
  background-color: ${props => props.theme.colors.primary}10;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  
  p {
    color: ${props => props.theme.colors.text.primary};
    font-size: 0.9rem;
    margin: 0;
  }
`;

const InfoBanner = ({ message }) => {
  return (
    <Banner>
      <FaInfoCircle />
      <p>{message}</p>
    </Banner>
  );
};

export default InfoBanner;