import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers,
  FaPlus,
  FaTrash,
  FaEdit,
  FaUserShield,
  FaUserTie,
  FaStore,
  FaUtensils,
  FaUser,
  FaSearch,
  FaTimes,
  FaUserCog,
  FaUserPlus,
  FaDesktop
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

// Helper to darken the primary color on hover
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
  const [branches, setBranches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
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
      manageMenu: false,
      manageTables: false,
      accessPOS: true
    }
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
        if (!storedUsers.length) {
          const demoUsers = [
            { id: 1, firstName: 'John', lastName: 'Doe', email: 'owner@example.com', role: 'owner',
              permissions: { manageUsers: true, manageMenu: true, manageTables: true, accessPOS: true } },
            { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'manager@example.com', role: 'manager',
              restaurantId: 1, branchId: 101,
              permissions: { manageUsers: false, manageMenu: true, manageTables: true, accessPOS: true } },
            { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'waiter@example.com', role: 'waiter',
              restaurantId: 1, branchId: 101,
              permissions: { manageUsers: false, manageMenu: false, manageTables: false, accessPOS: true } }
          ];
          localStorage.setItem('users', JSON.stringify(demoUsers));
          setUsers(demoUsers);
        } else {
          setUsers(storedUsers);
        }
        setRestaurants(storedRestaurants);
        setBranches(storedBranches);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (!searchTerm || fullName.includes(searchLower) || user.email.toLowerCase().includes(searchLower))
      && (roleFilter === 'all' || user.role === roleFilter);
  });

  const handleAddUser = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'waiter',
      restaurantId: restaurants.length ? restaurants[0].id : '',
      branchId: '',
      permissions: { manageUsers: false, manageMenu: false, manageTables: false, accessPOS: true }
    });
    setFormErrors({});
    setShowAddUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role,
      restaurantId: user.restaurantId || '',
      branchId: user.branchId || '',
      permissions: user.permissions || { manageUsers: false, manageMenu: false, manageTables: false, accessPOS: true }
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
    setFormData(prev => ({ ...prev, restaurantId, branchId: '' }));
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    let permissions;
    switch (role) {
      case 'owner':
        permissions = { manageUsers: true, manageMenu: true, manageTables: true, accessPOS: true };
        break;
      case 'manager':
        permissions = { manageUsers: false, manageMenu: true, manageTables: true, accessPOS: true };
        break;
      case 'waiter':
        permissions = { manageUsers: false, manageMenu: false, manageTables: false, accessPOS: true };
        break;
      default:
        permissions = { manageUsers: false, manageMenu: false, manageTables: false, accessPOS: true };
    }
    setFormData(prev => ({ ...prev, role, permissions }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (showAddUserModal || (showEditUserModal && formData.password)) {
      if (!formData.password) errors.password = 'Password is required';
      else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword)
        errors.confirmPassword = 'Passwords do not match';
    }
    if (['manager', 'waiter'].includes(formData.role)) {
      if (!formData.restaurantId) errors.restaurantId = 'Restaurant is required';
      if (!formData.branchId) errors.branchId = 'Branch is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (showAddUserModal) {
      const newUser = {
        id: Date.now(),
        ...formData,
        restaurantId: formData.restaurantId ? parseInt(formData.restaurantId) : null,
        branchId: formData.branchId ? parseInt(formData.branchId) : null
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setShowAddUserModal(false);
    } else if (showEditUserModal && selectedUser) {
      const updatedUser = {
        ...selectedUser,
        ...formData,
        restaurantId: formData.restaurantId ? parseInt(formData.restaurantId) : null,
        branchId: formData.branchId ? parseInt(formData.branchId) : null
      };
      const updatedUsers = users.map(u => u.id === selectedUser.id ? updatedUser : u);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setShowEditUserModal(false);
    }
  };

  const confirmDeleteUser = () => {
    if (!selectedUser) return;
    const updatedUsers = users.filter(u => u.id !== selectedUser.id);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setShowDeleteConfirmation(false);
    setSelectedUser(null);
  };

  const getRestaurantName = (id) => restaurants.find(r => r.id === id)?.name || 'Unknown';
  const getBranchName = (id) => branches.find(b => b.id === id)?.name || 'Unknown';
  const getFilteredBranches = () =>
    formData.restaurantId ? branches.filter(b => b.restaurantId === parseInt(formData.restaurantId)) : [];

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
                <Tr key={user.id}>
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
                    {user.permissions?.manageMenu && (
                      <AssignmentBadge style={{ marginLeft: '0.25rem' }}>
                        <FaUtensils /> Menu
                      </AssignmentBadge>
                    )}
                    {user.permissions?.manageTables && (
                      <AssignmentBadge style={{ marginLeft: '0.25rem' }}>
                        <FaDesktop /> Tables
                      </AssignmentBadge>
                    )}
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
                <CloseButton onClick={() => { setShowAddUserModal(false); setShowEditUserModal(false); }}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
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
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormInput
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={formErrors.password}
                    />
                    {formErrors.password && (
                      <ErrorMessage initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {formErrors.password}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    <FormInput
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={formErrors.confirmPassword}
                    />
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
                          {restaurants.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
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
                          {getFilteredBranches().map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
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
                      <h3>Permissions</h3>
                      <Checkbox>
                        <input
                          type="checkbox"
                          name="permissions.manageUsers"
                          checked={formData.permissions.manageUsers}
                          onChange={handleChange}
                        />
                        <label>Manage Users</label>
                      </Checkbox>
                      <Checkbox>
                        <input
                          type="checkbox"
                          name="permissions.manageMenu"
                          checked={formData.permissions.manageMenu}
                          onChange={handleChange}
                        />
                        <label>Manage Menu</label>
                      </Checkbox>
                      <Checkbox>
                        <input
                          type="checkbox"
                          name="permissions.manageTables"
                          checked={formData.permissions.manageTables}
                          onChange={handleChange}
                        />
                        <label>Manage Tables</label>
                      </Checkbox>
                      <Checkbox>
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
                  <ModalFooter>
                    <ModalButton type="button" className="secondary" onClick={() => {
                      setShowAddUserModal(false);
                      setShowEditUserModal(false);
                    }}>
                      Cancel
                    </ModalButton>
                    <ModalButton type="submit" className="primary">
                      {showAddUserModal ? 'Add User' : 'Save Changes'}
                    </ModalButton>
                  </ModalFooter>
                </Form>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
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
    </PageContainer>
  );
};

export default UserList;
