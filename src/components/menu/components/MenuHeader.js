// src/components/menu/components/MenuHeader.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaUtensils } from 'react-icons/fa';

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color ${props => props.theme.transitions.short};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Subtitle = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.1rem;
`;

const MenuHeader = ({ title, subtitle, backLink, backText }) => {
  return (
    <>
      <BackButton to={backLink}>
        <FaArrowLeft /> {backText}
      </BackButton>
      
      <Header>
        <TitleSection>
          <Title>
            <FaUtensils />
            {title}
          </Title>
          <Subtitle>
            {subtitle}
          </Subtitle>
        </TitleSection>
      </Header>
    </>
  );
};

export default MenuHeader;