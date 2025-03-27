// src/components/common/Navbar.js
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBars, 
  FaBell, 
  FaSearch, 
  FaMoon, 
  FaSun, 
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaUser
} from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const NavbarContainer = styled(motion.header)`
  background-color: ${props => props.theme.colors.background.paper};
  box-shadow: ${props => props.theme.shadows.small};
  padding: 0 1.5rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`;

const NavLeft = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.25rem;
  cursor: pointer;
  margin-right: 1rem;
  padding: 0.5rem;
  display: flex;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  
  @media (max-width: 992px) {
    width: 200px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.9rem;
  transition: all ${props => props.theme.transitions.short};
  background-color: ${props => props.theme.colors.background.main};
  color: ${props => props.theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.9rem;
  pointer-events: none;
`;

const NavRight = styled.div`
  display: flex;
  align-items: center;
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: 0.5rem;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${props => props.theme.colors.error};
  color: white;
  font-size: 0.7rem;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${props => props.theme.colors.text.primary};
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
  }
`;

const UserAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin-right: 0.5rem;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  display: block;
  
  @media (max-width: 576px) {
    display: none;
  }
`;

const UserName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  min-width: 200px;
  overflow: hidden;
  z-index: 1000;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.text.primary};
  text-decoration: none;
  transition: background-color ${props => props.theme.transitions.short};
  
  svg {
    margin-right: 0.75rem;
    font-size: 1rem;
    color: ${props => props.theme.colors.text.secondary};
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
    color: ${props => props.theme.colors.primary};
    
    svg {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.text.primary};
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitions.short};
  
  svg {
    margin-right: 0.75rem;
    font-size: 1rem;
    color: ${props => props.theme.colors.error};
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
    color: ${props => props.theme.colors.error};
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.colors.background.main};
  margin: 0.25rem 0;
`;

const dropdownVariants = {
  hidden: { 
    opacity: 0, 
    y: -10,
    transition: {
      duration: 0.2
    }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const Navbar = ({ onMenuClick, user }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.firstName) return '?';
    return `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`;
  };
  
  // Format user role for display
  const formatRole = (role) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };
  
  return (
    <NavbarContainer
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <NavLeft>
        <MenuButton
          onClick={onMenuClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaBars />
        </MenuButton>
        
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </NavLeft>
      
      <NavRight>
        <IconButton
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </IconButton>
        
        <IconButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Notifications"
        >
          <FaBell />
          <NotificationBadge>3</NotificationBadge>
        </IconButton>
        
        <UserSection ref={userMenuRef}>
          <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
            <UserAvatar>
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.firstName} />
              ) : (
                getUserInitials()
              )}
            </UserAvatar>
            
            <UserInfo>
              <UserName>{user?.firstName} {user?.lastName}</UserName>
              <UserRole>{formatRole(user?.role)}</UserRole>
            </UserInfo>
          </UserButton>
          
          <AnimatePresence>
            {isUserMenuOpen && (
              <DropdownMenu
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={dropdownVariants}
              >
                <DropdownItem to="/profile">
                  <FaUser />
                  My Profile
                </DropdownItem>
                
                <DropdownItem to="/settings">
                  <FaCog />
                  Settings
                </DropdownItem>
                
                <Divider />
                
                <LogoutButton onClick={handleLogout}>
                  <FaSignOutAlt />
                  Sign Out
                </LogoutButton>
              </DropdownMenu>
            )}
          </AnimatePresence>
        </UserSection>
      </NavRight>
    </NavbarContainer>
  );
};

export default Navbar;