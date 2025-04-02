// src/components/branches/BranchForm.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  FaStore, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaUser, 
  FaImage, 
  FaArrowLeft,
  FaChair,
  FaUtensils,
  FaCheck,
  FaInfoCircle,
  FaSave,
  FaTimes,
  FaMapMarkedAlt,
  FaCity,
  FaGlobeAmericas,
  FaEnvelope,
  FaClock,
  FaAlignLeft,
  FaCheckCircle,FaChevronRight
} from 'react-icons/fa';
import TableSetupConfig from '../tables/TableSetupConfig';

import branchService from '../../services/branchService';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const FormContainer = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
  overflow: hidden;
  position: relative;
`;

const FormHeader = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  padding: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAwIDEwMFYwaC0xMDBjNTAuNSAwIDEwMCA1MC41IDEwMCAxMDB6IiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHRyYW5zZm9ybS1vcmlnaW49ImJvdHRvbSByaWdodCI+PC9wYXRoPjwvc3ZnPg==');
    opacity: 0.2;
  }
`;

const FormTitle = styled(motion.h1)`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  
  svg {
    font-size: 2rem;
  }
`;

const FormSubtitle = styled(motion.p)`
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 80%;
`;

const BreadcrumbNavigation = styled.div`
  margin-bottom: 2rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: all ${props => props.theme.transitions.short};
  background-color: ${props => props.theme.colors.background.paper};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    transform: translateX(-5px);
  }
`;

const RestaurantInfo = styled(motion.div)`
  margin: 0 2rem 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.colors.background.main};
  border-radius: ${props => props.theme.borderRadius.medium};
  border-left: 4px solid ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RestaurantIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.5rem;
  }
`;

const RestaurantDetails = styled.div`
  flex: 1;
`;

const RestaurantName = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const RestaurantSubDetails = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const FormContent = styled.div`
  padding: 2rem;
`;

const FormSection = styled(motion.div)`
  margin-bottom: 2.5rem;
`;

const SectionDivider = styled.div`
  margin: 2rem 0;
  position: relative;
  height: 1px;
  background-color: ${props => props.theme.colors.background.main};
  
  &::before {
    content: attr(data-title);
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background-color: ${props => props.theme.colors.background.paper};
    padding-right: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
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

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Label = styled(motion.label)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const OptionalBadge = styled.span`
  font-size: 0.7rem;
  color: ${props => props.theme.colors.text.secondary};
  background-color: ${props => props.theme.colors.background.main};
  padding: 0.2rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.background.main};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  transition: all ${props => props.theme.transitions.short};
  background-color: ${props => props.theme.colors.background.main}50;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background-color: white;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const TextareaWrapper = styled.div`
  position: relative;
`;

