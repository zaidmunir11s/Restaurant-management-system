// src/components/menu/components/MenuItemCard.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaPause,
  FaPlay,
  FaEdit,
  FaTags,
} from 'react-icons/fa';
import "@google/model-viewer";

const Card = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
  
  ${props => props.status === 'inactive' && `
    opacity: 0.7;
  `}
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  z-index: 2;
  
  background-color: ${props => {
    switch (props.status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#F44336';
      case 'featured':
        return '#FFB74D';
      default:
        return '#9E9E9E';
    }
  }};
  color: white;
`;

const ModelViewerContainer = styled.div`
  width: 100%;
  height: 180px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
`;

const ModelLoaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.2);
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${props => props.theme.colors.background.main};
  border-top-color: ${props => props.theme.colors.primary};
`;

const MenuItemContent = styled.div`
  padding: 1rem;
`;

const MenuItemTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

const MenuItemDescription = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceAndCategory = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Price = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const Category = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
  background-color: ${props => props.theme.colors.background.main};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconActionButton = styled.button`
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
    color: ${props => props.color || props.theme.colors.primary};
  }
`;

// Simple loading animation component
const ModelLoaderAnimation = () => (
  <LoadingSpinner 
    animate={{
      rotate: 360
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

const MenuItemCard = ({ 
  item, 
  toggleItemStatus, 
  openChangeCategoryModal,
  variants 
}) => {
  const [modelLoaded, setModelLoaded] = useState(false);
  
  useEffect(() => {
    // This will be called when the component unmounts
    return () => {
      const modelViewer = document.getElementById(`model-viewer-${item.id}`);
      if (modelViewer) {
        modelViewer.removeEventListener('load', handleModelLoad);
      }
    };
  }, [item.id]);
  
  const handleModelLoad = () => {
    setModelLoaded(true);
  };

  return (
    <Card 
      variants={variants}
      status={item.status}
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
    >
      <StatusBadge status={item.status}>
        {item.status}
      </StatusBadge>
      
      <ModelViewerContainer>
        {!modelLoaded && (
          <ModelLoaderOverlay>
            <ModelLoaderAnimation />
          </ModelLoaderOverlay>
        )}
        
        <model-viewer
          id={`model-viewer-${item.id}`}
          src={item.modelUrl}
          auto-rotate
          camera-controls="false"
          disable-zoom
          disable-pan
          interaction-prompt="none"
          style={{ width: '100%', height: '100%' }}
          onLoad={handleModelLoad}
        ></model-viewer>
      </ModelViewerContainer>
      
      <MenuItemContent>
        <MenuItemTitle>{item.title}</MenuItemTitle>
        <MenuItemDescription>{item.description}</MenuItemDescription>
        
        <PriceAndCategory>
          <Price>{item.price}</Price>
          <Category>{item.category}</Category>
        </PriceAndCategory>
        
        <ActionButtonsContainer>
          <IconActionButton onClick={() => toggleItemStatus(item.id)} color={item.status === 'active' ? '#F44336' : '#4CAF50'}>
            {item.status === 'active' ? <FaPause /> : <FaPlay />}
          </IconActionButton>
          
          <IconActionButton onClick={() => openChangeCategoryModal(item)} color="#FFB74D">
            <FaTags />
          </IconActionButton>
          
          <IconActionButton as={Link} to={`/menu-items/${item.id}/edit`} color="#2196F3">
            <FaEdit />
          </IconActionButton>
        </ActionButtonsContainer>
      </MenuItemContent>
    </Card>
  );
};

export default MenuItemCard;