// src/components/pos/components/NewOrdersPanel.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBell, 
  FaTimes, 
  FaCheck, 
  FaUtensils,
  FaList,
  FaChair,
  FaEye
} from 'react-icons/fa';

const Panel = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
  background-color: ${props => props.theme.colors.background.paper};
  box-shadow: ${props => props.theme.shadows.large};
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const PanelHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PanelTitle = styled.h2`
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

const OrdersList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const OrderCard = styled.div`
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.background.main};
  margin-bottom: 1rem;
  border-left: 3px solid ${props => props.theme.colors.primary};
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const OrderId = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const OrderTime = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const OrderDetails = styled.div`
  margin-bottom: 1rem;
`;

const OrderCustomer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  span {
    font-weight: 500;
  }
`;

const ItemsList = styled.div`
  margin: 0.75rem 0;
  border-top: 1px solid ${props => props.theme.colors.background.paper}50;
  padding-top: 0.5rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemName = styled.div`
  flex: 1;
`;

const ItemQuantity = styled.div`
  width: 30px;
  text-align: center;
  font-weight: 500;
`;

const ItemPrice = styled.div`
  width: 60px;
  text-align: right;
  font-weight: 500;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  font-weight: 600;
  border-top: 1px solid ${props => props.theme.colors.background.paper}50;
  padding-top: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const TableSelectionContainer = styled.div`
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px dashed ${props => props.theme.colors.background.paper}80;
`;

const TableSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid ${props => props.theme.colors.background.paper};
  margin-bottom: 0.5rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all ${props => props.theme.transitions.short};
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      opacity: 0.9;
    }
  }
  
  &.secondary {
    background-color: ${props => props.theme.colors.background.paper};
    
    &:hover {
      background-color: ${props => props.theme.colors.background.paper}80;
    }
  }
  
  &.danger {
    background-color: ${props => props.theme.colors.error}20;
    color: ${props => props.theme.colors.error};
    
    &:hover {
      background-color: ${props => props.theme.colors.error}40;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${props => props.theme.colors.text.secondary};
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.2;
  }
`;

// Format time
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const NewOrdersPanel = ({ 
  newOrders,
  availableTables, 
  onClose, 
  onConfirmOrder,
  onRejectOrder
}) => {
  // State for mapping order to selected table
  const [selectedTables, setSelectedTables] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // Handle table selection
  const handleTableChange = (orderId, tableId) => {
    setSelectedTables({
      ...selectedTables,
      [orderId]: tableId
    });
  };
  
  // Handle order confirmation
// Handle order confirmation
const handleConfirmOrder = (order) => {
    const tableId = selectedTables[order.id];
    
    if (!tableId) {
      alert('Please select a table for this order');
      return;
    }
    
    onConfirmOrder(order, tableId);
  };
  
  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  return (
    <Panel
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ type: 'spring', damping: 25 }}
    >
      <PanelHeader>
        <PanelTitle>
          <FaBell /> Incoming Orders ({newOrders.length})
        </PanelTitle>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </PanelHeader>
      
      <OrdersList>
        {newOrders.length === 0 ? (
          <EmptyState>
            <FaUtensils />
            <p>No pending orders</p>
          </EmptyState>
        ) : (
          newOrders.map(order => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderId>Order #{order.id}</OrderId>
                <OrderTime>{formatTime(order.timestamp)}</OrderTime>
              </OrderHeader>
              
              <OrderDetails>
                <OrderCustomer>
                  Customer: <span>{order.customerName || 'Guest'}</span>
                </OrderCustomer>
                
                <Button 
                  className="secondary" 
                  onClick={() => toggleOrderDetails(order.id)}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <FaList /> {expandedOrder === order.id ? 'Hide' : 'View'} Order Details
                </Button>
                
                <AnimatePresence>
                  {expandedOrder === order.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <ItemsList>
                        {order.items.map(item => (
                          <OrderItem key={item.id}>
                            <ItemName>{item.name}</ItemName>
                            <ItemQuantity>×{item.quantity}</ItemQuantity>
                            <ItemPrice>{formatCurrency(item.amount)}</ItemPrice>
                          </OrderItem>
                        ))}
                        <OrderTotal>
                          <span>Total:</span>
                          <span>{formatCurrency(order.items.reduce((sum, item) => sum + parseFloat(item.amount), 0))}</span>
                        </OrderTotal>
                      </ItemsList>
                    </motion.div>
                  )}
                </AnimatePresence>
              </OrderDetails>
              
              <TableSelectionContainer>
                <label htmlFor={`table-select-${order.id}`}>Assign to Table:</label>
                <TableSelect
                  id={`table-select-${order.id}`}
                  value={selectedTables[order.id] || ''}
                  onChange={(e) => handleTableChange(order.id, parseInt(e.target.value))}
                >
                  <option value="">Select a table</option>
                  {availableTables.map(table => (
                    <option key={table.id} value={table.id}>
                      Table #{table.number} ({table.capacity} seats)
                    </option>
                  ))}
                </TableSelect>
              </TableSelectionContainer>
              
              <ActionButtons>
                <Button 
                  className="danger"
                  onClick={() => onRejectOrder(order.id)}
                >
                  <FaTimes /> Reject Order
                </Button>
                <Button 
                  className="primary"
                  onClick={() => handleConfirmOrder(order)}
                  disabled={!selectedTables[order.id]}
                >
                  <FaCheck /> Confirm Order
                </Button>
              </ActionButtons>
            </OrderCard>
          ))
        )}
      </OrdersList>
    </Panel>
  );
};

export default NewOrdersPanel;