const Textarea = styled(motion.textarea)`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.background.main};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all ${props => props.theme.transitions.short};
  background-color: ${props => props.theme.colors.background.main}50;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background-color: white;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const Select = styled(motion.select)`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid ${props => props.error ? props.theme.colors.error : props.theme.colors.background.main};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  background-color: ${props => props.theme.colors.background.main}50;
  appearance: none;
  transition: all ${props => props.theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background-color: white;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const SelectArrow = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  
  svg {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const ErrorMessage = styled(motion.p)`
  color: ${props => props.theme.colors.error};
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  svg {
    font-size: 0.9rem;
  }
`;

const ImageUploadContainer = styled(motion.div)`
  width: 100%;
  height: 250px;
  border: 2px dashed ${props => props.error ? props.theme.colors.error : props.theme.colors.primary}50;
  border-radius: ${props => props.theme.borderRadius.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  background-color: ${props => props.theme.colors.background.main}30;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}10;
    transform: translateY(-5px);
  }
  
  svg {
    font-size: 3rem;
    color: ${props => props.theme.colors.primary}80;
    margin-bottom: 1rem;
  }
  
  p {
    text-align: center;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 0.5rem;
  }
  
  .upload-hint {
    font-size: 0.8rem;
    opacity: 0.7;
  }
  
  input {
    display: none;
  }
`;

const PreviewImage = styled(motion.div)`
  width: 100%;
  height: 250px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: ${props => props.theme.borderRadius.medium};
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.medium};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.7));
    pointer-events: none;
  }
  
  .remove-btn {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: ${props => props.theme.borderRadius.medium};
    width: auto;
    height: auto;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: background-color ${props => props.theme.transitions.short};
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.9);
    }
  }
  
  .preview-label {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border-radius: ${props => props.theme.borderRadius.medium};
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    font-weight: 500;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }
  
  label {
    cursor: pointer;
    font-size: 1rem;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const InfoText = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  svg {
    margin-top: 0.2rem;
    color: ${props => props.theme.colors.secondary};
    flex-shrink: 0;
  }
`;

const SettingsCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.main}50;
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.theme.colors.background.main};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.small};
    border-color: ${props => props.theme.colors.primary}30;
  }
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
    
    svg {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const TableSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  .slider-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .slider-value {
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}20;
    padding: 0.25rem 0.75rem;
    border-radius: ${props => props.theme.borderRadius.full};
  }
  
  .slider-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    input[type="range"] {
      flex: 1;
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 8px;
      background: ${props => props.theme.colors.background.main};
      border-radius: 5px;
      outline: none;
      
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${props => props.theme.colors.primary};
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          transform: scale(1.2);
          box-shadow: 0 0 10px ${props => props.theme.colors.primary}50;
        }
      }
      
      &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${props => props.theme.colors.primary};
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
        
        &:hover {
          transform: scale(1.2);
          box-shadow: 0 0 10px ${props => props.theme.colors.primary}50;
        }
      }
    }
  }
`;

const ButtonGroup = styled(motion.div)`
  grid-column: span 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.colors.background.main};
  
  @media (max-width: 768px) {
    grid-column: span 1;
    flex-direction: column;
    gap: 1rem;
  }
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all ${props => props.theme.transitions.medium};
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    box-shadow: 0 4px 15px ${props => props.theme.colors.primary}40;
    
    &:hover {
      background-color: ${props => {
        const hexColor = props.theme.colors.primary.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r * 0.9}, ${g * 0.9}, ${b * 0.9}, 1)`;
      }};
      transform: translateY(-5px);
      box-shadow: 0 6px 20px ${props => props.theme.colors.primary}60;
    }
  }
  
  &.secondary {
    background-color: ${props => props.theme.colors.background.main};
    color: ${props => props.theme.colors.text.primary};
    
    &:hover {
      background-color: ${props => props.theme.colors.background.paper};
      transform: translateY(-5px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    }
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.text.disabled};
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const SuccessModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: ${props => props.theme.shadows.large};
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 2.5rem;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text.primary};
`;

const ModalText = styled.p`
  margin-bottom: 2rem;
  color: ${props => props.theme.colors.text.secondary};
`;

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const BranchForm = () => {
  const { restaurantId } = useParams();
  const { id } = useParams(); // For editing mode
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [restaurant, setRestaurant] = useState(null);
  const [managers, setManagers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    restaurantId: restaurantId || '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    managerId: '',
    openingTime: '08:00',
    closingTime: '22:00',
    description: '',
    image: null,
    status: 'active',
    // Table settings
    tableCount: 10,
    includeIndoorTables: true,
    includeOutdoorTables: true,
    // Menu settings
    includeDefaultMenu: true
  });
  
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      
      try {
        console.log("Starting fetchData with restaurantId:", restaurantId);
        
        // Load restaurant data (if restaurantId is available)
        // In the fetchData function or useEffect
if (restaurantId) {
  try {
    console.log("Fetching restaurant with ID:", restaurantId);
    const foundRestaurant = await branchService.getRestaurantById(restaurantId);
    console.log("Found restaurant:", foundRestaurant);
    
    setRestaurant(foundRestaurant);
    setFormData(prevState => ({
      ...prevState,
      restaurantId: restaurantId, // Make sure this is the exact ID from the URL
    }));
  } catch (error) {
    // Error handling
  }
}
        
        // Rest of your code...
      } catch (error) {
        console.error("Main fetchData error:", error);
        setErrors({ general: 'An error occurred while loading data.' });
      } finally {
        setIsFetching(false);
      }
    };
    
    fetchData();
  }, [id, restaurantId, isEditing, navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } 
    // Handle other inputs
    else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
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
    
    setFormData({
      ...formData,
      image: file
    });
    
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
    setFormData({
      ...formData,
      image: null
    });
    setImagePreview(null);
  };
  
  // src/components/branches/BranchForm.js
