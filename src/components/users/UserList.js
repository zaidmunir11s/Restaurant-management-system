import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers, FaPlus, FaTrash, FaEdit, FaUserShield, FaUserTie, FaStore,
  FaUtensils, FaUser, FaSearch, FaTimes, FaUserCog, FaUserPlus,
  FaDesktop, FaChair, FaCheckCircle
} from 'react-icons/fa';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import branchService from '../../services/branchService';
import restaurantService from '../../services/restaurantService';

const darkenColor = (hex) => {
    const hexColor = hex.replace('#', '');
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    return `rgba(${r * 0.9}, ${g * 0.9}, ${b * 0.9}, 1)`;
  };
  
  const PageContainer = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  `;
  
  const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  `;
  
  const Title = styled.h1`
    color: ${({ theme }) => theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 2rem;
    svg { font-size: 2rem; color: ${({ theme }) => theme.colors.primary}; }
  `;
  
  const SearchFilterBar = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  `;
  
  const SearchBox = styled.div`
    position: relative;
    flex: 1;
    min-width: 240px;
    max-width: 320px;
    input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.75rem;
      border: 1px solid ${({ theme }) => theme.colors.background.main};
      border-radius: ${({ theme }) => theme.borderRadius.medium};
      background-color: ${({ theme }) => theme.colors.background.paper};
      font-size: 0.9rem;
      transition: border-color 0.2s;
      &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
    }
    svg {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  `;
  
  const FilterSelect = styled.select`
    padding: 0.75rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.background.main};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    background-color: ${({ theme }) => theme.colors.background.paper};
    font-size: 0.9rem;
    transition: border-color 0.2s;
    &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
  `;
  
  const Button = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.colors.text.disabled : theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-weight: 500;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s, transform 0.2s;
    &:hover {
      background-color: ${({ theme }) => darkenColor(theme.colors.primary)};
      transform: translateY(-2px);
    }
  `;
  
  const UsersGrid = styled.div`
    margin-bottom: 2rem;
    overflow-x: auto;
  `;
  
  const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: ${({ theme }) => theme.colors.background.paper};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    overflow: hidden;
    box-shadow: ${({ theme }) => theme.shadows.small};
  `;
  
  const Th = styled.th`
    text-align: left;
    padding: 1rem;
    background-color: ${({ theme }) => theme.colors.background.main};
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text.primary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.background.main};
  `;
  
  const Td = styled.td`
    padding: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.background.main};
    color: ${({ theme }) => theme.colors.text.primary};
    &:last-child { text-align: right; }
  `;
  
  const Tr = styled.tr`
    transition: background-color 0.2s;
    &:hover { background-color: ${({ theme }) => theme.colors.background.main}50; }
    &:last-child td { border-bottom: none; }
  `;
  
  const RoleBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.75rem;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: 0.8rem;
    font-weight: 500;
    ${({ role }) => {
      switch (role) {
        case 'owner':
          return `background-color: #9C27B020; color: #9C27B0;`;
        case 'manager':
          return `background-color: #2196F320; color: #2196F3;`;
        case 'waiter':
          return `background-color: #4CAF5020; color: #4CAF50;`;
        default:
          return `background-color: #90909020; color: #909090;`;
      }
    }}
  `;
  
  const AssignmentBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: ${({ theme }) => theme.borderRadius.small};
    font-size: 0.75rem;
    background-color: ${({ theme }) => theme.colors.background.main};
    color: ${({ theme }) => theme.colors.text.secondary};
    svg { font-size: 0.8rem; color: ${({ theme }) => theme.colors.primary}; }
  `;
  
  const ActionButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme, color }) => color || theme.colors.primary};
    cursor: pointer;
    padding: 0.5rem;
    border-radius: ${({ theme }) => theme.borderRadius.small};
    transition: background-color 0.2s;
    &:hover { background-color: ${({ theme }) => theme.colors.background.main}; }
    &:disabled { color: ${({ theme }) => theme.colors.text.disabled}; cursor: not-allowed; }
  `;
  
  const EmptyState = styled.div`
    text-align: center;
    padding: 3rem;
    background-color: ${({ theme }) => theme.colors.background.paper};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    box-shadow: ${({ theme }) => theme.shadows.small};
    svg { font-size: 3rem; color: ${({ theme }) => theme.colors.background.main}; margin-bottom: 1rem; }
    h2 { margin-bottom: 0.5rem; color: ${({ theme }) => theme.colors.text.primary}; }
    p { color: ${({ theme }) => theme.colors.text.secondary}; margin-bottom: 1.5rem; }
  `;
  
  const Modal = styled(motion.div)`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex; justify-content: center; align-items: center;
    z-index: 100; padding: 1rem;
  `;
  
  const ModalContent = styled(motion.div)`
    background-color: ${({ theme }) => theme.colors.background.paper};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    box-shadow: ${({ theme }) => theme.shadows.large};
    width: 90%; max-width: 600px;
    overflow: hidden;
  `;
  
  const ModalHeader = styled.div`
    padding: 1.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.background.main};
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  
  const ModalTitle = styled.h2`
    margin: 0;
    font-size: 1.2rem;
    display: flex; align-items: center; gap: 0.5rem;
    svg { color: ${({ theme }) => theme.colors.primary}; }
  `;
  
  const CloseButton = styled.button`
    background: none; border: none;
    font-size: 1.2rem; cursor: pointer;
    color: ${({ theme }) => theme.colors.text.secondary};
    &:hover { color: ${({ theme }) => theme.colors.primary}; }
  `;
  
  const ModalBody = styled.div`
    padding: 1.5rem;
  `;
  
  const Form = styled.form`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  `;
  
  const FormGroup = styled.div`
    margin-bottom: 1rem;
    &.full-width { grid-column: 1 / -1; }
  `;
  
  const FormLabel = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text.primary};
  `;
  
  const FormInput = styled.input`
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid ${({ error, theme }) => (error ? theme.colors.error : theme.colors.background.main)};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    background-color: ${({ theme }) => theme.colors.background.paper};
    font-size: 1rem;
    transition: border-color 0.2s;
    &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
  `;
  // New styled components for branch permissions
const BranchPermissionSection = styled.div`
margin-top: 1rem;
padding: 1rem;
background-color: ${({ theme }) => theme.colors.background.main}30;
border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const BranchPermissionTitle = styled.h4`
margin-bottom: 0.75rem;
font-size: 0.95rem;
display: flex;
align-items: center;
gap: 0.5rem;
color: ${({ theme }) => theme.colors.text.primary};
svg {
  color: ${({ theme }) => theme.colors.primary};
}
`;

