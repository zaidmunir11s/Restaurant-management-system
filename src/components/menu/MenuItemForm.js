// src/components/menu/MenuItemForm.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  FaUtensils, 
  FaArrowLeft,
  FaDollarSign,
  FaImage,
  FaCube,
  FaLayerGroup,
  FaAlignLeft 
} from 'react-icons/fa';

const FormContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: color ${props => props.theme.transitions.short};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const FormTitle = styled(motion.h1)`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const FormWrapper = styled(motion.form)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled(motion.div)`
  margin-bottom: 1rem;
  position: relative;
  
  &.full-width {
    grid-column: span 2;
    
    @media (max-width: 768px) {
      grid-column: span 1;
    }
  }
`;

const Label = styled(motion.label)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.error ? props.theme.colors.error : '#e0e0e0'};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  transition: all ${props => props.theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const Textarea = styled(motion.textarea)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.error ? props.theme.colors.error : '#e0e0e0'};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all ${props => props.theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const Select = styled(motion.select)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.error ? props.theme.colors.error : '#e0e0e0'};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  background-color: white;
  transition: all ${props => props.theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const ErrorMessage = styled(motion.p)`
  color: ${props => props.theme.colors.error};
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const InfoText = styled.p`
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const ModelPreview = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${props => props.theme.colors.background.main};
  border-radius: ${props => props.theme.borderRadius.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
`;

const ModelIcon = styled(FaCube)`
  font-size: 3rem;
  color: ${props => props.theme.colors.primary}50;
  margin-bottom: 1rem;
`;

const ModelText = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  max-width: 80%;
  font-size: 0.9rem;
`;

const ButtonGroup = styled(motion.div)`
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-column: span 1;
    flex-direction: column;
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${props => {
        const hexColor = props.theme.colors.primary.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r * 0.9}, ${g * 0.9}, ${b * 0.9}, 1)`;
      }};
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: ${props => props.theme.colors.text.primary};
    border: 1px solid #e0e0e0;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

const MenuItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    status: 'active',
    modelUrl: 'https://menu-reality.com/fast_food_meal.glb'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    // Get categories from existing menu items
    const fetchCategories = () => {
      const allMenuItems = [];
      
      // Get all menu items from localStorage (from all restaurants/branches)
      const localStorageKeys = Object.keys(localStorage);
      
      // Filter keys related to menus
      const menuKeys = localStorageKeys.filter(key => 
        key.startsWith('restaurant_menu_') || key.startsWith('branch_menu_')
      );
      
      // Collect all menu items
      menuKeys.forEach(key => {
        try {
          const items = JSON.parse(localStorage.getItem(key) || '[]');
          allMenuItems.push(...items);
        } catch (error) {
          console.error(`Error parsing menu items from ${key}:`, error);
        }
      });
      
      // Extract unique categories
      const uniqueCategories = [...new Set(allMenuItems.map(item => item.category))];
      setCategories(uniqueCategories);
    };
    
    fetchCategories();
    
    // If editing, fetch item data
    if (isEditing) {
      setIsFetching(true);
      
      const fetchMenuItemData = () => {
        // Search in all localStorage menu items for this ID
        const localStorageKeys = Object.keys(localStorage);
        const menuKeys = localStorageKeys.filter(key => 
          key.startsWith('restaurant_menu_') || key.startsWith('branch_menu_')
        );
        
        let foundItem = null;
        
        // Look for the item with this ID in all menus
        for (const key of menuKeys) {
          try {
            const items = JSON.parse(localStorage.getItem(key) || '[]');
            const item = items.find(item => item.id === parseInt(id));
            
            if (item) {
              foundItem = item;
              break;
            }
          } catch (error) {
            console.error(`Error parsing menu items from ${key}:`, error);
          }
        }
        
        if (foundItem) {
          setFormData(foundItem);
        } else {
          setErrors({ general: 'Menu item not found' });
        }
        
        setIsFetching(false);
      };
      
      fetchMenuItemData();
    }
  }, [id, isEditing]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const validationErrors = {};
    if (!formData.title) validationErrors.title = 'Menu item title is required';
    if (!formData.price) validationErrors.price = 'Price is required';
    if (!formData.category) validationErrors.category = 'Category is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For editing existing item, we need to update it in all menus where it appears
      if (isEditing) {
        const localStorageKeys = Object.keys(localStorage);
        const menuKeys = localStorageKeys.filter(key => 
          key.startsWith('restaurant_menu_') || key.startsWith('branch_menu_')
        );
        
        // Update the item in all menus
        for (const key of menuKeys) {
          try {
            const items = JSON.parse(localStorage.getItem(key) || '[]');
            const itemIndex = items.findIndex(item => item.id === parseInt(id));
            
            if (itemIndex !== -1) {
              // Update item but keep the ID
              items[itemIndex] = {
                ...formData,
                id: parseInt(id)
              };
              
              localStorage.setItem(key, JSON.stringify(items));
            }
          } catch (error) {
            console.error(`Error updating menu item in ${key}:`, error);
          }
        }
      }
      
      // Navigate back
      navigate(-1);
    } catch (error) {
      console.error('Error saving menu item:', error);
      setErrors({
        general: error.message || 'Error saving menu item. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isFetching) {
    return (
      <FormContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <BackButton to="-1">
          <FaArrowLeft /> Back to Menu
        </BackButton>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <motion.div
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: '3px solid #e0e0e0',
              borderTopColor: '#FF5722',
              margin: '0 auto 1rem'
            }}
          />
          <p>Loading menu item information...</p>
        </div>
      </FormContainer>
    );
  }
  
  return (
    <FormContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <BackButton to="-1">
        <FaArrowLeft /> Back to Menu
      </BackButton>
      
      <FormTitle variants={itemVariants}>
        <FaUtensils />
        {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
      </FormTitle>
      
      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ marginBottom: '1rem', color: 'red' }}
        >
          <ErrorMessage>{errors.general}</ErrorMessage>
        </motion.div>
      )}
      
      <FormWrapper onSubmit={handleSubmit}>
        <FormGroup variants={itemVariants}>
          <Label htmlFor="title">
            <FaUtensils />
            Item Name
          </Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="price">
            <FaDollarSign />
            Price
          </Label>
          <Input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            error={errors.price}
            whileFocus={{ scale: 1.01 }}
            placeholder="e.g. $12.99"
          />
          {errors.price && <ErrorMessage>{errors.price}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="category">
            <FaLayerGroup />
            Category
          </Label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
          {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            error={errors.status}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="featured">Featured</option>
          </Select>
          {errors.status && <ErrorMessage>{errors.status}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup className="full-width" variants={itemVariants}>
          <Label htmlFor="description">
            <FaAlignLeft />
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup className="full-width" variants={itemVariants}>
          <Label htmlFor="modelUrl">
            <FaCube />
            3D Model
          </Label>
          <ModelPreview>
            <ModelIcon />
            <ModelText>
              To add or change 3D models, please use the iOS app.
              Current model: {formData.modelUrl ? formData.modelUrl.split('/').pop() : 'None'}
            </ModelText>
          </ModelPreview>
          <InfoText>
            3D models can only be added or changed through the iOS app.
          </InfoText>
        </FormGroup>
        
        <ButtonGroup variants={itemVariants}>
          <Button
            type="button"
            className="secondary"
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Menu Item' : 'Create Menu Item'}
          </Button>
        </ButtonGroup>
      </FormWrapper>
    </FormContainer>
  );
};

export default MenuItemForm;