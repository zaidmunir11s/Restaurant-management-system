// src/components/pos/components/OrderPanel.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShoppingCart, 
  FaUtensils, 
  FaPlusCircle, 
  FaTrash, 
  FaCreditCard,
  FaEdit,
  FaReceipt,
  FaPrint,
  FaPlus,
  FaMinus,
  FaMoneyBill,
  FaQrcode,
  FaMobileAlt,
  FaCheck,
  FaTimes,
  FaCheckCircle,
  FaRegCreditCard,
  FaPercent,
  FaTag,
  FaHistory,
  FaListAlt,
  FaEnvelope,
  FaExchangeAlt
} from 'react-icons/fa';

const PanelContainer = styled.div`
  background-color: ${props => props.theme.colors.background.paper};
  height: 100%;
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

const TableInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.35rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.small};
  background-color: ${props => props.theme.colors.background.main};
  
  strong {
    color: ${props => props.theme.colors.primary};
  }
`;

const OrderContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const OrderSelector = styled.div`
  padding: 0.75rem 1rem;
  display: flex;
  gap: 0.5rem;
  background-color: ${props => props.theme.colors.background.main}50;
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
  flex-wrap: wrap;
`;

const OrderButton = styled.button`
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.paper};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.main};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.main};
  }
`;

const AddOrderButton = styled.button`
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border: 1px dashed ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}30;
  }
`;

const DeleteOrderButton = styled.button`
  padding: 0.5rem 0.75rem;
  background-color: ${props => props.theme.colors.error}20;
  color: ${props => props.theme.colors.error};
  border: 1px dashed ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: auto;
  
  &:hover {
    background-color: ${props => props.theme.colors.error}30;
  }
`;

const OrderItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  padding-right: 0.5rem;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ItemPrice = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.background.main};
  color: ${props => props.theme.colors.text.primary};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary};
    color: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 0.75rem;
  }
`;

const ItemQuantity = styled.div`
  width: 24px;
  text-align: center;
  font-weight: 500;
`;

const ItemTotal = styled.div`
  font-weight: 600;
  min-width: 60px;
  text-align: right;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.error};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  
  &:hover {
    color: ${props => props.theme.colors.error}dd;
  }
`;

const EmptyCart = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.background.main};
  }
`;

const OrderSummary = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-top: 1px solid ${props => props.theme.colors.background.main};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &.total {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px dashed ${props => props.theme.colors.background.main};
    font-weight: 700;
    font-size: 1.1rem;
  }
`;

const DiscountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: ${props => props.theme.colors.background.main}50;
  border-radius: ${props => props.theme.borderRadius.small};
  
  .discount-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: ${props => props.theme.colors.text.primary};
    
    svg {
      color: ${props => props.theme.colors.primary};
    }
  }
  
  .discount-value {
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
  }
`;

const DiscountInput = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors.background.main};
    border-radius: ${props => props.theme.borderRadius.small} 0 0 ${props => props.theme.borderRadius.small};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
  
  select {
    padding: 0.5rem;
    border: 1px solid ${props => props.theme.colors.background.main};
    border-left: none;
    border-radius: 0 ${props => props.theme.borderRadius.small} ${props => props.theme.borderRadius.small} 0;
    background-color: ${props => props.theme.colors.background.main};
    
    &:focus {
      outline: none;
    }
  }
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.background.main};
`;

const ReceiptButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.background.main};
`;

const Button = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      opacity: 0.9;
    }
  }
  
  &.secondary {
    background-color: ${props => props.theme.colors.background.main};
    color: ${props => props.theme.colors.text.primary};
    
    &:hover {
      background-color: ${props => props.theme.colors.background.main}dd;
    }
  }
  
  &.success {
    background-color: #4CAF50;
    color: white;
    
    &:hover {
      opacity: 0.9;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Modal Components for Payment
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
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.large};
  width: 90%;
  max-width: 500px;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  margin: 0;
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
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PaymentMethod = styled.div`
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : props.theme.colors.background.main};
  background-color: ${props => props.selected ? `${props.theme.colors.primary}20` : props.theme.colors.background.paper};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.selected ? `${props.theme.colors.primary}20` : props.theme.colors.background.main};
  }
  
  svg {
    font-size: 1.5rem;
    color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.text.primary};
  }
`;

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.background.main};
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const PaymentSummary = styled.div`
  background-color: ${props => props.theme.colors.background.main};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const SuccessMessage = styled(motion.div)`
  padding: 2rem;
  text-align: center;
  
  svg {
    font-size: 4rem;
    color: #4CAF50;
    margin-bottom: 1rem;
  }
