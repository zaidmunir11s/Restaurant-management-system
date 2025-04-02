// src/components/branches/BranchDetail.js
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Lottie from 'react-lottie';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe, 
  FaUtensils,
  FaStore,
  FaChair,
  FaListAlt,
  FaUserFriends,
  FaRegClock,
  FaRegCalendarAlt,
  FaTachometerAlt,
  FaChevronRight,
  FaPlusCircle,
  FaPercentage,
  FaMapMarkedAlt,
  FaCheck,
  FaChartLine
} from 'react-icons/fa';

// Import Lottie animations
import restaurantAnimation from '../../animations/restaurant-animation.json';
import foodAnimation from '../../animations/food-animation.json';
import tableAnimation from '../../animations/table-animation.json';
import successAnimation from '../../animations/success-animation.json';

import branchService from '../../services/branchService';
import tableService from '../../services/tableService';

const DetailContainer = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTransition = styled(motion.div)`
  width: 100%;
`;

const BackButtonContainer = styled(motion.div)`
  margin-bottom: 2rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text.secondary};
  text-decoration: none;
  font-size: 0.9rem;
  transition: all ${props => props.theme.transitions.short};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.background.paper};
    transform: translateX(-5px);
  }
`;

const Header = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.medium};
  overflow: hidden;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const TitleSection = styled(motion.div)`
  flex: 1;
`;

const Title = styled(motion.h1)`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Subtitle = styled(motion.div)`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StatusBadge = styled(motion.span)`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-left: 1rem;
  
  background-color: ${props => {
    switch (props.status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#F44336';
      case 'maintenance':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  }};
  color: white;
`;

const ActionButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    width: 100%;
    justify-content: stretch;
  }
`;

const Button = styled(Link)`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all ${props => props.theme.transitions.medium};
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3);
    
    &:hover {
      background-color: ${props => {
        const hexColor = props.theme.colors.primary.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r * 0.9}, ${g * 0.9}, ${b * 0.9}, 1)`;
      }};
      transform: translateY(-5px);
      box-shadow: 0 6px 15px rgba(255, 87, 34, 0.4);
    }
  }
  
  &.secondary {
    color: ${props => props.theme.colors.text.primary};
    border: 1px solid ${props => props.theme.colors.background.main};
    background-color: ${props => props.theme.colors.background.paper};
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    
    &:hover {
      background-color: ${props => props.theme.colors.background.main};
      transform: translateY(-5px);
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
    }
  }
  
  &.danger {
    color: ${props => props.theme.colors.error};
    border: 1px solid ${props => props.theme.colors.error}50;
    background-color: ${props => props.theme.colors.error}10;
    
    &:hover {
      background-color: ${props => props.theme.colors.error}20;
      transform: translateY(-5px);
      box-shadow: 0 6px 15px rgba(244, 67, 54, 0.2);
    }
  }
  
  @media (max-width: 480px) {
    flex: 1;
    justify-content: center;
  }
`;

const DeleteButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all ${props => props.theme.transitions.medium};
  background: none;
  color: ${props => props.theme.colors.error};
  border: 1px solid ${props => props.theme.colors.error}50;
  background-color: ${props => props.theme.colors.error}10;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.error}20;
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(244, 67, 54, 0.2);
  }
  
  @media (max-width: 480px) {
    flex: 1;
    justify-content: center;
  }
`;

const Content = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled(motion.div)`
  border-radius: ${props => props.theme.borderRadius.large};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.medium};
  position: relative;
  aspect-ratio: 16 / 9;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
    pointer-events: none;
  }
`;

const InfoSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoGroup = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background-color: ${props => props.theme.colors.background.paper};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.small};
  transition: all ${props => props.theme.transitions.medium};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: ${props => props.theme.colors.primary};
  }
`;

const InfoLabel = styled(motion.h3)`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const InfoValue = styled(motion.div)`
  color: ${props => props.theme.colors.text.primary};
  line-height: 1.6;
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: all ${props => props.theme.transitions.short};
    
    &:hover {
      text-decoration: underline;
      color: ${props => props.theme.colors.secondary};
    }
  }
`;

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.1rem;
  }
`;

