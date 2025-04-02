// src/components/restaurants/RestaurantForm.js
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUtensils, FaMapMarkerAlt, FaPhone, FaGlobe, FaImage } from 'react-icons/fa';
import restaurantService from '../../services/restaurantService';
import { AuthContext } from '../../context/AuthContext';

const FormContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
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

const Form = styled(motion.form)`
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

const ImageUploadContainer = styled(motion.div)`
  width: 100%;
  height: 200px;
  border: 2px dashed ${props => props.error ? props.theme.colors.error : '#e0e0e0'};
  border-radius: ${props => props.theme.borderRadius.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}05;
  }
  
  svg {
    font-size: 2rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
  }
  
  p {
    text-align: center;
    color: ${props => props.theme.colors.text.secondary};
  }
  
  input {
    display: none;
  }
`;

const PreviewImage = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: ${props => props.theme.borderRadius.small};
  position: relative;
  
  .remove-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color ${props => props.theme.transitions.short};
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
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

const RestaurantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    website: '',
    cuisine: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    status: 'active'
  });
  
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  useEffect(() => {
    if (isEditing) {
      setIsFetching(true);
      
      const fetchRestaurant = async () => {
        try {
          const restaurantData = await restaurantService.getRestaurantById(id);
          setFormData(restaurantData);
          
          if (restaurantData.imageUrl) {
            setImagePreview(restaurantData.imageUrl);
          }
          
        } catch (error) {
          setErrors({
            general: 'Failed to load restaurant data. Please try again.'
          });
          console.error('Error fetching restaurant:', error);
        } finally {
          setIsFetching(false);
        }
      };
      
      fetchRestaurant();
    }
  }, [isEditing, id]);
  
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
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        image: 'Please upload a valid image (JPEG, PNG, GIF)'
      });
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({
        ...errors,
        image: 'Image must be less than 2MB'
      });
      return;
    }
    
    setImageFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Clear error
    if (errors.image) {
      setErrors({
        ...errors,
        image: null
      });
    }
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };
  
  // In RestaurantForm.js
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  const validationErrors = {};
  if (!formData.name) validationErrors.name = 'Restaurant name is required';
  if (!formData.phone) validationErrors.phone = 'Phone number is required';
  if (!formData.address) validationErrors.address = 'Address is required';
  if (!formData.city) validationErrors.city = 'City is required';
  if (!formData.state) validationErrors.state = 'State is required';
  
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  setIsLoading(true);
  
  try {
    let restaurantData = { ...formData };
    
    // Add owner field if creating new restaurant
    if (!isEditing && currentUser) {
      restaurantData.owner = currentUser.id || currentUser._id;
    }
    
    // Add image if available
    if (imageFile) {
      restaurantData.image = imageFile;
    }
    
    let response;
    if (isEditing) {
      // Update existing restaurant
      response = await restaurantService.updateRestaurant(id, restaurantData);
    } else {
      // Create new restaurant
      response = await restaurantService.createRestaurant(restaurantData);
    }
    
    // Ensure consistent id property
    const restaurantId = response._id || response.id;
    
    // Navigate back to restaurants list
    navigate(`/restaurants/${restaurantId}`);
  } catch (error) {
    console.error('Error saving restaurant:', error);
    setErrors({
      general: error.message || 'Error saving restaurant. Please try again.'
    });
    setIsLoading(false);
  }
};
  
  if (isFetching) {
    return (
      <FormContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
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
          <p>Loading restaurant information...</p>
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
      <FormTitle variants={itemVariants}>
        <FaUtensils />
        {isEditing ? 'Edit Restaurant' : 'Add New Restaurant'}
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
      
      <Form onSubmit={handleSubmit}>
        <FormGroup variants={itemVariants}>
          <Label htmlFor="name">
            <FaUtensils />
            Restaurant Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="cuisine">Cuisine Type</Label>
          <Select
            id="cuisine"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            error={errors.cuisine}
          >
            <option value="">Select a cuisine</option>
            <option value="Seafood">Seafood</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Asian">Asian</option>
            <option value="American">American</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="Indian">Indian</option>
            <option value="Other">Other</option>
          </Select>
          {errors.cuisine && <ErrorMessage>{errors.cuisine}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="phone">
            <FaPhone />
            Phone Number
          </Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="website">
            <FaGlobe />
            Website
          </Label>
          <Input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            error={errors.website}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.website && <ErrorMessage>{errors.website}</ErrorMessage>}
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
            <option value="maintenance">Maintenance</option>
          </Select>
          {errors.status && <ErrorMessage>{errors.status}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="address">
            <FaMapMarkerAlt />
            Address
          </Label>
          <Input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="state">State</Label>
          <Input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            error={errors.state}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode || ''}
            onChange={handleChange}
            error={errors.zipCode}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.zipCode && <ErrorMessage>{errors.zipCode}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup className="full-width" variants={itemVariants}>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            error={errors.description}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup className="full-width" variants={itemVariants}>
          <Label htmlFor="image">
            <FaImage />
            Restaurant Image
          </Label>
          {imagePreview ? (
            <PreviewImage src={imagePreview}>
              <button type="button" className="remove-btn" onClick={removeImage}>×</button>
            </PreviewImage>
          ) : (
            <ImageUploadContainer
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              error={errors.image}
              onClick={() => document.getElementById('image').click()}
            >
              <FaImage />
              <p>Click to upload an image<br />(JPEG, PNG, GIF, max 2MB)</p>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </ImageUploadContainer>
          )}
          {errors.image && <ErrorMessage>{errors.image}</ErrorMessage>}
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
            {isLoading ? 'Saving...' : isEditing ? 'Update Restaurant' : 'Create Restaurant'}
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default RestaurantForm;