// src/common/Sidebar.js
import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { 
  FaHome, 
  FaUtensils, 
  FaStore, 
  FaClipboardList, 
  FaUsers, 
  FaChartBar, 
  FaPercent, 
  FaChair,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaCashRegister,
  FaMoneyBill,
  FaList,
  FaTh
} from 'react-icons/fa';

const SidebarContainer = styled.div`
  background-color: ${props => props.theme.colors.background.paper};
  height: 100%;
  box-shadow: ${props => props.theme.shadows.small};
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 60px; /* Height of navbar */
  overflow-y: auto;
  transition: width ${props => props.theme.transitions.medium};
  z-index: 10;
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.isExpanded ? 'space-between' : 'center'};
  padding: ${props => props.isExpanded ? '1rem' : '1rem 0'};
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
`;

const Logo = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  
  span {
    margin-left: 0.5rem;
    transition: opacity ${props => props.theme.transitions.short}, 
                transform ${props => props.theme.transitions.short};
    opacity: ${props => props.isExpanded ? 1 : 0};
    transform: translateX(${props => props.isExpanded ? 0 : '-10px'});
  }
`;

const ToggleButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
  }
`;

const NavSection = styled.div`
  margin-top: 1rem;
  padding: ${props => props.isExpanded ? '0 0.5rem' : '0'};
`;

const NavSectionTitle = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: ${props => props.theme.colors.text.secondary};
  margin: 1rem 0 0.5rem;
  padding: ${props => props.isExpanded ? '0 0.5rem' : '0'};
  white-space: nowrap;
  opacity: ${props => props.isExpanded ? 1 : 0};
  transition: opacity ${props => props.theme.transitions.short};
  text-align: ${props => props.isExpanded ? 'left' : 'center'};
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${props => props.isExpanded ? '0.75rem 1rem' : '0.75rem 0'};
  color: ${props => props.theme.colors.text.primary};
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.small};
  margin-bottom: 0.25rem;
  position: relative;
  transition: background-color ${props => props.theme.transitions.short}, 
              color ${props => props.theme.transitions.short};
  justify-content: ${props => props.isExpanded ? 'flex-start' : 'center'};
  
  svg {
    font-size: 1.25rem;
    min-width: ${props => props.isExpanded ? '1.5rem' : 'auto'};
    margin-right: ${props => props.isExpanded ? '0.75rem' : '0'};
    transition: color ${props => props.theme.transitions.short};
  }
  
  span {
    white-space: nowrap;
    opacity: ${props => props.isExpanded ? 1 : 0};
    transition: opacity ${props => props.theme.transitions.short};
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
    color: ${props => props.theme.colors.primary};
  }
  
  &.active {
    background-color: ${props => `${props.theme.colors.primary}10`};
    color: ${props => props.theme.colors.primary};
    font-weight: 500;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background-color: ${props => props.theme.colors.primary};
      border-radius: 0 2px 2px 0;
    }
  }
`;

const Sidebar = ({ isExpanded, toggleSidebar }) => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);
  
  // Check if user has general permission
  const hasPermission = (permission) => {
    if (!currentUser || !currentUser.permissions) return false;
    return Boolean(currentUser.permissions[permission]);
  };
  
  // Check if user has branch-specific permissions
  const hasBranchSpecificPermissions = () => {
    if (!currentUser || !currentUser.branchPermissions) return false;
    
    const hasMenuPermissions = Array.isArray(currentUser.branchPermissions.menu) && 
                              currentUser.branchPermissions.menu.length > 0;
                              
    const hasTablesPermissions = Array.isArray(currentUser.branchPermissions.tables) && 
                                currentUser.branchPermissions.tables.length > 0;
                                
    return hasMenuPermissions || hasTablesPermissions;
  };
  
  // Build navigation items based on user permissions
  const getNavItems = () => {
    if (!currentUser) return [];
    
    const navItems = [];
    
    // Dashboard - always visible
    navItems.push({ 
      path: `/dashboard`, 
      label: 'Dashboard', 
      icon: <FaHome />,
      section: 'main'
    });
    
    // Full restaurant access
    if (currentUser.role === 'owner' || hasPermission('manageRestaurants')) {
      navItems.push({ 
        path: '/restaurants', 
        label: 'Restaurants', 
        icon: <FaUtensils />,
        section: 'main'
      });
    }
    
    // Full branch access
    if (currentUser.role === 'owner' || hasPermission('manageBranches')) {
      navItems.push({ 
        path: '/branches', 
        label: 'Branches', 
        icon: <FaStore />,
        section: 'main'
      });
    }
    
    // Full user management
    if (currentUser.role === 'owner' || hasPermission('manageUsers')) {
      navItems.push({ 
        path: '/users', 
        label: 'Staff', 
        icon: <FaUsers />,
        section: 'main'
      });
    }
    
    // POS access
    if (currentUser.role === 'owner' || hasPermission('accessPOS')) {
      navItems.push({ 
        path: '/pos', 
        label: 'POS System', 
        icon: <FaCashRegister />,
        section: 'main'
      });
    }
    
    // Branch-specific permissions
    if (hasBranchSpecificPermissions()) {
      // Menu permissions for specific branches
      if (currentUser.branchPermissions?.menu && currentUser.branchPermissions.menu.length > 0) {
        navItems.push({ 
          path: '/assigned-menus', 
          label: 'Branch Menus', 
          icon: <FaClipboardList />,
          section: 'branch-specific'
        });
      }
      
      // Table permissions for specific branches
      if (currentUser.branchPermissions?.tables && currentUser.branchPermissions.tables.length > 0) {
        navItems.push({ 
          path: '/assigned-tables', 
          label: 'Branch Tables', 
          icon: <FaChair />,
          section: 'branch-specific'
        });
      }
    }
    
    // Settings - always visible
    navItems.push({ 
      path: '/settings', 
      label: 'Settings', 
      icon: <FaCog />,
      section: 'main'
    });
    
    return navItems;
  };
  
  // Group nav items by section
  const groupedNavItems = () => {
    const items = getNavItems();
    const grouped = {};
    
    items.forEach(item => {
      if (!grouped[item.section]) {
        grouped[item.section] = [];
      }
      grouped[item.section].push(item);
    });
    
    return grouped;
  };
  
  const navItemGroups = groupedNavItems();
  
  return (
    <SidebarContainer>
      <SidebarHeader isExpanded={isExpanded}>
        <Logo isExpanded={isExpanded}>
          <FaUtensils />
          <span>RestaurantPro</span>
        </Logo>
        
        <ToggleButton 
          onClick={toggleSidebar}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
        </ToggleButton>
      </SidebarHeader>
      
      {/* Main Navigation */}
      <NavSection isExpanded={isExpanded}>
        <NavSectionTitle isExpanded={isExpanded}>Main</NavSectionTitle>
        
        {navItemGroups.main && navItemGroups.main.map((item) => (
          <NavItem 
            key={item.path}
            to={item.path}
            isExpanded={isExpanded}
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavItem>
        ))}
      </NavSection>
      
      {/* Branch-specific permissions section */}
      {navItemGroups['branch-specific'] && navItemGroups['branch-specific'].length > 0 && (
        <NavSection isExpanded={isExpanded}>
          <NavSectionTitle isExpanded={isExpanded}>Branch Access</NavSectionTitle>
          
          {navItemGroups['branch-specific'].map((item) => (
            <NavItem 
              key={item.path}
              to={item.path}
              isExpanded={isExpanded}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavItem>
          ))}
        </NavSection>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;