const MenuCard = styled(Link)`
  position: relative;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 2rem 1.5rem;
  text-decoration: none;
  color: white;
  transition: all ${props => props.theme.transitions.short};
  display: flex;
  align-items: center;
  gap: 2rem;
  overflow: hidden;
  margin-bottom: 2rem;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.theme.shadows.large};
  }
  
  .card-content {
    flex: 1;
    z-index: 2;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    opacity: 0.9;
    margin-bottom: 1rem;
  }

  .animation-container {
    width: 120px;
    height: 120px;
  }
  
  .action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 0.5rem 1rem;
    border-radius: ${props => props.theme.borderRadius.medium};
    transition: all 0.3s ease;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
`;

const Description = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.small};
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
    font-weight: 600;
  }
  
  p {
    line-height: 1.8;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const StatCards = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
  text-align: center;
  transition: all ${props => props.theme.transitions.medium};
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-7px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.color || props.theme.colors.primary};
  }
  
  .icon {
    font-size: 1.8rem;
    color: ${props => props.color || props.theme.colors.primary};
    margin-bottom: 0.75rem;
    transition: transform 0.3s ease;
  }
  
  &:hover .icon {
    transform: scale(1.2);
  }
  
  .value {
    font-size: 2rem;
    font-weight: 700;
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const SectionTitle = styled(motion.h2)`
  color: ${props => props.theme.colors.text.primary};
  margin: 2.5rem 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
  
  &:after {
    content: '';
    display: block;
    height: 2px;
    background: linear-gradient(90deg, ${props => props.theme.colors.primary}50, transparent);
    flex: 1;
    margin-left: 1rem;
    border-radius: 2px;
  }
`;

const ModulesGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const ModuleCard = styled(Link)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.small};
  padding: 1.5rem;
  text-decoration: none;
  color: ${props => props.theme.colors.text.primary};
  transition: all ${props => props.theme.transitions.medium};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: ${props => props.color || props.theme.colors.primary};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::before {
    transform: scaleX(1);
  }
  
  svg {
    font-size: 2.5rem;
    color: ${props => props.color || props.theme.colors.primary};
    transition: transform 0.3s ease;
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  p {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 0.9rem;
  }
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
  
  &:hover svg {
    transform: scale(1.2);
  }
`;

const BranchesList = styled(motion.div)`
  margin-top: 1rem;
`;

const BranchSummary = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.large};
  margin-bottom: 1rem;
  background-color: ${props => props.theme.colors.background.paper};
  box-shadow: ${props => props.theme.shadows.small};
  text-decoration: none;
  transition: all ${props => props.theme.transitions.medium};
  
  &:hover {
    transform: translateX(10px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const BranchIcon = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  transition: all 0.3s ease;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1.5rem;
  }
  
  ${BranchSummary}:hover & {
    background-color: ${props => props.theme.colors.primary};
    
    svg {
      color: white;
    }
  }
`;

const BranchInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 1.1rem;
    color: ${props => props.theme.colors.text.primary};
    margin-bottom: 0.25rem;
    transition: color 0.3s ease;
  }
  
  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.text.secondary};
  }
  
  ${BranchSummary}:hover & h3 {
    color: ${props => props.theme.colors.primary};
  }
`;

const BranchStatus = styled.div`
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#F44336';
      case 'maintenance':
        return '#FFC107';
      default:
        return '#9E9E9E';
    }
  }};
  color: white;
  transition: transform 0.3s ease;
  
  ${BranchSummary}:hover & {
    transform: scale(1.1);
  }
`;

const ConfirmationModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
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

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text.primary};
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const ModalButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &.confirm {
    background-color: ${props => props.theme.colors.error};
    color: white;
    
    &:hover {
      background-color: ${props => props.theme.colors.error}dd;
    }
  }
  
  &.cancel {
    background-color: ${props => props.theme.colors.background.main};
    color: ${props => props.theme.colors.text.primary};
    
    &:hover {
      background-color: ${props => props.theme.colors.background.main}dd;
    }
  }
`;

const LottieWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const NoDataMessage = styled(motion.div)`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.medium};
  
  h2 {
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
  }
  
  p {
    margin-bottom: 2rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  }
};

const BranchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
// In BranchDetail.js
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      console.log("Fetching branch with ID:", id);
      // Get branch from API
      const fetchedBranch = await branchService.getBranchById(id);
      console.log("Fetched branch data:", fetchedBranch);
      
      if (fetchedBranch) {
        setBranch(fetchedBranch);
        
        // Get restaurant data
        if (fetchedBranch.restaurantId) {
          const fetchedRestaurant = await branchService.getRestaurantById(fetchedBranch.restaurantId);
          setRestaurant(fetchedRestaurant);
        }
        
        // Get tables for this branch
        try {
          const branchTables = await tableService.getTablesByBranch(id);
          setTables(branchTables || []);
        } catch (tableError) {
          console.error("Error fetching tables:", tableError);
          // Don't fail the whole page if tables can't be fetched
          setTables([]);
        }
      } else {
        setError('Branch not found');
      }
    } catch (error) {
      console.error('Error fetching branch details:', error);
      setError(error.message || 'Error loading branch details');
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchData();
}, [id]);
  
  const handleDelete = () => {
    try {
      // Get current branches
      const branches = JSON.parse(localStorage.getItem('branches') || '[]');
      
      // Filter out the deleted branch
      const updatedBranches = branches.filter(b => b.id !== parseInt(id));
      
      // Update localStorage
      localStorage.setItem('branches', JSON.stringify(updatedBranches));
      
      // Show success animation
      setDeleteSuccess(true);
      
      // Navigate back to restaurant after success animation
      setTimeout(() => {
        if (branch && branch.restaurantId) {
          navigate(`/restaurants/${branch.restaurantId}`);
        } else {
          navigate('/restaurants');
        }
      }, 2000);
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  };
  
  const totalTables = tables.length;
  const availableTables = tables.filter(t => t.status === 'available').length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const reservedTables = tables.filter(t => t.status === 'reserved').length;
  
  // Lottie animation options
  const foodAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: foodAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  
  const tableAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: tableAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  
  const successAnimationOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  
  if (isLoading) {
    return (
      <DetailContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <BackButtonContainer>
          <BackButton to="/restaurants">
            <FaArrowLeft /> Back to Restaurants
          </BackButton>
        </BackButtonContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          flexDirection: 'column'
        }}>
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: restaurantAnimation,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
              }
            }}
            height={200}
            width={200}
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            style={{ marginTop: '1rem', fontSize: '1.1rem' }}
          >
            Loading branch information...
          </motion.p>
        </div>
      </DetailContainer>
    );
  }
  
  if (error || !branch) {
    return (
      <DetailContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <BackButtonContainer>
          <BackButton to="/restaurants">
            <FaArrowLeft /> Back to Restaurants
          </BackButton>
        </BackButtonContainer>
        <NoDataMessage
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Branch Not Found</h2>
          <p>{error || 'The branch you are looking for does not exist or has been removed.'}</p>
          <Button to="/restaurants" className="primary">
            View All Restaurants
          </Button>
        </NoDataMessage>
      </DetailContainer>
    );
  }
  
  return (
    <DetailContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageTransition variants={fadeIn} initial="hidden" animate="visible">
        <BackButtonContainer 
          variants={slideUp}
          initial="hidden"
          animate="visible"
        >
          <BackButton to={`/restaurants/${branch.restaurantId}`}>
            <FaArrowLeft /> Back to {restaurant?.name || 'Restaurant'}
          </BackButton>
        </BackButtonContainer>
        
        <Header variants={slideUp} initial="hidden" animate="visible">
          <TitleSection>
            <Title>
              <FaStore />
              {branch.name}
              <StatusBadge 
                status={branch.status}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {branch.status || 'Active'}
              </StatusBadge>
            </Title>
            <Subtitle>
              <FaMapMarkerAlt />
              {branch.address}, {branch.city}
            </Subtitle>
          </TitleSection>
          
          <ActionButtons>
            <Button 
              to={`/branches/${id}/edit`} 
              className="primary"
              whileHover={{ y: -5, boxShadow: '0 6px 15px rgba(255, 87, 34, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <FaEdit /> Edit
            </Button>
            <DeleteButton 
              onClick={() => setShowDeleteModal(true)}
              className="danger"
              whileHover={{ y: -5, boxShadow: '0 6px 15px rgba(244, 67, 54, 0.2)' }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTrash /> Delete
            </DeleteButton>
          </ActionButtons>
        </Header>
        
        {/* Featured Menu Card with Lottie Animation */}
        <MenuCard 
          to={`/branches/${id}/menu`}
          whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}
        >
          <div className="card-content">
            <h3>View Branch Menu</h3>
            <p>Manage and update menu items for this branch</p>
            <div className="action-button">
              <span>Explore Menu</span>
              <FaChevronRight />
            </div>
          </div>
          <div className="animation-container">
            <Lottie options={foodAnimationOptions} height={120} width={120} />
          </div>
        </MenuCard>
        
        <Content variants={staggerContainer} initial="hidden" animate="visible">
          <ImageSection variants={fadeInScale}>
            <img 
              src={branch.imageUrl || 'https://via.placeholder.com/800x450?text=Branch+Image'} 
              alt={branch.name} 
            />
          </ImageSection>
          
          <InfoSection>
            <InfoGroup 
              variants={fadeInScale}
              whileHover={{ translateY: -5, boxShadow: props => props.theme.shadows.medium }}
            >
              <InfoLabel>
                <FaMapMarkerAlt /> Location
              </InfoLabel>
              <InfoValue>
                {branch.address}<br />
                {branch.city}, {branch.state} {branch.zipCode}
              </InfoValue>
            </InfoGroup>
            
            <InfoGroup 
              variants={fadeInScale}
              whileHover={{ translateY: -5, boxShadow: props => props.theme.shadows.medium }}
            >
              <InfoLabel>
                <FaPhone /> Contact Information
              </InfoLabel>
              <InfoItem>
                <FaPhone />
                <InfoValue>{branch.phone}</InfoValue>
              </InfoItem>
              {branch.email && (
                <InfoItem>
                  <FaEnvelope />
                  <InfoValue>
                    <a href={`mailto:${branch.email}`}>{branch.email}</a>
                  </InfoValue>
                </InfoItem>
              )}
            </InfoGroup>
            
            <InfoGroup 
              variants={fadeInScale}
              whileHover={{ translateY: -5, boxShadow: props => props.theme.shadows.medium }}
            >
              <InfoLabel>
                <FaRegClock /> Operating Hours
              </InfoLabel>
              <InfoValue>
                <div>Monday - Friday: {branch.weekdayHours || '10:00 AM - 10:00 PM'}</div>
                <div>Saturday - Sunday: {branch.weekendHours || '11:00 AM - 11:00 PM'}</div>
              </InfoValue>
            </InfoGroup>
          </InfoSection>
        </Content>
        
        {branch.description && (
          <Description 
            variants={slideUp}
            initial="hidden"
            animate="visible"
          >
            <h3>About {branch.name}</h3>
            <p>{branch.description}</p>
          </Description>
        )}
        
        <StatCards 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
        >
          <StatCard 
            variants={fadeInScale}
            whileHover={{ y: -7, boxShadow: props => props.theme.shadows.medium }}
          >
            <div className="icon">
              <FaChair />
            </div>
            <div className="value">{totalTables}</div>
            <div className="label">Total Tables</div>
          </StatCard>
          
          <StatCard 
            variants={fadeInScale}
            whileHover={{ y: -7, boxShadow: props => props.theme.shadows.medium }}
            color="#4CAF50"
          >
            <div className="icon" style={{ color: '#4CAF50' }}>
              <FaChair />
            </div>
            <div className="value">{availableTables}</div>
            <div className="label">Available Tables</div>
          </StatCard>
          
          <StatCard 
            variants={fadeInScale}
            whileHover={{ y: -7, boxShadow: props => props.theme.shadows.medium }}
            color="#F44336"
          >
            <div className="icon" style={{ color: '#F44336' }}>
              <FaChair />
            </div>
            <div className="value">{occupiedTables}</div>
            <div className="label">Occupied Tables</div>
          </StatCard>
          
          <StatCard 
            variants={fadeInScale}
            whileHover={{ y: -7, boxShadow: props => props.theme.shadows.medium }}
            color="#FFC107"
          >
            <div className="icon" style={{ color: '#FFC107' }}>
              <FaChair />
            </div>
            <div className="value">{reservedTables}</div>
            <div className="label">Reserved Tables</div>
          </StatCard>
          
          <StatCard 
            variants={fadeInScale}
            whileHover={{ y: -7, boxShadow: props => props.theme.shadows.medium }}
            color="#2196F3"
          >
            <div className="icon" style={{ color: '#2196F3' }}>
              <FaUserFriends />
            </div>
            <div className="value">{branch.staffCount || 8}</div>
            <div className="label">Staff Members</div>
          </StatCard>
        </StatCards>
        
        <SectionTitle
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <FaTachometerAlt /> Management Options
        </SectionTitle>
        
        <ModulesGrid 
          variants={staggerContainer}
          initial="hidden" 
          animate="visible"
          transition={{ staggerChildren: 0.1, delayChildren: 0.6 }}
        >
          <ModuleCard 
            to={`/branches/${id}/tables`} 
            color="#FF5722"
            variants={fadeInScale}
            whileHover={{ y: -10, boxShadow: props => props.theme.shadows.medium }}
          >
            <FaChair style={{ color: '#FF5722' }} />
            <h3>Table Management</h3>
            <p>Manage tables, reservations and seating</p>
          </ModuleCard>
          
          <ModuleCard 
            to={`/branches/${id}/menu`} 
            color="#4CAF50"
            variants={fadeInScale}
            whileHover={{ y: -10, boxShadow: props => props.theme.shadows.medium }}
          >
            <FaUtensils style={{ color: '#4CAF50' }} />
            <h3>Menu Management</h3>
            <p>Manage menu items and categories</p>
          </ModuleCard>
          
          <ModuleCard 
            to={`/branches/${id}/deals`} 
            color="#2196F3"
            variants={fadeInScale}
            whileHover={{ y: -10, boxShadow: props => props.theme.shadows.medium }}
          >
            <FaPercentage style={{ color: '#2196F3' }} />
            <h3>Deals & Promotions</h3>
            <p>Create and manage special offers</p>
          </ModuleCard>
          
          <ModuleCard 
            to={`/branches/${id}/analytics`} 
            color="#9C27B0"
            variants={fadeInScale}
            whileHover={{ y: -10, boxShadow: props => props.theme.shadows.medium }}
          >
            <FaChartLine style={{ color: '#9C27B0' }} />
            <h3>Analytics</h3>
            <p>View performance metrics and trends</p>
          </ModuleCard>
          
          <ModuleCard 
            to={`/branches/${id}/staff`} 
            color="#FF9800"
            variants={fadeInScale}
            whileHover={{ y: -10, boxShadow: props => props.theme.shadows.medium }}
          >
            <FaUserFriends style={{ color: '#FF9800' }} />
            <h3>Staff Management</h3>
            <p>Manage staff schedules and roles</p>
          </ModuleCard>
          
          <ModuleCard 
            to={`/branches/${id}/settings`} 
            color="#607D8B"
            variants={fadeInScale}
            whileHover={{ y: -10, boxShadow: props => props.theme.shadows.medium }}
          >
            <FaMapMarkedAlt style={{ color: '#607D8B' }} />
            <h3>Branch Settings</h3>
            <p>Configure branch details and preferences</p>
          </ModuleCard>
        </ModulesGrid>
        
        {/* Table Management Card with animation */}
        <MenuCard 
          to={`/branches/${id}/tables`}
          whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}
          style={{ 
            background: 'linear-gradient(135deg, #2196F3, #03A9F4)',
            marginTop: '2rem'
          }}
        >
          <div className="card-content">
            <h3>Manage Tables</h3>
            <p>View and manage table reservations, capacity, and availability</p>
            <div className="action-button">
              <span>View Tables</span>
              <FaChevronRight />
            </div>
          </div>
          <div className="animation-container">
            <Lottie options={tableAnimationOptions} height={120} width={120} />
          </div>
        </MenuCard>
      </PageTransition>
      
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <ConfirmationModal
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
              {deleteSuccess ? (
                <>
                  <LottieWrapper>
                    <Lottie 
                      options={successAnimationOptions}
                      height={150}
                      width={150}
                    />
                  </LottieWrapper>
                  <ModalTitle>Branch Deleted Successfully!</ModalTitle>
                  <p>Redirecting to the restaurant page...</p>
                </>
              ) : (
                <>
                  <ModalTitle>Confirm Deletion</ModalTitle>
                  <p>Are you sure you want to delete this branch? This action cannot be undone and will delete all associated data including menus, tables, and reservations.</p>
                  <ModalButtons>
                    <ModalButton 
                      className="cancel"
                      onClick={() => setShowDeleteModal(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </ModalButton>
                    <ModalButton 
                      className="confirm"
                      onClick={handleDelete}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Yes, Delete
                    </ModalButton>
                  </ModalButtons>
                </>
              )}
            </ModalContent>
          </ConfirmationModal>
        )}
      </AnimatePresence>
    </DetailContainer>
  );
};

export default BranchDetail;