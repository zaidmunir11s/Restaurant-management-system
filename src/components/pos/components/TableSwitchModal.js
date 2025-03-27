// src/components/pos/components/TableSwitchModal.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaChair, 
  FaExchangeAlt, 
  FaTimes, 
  FaCheck 
} from 'react-icons/fa';

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
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.large};
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
`;

const ModalHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
  overflow-y: auto;
`;

const CurrentTableInfo = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: ${props => props.theme.colors.background.main}50;
  border-radius: ${props => props.theme.borderRadius.medium};
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .icon {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.primary};
  }
  
  .info {
    flex: 1;
    
    .label {
      font-size: 0.8rem;
      color: ${props => props.theme.colors.text.secondary};
    }
    
    .value {
      font-size: 1.1rem;
      font-weight: 600;
    }
  }
`;

const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TableCard = styled.div`
  aspect-ratio: 1/1;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => {
    if (props.selected) return `${props.theme.colors.primary}20`;
    
    switch (props.status) {
      case 'available':
        return '#4CAF5020';
      case 'occupied':
        return '#F4433620';
      case 'reserved':
        return '#FFC10720';
      default:
        return props.theme.colors.background.main;
    }
  }};
  border: 2px solid ${props => {
    if (props.selected) return props.theme.colors.primary;
    
    switch (props.status) {
      case 'available':
        return '#4CAF50';
      case 'occupied':
        return '#F44336';
      case 'reserved':
        return '#FFC107';
      default:
        return props.theme.colors.background.main;
    }
  }};
  padding: 1rem;
  cursor: ${props => props.status === 'available' ? 'pointer' : 'not-allowed'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: ${props => props.status === 'available' ? 1 : 0.6};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    transform: ${props => props.status === 'available' ? 'translateY(-5px)' : 'none'};
  }
`;

const TableNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const TableCapacity = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const NoTablesMessage = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: ${props => props.theme.colors.text.secondary};
`;

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.background.main};
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => 
    props.variant === 'primary' 
      ? props.theme.colors.primary 
      : props.theme.colors.background.main
  };
  color: ${props => 
    props.variant === 'primary' 
      ? 'white' 
      : props.theme.colors.text.primary
  };
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TableSwitchModal = ({ 
  show, 
  onClose, 
  currentTable, 
  availableTables, 
  onSwitchTable 
}) => {
  const [selectedTableId, setSelectedTableId] = useState(null);
  
  const handleTableSelect = (tableId) => {
    setSelectedTableId(tableId);
  };
  
  const handleConfirmSwitch = () => {
    if (selectedTableId) {
      onSwitchTable(selectedTableId);
    }
  };
  
  return (
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
        <ModalHeader>
          <ModalTitle>
            <FaExchangeAlt /> Switch Table
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <CurrentTableInfo>
            <div className="icon">
              <FaChair />
            </div>
            <div className="info">
              <div className="label">Current Table</div>
              <div className="value">Table #{currentTable?.number} ({currentTable?.capacity} seats)</div>
            </div>
          </CurrentTableInfo>
          
          <h3>Select a new table:</h3>
          
          {availableTables.length === 0 ? (
            <NoTablesMessage>
              No available tables to switch to.
            </NoTablesMessage>
          ) : (
            <TableGrid>
              {availableTables.map(table => (
                <TableCard 
                  key={table.id}
                  status={table.status}
                  selected={selectedTableId === table.id}
                  onClick={() => table.status === 'available' && handleTableSelect(table.id)}
                >
                  <TableNumber>{table.number}</TableNumber>
                  <TableCapacity>{table.capacity} seats</TableCapacity>
                </TableCard>
              ))}
            </TableGrid>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={onClose}>
            <FaTimes /> Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirmSwitch}
            disabled={!selectedTableId}
          >
            <FaCheck /> Confirm Switch
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TableSwitchModal;