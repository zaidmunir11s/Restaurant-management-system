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
import UserForm from './UserForm';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
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
    background-color: ${({ theme }) => theme.colors.primary};
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
    &:hover { background-color: ${({ theme }) => theme.colors.primary}; }
  }
  &.secondary {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.background.main};
    &:hover { background-color: ${({ theme }) => theme.colors.background.main}; }
  }
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
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const fetchedUsers = await userService.getAllUsers();
        
        let filteredUsers = fetchedUsers;
        
        if (currentUser && 
            currentUser.role !== 'owner' && 
            !currentUser.permissions?.manageUsers) {
          
          if (currentUser.role === 'manager' && currentUser.branchId) {
            filteredUsers = fetchedUsers.filter(user => 
              user.branchId === currentUser.branchId
            );
          } else {
            filteredUsers = fetchedUsers.filter(user => 
              (user._id === currentUser._id) || (user.id === currentUser.id)
            );
          }
        }
        
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser]);

  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const fetchedRestaurants = await restaurantService.getAllRestaurants();
        setRestaurants(fetchedRestaurants);
        
        const fetchedBranches = await branchService.getAllBranches();
        setBranches(fetchedBranches);
        
      } catch (error) {
        console.error('Error loading master data:', error);
      }
    };
    
    loadMasterData();
  }, []);
  
  const filteredUsers = users.filter(user => {
    // Skip the owner in filtering to avoid showing it
    if (user.role === 'owner' && currentUser && currentUser.role === 'owner' && 
        (user._id === currentUser._id || user.id === currentUser.id)) {
      return false;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return (!searchTerm || fullName.includes(searchLower) || user.email.toLowerCase().includes(searchLower))
      && (roleFilter === 'all' || user.role === roleFilter);
  });

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowAddUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirmation(true);
  };

  const handleSubmitUser = async (userData) => {
    try {
      let savedUser;
      
      if (showAddUserModal) {
        savedUser = await userService.createUser(userData);
        
        if (savedUser) {
          setUsers([...users, savedUser]);
        }
        setShowAddUserModal(false);
      } else if (showEditUserModal && selectedUser) {
        const userId = selectedUser._id || selectedUser.id;
        savedUser = await userService.updateUser(userId, userData);
        
        if (savedUser) {
          setUsers(users.map(u => 
            (u._id === userId || u.id === userId) ? savedUser : u
          ));
        }
        setShowEditUserModal(false);
      }

      return savedUser;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const userId = selectedUser._id || selectedUser.id;
      
      await userService.deleteUser(userId);
      
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
              <UserForm 
                initialData={selectedUser}
                onSubmit={handleSubmitUser}
                onCancel={() => {
                  setShowAddUserModal(false);
                  setShowEditUserModal(false);
                }}
              />
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