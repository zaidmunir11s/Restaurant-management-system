import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 1rem;
  background-color: ${props => props.theme.colors.background.paper};
  text-align: center;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
  border-top: 1px solid ${props => props.theme.colors.background.main};
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <p>© {currentYear} Restaurant Management System. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;