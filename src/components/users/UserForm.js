import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import branchService from '../../services/branchService';
import restaurantService from '../../services/restaurantService';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaStore, FaCheck, FaTimes } from 'react-icons/fa';

// Styled components (keep your existing styling)

const UserForm = ({ user, onSubmit, onCancel }) => {
  const { currentUser } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    restaurants: [],
    branches: [],
    permissions: {
      editRestaurantDetails: false,
      createBranches: false,
      editBranchInfo: false,
      editMenu: false,
      editTables: false,
      accessPOS: false
    }
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = Boolean(user);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load restaurants
        const fetchedRestaurants = await restaurantService.getAllRestaurants();
        setRestaurants(fetchedRestaurants);
        
        // Load branches
        const fetchedBranches = await branchService.getAllBranches();
        setBranches(fetchedBranches);
        
        // If editing, populate the form
        if (user) {
          setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            password: '', // Don't populate password for editing
            role: user.role || '',
            restaurants: user.restaurants || [],
            branches: user.branches || [],
            permissions: {
              editRestaurantDetails: user.permissions?.editRestaurantDetails || false,
              createBranches: user.permissions?.createBranches || false,
              editBranchInfo: user.permissions?.editBranchInfo || false,
              editMenu: user.permissions?.editMenu || false,
              editTables: user.permissions?.editTables || false,
              accessPOS: user.permissions?.accessPOS || false
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
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('permissions.')) {
      const permissionName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [permissionName]: checked
        }
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

  const handleMultiSelect = (e, field) => {
    const options = e.target.options;
    const values = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!isEditMode && !formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ general: error.message || "Failed to save user" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && <div className="error">{errors.general}</div>}
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">
            <FaUser /> First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? "error" : ""}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">
            <FaUser /> Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? "error" : ""}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="email">
          <FaEnvelope /> Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? "error" : ""}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="password">
          <FaLock /> Password {isEditMode && "(Leave blank to keep current)"}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? "error" : ""}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>
      
      <div className="form-group">
        <label htmlFor="role">
          <FaUser /> Role
        </label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g. Manager, Waiter, Chef, etc."
          className={errors.role ? "error" : ""}
        />
        {errors.role && <span className="error-message">{errors.role}</span>}
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="restaurants">
            <FaBuilding /> Assigned Restaurants
          </label>
          <select
            id="restaurants"
            name="restaurants"
            multiple
            value={formData.restaurants}
            onChange={(e) => handleMultiSelect(e, 'restaurants')}
          >
            {restaurants.map(restaurant => (
              <option key={restaurant._id || restaurant.id} value={restaurant._id || restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
          <small>Hold Ctrl/Cmd to select multiple</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="branches">
            <FaStore /> Assigned Branches
          </label>
          <select
            id="branches"
            name="branches"
            multiple
            value={formData.branches}
            onChange={(e) => handleMultiSelect(e, 'branches')}
          >
            {branches.map(branch => (
              <option key={branch._id || branch.id} value={branch._id || branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <small>Hold Ctrl/Cmd to select multiple</small>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Permissions</h3>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="permissions.editRestaurantDetails"
              checked={formData.permissions.editRestaurantDetails}
              onChange={handleChange}
            />
            Edit Restaurant Details
          </label>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="permissions.createBranches"
              checked={formData.permissions.createBranches}
              onChange={handleChange}
            />
            Create Branches
          </label>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="permissions.editBranchInfo"
              checked={formData.permissions.editBranchInfo}
              onChange={handleChange}
            />
            Edit Branch Information
          </label>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="permissions.editMenu"
              checked={formData.permissions.editMenu}
              onChange={handleChange}
            />
            Edit Branch Menus
          </label>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="permissions.editTables"
              checked={formData.permissions.editTables}
              onChange={handleChange}
            />
            Edit Tables
          </label>
        </div>
        
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="permissions.accessPOS"
              checked={formData.permissions.accessPOS}
              onChange={handleChange}
            />
            Access POS System
          </label>
        </div>
      </div>
      
      <div className="button-group">
        <button type="button" className="cancel-button" onClick={onCancel} disabled={isLoading}>
          <FaTimes /> Cancel
        </button>
        <button type="submit" className="submit-button" disabled={isLoading}>
          <FaCheck /> {isLoading ? "Saving..." : (isEditMode ? "Update User" : "Create User")}
        </button>
      </div>
    </form>
  );
};

export default UserForm;