// Add this import

// In your BranchForm component, update the handleSubmit function:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  const validationErrors = {};
  if (!formData.name) validationErrors.name = 'Branch name is required';
  if (!formData.restaurantId) validationErrors.restaurantId = 'Restaurant is required';
  if (!formData.address) validationErrors.address = 'Address is required';
  if (!formData.city) validationErrors.city = 'City is required';
  if (!formData.state) validationErrors.state = 'State is required';
  if (!formData.phone) validationErrors.phone = 'Phone number is required';
  
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  setIsLoading(true);
  
  try {
    // Prepare branch data for API
    const branchData = {
      name: formData.name,
      restaurantId: formData.restaurantId, // Keep as is for MongoDB ObjectId
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode || '',
      phone: formData.phone,
      email: formData.email || '',
      managerId: formData.managerId || null,
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,
      weekdayHours: formData.weekdayHours || '',
      weekendHours: formData.weekendHours || '',
      description: formData.description || '',
      status: formData.status || 'active',
      tableCount: parseInt(formData.tableCount || 10)
    };

    // If we have an image, include it
    if (formData.image) {
      branchData.image = formData.image;
    }
    
    console.log("Submitting branch with restaurantId:", branchData.restaurantId);
    
    let branch;
    if (isEditing) {
      console.log("Updating existing branch with ID:", id);
      branch = await branchService.updateBranch(id, branchData);
      console.log("Branch updated successfully:", branch);
    } else {
      console.log("Creating new branch");
      branch = await branchService.createBranch(branchData);
      console.log("Branch created successfully:", branch);
    }

    // Show success message
    setShowSuccess(true);
    
    // Navigate back after a delay
    setTimeout(() => {
      // Make sure to use the branch's restaurantId from the response if available
      const targetRestaurantId = branch?.restaurantId || branchData.restaurantId;
      navigate(`/restaurants/${targetRestaurantId}/branches`);
    }, 1500);
  } catch (error) {
    console.error('Error saving branch:', error);
    
    // Clear loading state
    setIsLoading(false);
    
    // Set appropriate error message
    if (error.message === 'Restaurant not found') {
      setErrors({
        general: 'The restaurant was not found. Please check the restaurant ID and try again.'
      });
    } else if (typeof error === 'object' && error !== null) {
      setErrors({
        general: error.message || 'Error saving branch. Please try again.'
      });
    } else {
      setErrors({
        general: 'An unknown error occurred. Please try again.'
      });
    }
  }
};

if (isFetching) {
return (
  <PageContainer>
    <BreadcrumbNavigation>
      <BackLink to={restaurantId ? `/restaurants/${restaurantId}/branches` : '/restaurants'}>
        <FaArrowLeft /> Back
      </BackLink>
    </BreadcrumbNavigation>
    
    <FormContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem' }}>
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
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginLeft: '1rem' }}
        >
          Loading branch information...
        </motion.p>
      </div>
    </FormContainer>
  </PageContainer>
);
}