`;

const EmailInput = styled.div`
  margin-top: 1rem;
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid ${props => props.theme.colors.background.main};
    border-radius: ${props => props.theme.borderRadius.small};
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
    }
  }
  
  button {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.75rem;
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${props => props.theme.borderRadius.small};
    cursor: pointer;
    
    &:hover {
      opacity: 0.9;
    }
  }
`;

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const OrderPanel = ({ 
  orders,
  table, 
  onPaymentComplete, 
  branch,
  onUpdateQuantity,
  onRemoveItem,
  onSetOrderStatus,
  onAddOrder,
  onDeleteOrder,
  activeOrderIndex,      // Add this
  setActiveOrderIndex ,
  onSwitchTable 
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [discountType, setDiscountType] = useState('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [emailAddress, setEmailAddress] = useState(''); 
  const [showSendReceiptModal, setShowSendReceiptModal] = useState(false);
  const [receiptSent, setReceiptSent] = useState(false);
  
  // Reset active order index when orders change
  useEffect(() => {
    if (orders && orders.length > 0 && activeOrderIndex >= orders.length) {
      setActiveOrderIndex(0);
    }
  }, [orders, activeOrderIndex]);
  
  // Get active order
  const activeOrder = orders && orders.length > 0 ? orders[activeOrderIndex] : null;
  
  // Calculate order totals with discount
  const calculateTotals = () => {
    if (!activeOrder || !activeOrder.items || activeOrder.items.length === 0) {
      return { subtotal: 0, discount: 0, tax: 0, total: 0 };
    }
    
    const subtotal = activeOrder.items.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    
    // Calculate discount
    let discountAmount = 0;
    if (discountValue && !isNaN(parseFloat(discountValue))) {
      if (discountType === 'percent') {
        discountAmount = subtotal * (parseFloat(discountValue) / 100);
      } else {
        discountAmount = parseFloat(discountValue);
      }
    }
    
    // Make sure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);
    
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * 0.08; // Assuming 8% tax
    const total = afterDiscount + tax;
    
    return { subtotal, discount: discountAmount, tax, total };
  };
  const handleInitiateTableSwitch = () => {
    if (!activeOrder) return;

    // Call the parent component's table switch method with the current order
    onSwitchTable(activeOrder);
  };
  const { subtotal, discount, tax, total } = calculateTotals();
  
  // Apply discount
  const applyDiscount = () => {
    if (!activeOrder) return;
    
    // Save discount to order
    onSetOrderStatus(activeOrder.id, {
      discountType,
      discountValue: parseFloat(discountValue),
      discountAmount: discount
    });
  };
  
  // Handle payment completion
  const handleCompletePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      
      // Wait to show success message before closing
      setTimeout(() => {
        if (onPaymentComplete) {
          onPaymentComplete(activeOrder.id);
        }
        setShowPaymentModal(false);
        setPaymentComplete(false);
      }, 2000);
    }, 1500);
  };
  
  // Handle complete order (mark as served)
  const handleCompleteOrder = () => {
    if (!activeOrder) return;
    
    // Mark order as served
    onSetOrderStatus(activeOrder.id, { status: 'served' });
  };
  
  // Handle confirming order
  const handleConfirmOrder = () => {
    if (!activeOrder) return;
    
    // Mark order as confirmed
    onSetOrderStatus(activeOrder.id, { status: 'confirmed', modified: false });
  };
  
  // Handle confirming modifications
  const handleConfirmModifications = () => {
    if (!activeOrder) return;
    
    // Mark order as confirmed again after modifications
    onSetOrderStatus(activeOrder.id, { modified: false, status: 'confirmed' });
  };
  
  // Handle printing receipt
  const handlePrintReceipt = () => {
    if (!activeOrder) return;
    
    // Generate receipt content
    const receiptContent = {
      orderId: activeOrder.id,
      tableNumber: activeOrder.tableNumber,
      timestamp: new Date().toISOString(),
      items: activeOrder.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        amount: item.amount
      })),
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      paid: true
    };
    
    // Store receipt in localStorage for this branch
    const receipts = JSON.parse(localStorage.getItem(`branch_receipts_${branch.id}`) || '[]');
    receipts.push(receiptContent);
    localStorage.setItem(`branch_receipts_${branch.id}`, JSON.stringify(receipts));
    
    // For demo, show receipt in console
    console.log('RECEIPT');
    console.log('----------------------------------------');
    console.log(`Order #${activeOrder.id}`);
    console.log(`Table: ${activeOrder.tableNumber}`);
    console.log(`Date: ${new Date().toLocaleString()}`);
    console.log('----------------------------------------');
    activeOrder.items.forEach(item => {
      console.log(`${item.quantity}x ${item.name} - ${formatCurrency(item.amount)}`);
    });
    console.log('----------------------------------------');
    console.log(`Subtotal: ${formatCurrency(subtotal)}`);
    if (discount > 0) {
      console.log(`Discount: -${formatCurrency(discount)}`);
    }
    console.log(`Tax (8%): ${formatCurrency(tax)}`);
    console.log(`Total: ${formatCurrency(total)}`);
    console.log('----------------------------------------');
    
    // Show alert for demo purposes
    alert('Receipt generated! Check the console for details.');
  };
  
  // Handle sending receipt
  const handleSendReceipt = () => {
    setShowSendReceiptModal(true);
  };
  
  // Handle sending receipt by email
  const handleSendEmailReceipt = () => {
    if (!activeOrder || !emailAddress) return;
    
    setIsProcessing(true);
    
    // Generate receipt content (same as print receipt)
    const receiptContent = {
      orderId: activeOrder.id,
      tableNumber: activeOrder.tableNumber,
      timestamp: new Date().toISOString(),
      items: activeOrder.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        amount: item.amount
      })),
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      paid: true,
      email: emailAddress
    };
    
    // Store receipt in localStorage for this branch
    const receipts = JSON.parse(localStorage.getItem(`branch_receipts_${branch.id}`) || '[]');
    receipts.push(receiptContent);
    localStorage.setItem(`branch_receipts_${branch.id}`, JSON.stringify(receipts));
    
    console.log('Sending receipt to email:', emailAddress);
    console.log('Receipt data:', receiptContent);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setReceiptSent(true);
      
      // Close modal after showing success message
      setTimeout(() => {
        setShowSendReceiptModal(false);
        setReceiptSent(false);
        setEmailAddress('');
      }, 2000);
    }, 1500);
  };
  
  // Handle deleting an order
  const handleDeleteOrder = () => {
    if (!activeOrder) return;
    
    if (window.confirm(`Are you sure you want to delete Order #${activeOrderIndex + 1}?`)) {
      onDeleteOrder(activeOrder.id);
    }
  };
  
  return (
    <PanelContainer>
      <PanelHeader>
        <PanelTitle>
          <FaShoppingCart /> Order
        </PanelTitle>
        {table && (
          <TableInfo>
            Table <strong>#{table.number}</strong> • {table.capacity} Seats
          </TableInfo>
        )}
      </PanelHeader>
      
      {orders && orders.length > 0 && (
        <OrderSelector>
          {orders.map((order, index) => (
            <OrderButton 
              key={order.id}
              active={index === activeOrderIndex}
              onClick={() => setActiveOrderIndex(index)}
            >
              #{index + 1} 
              {order.status === 'served' ? <FaCheck size={12} /> : null}
              {order.status === 'confirmed' && !order.modified ? <FaCheckCircle size={12} color="#4CAF50" style={{marginLeft: '3px'}} /> : null}
              {order.status === 'confirmed' && order.modified ? <FaEdit size={12} color="#FF9800" style={{marginLeft: '3px'}} /> : null}
            </OrderButton>
          ))}
          
          <AddOrderButton onClick={() => onAddOrder(table?.id)}>
            <FaPlus /> New
          </AddOrderButton>
          
          {orders.length > 0 && (
            <DeleteOrderButton onClick={handleDeleteOrder}>
              <FaTrash /> Delete
            </DeleteOrderButton>
          )}
        </OrderSelector>
      )}
      
      <OrderContent>
        {!activeOrder || activeOrder.items.length === 0 ? (
          <EmptyCart>
            <FaShoppingCart />
            <p>No items in order</p>
            <p>Select items from the menu to add them</p>
          </EmptyCart>
        ) : (
          <OrderItemsList>
            {activeOrder.items.map(item => (
              <OrderItem key={item.id}>
                <ItemInfo>
                  <ItemName>{item.name}</ItemName>
                  <ItemPrice>{formatCurrency(item.price)} each</ItemPrice>
                </ItemInfo>
                <ItemActions>
                  <QuantityButton 
                    onClick={() => onUpdateQuantity(activeOrder.id, item.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus />
                  </QuantityButton>
                  <ItemQuantity>{item.quantity}</ItemQuantity>
                  <QuantityButton 
                    onClick={() => onUpdateQuantity(activeOrder.id, item.id, 1)}
                  >
                    <FaPlus />
                  </QuantityButton>
                </ItemActions>
                <ItemTotal>
                  {formatCurrency(item.amount)}
                  <RemoveButton onClick={() => onRemoveItem(activeOrder.id, item.id)}>
                    <FaTrash />
                  </RemoveButton>
                </ItemTotal>
              </OrderItem>
            ))}
          </OrderItemsList>
        )}
      </OrderContent>
      
      <OrderSummary>
        <SummaryRow>
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </SummaryRow>
        
        {/* Discount section */}
        <DiscountRow>
          <div className="discount-label">
            <FaTag /> Discount
          </div>
          <div className="discount-value">
            {discount > 0 ? `-${formatCurrency(discount)}` : '-'}
          </div>
        </DiscountRow>
        
        <DiscountInput>
          <input 
            type="number" 
            min="0" 
            placeholder="Add discount"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
          />
          <select 
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="percent">%</option>
            <option value="amount">$</option>
          </select>
          <Button 
            className="secondary" 
            onClick={applyDiscount}
            style={{ borderRadius: '0 0 0 0' }}
          >
            Apply
          </Button>
        </DiscountInput>
        
        <SummaryRow>
          <span>Tax (8%)</span>
          <span>{formatCurrency(tax)}</span>
        </SummaryRow>
        <Button
            className="secondary"
            onClick={handleInitiateTableSwitch}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaExchangeAlt /> Switch Table
          </Button>
        
<SummaryRow className="total">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </SummaryRow>
      </OrderSummary>
      
      {activeOrder && activeOrder.status === 'preparing' ? (
        <ActionButtons>
          <Button
            className="secondary"
            onClick={handleConfirmOrder}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaCheckCircle /> Confirm Order
          </Button>
          <Button
            className="success"
            onClick={handleCompleteOrder}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaCheck /> Complete Order
          </Button>
          <Button
            className="secondary"
            onClick={handleInitiateTableSwitch}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaExchangeAlt /> Switch Table
          </Button>
        </ActionButtons>
      ) : activeOrder && activeOrder.status === 'confirmed' && !activeOrder.modified ? (
        <ActionButtons>
          <Button
            className="secondary"
            onClick={handlePrintReceipt}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaPrint /> Print Receipt
          </Button>
          <Button
            className="success"
            onClick={handleCompleteOrder}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaCheck /> Complete Order
          </Button>
        </ActionButtons>
      ) : activeOrder && activeOrder.status === 'confirmed' && activeOrder.modified ? (
        <ActionButtons>
          <Button
            className="secondary"
            onClick={handlePrintReceipt}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaPrint /> Print Receipt
          </Button>
          <Button
            className="primary"
            onClick={handleConfirmModifications}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaEdit /> Confirm Changes
          </Button>
        </ActionButtons>
      ) : activeOrder && activeOrder.status === 'served' && activeOrder.modified ? (
        // New condition: Served orders with modifications show Modify button instead of Pay
        <ReceiptButtons>
          <Button
            className="secondary"
            onClick={handlePrintReceipt}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaPrint /> Print
          </Button>
          <Button
            className="secondary"
            onClick={handleSendReceipt}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaEnvelope /> Email
          </Button>
          <Button
            className="success"
            onClick={handleConfirmModifications}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaEdit /> Modify
          </Button>
        </ReceiptButtons>
      ) : (
        // Default case: Normal served orders without modifications show Pay button
        <ReceiptButtons>
          <Button
            className="secondary"
            onClick={handlePrintReceipt}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaPrint /> Print
          </Button>
          <Button
            className="secondary"
            onClick={handleSendReceipt}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaEnvelope /> Email
          </Button>
          <Button
            className="primary"
            onClick={() => setShowPaymentModal(true)}
            disabled={!activeOrder || activeOrder.items.length === 0}
          >
            <FaCreditCard /> Pay
          </Button>
        </ReceiptButtons>
      )}
      
      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {paymentComplete ? (
                <SuccessMessage>
                  <FaCheckCircle />
                  <h2>Payment Successful!</h2>
                  <p>The payment has been processed successfully.</p>
                </SuccessMessage>
              ) : (
                <>
                  <ModalHeader>
                    <ModalTitle>
                      <FaCreditCard /> Process Payment
                    </ModalTitle>
                    <CloseButton onClick={() => setShowPaymentModal(false)}>
                      <FaTimes />
                    </CloseButton>
                  </ModalHeader>
                  
                  <ModalBody>
                    <PaymentSummary>
                      <SummaryRow>
                        <strong>Table #{table?.number}</strong>
                        <span>{formatCurrency(total)}</span>
                      </SummaryRow>
                    </PaymentSummary>
                    
                    <h4>Select Payment Method</h4>
                    <PaymentMethods>
                      <PaymentMethod
                        selected={paymentMethod === 'card'}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <FaRegCreditCard />
                        <span>Card</span>
                      </PaymentMethod>
                      <PaymentMethod
                        selected={paymentMethod === 'cash'}
                        onClick={() => setPaymentMethod('cash')}
                      >
                        <FaMoneyBill />
                        <span>Cash</span>
                      </PaymentMethod>
                    </PaymentMethods>
                  </ModalBody>
                  
                  <ModalFooter>
                    <Button
                      className="secondary"
                      onClick={() => setShowPaymentModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="primary"
                      onClick={handleCompletePayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Complete Payment'}
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
      
      {/* Send Receipt Modal */}
      <AnimatePresence>
        {showSendReceiptModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {receiptSent ? (
                <SuccessMessage>
                  <FaCheckCircle />
                  <h2>Receipt Sent!</h2>
                  <p>The receipt has been sent to {emailAddress}</p>
                </SuccessMessage>
              ) : (
                <>
                  <ModalHeader>
                    <ModalTitle>
                      <FaEnvelope /> Send Receipt
                    </ModalTitle>
                    <CloseButton onClick={() => setShowSendReceiptModal(false)}>
                      <FaTimes />
                    </CloseButton>
                  </ModalHeader>
                  
                  <ModalBody>
                    <h4>Enter Email Address</h4>
                    <EmailInput>
                      <input 
                        type="email"
                        placeholder="customer@example.com"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                      />
                      <button 
                        onClick={handleSendEmailReceipt}
                        disabled={!emailAddress || isProcessing}
                      >
                        {isProcessing ? 'Sending...' : 'Send Receipt'}
                      </button>
                    </EmailInput>
                  </ModalBody>
                  
                  <ModalFooter>
                    <Button
                      className="secondary"
                      onClick={() => setShowSendReceiptModal(false)}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </PanelContainer>
  );
};

export default OrderPanel;