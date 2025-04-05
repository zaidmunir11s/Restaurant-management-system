// src/components/users/UserForm.js
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import branchService from '../../services/branchService';
import restaurantService from '../../services/restaurantService';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaStore, FaCheck, FaTimes, FaUserCog, FaUtensils, FaChair, FaCheckCircle } from 'react-icons/fa';

// Styled components for the form
const FormContainer = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ error, theme }) => (error ? theme.colors.error : theme.colors.background.main)};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.background.paper};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ error, theme }) => (error ? theme.colors.error : theme.colors.background.main)};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.background.paper};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ErrorMessage = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const PermissionSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.colors.background.main}50;
  border-radius: ${props => props.theme.borderRadius.medium};
  
  h3 {
    margin-bottom: 1rem;
    font-size: 1rem;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }
  
  label {
    cursor: pointer;
    font-size: 0.9rem;
    color: ${props => props.theme.colors.text.primary};
  }
`;

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    
    &:hover {
      opacity: 0.9;
    }
    
    &:disabled {
      background-color: ${props => props.theme.colors.text.disabled};
      cursor: not-allowed;
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: ${props => props.theme.colors.text.primary};
    border: 1px solid ${props => props.theme.colors.background.main};
    
    &:hover {
      background-color: ${props => props.theme.colors.background.main};
    }
  }
`;

