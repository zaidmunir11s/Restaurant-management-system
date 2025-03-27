// src/components/pos/CustomerOrderSimulator.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaShoppingCart, 
  FaPlus, 
  FaMinus, 
  FaCheck, 
  FaTimes,
  FaUser
} from 'react-icons/fa';

const SimulatorContainer = styled(motion.div)`
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const SimulatorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    
    svg {
      color: #FF5722;
    }
  }
`;

const BranchSelect = styled.div`
  select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    
    &:focus {
      outline: none;
      border-color: #FF5722;
    }
  }
`;

const MenuSection = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: #333;
  }
`;

const MenuItems = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const MenuItem = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f9f9f9;
    transform: translateY(-2px);
    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.05);
  }
  
  .item-info {
    flex: 1;
    
    .item-name {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    
    .item-price {
      color: #FF5722;
      font-weight: 600;
    }
  }
  
  .item-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${props => props.add ? '#FF5722' : '#f0f0f0'};
  color: ${props => props.add ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.9;
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CartSection = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: #333;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
  
  .item-info {
    flex: 1;
    
    .item-name {
      font-weight: 500;
    }
    
    .item-price {
      font-size: 0.9rem;
      color: #666;
    }
  }
  
  .item-quantity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .quantity {
      font-weight: 600;
      min-width: 24px;
      text-align: center;
    }
  }
  
  .item-total {
    font-weight: 600;
    color: #FF5722;
  }
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed #ddd;
  font-weight: 600;
  font-size: 1.1rem;
`;

const CustomerInfo = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    margin-bottom: 1rem;
    font-size: 1.1rem;
    color: #333;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    
    &:focus {
      outline: none;
      border-color: #FF5722;
    }
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #FF5722;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: #E64A19;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  text-align: center;
  margin: 2rem 0;
  
  svg {
    font-size: 4rem;
    color: #4CAF50;
    margin-bottom: 1rem;
  }
  
  h3 {
    margin-bottom: 0.5rem;
    color: #4CAF50;
  }
  
  p {
    color: #666;
    margin-bottom: 1.5rem;
  }