const BranchList = styled.div`
display: flex;
flex-direction: column;
gap: 0.5rem;
margin-bottom: 1rem;
max-height: 200px;
overflow-y: auto;
padding-right: 0.5rem;

&::-webkit-scrollbar {
  width: 4px;
}

&::-webkit-scrollbar-thumb {
  background-color: ${({ theme }) => theme.colors.primary}50;
  border-radius: 4px;
}
`;

const BranchItem = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding: 0.5rem 0.75rem;
border-radius: ${({ theme }) => theme.borderRadius.small};
background-color: ${({ theme, selected }) => selected ? `${theme.colors.primary}15` : 'transparent'};
border: 1px solid ${({ theme, selected }) => selected ? theme.colors.primary : theme.colors.background.main};
cursor: pointer;
transition: all 0.2s;

&:hover {
  background-color: ${({ theme }) => theme.colors.background.main}50;
}
`;

const BranchName = styled.span`
font-size: 0.85rem;
display: flex;
align-items: center;
gap: 0.5rem;

svg {
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.9rem;
}
`;
  const FormSelect = styled.select`
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid ${({ error, theme }) => (error ? theme.colors.error : theme.colors.background.main)};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    background-color: ${({ theme }) => theme.colors.background.paper};
    font-size: 1rem;
    &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
  `;
  
  const ErrorMessage = styled(motion.p)`
    color: ${({ theme }) => theme.colors.error};
    font-size: 0.8rem;
    margin-top: 0.25rem;
  `;
  
  const ModalFooter = styled.div`
    padding: 1.5rem;
    border-top: 1px solid ${({ theme }) => theme.colors.background.main};
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  `;
  
  const ModalButton = styled.button`
    padding: 0.75rem 1.5rem;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
    &.primary {
      background-color: ${({ theme }) => theme.colors.primary};
      color: white;
      border: none;
      &:hover { background-color: ${({ theme }) => darkenColor(theme.colors.primary)}; }
    }
    &.secondary {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.text.primary};
      border: 1px solid ${({ theme }) => theme.colors.background.main};
      &:hover { background-color: ${({ theme }) => theme.colors.background.main}; }
    }
  `;
  
  const Checkbox = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    input { width: 18px; height: 18px; cursor: pointer; }
    label { font-size: 0.9rem; cursor: pointer; }
  `;
  
  const PermissionSection = styled.div`
    margin-top: 1rem;
    padding: 1rem;
    background-color: ${({ theme }) => theme.colors.background.main}50;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    h3 { margin-bottom: 1rem; font-size: 1rem; color: ${({ theme }) => theme.colors.text.primary}; }
  `;
  const RoleIcon = ({ role }) => {
    switch (role) {
      case 'owner': return <FaUserShield />;
      case 'manager': return <FaUserTie />;
      case 'waiter': return <FaUser />;
      default: return <FaUser />;
    }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };
  
  const UserList = () => {
    const { currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [branches, setBranches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    
    // Enhanced formData with branch-specific permissions
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'waiter',
      restaurantId: '',
      branchId: '',
      permissions: {
        manageUsers: false,
        manageBranches: false,
        manageRestaurants: false,
        accessPOS: true
      },
      // New branch-specific permissions
      branchPermissions: {
        menu: [], // Array of branch IDs where user can manage menus
        tables: [] // Array of branch IDs where user can manage tables
      }
    });
    
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [assignedBranches, setAssignedBranches] = useState([]);
  
    // Load initial data
    useEffect(() => {
      const loadData = async () => {
        setIsLoading(true);
        try {
          // Get users from API
          const fetchedUsers = await userService.getAllUsers();
          
          // Filter out the real owner (current logged-in user if they're an owner)
          const filteredUsers = fetchedUsers.filter(user => {
            // Don't show the current user if they're an owner
            if (currentUser && currentUser.role === 'owner') {
              return user._id !== currentUser._id && user.id !== currentUser.id;
            }
            return true;
          });
          
          setUsers(filteredUsers);
    
          try {
            // Get restaurants from API
            const fetchedRestaurants = await restaurantService.getAllRestaurants();
            setRestaurants(fetchedRestaurants);
            
            // Get all branches from API
            const fetchedBranches = await branchService.getAllBranches();
            setBranches(fetchedBranches);
          } catch (restError) {
            console.error("Error loading restaurants/branches:", restError);
          }
        } catch (error) {
          console.error("Error loading data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }, [currentUser]);
  
    const filteredUsers = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (!searchTerm || fullName.includes(searchLower) || user.email.toLowerCase().includes(searchLower))
        && (roleFilter === 'all' || user.role === roleFilter);
    });
  
    // Update assigned branches when restaurantId or branchId changes
    useEffect(() => {
      if (formData.restaurantId) {
        // For owner and manager roles with restaurant but no specific branch, 
        // all branches of the restaurant are considered "assigned" for permissions
        if (formData.role === 'owner' || 
           (formData.role === 'manager' && !formData.branchId)) {
          const restaurantBranches = branches.filter(b => {
            const branchRestaurantId = b.restaurantId?._id || b.restaurantId;
            return branchRestaurantId === formData.restaurantId;
          });
          setAssignedBranches(restaurantBranches);
        } 
        // For waiters and managers with specific branch, only that branch is considered "assigned"
        else if (formData.branchId) {
          const branch = branches.find(b => (b._id === formData.branchId || b.id === formData.branchId));
          setAssignedBranches(branch ? [branch] : []);
        } else {
          setAssignedBranches([]);
        }
      } else {
        setAssignedBranches([]);
      }
    }, [formData.restaurantId, formData.branchId, formData.role, branches]);
  
    const handleAddUser = () => {
      setSelectedUser(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'waiter',
        restaurantId: restaurants.length > 0 ? (restaurants[0]._id || restaurants[0].id) : '',
        branchId: '',
        permissions: { 
          manageUsers: false, 
          manageRestaurants: false,
          manageBranches: false,
          accessPOS: true
        },
        branchPermissions: {
          menu: [],
          tables: []
        }
      });
      setFormErrors({});
      setShowAddUserModal(true);
    };
  
  // Add this to your handleEditUser function to properly load branch permissions:

const handleEditUser = (user) => {
    setSelectedUser(user);
    
    // Create a copy to avoid modifying the original directly
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '', // Don't populate password for editing
      confirmPassword: '',
      role: user.role || '',
      restaurantId: user.restaurantId || '',
      branchId: user.branchId || '',
      permissions: {
        manageUsers: user.permissions?.manageUsers || false,
        manageRestaurants: user.permissions?.manageRestaurants || false,
        manageBranches: user.permissions?.manageBranches || false,
        accessPOS: user.permissions?.accessPOS || true
      },
      // Make sure to properly load branch permissions from user data
      branchPermissions: {
        menu: Array.isArray(user.branchPermissions?.menu) ? user.branchPermissions.menu : [],
        tables: Array.isArray(user.branchPermissions?.tables) ? user.branchPermissions.tables : []
      }
    });
    setFormErrors({});
    setShowEditUserModal(true);
  };
  
    const handleDeleteUser = (user) => {
      setSelectedUser(user);
      setShowDeleteConfirmation(true);
    };
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      if (name.startsWith('permissions.')) {
        const permissionName = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          permissions: { ...prev.permissions, [permissionName]: checked }
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
    };
  
    const handleRestaurantChange = (e) => {
      const restaurantId = e.target.value;
      setFormData(prev => ({ 
        ...prev, 
        restaurantId, 
        branchId: '',
        // Reset branch-specific permissions when restaurant changes
        branchPermissions: {
          menu: [],
          tables: []
        }
      }));
    };
  
    const handleRoleChange = (e) => {
      const role = e.target.value;
      let permissions;
      switch (role) {
        case 'owner':
          permissions = { 
            manageUsers: true, 
            manageMenu: true, 
            manageTables: true, 
            accessPOS: true,
            manageRestaurants: true,
            manageBranches: true 
          };
          break;
        case 'manager':
          permissions = { 
            manageUsers: false, 
            manageMenu: true, 
            manageTables: true, 
            accessPOS: true,
            manageRestaurants: false,
            manageBranches: true 
          };
          break;
        case 'waiter':
          permissions = { 
            manageUsers: false, 
            manageMenu: false, 
            manageTables: false, 
            accessPOS: true,
            manageRestaurants: false,
            manageBranches: false 
          };
          break;
        default:
          permissions = { 
            manageUsers: false, 
            manageMenu: false, 
            manageTables: false, 
            accessPOS: true,
            manageRestaurants: false,
            manageBranches: false 
          };
      }
      setFormData(prev => ({ ...prev, role, permissions }));
    };
  
    // Toggle menu permission for a specific branch
    const toggleBranchMenuPermission = (branchId) => {
      setFormData(prev => {
        const currentMenuPermissions = [...prev.branchPermissions.menu];
        const index = currentMenuPermissions.indexOf(branchId);
        
        if (index >= 0) {
          // Remove permission
          currentMenuPermissions.splice(index, 1);
        } else {
          // Add permission
          currentMenuPermissions.push(branchId);
        }
        
        return {
          ...prev,
          branchPermissions: {
            ...prev.branchPermissions,
            menu: currentMenuPermissions
          }
        };
      });
    };
  
    // Toggle tables permission for a specific branch
    const toggleBranchTablesPermission = (branchId) => {
      setFormData(prev => {
        const currentTablesPermissions = [...prev.branchPermissions.tables];
        const index = currentTablesPermissions.indexOf(branchId);
        
        if (index >= 0) {
          // Remove permission
          currentTablesPermissions.splice(index, 1);
        } else {
          // Add permission
          currentTablesPermissions.push(branchId);
        }
        
        return {
          ...prev,
          branchPermissions: {
            ...prev.branchPermissions,
            tables: currentTablesPermissions
          }
        };
      });
    };
  
    const validateForm = () => {
      const errors = {};
      if (!formData.firstName) errors.firstName = 'First name is required';
      if (!formData.lastName) errors.lastName = 'Last name is required';
      if (!formData.email) errors.email = 'Email is required';
      
      // Only require password for new users
      if (showAddUserModal && !formData.password) {
        errors.password = 'Password is required for new users';
      }
      
      // Only validate password if it's provided (for edits) or required (for new users)
      if (formData.password) {
        if (formData.password.length < 6) {
          errors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
      }
      
      // Only require restaurant and branch for non-owner roles
      if (['manager', 'waiter'].includes(formData.role)) {
        if (!formData.restaurantId) errors.restaurantId = 'Restaurant is required';
        if (!formData.branchId) errors.branchId = 'Branch is required';
      }
      
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
  
   // In handleSubmit, ensure you're properly handling the returned data:

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Format data for API
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        permissions: {
          manageUsers: Boolean(formData.permissions?.manageUsers),
          manageRestaurants: Boolean(formData.permissions?.manageRestaurants),
          manageBranches: Boolean(formData.permissions?.manageBranches),
          accessPOS: Boolean(formData.permissions?.accessPOS)
        },
        branchPermissions: {
          menu: formData.branchPermissions?.menu || [],
          tables: formData.branchPermissions?.tables || []
        }
      };
      
      console.log("About to save user data:", JSON.stringify(userData, null, 2));
      
      // Add password if provided
      if (formData.password) {
        userData.password = formData.password;
      }
      
      // Add IDs if provided
      if (formData.restaurantId) {
        userData.restaurantId = formData.restaurantId;
      }
      
      if (formData.branchId) {
        userData.branchId = formData.branchId;
      }
      
      let savedUser;
      
      if (showAddUserModal) {
        // Create new user
        savedUser = await userService.createUser(userData);
        console.log("User created:", savedUser);
        
        // Update UI
        if (savedUser) {
          setUsers([...users, savedUser]);
        }
        setShowAddUserModal(false);
      } else if (showEditUserModal && selectedUser) {
        // Update existing user
        const userId = selectedUser._id || selectedUser.id;
        savedUser = await userService.updateUser(userId, userData);
        console.log("User updated:", savedUser);
        
        // Update UI
        if (savedUser) {
          setUsers(users.map(u => 
            (u._id === userId || u.id === userId) ? savedUser : u
          ));
        }
        setShowEditUserModal(false);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setFormErrors({
        general: error.message || 'Failed to save user. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
    const testUserCreation = async () => {
      try {
        // Create a minimal test user
        const testUser = {
          firstName: "Test",
          lastName: "User",
          email: `test${Date.now()}@example.com`, // Ensure unique email
          password: "password123",
          role: "waiter"
        };
        
        console.log('Sending test user:', testUser);
        const response = await userService.createUser(testUser);
        console.log('Test user created successfully:', response);
        
        // Add the user to the list
        setUsers([...users, response]);
        
        alert('Test user created successfully');
      } catch (error) {
        console.error('Test user creation failed:', error);
        alert(`Test failed: ${error.message}`);
      }
    };
  
    const confirmDeleteUser = async () => {
      if (!selectedUser) return;
      
      try {
        // Get the user ID (handling both id and _id formats)
        const userId = selectedUser._id || selectedUser.id;
        
        await userService.deleteUser(userId);
        
        // Remove the deleted user from the users array
        setUsers(users.filter(u => u._id !== userId && u.id !== userId));
        setShowDeleteConfirmation(false);
        setSelectedUser(null);
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    };
  
    const getRestaurantName = (id) => {
      const restaurant = restaurants.find(r => r._id === id || r.id === id);
      return restaurant?.name || 'Unknown';
    };
    
    const getBranchName = (id) => {
      const branch = branches.find(b => b._id === id || b.id === id);
      return branch?.name || 'Unknown';
    };
    
    const getFilteredBranches = () => {
      if (!formData.restaurantId) return [];
      return branches.filter(b => {
        // Handle both _id and id formats
        const branchRestaurantId = b.restaurantId?._id || b.restaurantId;
        return branchRestaurantId === formData.restaurantId;
      });
    };
  
    const canManageUser = (user) => {
      if (!currentUser) return false;
      if (currentUser.role === 'owner') return true;
      if (currentUser.role === 'manager' &&
        currentUser.permissions?.manageUsers &&
        user.role === 'waiter' &&
        user.branchId === currentUser.branchId)
        return true;
      return false;
    };
  
    // Helper to check if a branch has a specific permission
    const hasBranchPermission = (branchId, permissionType) => {
      return formData.branchPermissions[permissionType].includes(branchId);
    };
  
    // Render the list of branches with their permissions
    const renderBranchPermissions = () => {
      if (assignedBranches.length === 0) {
        return (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#666', fontSize: '0.9rem' }}>
            No branches assigned. Please select a restaurant and branch first.
          </div>
        );
      }
  
      return (
        <>
          <BranchPermissionTitle>
            <FaUtensils /> Menu Management Permissions
          </BranchPermissionTitle>
          <BranchList>
            {assignedBranches.map(branch => (
              <BranchItem 
                key={`menu-${branch._id || branch.id}`}
                selected={hasBranchPermission(branch._id || branch.id, 'menu')}
                onClick={() => toggleBranchMenuPermission(branch._id || branch.id)}
              >
                <BranchName>
                  <FaStore /> {branch.name}
                </BranchName>
                {hasBranchPermission(branch._id || branch.id, 'menu') && (
                  <FaCheckCircle color="#4CAF50" />
                )}
              </BranchItem>
            ))}
          </BranchList>
  
          <BranchPermissionTitle>
            <FaChair /> Table Management Permissions
          </BranchPermissionTitle>
          <BranchList>
            {assignedBranches.map(branch => (
              <BranchItem 
                key={`tables-${branch._id || branch.id}`}
                selected={hasBranchPermission(branch._id || branch.id, 'tables')}
                onClick={() => toggleBranchTablesPermission(branch._id || branch.id)}
              >
                <BranchName>
                  <FaStore /> {branch.name}
                </BranchName>
                {hasBranchPermission(branch._id || branch.id, 'tables') && (
                  <FaCheckCircle color="#4CAF50" />
                )}
              </BranchItem>
            ))}
          </BranchList>
        </>
      );
    };
  
    // Helper to get a list of branch names for a permission type
    const getBranchPermissionDisplay = (user, permissionType) => {
      if (!user.branchPermissions || !user.branchPermissions[permissionType] || 
          user.branchPermissions[permissionType].length === 0) {
        return null;
      }
  
      return user.branchPermissions[permissionType].map(branchId => {
        return (
          <AssignmentBadge key={`${permissionType}-${branchId}`} style={{ marginLeft: '0.25rem' }}>
            {permissionType === 'menu' ? <FaUtensils /> : <FaChair />} {getBranchName(branchId)}
          </AssignmentBadge>
        );
      });
    };
  
    return (
      <PageContainer>
        <Header>
          <Title>
            <FaUsers /> User Management
          </Title>
          {currentUser?.role === 'owner' && (
            <Button onClick={handleAddUser}>
              <FaUserPlus /> Add New User
            </Button>
          )}
        </Header>
        
        <SearchFilterBar>
          <SearchBox>
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          <FilterSelect value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="owner">Owners</option>
            <option value="manager">Managers</option>
            <option value="waiter">Waiters</option>
          </FilterSelect>
        </SearchFilterBar>
        
        <UsersGrid>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState>
              <FaUsers />
              <h2>No Users Found</h2>
              <p>
                {searchTerm || roleFilter !== 'all'
                  ? 'No users match your current filters.'
                  : 'There are no users in the system yet.'}
              </p>
              {currentUser?.role === 'owner' && (
                <Button onClick={handleAddUser}>
                  <FaUserPlus /> Add New User
                </Button>
              )}
            </EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Assignment</Th>
                  <Th>Permissions</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <Tr key={user._id || user.id}>
                    <Td>{user.firstName} {user.lastName}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <RoleBadge role={user.role}>
                        <RoleIcon role={user.role} />
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </RoleBadge>
                    </Td>
                    <Td>
                      {user.restaurantId && (
                        <AssignmentBadge>
                          <FaStore /> {getRestaurantName(user.restaurantId)}
                        </AssignmentBadge>
                      )}
                      {user.branchId && (
                        <AssignmentBadge style={{ marginLeft: '0.5rem' }}>
                          <FaUtensils /> {getBranchName(user.branchId)}
                        </AssignmentBadge>
                      )}
                    </Td>
                    <Td>
                      {user.permissions?.manageUsers && (
                        <AssignmentBadge>
                          <FaUserCog /> Users
                        </AssignmentBadge>
                      )}
                      {user.permissions?.manageRestaurants && (
                        <AssignmentBadge style={{ marginLeft: '0.25rem' }}>
                          <FaStore /> Restaurants
                        </AssignmentBadge>
                      )}
                      {user.permissions?.manageBranches && (
                        <AssignmentBadge style={{ marginLeft: '0.25rem' }}>
                          <FaStore /> Branches
                        </AssignmentBadge>
                      )}
                      {/* Display branch-specific permissions */}
                      {getBranchPermissionDisplay(user, 'menu')}
                      {getBranchPermissionDisplay(user, 'tables')}
                      {user.permissions?.accessPOS && (
                        <AssignmentBadge style={{ marginLeft: '0.25rem' }}>
                          <FaDesktop /> POS
                        </AssignmentBadge>
                      )}
                    </Td>
                    <Td>
                      {canManageUser(user) && (
                        <>
                          <ActionButton onClick={() => handleEditUser(user)}>
                            <FaEdit />
                          </ActionButton>
                          {currentUser?.role === 'owner' && (
                            <ActionButton onClick={() => handleDeleteUser(user)}>
                              <FaTrash />
                            </ActionButton>
                          )}
                        </>
                      )}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </Table>
          )}
        </UsersGrid>
        
        {/* User form modal */}
        <AnimatePresence>
          {(showAddUserModal || showEditUserModal) && (
            <Modal
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ModalContent variants={modalVariants} initial="hidden" animate="visible" exit="exit">
                <ModalHeader>
                  <ModalTitle>
                    {showAddUserModal ? <FaUserPlus /> : <FaEdit />}
                    {showAddUserModal ? 'Add New User' : 'Edit User'}
                  </ModalTitle>
                  <CloseButton onClick={() => { 
                    setShowAddUserModal(false);
                    setShowEditUserModal(false);
                  }}>
                    <FaTimes />
                  </CloseButton>
                </ModalHeader>
                <ModalBody>
                  <Form onSubmit={handleSubmit}>
                    {formErrors.general && (
                      <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {formErrors.general}
                      </ErrorMessage>
                    )}
                    
                    <FormGroup>
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <FormInput
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={formErrors.firstName}
                      />
                      {formErrors.firstName && (
                        <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          {formErrors.firstName}
                        </ErrorMessage>
                      )}
                    </FormGroup>
                    <FormGroup>
                   <FormLabel htmlFor="lastName">Last Name</FormLabel>
                   <FormInput
                     type="text"
                     id="lastName"
                     name="lastName"
                     value={formData.lastName}
                     onChange={handleChange}
                     error={formErrors.lastName}
                   />
                   {formErrors.lastName && (
                     <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                       {formErrors.lastName}
                     </ErrorMessage>
                   )}
                 </FormGroup>
                 
                 <FormGroup className="full-width">
                   <FormLabel htmlFor="email">Email</FormLabel>
                   <FormInput
                     type="email"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     error={formErrors.email}
                   />
                   {formErrors.email && (
                     <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                       {formErrors.email}
                     </ErrorMessage>
                   )}
                 </FormGroup>
                 
                 <FormGroup>
                   <FormLabel htmlFor="password">
                     Password {showEditUserModal && "(Leave blank to keep current)"}
                   </FormLabel>
                   <div style={{ position: 'relative' }}>
                     <FormInput
                       type={showPassword ? "text" : "password"}
                       id="password"
                       name="password"
                       value={formData.password}
                       onChange={handleChange}
                       error={formErrors.password}
                     />
                     <button 
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       style={{
                         position: 'absolute',
                         right: '10px',
                         top: '50%',
                         transform: 'translateY(-50%)',
                         background: 'none',
                         border: 'none',
                         cursor: 'pointer',
                         color: '#666'
                       }}
                     >
                       {showPassword ? "Hide" : "Show"}
                     </button>
                   </div>
                   {formErrors.password && (
                     <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                       {formErrors.password}
                     </ErrorMessage>
                   )}
                 </FormGroup>
                 
                 <FormGroup>
                   <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                   <div style={{ position: 'relative' }}>
                     <FormInput
                       type={showPassword ? "text" : "password"}
                       id="confirmPassword"
                       name="confirmPassword"
                       value={formData.confirmPassword}
                       onChange={handleChange}
                       error={formErrors.confirmPassword}
                     />
                   </div>
                   {formErrors.confirmPassword && (
                     <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                       {formErrors.confirmPassword}
                     </ErrorMessage>
                   )}
                 </FormGroup>
                 
                 <FormGroup>
                   <FormLabel htmlFor="role">Role</FormLabel>
                   <FormSelect
                     id="role"
                     name="role"
                     value={formData.role}
                     onChange={(e) => { handleChange(e); handleRoleChange(e); }}
                   >
                     <option value="owner">Owner</option>
                     <option value="manager">Manager</option>
                     <option value="waiter">Waiter</option>
                   </FormSelect>
                 </FormGroup>
                 
                 {['manager', 'waiter'].includes(formData.role) && (
                   <>
                     <FormGroup>
                       <FormLabel htmlFor="restaurantId">Restaurant</FormLabel>
                       <FormSelect
                         id="restaurantId"
                         name="restaurantId"
                         value={formData.restaurantId}
                         onChange={(e) => { handleChange(e); handleRestaurantChange(e); }}
                         error={formErrors.restaurantId}
                       >
                         <option value="">Select Restaurant</option>
                         {restaurants.map(restaurant => (
                           <option key={restaurant._id || restaurant.id} value={restaurant._id || restaurant.id}>
                             {restaurant.name}
                           </option>
                         ))}
                       </FormSelect>
                       {formErrors.restaurantId && (
                         <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                           {formErrors.restaurantId}
                         </ErrorMessage>
                       )}
                     </FormGroup>
                     
                     <FormGroup>
                       <FormLabel htmlFor="branchId">Branch</FormLabel>
                       <FormSelect
                         id="branchId"
                         name="branchId"
                         value={formData.branchId}
                         onChange={handleChange}
                         error={formErrors.branchId}
                       >
                         <option value="">Select Branch</option>
                         {getFilteredBranches().map(branch => (
                           <option key={branch._id || branch.id} value={branch._id || branch.id}>
                             {branch.name}
                           </option>
                         ))}
                       </FormSelect>
                       {formErrors.branchId && (
                         <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                           {formErrors.branchId}
                         </ErrorMessage>
                       )}
                     </FormGroup>
                   </>
                 )}
                 
                 <FormGroup className="full-width">
                   <PermissionSection>
                     <h3>General Permissions</h3>
                     <Checkbox key="manageUsers">
                       <input
                         type="checkbox"
                         name="permissions.manageUsers"
                         checked={formData.permissions.manageUsers}
                         onChange={handleChange}
                       />
                       <label>Manage Users</label>
                     </Checkbox>
                     
                     <Checkbox key="manageRestaurants">
                       <input
                         type="checkbox"
                         name="permissions.manageRestaurants"
                         checked={formData.permissions.manageRestaurants}
                         onChange={handleChange}
                       />
                       <label>Manage Restaurants</label>
                     </Checkbox>
                     
                     <Checkbox key="manageBranches">
                       <input
                         type="checkbox"
                         name="permissions.manageBranches"
                         checked={formData.permissions.manageBranches}
                         onChange={handleChange}
                       />
                       <label>Manage Branches</label>
                     </Checkbox>
                     
                     <Checkbox key="accessPOS">
                       <input
                         type="checkbox"
                         name="permissions.accessPOS"
                         checked={formData.permissions.accessPOS}
                         onChange={handleChange}
                       />
                       <label>Access POS System</label>
                     </Checkbox>
                   </PermissionSection>
                 </FormGroup>
                 
                 {/* Branch-specific permissions section */}
                 {(formData.restaurantId || formData.branchId) && (
                   <FormGroup className="full-width">
                     <BranchPermissionSection>
                       <h3>Branch-Specific Permissions</h3>
                       <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#666' }}>
                         Select which branches this user can manage menus and tables for.
                       </p>
                       {renderBranchPermissions()}
                     </BranchPermissionSection>
                   </FormGroup>
                 )}
                 
                 <ModalFooter>
                   <ModalButton 
                     type="button" 
                     className="secondary" 
                     onClick={() => {
                       setShowAddUserModal(false);
                       setShowEditUserModal(false);
                     }}
                   >
                     Cancel
                   </ModalButton>
                   <ModalButton type="submit" className="primary" disabled={isLoading}>
                     {isLoading ? "Saving..." : (showAddUserModal ? 'Add User' : 'Save Changes')}
                   </ModalButton>
                 </ModalFooter>
               </Form>
             </ModalBody>
           </ModalContent>
         </Modal>
       )}
     </AnimatePresence>
     
     {/* Delete confirmation modal */}
     <AnimatePresence>
       {showDeleteConfirmation && (
         <Modal
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
         >
           <ModalContent variants={modalVariants} initial="hidden" animate="visible" exit="exit">
             <ModalHeader>
               <ModalTitle>
                 <FaTrash /> Delete User
               </ModalTitle>
               <CloseButton onClick={() => setShowDeleteConfirmation(false)}>
                 <FaTimes />
               </CloseButton>
             </ModalHeader>
             <ModalBody>
               <p>
                 Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}?
               </p>
             </ModalBody>
             <ModalFooter>
               <ModalButton type="button" className="secondary" onClick={() => setShowDeleteConfirmation(false)}>
                 Cancel
               </ModalButton>
               <ModalButton type="button" className="primary" onClick={confirmDeleteUser}>
                 Delete
               </ModalButton>
             </ModalFooter>
           </ModalContent>
         </Modal>
       )}
     </AnimatePresence>
     
     {/* Test button */}
     <button onClick={testUserCreation} style={{marginBottom: '1rem'}}>
       Test User Creation
     </button>
   </PageContainer>
 );
};

export default UserList;