return (
<PageContainer>
  <BreadcrumbNavigation>
    <BackLink to={restaurantId ? `/restaurants/${restaurantId}/branches` : '/restaurants'}>
      <FaArrowLeft /> {restaurant ? `Back to ${restaurant.name} Branches` : 'Back'}
    </BackLink>
  </BreadcrumbNavigation>
  
  <FormContainer
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
  >
    <FormHeader>
      <FormTitle>
        <FaStore />
        {isEditing ? 'Edit Branch Location' : 'Add New Branch Location'}
      </FormTitle>
      <FormSubtitle>
        {isEditing 
          ? 'Update the details of your existing branch location.' 
          : 'Create a new branch location for your restaurant to expand your business.'}
      </FormSubtitle>
    </FormHeader>
    
    {restaurant && (
      <RestaurantInfo 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RestaurantIcon>
          <FaUtensils />
        </RestaurantIcon>
        <RestaurantDetails>
          <RestaurantName>{restaurant.name}</RestaurantName>
          <RestaurantSubDetails>
            {restaurant.cuisine || 'Restaurant'} • {restaurant.city}, {restaurant.state}
          </RestaurantSubDetails>
        </RestaurantDetails>
      </RestaurantInfo>
    )}
    
    <FormContent>
      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ 
            marginBottom: '1rem', 
            padding: '1rem', 
            borderRadius: '8px', 
            backgroundColor: '#ffebee', 
            color: '#d32f2f',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem' 
          }}
        >
          <FaTimes />
          <ErrorMessage>{errors.general}</ErrorMessage>
        </motion.div>
      )}
      
      <Form onSubmit={handleSubmit}>
        {/* Basic Branch Information */}
        <FormSection variants={staggerChildren} initial="hidden" animate="visible">
          <SectionDivider data-title="Branch Details" />
          
          <FormGroup variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="name">
                <FaStore />
                Branch Name
              </Label>
            </LabelRow>
            <InputWrapper>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="e.g. Downtown Branch"
              />
            </InputWrapper>
            {errors.name && (
              <ErrorMessage>
                <FaTimes /> {errors.name}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="status">Status</Label>
            </LabelRow>
            <InputWrapper>
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
              <SelectArrow>
                <FaChevronRight />
              </SelectArrow>
            </InputWrapper>
            {errors.status && (
              <ErrorMessage>
                <FaTimes /> {errors.status}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="address">
                <FaMapMarkerAlt />
                Street Address
              </Label>
            </LabelRow>
            <InputWrapper>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="e.g. 123 Main Street"
              />
            </InputWrapper>
            {errors.address && (
              <ErrorMessage>
                <FaTimes /> {errors.address}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="city">
                <FaCity />
                City
              </Label>
            </LabelRow>
            <InputWrapper>
              <Input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="e.g. Miami"
              />
            </InputWrapper>
            {errors.city && (
              <ErrorMessage>
                <FaTimes /> {errors.city}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="state">
                <FaGlobeAmericas />
                State
              </Label>
            </LabelRow>
            <InputWrapper>
              <Input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                error={errors.state}
                placeholder="e.g. FL"
              />
            </InputWrapper>
            {errors.state && (
              <ErrorMessage>
                <FaTimes /> {errors.state}
              </ErrorMessage>
            )}
          </FormGroup>
          
          
          <FormGroup variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="phone">
                <FaPhone />
                Phone Number
              </Label>
            </LabelRow>
            <InputWrapper>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                placeholder="e.g. (555) 123-4567"
              />
            </InputWrapper>
            {errors.phone && (
              <ErrorMessage>
                <FaTimes /> {errors.phone}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="email">
                <FaEnvelope />
                Email Address
              </Label>
              <OptionalBadge>Optional</OptionalBadge>
            </LabelRow>
            <InputWrapper>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="e.g. branch@example.com"
              />
            </InputWrapper>
            {errors.email && (
              <ErrorMessage>
                <FaTimes /> {errors.email}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="managerId">
                <FaUser />
                Branch Manager
              </Label>
            </LabelRow>
            <InputWrapper>
              <Select
                id="managerId"
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
                error={errors.managerId}
              >
                <option value="">Select a manager</option>
                {managers.map(manager => (
                  <option key={manager.id} value={manager.id}>
                    {manager.name}
                  </option>
                ))}
              </Select>
              <SelectArrow>
                <FaChevronRight />
              </SelectArrow>
            </InputWrapper>
            {errors.managerId && (
              <ErrorMessage>
                <FaTimes /> {errors.managerId}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="openingTime">
                <FaClock />
                Opening Time
              </Label>
            </LabelRow>
            <InputWrapper>
              <Input
                type="time"
                id="openingTime"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleChange}
                error={errors.openingTime}
              />
            </InputWrapper>
            {errors.openingTime && (
              <ErrorMessage>
                <FaTimes /> {errors.openingTime}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="closingTime">
                <FaClock />
                Closing Time
              </Label>
            </LabelRow>
            <InputWrapper>
              <Input
                type="time"
                id="closingTime"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleChange}
                error={errors.closingTime}
              />
            </InputWrapper>
            {errors.closingTime && (
              <ErrorMessage>
                <FaTimes /> {errors.closingTime}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup className="full-width" variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="description">
                <FaAlignLeft />
                Description
              </Label>
              <OptionalBadge>Optional</OptionalBadge>
            </LabelRow>
            <TextareaWrapper>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                placeholder="Provide a short description of this branch..."
              />
            </TextareaWrapper>
            {errors.description && (
              <ErrorMessage>
                <FaTimes /> {errors.description}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup className="full-width" variants={fadeInUp}>
            <LabelRow>
              <Label htmlFor="image">
                <FaImage />
                Branch Image
              </Label>
              <OptionalBadge>Optional</OptionalBadge>
            </LabelRow>
            {imagePreview ? (
              <PreviewImage src={imagePreview}>
                <div className="preview-label">Branch Image</div>
                <button type="button" className="remove-btn" onClick={removeImage}>
                  <FaTimes /> Remove Image
                </button>
              </PreviewImage>
            ) : (
              <ImageUploadContainer
                error={errors.image}
                onClick={() => document.getElementById('image').click()}
                whileHover={{ y: -5 }}
              >
                <FaImage />
                <p>Click to upload an image</p>
                <p className="upload-hint">(JPEG, PNG, GIF, max 2MB)</p>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </ImageUploadContainer>
            )}
            {errors.image && (
              <ErrorMessage>
                <FaTimes /> {errors.image}
              </ErrorMessage>
            )}
          </FormGroup>
        </FormSection>
        
        {/* Table Setup */}
        <FormSection variants={staggerChildren} initial="hidden" animate="visible">
  <SectionDivider data-title="Table Configuration" />
  
  <FormGroup className="full-width" variants={fadeInUp}>
    <TableSetupConfig formData={formData} handleChange={handleChange} />
  </FormGroup>
</FormSection>
        
        {/* Menu Setup */}
        <FormSection variants={staggerChildren} initial="hidden" animate="visible">
          <SectionDivider data-title="Menu Configuration" />
          
          <FormGroup className="full-width" variants={fadeInUp}>
            <SettingsCard>
              <h3>
                <FaUtensils /> Menu Setup
              </h3>
              <Checkbox>
                <input
                  type="checkbox"
                  id="includeDefaultMenu"
                  name="includeDefaultMenu"
                  checked={formData.includeDefaultMenu}
                  onChange={handleChange}
                />
                <label htmlFor="includeDefaultMenu">Include default menu items</label>
              </Checkbox>
              <InfoText>
                <FaInfoCircle />
                If checked, standard menu items will be created for this branch.
                Categories include Appetizers, Main Courses, Desserts, and Beverages.
                You can customize or add more items after creating the branch.
              </InfoText>
            </SettingsCard>
          </FormGroup>
        </FormSection>
        
        <ButtonGroup variants={fadeInUp}>
          <div>
            <Button
              type="button"
              className="secondary"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <FaTimes /> Cancel
            </Button>
          </div>
          <div>
            <Button
              type="submit"
              className="primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <FaSave /> {isLoading ? 'Saving...' : isEditing ? 'Update Branch' : 'Create Branch'}
            </Button>
          </div>
        </ButtonGroup>
      </Form>
    </FormContent>
  </FormContainer>
  
  {/* Success Modal */}
  <AnimatePresence>
    {showSuccess && (
      <SuccessModal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalContent
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <SuccessIcon>
            <FaCheckCircle />
          </SuccessIcon>
          <ModalTitle>{isEditing ? 'Branch Updated!' : 'Branch Created!'}</ModalTitle>
          <ModalText>
            {isEditing 
              ? 'Your branch has been successfully updated.' 
              : 'Your new branch has been successfully created.'}
          </ModalText>
          <Button
            className="primary"
            style={{ margin: '0 auto', display: 'inline-flex' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCheck /> Continue
          </Button>
        </ModalContent>
      </SuccessModal>
    )}
  </AnimatePresence>
</PageContainer>
);
};

export default BranchForm;