`;

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const CustomerOrderSimulator = () => {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  
  // Load branches and menu items
  useEffect(() => {
    // Load branches
    const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
    setBranches(storedBranches);
    
    if (storedBranches.length > 0) {
      setSelectedBranch(storedBranches[0]);
      
      // Load menu items for the first branch
      const branchMenuItems = JSON.parse(localStorage.getItem(`branch_menu_${storedBranches[0].id}`) || '[]');
      setMenuItems(branchMenuItems);
    }
  }, []);
  
  // Load menu items when branch changes
  const handleBranchChange = (e) => {
    const branchId = parseInt(e.target.value);
    const branch = branches.find(b => b.id === branchId);
    
    if (branch) {
      setSelectedBranch(branch);
      
      // Load menu items
      const branchMenuItems = JSON.parse(localStorage.getItem(`branch_menu_${branchId}`) || '[]');
      setMenuItems(branchMenuItems);
    }
  };
  
  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.menuItemId === item.id);
    
    if (existingItem) {
      // Update quantity
      const updatedCart = cart.map(cartItem => {
        if (cartItem.menuItemId === item.id) {
          const quantity = cartItem.quantity + 1;
          const amount = (parseFloat(item.price) * quantity).toFixed(2);
          return { ...cartItem, quantity, amount };
        }
        return cartItem;
      });
      
      setCart(updatedCart);
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        amount: item.price
      };
      
      setCart([...cart, newItem]);
    }
  };
  
  // Update item quantity
  const updateQuantity = (itemId, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const quantity = Math.max(1, item.quantity + change);
        const amount = (parseFloat(item.price) * quantity).toFixed(2);
        return { ...item, quantity, amount };
      }
      return item;
    });
    
    setCart(updatedCart);
  };
  
  // Remove item from cart
  const removeItem = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };
  
  // Calculate total
  const total = cart.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  
  // Submit order
  const submitOrder = () => {
    if (!selectedBranch || cart.length === 0) return;
    
    const order = {
      id: Date.now(),
      branchId: selectedBranch.id,
      timestamp: new Date().toISOString(),
      customerName: customerName || 'Guest',
      items: cart,
      status: 'pending',
      total
    };
    
    // Save to localStorage
    const incomingOrders = JSON.parse(localStorage.getItem(`branch_incoming_orders_${selectedBranch.id}`) || '[]');
    localStorage.setItem(`branch_incoming_orders_${selectedBranch.id}`, JSON.stringify([...incomingOrders, order]));
    
    // Reset form
    setOrderSubmitted(true);
    setCart([]);
    
    // Reset after a delay
    setTimeout(() => {
      setOrderSubmitted(false);
      setCustomerName('');
    }, 5000);
  };
  
  // Get unique categories
  const categories = [...new Set(menuItems.map(item => item.category))];
  
  return (
    <SimulatorContainer>
      <SimulatorHeader>
        <h2><FaShoppingCart /> Customer Order</h2>
        
        <BranchSelect>
          <select 
            value={selectedBranch?.id || ''}
            onChange={handleBranchChange}
          >
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </BranchSelect>
      </SimulatorHeader>
      
      {orderSubmitted ? (
        <SuccessMessage
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FaCheck />
          <h3>Order Submitted Successfully!</h3>
          <p>Your order has been sent to the restaurant.</p>
          <SubmitButton onClick={() => setOrderSubmitted(false)}>Place Another Order</SubmitButton>
        </SuccessMessage>
      ) : (
        <>
          {categories.map(category => (
            <MenuSection key={category}>
              <h3>{category}</h3>
              <MenuItems>
                {menuItems
                  .filter(item => item.category === category)
                  .map(item => (
                    <MenuItem key={item.id}>
                      <div className="item-info">
                        <div className="item-name">{item.name}</div>
                        <div className="item-price">{formatCurrency(item.price)}</div>
                      </div>
                      <div className="item-actions">
                        <ActionButton add onClick={() => addToCart(item)}>
                          <FaPlus size={12} />
                        </ActionButton>
                      </div>
                    </MenuItem>
                  ))
                }
              </MenuItems>
            </MenuSection>
          ))}
          
          <CartSection>
            <h3><FaShoppingCart /> Your Order</h3>
            
            {cart.length === 0 ? (
              <p>Your cart is empty. Add items to place an order.</p>
            ) : (
              <>
                {cart.map(item => (
                  <CartItem key={item.id}>
                    <div className="item-info">
                      <div className="item-name">{item.name}</div>
                      <div className="item-price">{formatCurrency(item.price)} each</div>
                    </div>
                    <div className="item-quantity">
                      <ActionButton onClick={() => updateQuantity(item.id, -1)}>
                        <FaMinus size={12} />
                      </ActionButton>
                      <div className="quantity">{item.quantity}</div>
                      <ActionButton onClick={() => updateQuantity(item.id, 1)}>
                        <FaPlus size={12} />
                      </ActionButton>
                    </div>
                    <div className="item-total">
                      {formatCurrency(item.amount)}
                      <ActionButton onClick={() => removeItem(item.id)}>
                        <FaTimes size={12} />
                      </ActionButton>
                    </div>
                  </CartItem>
                ))}
                
                <CartTotal>
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </CartTotal>
              </>
            )}
          </CartSection>
          
          <CustomerInfo>
            <h3><FaUser /> Your Information</h3>
            <input 
              type="text"
              placeholder="Your Name (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </CustomerInfo>
          
          <SubmitButton 
            onClick={submitOrder}
            disabled={cart.length === 0}
          >
            <FaCheck /> Place Order
          </SubmitButton>
        </>
      )}
    </SimulatorContainer>
  );
};

export default CustomerOrderSimulator;