const UserForm = ({ initialData, onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const [branches, setBranches] = useState([]);
  const [assignedBranches, setAssignedBranches] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  
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
      manageRestaurants: false,
      manageBranches: false,
      accessPOS: true
    },
    branchPermissions: {
      menu: [],
      tables: []
    }
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine if we're in edit mode
  const isEditMode = Boolean(initialData);
  
  // Load initial data and dependencies
  // In UserForm.js - update the useEffect for loading data

useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // STEP 1: Load restaurants with more robust error handling
        try {
          console.log("Fetching restaurants...");
          const fetchedRestaurants = await restaurantService.getAllRestaurants();
          console.log("Fetched restaurants:", fetchedRestaurants);
          
          if (fetchedRestaurants && fetchedRestaurants.length > 0) {
            setRestaurants(fetchedRestaurants);
            
            // For new users, preselect the first restaurant if none is already selected
            if (!initialData && !formData.restaurantId) {
              setFormData(prev => ({
                ...prev,
                restaurantId: fetchedRestaurants[0]._id || fetchedRestaurants[0].id
              }));
            }
          } else {
            console.warn("No restaurants were fetched");
            setErrors(prev => ({ ...prev, restaurantError: "No restaurants found" }));
          }
        } catch (restaurantError) {
          console.error("Error loading restaurants:", restaurantError);
          setErrors(prev => ({ ...prev, restaurantError: "Failed to load restaurants" }));
        }
        
        // STEP 2: Load branches with more robust error handling
        try {
          console.log("Fetching branches...");
          // Get all branches regardless of restaurant
          const fetchedBranches = await branchService.getAllBranches();
          console.log("Fetched branches:", fetchedBranches);
          
          if (fetchedBranches && fetchedBranches.length > 0) {
            setBranches(fetchedBranches);
          } else {
            console.warn("No branches were fetched");
          }
        } catch (branchError) {
          console.error("Error loading branches:", branchError);
          setErrors(prev => ({ ...prev, branchError: "Failed to load branches" }));
        }
        
        // STEP 3: If editing, populate the form with user data
        if (initialData) {
          setFormData({
            firstName: initialData.firstName || '',
            lastName: initialData.lastName || '',
            email: initialData.email || '',
            password: '',
            confirmPassword: '',
            role: initialData.role || 'waiter',
            restaurantId: initialData.restaurantId || '',
            branchId: initialData.branchId || '',
            permissions: {
              manageUsers: initialData.permissions?.manageUsers || false,
              manageRestaurants: initialData.permissions?.manageRestaurants || false,
              manageBranches: initialData.permissions?.manageBranches || false,
              accessPOS: initialData.permissions?.accessPOS || true
            },
            branchPermissions: {
              menu: Array.isArray(initialData.branchPermissions?.menu) ? 
                initialData.branchPermissions.menu : [],
              tables: Array.isArray(initialData.branchPermissions?.tables) ? 
                initialData.branchPermissions.tables : []
            }
          });
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setErrors({ general: "Failed to load data" });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [initialData]);
  
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
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('permissions.')) {
      const permissionName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        permissions: { ...prev.permissions, [permissionName]: checked }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
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
          manageRestaurants: true,
          manageBranches: true,
          accessPOS: true
        };
        break;
      case 'manager':
        permissions = { 
          manageUsers: false, 
          manageRestaurants: false,
          manageBranches: true,
          accessPOS: true
        };
        break;
      case 'waiter':
        permissions = { 
          manageUsers: false, 
          manageRestaurants: false,
          manageBranches: false,
          accessPOS: true
        };
        break;
      default:
        permissions = { 
          manageUsers: false, 
          manageRestaurants: false,
          manageBranches: false,
          accessPOS: false
        };
    }
    
    setFormData(prev => ({ 
      ...prev, 
      role, 
      permissions,
      // Reset branch-specific permissions when role changes
      branchPermissions: {
        menu: [],
        tables: []
      }
    }));
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
  
  // Helper to check if a branch has a specific permission
  const hasBranchPermission = (branchId, permissionType) => {
    return formData.branchPermissions[permissionType].includes(branchId);
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    
    // Password is required for new users
    if (!isEditMode && !formData.password) {
      newErrors.password = "Password is required for new users";
    }
    
    // Password validation
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    // Restaurant is required
    if (!formData.restaurantId) {
      newErrors.restaurantId = "Restaurant is required";
    }
    
    // Branch is required for waiters
    if (formData.role === 'waiter' && !formData.branchId) {
      newErrors.branchId = "Branch is required for waiters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Prepare data for submission
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        permissions: formData.permissions,
        branchPermissions: formData.branchPermissions
      };
      
      // Only include password if provided (for new users or password changes)
      if (formData.password) {
        userData.password = formData.password;
      }
      
      // Include restaurant and branch IDs if provided
      if (formData.restaurantId) {
        userData.restaurantId = formData.restaurantId;
      }
      
      if (formData.branchId) {
        userData.branchId = formData.branchId;
      }
      
      // Submit data
      await onSubmit(userData);
      
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({
        general: error.message || 'Failed to save user. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render branch permissions section
  const renderBranchPermissions = () => {
    if (assignedBranches.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#666', fontSize: '0.9rem' }}>
          No branches assigned. Please select a restaurant{formData.role === 'waiter' ? ' and branch' : ''} first.
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
  
  if (isLoading && !initialData) {
    return <div>Loading...</div>;
  }
  
  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FormTitle>
        <FaUser />
        {isEditMode ? 'Edit User' : 'Create New User'}
      </FormTitle>
      
      {errors.general && (
        <ErrorMessage>{errors.general}</ErrorMessage>
      )}
      
      <form onSubmit={handleSubmit}>
        <FormGrid>
          <FormGroup>
            <FormLabel htmlFor="firstName">
              <FaUser /> First Name
            </FormLabel>
            <FormInput
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            {errors.firstName && (
              <ErrorMessage>{errors.firstName}</ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="lastName">
              <FaUser /> Last Name
            </FormLabel>
            <FormInput
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
            />
            {errors.lastName && (
              <ErrorMessage>{errors.lastName}</ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup className="full-width">
            <FormLabel htmlFor="email">
              <FaEnvelope /> Email
            </FormLabel>
            <FormInput
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            {errors.email && (
              <ErrorMessage>{errors.email}</ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="password">
              <FaLock /> Password {isEditMode && "(Leave blank to keep current)"}
            </FormLabel>
            <div style={{ position: 'relative' }}>
              <FormInput
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
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
            {errors.password && (
              <ErrorMessage>{errors.password}</ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="confirmPassword">
              <FaLock /> Confirm Password
            </FormLabel>
            <FormInput
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="role">
              <FaUserCog /> Role
            </FormLabel>
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
          
          // Add this to the JSX in UserForm.js where the restaurant dropdown is rendered
<FormGroup>
  <FormLabel htmlFor="restaurantId">
    <FaBuilding /> Restaurant {restaurants.length === 0 && "(No restaurants available)"}
  </FormLabel>
  <FormSelect
    id="restaurantId"
    name="restaurantId"
    value={formData.restaurantId}
    onChange={(e) => { handleChange(e); handleRestaurantChange(e); }}
    error={errors.restaurantId}
  >
    <option value="">Select Restaurant</option>
    {restaurants.map(restaurant => (
      <option key={restaurant._id || restaurant.id} value={restaurant._id || restaurant.id}>
        {restaurant.name}
      </option>
    ))}
  </FormSelect>
  {errors.restaurantId && (
    <ErrorMessage>{errors.restaurantId}</ErrorMessage>
  )}
  {errors.restaurantError && (
    <ErrorMessage>{errors.restaurantError}</ErrorMessage>
  )}
  {restaurants.length === 0 && (
    <ErrorMessage>
      No restaurants available. Please check network connection or permissions.
    </ErrorMessage>
  )}
</FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="branchId">
              <FaStore /> Branch
            </FormLabel>
            <FormSelect
              id="branchId"
              name="branchId"
              value={formData.branchId}
              onChange={handleChange}
              error={errors.branchId}
              disabled={!formData.restaurantId}
            >
              <option value="">Select Branch</option>
              {branches
                .filter(branch => {
                  const branchRestaurantId = branch.restaurantId?._id || branch.restaurantId;
                  return branchRestaurantId === formData.restaurantId;
                })
                .map(branch => (
                  <option key={branch._id || branch.id} value={branch._id || branch.id}>
                    {branch.name}
                  </option>
                ))
              }
            </FormSelect>
            {errors.branchId && (
              <ErrorMessage>{errors.branchId}</ErrorMessage>
            )}
          </FormGroup>
        </FormGrid>
        
        <PermissionSection>
          <h3>General Permissions</h3>
          
          <Checkbox>
            <input
              type="checkbox"
              id="manageUsers"
              name="permissions.manageUsers"
              checked={formData.permissions.manageUsers}
              onChange={handleChange}
            />
            <label htmlFor="manageUsers">Manage Users</label>
          </Checkbox>
          
          <Checkbox>
            <input
              type="checkbox"
              id="manageRestaurants"
              name="permissions.manageRestaurants"
              checked={formData.permissions.manageRestaurants}
              onChange={handleChange}
            />
            <label htmlFor="manageRestaurants">Manage Restaurants</label>
          </Checkbox>
          
          <Checkbox>
            <input
              type="checkbox"
              id="manageBranches"
              name="permissions.manageBranches"
              checked={formData.permissions.manageBranches}
              onChange={handleChange}
            />
            <label htmlFor="manageBranches">Manage Branches</label>
          </Checkbox>
          
          <Checkbox>
            <input
              type="checkbox"
              id="accessPOS"
              name="permissions.accessPOS"
              checked={formData.permissions.accessPOS}
              onChange={handleChange}
            />
            <label htmlFor="accessPOS">Access POS System</label>
          </Checkbox>
        </PermissionSection>
        
        {/* Branch-specific permissions section */}
        {formData.restaurantId && (
          <BranchPermissionSection>
            <h3>Branch-Specific Permissions</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '1rem', color: '#666' }}>
              Select which branches this user can manage menus and tables for.
            </p>
            {renderBranchPermissions()}
          </BranchPermissionSection>
        )}
        
        <ButtonContainer>
          <Button
            type="button"
            className="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            <FaTimes /> Cancel
          </Button>
          
          <Button
            type="submit"
            className="primary"
            disabled={isLoading}
          >
            <FaCheck /> {isLoading ? "Saving..." : (isEditMode ? "Update User" : "Create User")}
          </Button>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default UserForm;