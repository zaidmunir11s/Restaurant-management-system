// src/components/pos/components/PaymentModal.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaCreditCard, 
  FaMoneyBill, 
  FaTimes, 
  FaCheck, 
  FaQrcode,
  FaMobileAlt
} from 'react-icons/fa';

const ModalOverlay = styled(motion.div)`
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
  padding: 1.5rem;
`;

const OrderSummary = styled.div`
  background-color: ${props => props.theme.colors.background.main};
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &.total {
    font-size: 1.2rem;
    font-weight: 700;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid ${props => props.theme.colors.background.paper};
  }
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const PaymentMethod = styled.div`
  background-color: ${props => 
    props.selected 
      ? `${props.theme.colors.primary}20` 
      : props.theme.colors.background.main
  };
  border: 2px solid ${props => 
    props.selected 
      ? props.theme.colors.primary 
      : 'transparent'
  };
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => `${props.theme.colors.primary}10`};
  }
  
  svg {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: ${props => 
      props.selected 
        ? props.theme.colors.primary 
        : props.theme.colors.text.primary
    };
  }
`;

const AmountInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  border: 1px solid ${props => props.theme.colors.background.main};
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.background.main};
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

// src/components/pos/components/PaymentModal.js (continued)
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

const SuccessMessage = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  
  svg {
    font-size: 3rem;
    color: #4CAF50;
    margin-bottom: 1rem;
  }
  
  h3 {
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
`;

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const PaymentModal = ({ order, onClose, onPaymentComplete, total }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [amountPaid, setAmountPaid] = useState(total.toFixed(2));
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleCompletePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Auto close after success message
      setTimeout(() => {
        onPaymentComplete();
      }, 2000);
    }, 1500);
  };
  
  const handleAmountChange = (e) => {
    setAmountPaid(e.target.value);
  };
  
  const getChange = () => {
    const paid = parseFloat(amountPaid);
    return paid > total ? paid - total : 0;
  };
  
  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContent
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        {showSuccess ? (
          <SuccessMessage
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaCheck />
            <h3>Payment Successful!</h3>
            <p>The payment has been processed successfully.</p>
          </SuccessMessage>
        ) : (
          <>
            <ModalHeader>
              <ModalTitle>
                <FaCreditCard /> Process Payment
              </ModalTitle>
              <CloseButton onClick={onClose}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <OrderSummary>
                <SummaryRow>
                  <div>Order #{order.id}</div>
                  <div>Table #{order.tableNumber}</div>
                </SummaryRow>
                <SummaryRow>
                  <div>Items:</div>
                  <div>{order.items.length}</div>
                </SummaryRow>
                <SummaryRow className="total">
                  <div>Total:</div>
                  <div>{formatCurrency(total)}</div>
                </SummaryRow>
              </OrderSummary>
              
              <h3>Payment Method</h3>
              <PaymentMethods>
                <PaymentMethod 
                  selected={paymentMethod === 'cash'} 
                  onClick={() => setPaymentMethod('cash')}
                >
                  <FaMoneyBill />
                  <div>Cash</div>
                </PaymentMethod>
                <PaymentMethod 
                  selected={paymentMethod === 'card'} 
                  onClick={() => setPaymentMethod('card')}
                >
                  <FaCreditCard />
                  <div>Card</div>
                </PaymentMethod>
                <PaymentMethod 
                  selected={paymentMethod === 'mobile'} 
                  onClick={() => setPaymentMethod('mobile')}
                >
                  <FaMobileAlt />
                  <div>Mobile</div>
                </PaymentMethod>
                <PaymentMethod 
                  selected={paymentMethod === 'qr'} 
                  onClick={() => setPaymentMethod('qr')}
                >
                  <FaQrcode />
                  <div>QR Code</div>
                </PaymentMethod>
              </PaymentMethods>
              
              {paymentMethod === 'cash' && (
                <>
                  <h3>Amount Received</h3>
                  <AmountInput 
                    type="number" 
                    value={amountPaid}
                    onChange={handleAmountChange}
                    min={total}
                    step="0.01"
                  />
                  
                  <SummaryRow>
                    <div>Total Amount:</div>
                    <div>{formatCurrency(total)}</div>
                  </SummaryRow>
                  <SummaryRow>
                    <div>Amount Paid:</div>
                    <div>{formatCurrency(parseFloat(amountPaid))}</div>
                  </SummaryRow>
                  <SummaryRow>
                    <div>Change:</div>
                    <div>{formatCurrency(getChange())}</div>
                  </SummaryRow>
                </>
              )}
            </ModalBody>
            
            <ModalFooter>
              <Button onClick={onClose}>
                <FaTimes /> Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleCompletePayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Complete Payment'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default PaymentModal;