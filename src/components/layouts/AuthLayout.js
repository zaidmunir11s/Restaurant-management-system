import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

const AuthLayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.main};
`;

const ImageSection = styled.div`
  flex: 1;
  background-image: url('https://source.unsplash.com/random?restaurant');
  background-size: cover;
  background-position: center;
  display: none;
  
  @media (min-width: 992px) {
    display: block;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const Logo = styled(motion.div)`
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AuthLayout = () => {
  return (
    <AuthLayoutContainer>
      <ImageSection />
      <ContentSection>
        <Logo
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          🍽️ RestaurantPro
        </Logo>
        <Outlet />
      </ContentSection>
    </AuthLayoutContainer>
  );
};

export default AuthLayout;