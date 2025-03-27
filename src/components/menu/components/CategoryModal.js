// src/components/menu/components/CategoryModal.js
import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: ${props => props.theme.shadows.large};
`;

const ModalTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.primary}50;
    border-radius: 4px;
  }
`;

const CategoryOption = styled.div`
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
  }
  
  ${props => props.selected && `
    background-color: ${props.theme.colors.primary}20;
    font-weight: 500;
  `}
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 500;
  display: flex;
  align-items: center;
  border: none;
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
      background-color: ${props => props.theme.colors.background.main};
    }
  }
`;

const CategoryModal = ({
  show,
  onClose,
  selectedItem,
  categories,
  changeItemCategory
}) => {
  // Filter out 'All' from the categories
  const filteredCategories = categories.filter(cat => cat !== 'All');
  
  return (
    <AnimatePresence>
      {show && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <ModalTitle>Change Category for {selectedItem?.title}</ModalTitle>
            
            <CategoryList>
              {filteredCategories.map(category => (
                <CategoryOption 
                  key={category}
                  selected={selectedItem && selectedItem.category === category}
                  onClick={() => changeItemCategory(category)}
                >
                  {category}
                </CategoryOption>
              ))}
            </CategoryList>
            
            <ModalActions>
              <ActionButton className="secondary" onClick={onClose}>
                Cancel
              </ActionButton>
              <ActionButton className="primary" onClick={onClose}>
                Done
              </ActionButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default CategoryModal;