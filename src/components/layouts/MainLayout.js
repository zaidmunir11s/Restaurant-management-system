// src/components/layouts/MainLayout.js
import React, { useState, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import Navbar from '../../common/Navbar';
import Sidebar from '../../common/Sidebar';
import Footer from '../../common/Footer';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.colors.background.main};
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

const SidebarContainer = styled(motion.div)`
  width: ${props => props.isExpanded ? '250px' : '70px'};
  flex-shrink: 0;
  transition: width ${props => props.theme.transitions.medium};
  
  @media (max-width: 768px) {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    z-index: 100;
    width: 250px;
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    transition: transform ${props => props.theme.transitions.medium};
  }
`;

const ContentContainer = styled(motion.main)`
  flex: 1;
  padding: 80px 20px 20px;
  transition: margin-left ${props => props.theme.transitions.medium};
  margin-left: ${props => props.sidebarWidth === '250px' ? '0' : '0'};
  
  @media (min-width: 1200px) {
    padding: 80px 40px 40px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

const MainLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <LayoutContainer>
      <Navbar 
        onMenuClick={toggleMobileSidebar} 
        user={currentUser}
      />
      
      <MainContent>
        <SidebarContainer 
          isExpanded={isSidebarExpanded}
          isOpen={isMobileSidebarOpen}
        >
          <Sidebar 
            isExpanded={isSidebarExpanded} 
            toggleSidebar={toggleSidebar}
            userRole={currentUser?.role || 'guest'}
          />
        </SidebarContainer>
        
        <Overlay 
          isOpen={isMobileSidebarOpen}
          onClick={closeMobileSidebar}
          initial={{ opacity: 0 }}
          animate={{ opacity: isMobileSidebarOpen ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <ContentContainer sidebarWidth={isSidebarExpanded ? '250px' : '70px'}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              style={{ minHeight: 'calc(100vh - 180px)' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
          
          <Footer />
        </ContentContainer>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;