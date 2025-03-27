// src/components/pos/POSScreen.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FaUtensils, FaArrowLeft, FaBell, FaCashRegister, FaExpand, 
  FaCompress, FaChair, FaSearch, FaPlus,
  FaStore, FaTachometerAlt, FaListAlt, FaShoppingCart, FaShoppingBasket
} from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';

// Import components
import BranchSelector from './components/BranchSelector';
import TableGrid from './components/TableGrid';
import OrderPanel from './components/OrderPanel';
import NotificationsPanel from './components/NotificationsPanel';
import MenuItemSelector from './components/MenuItemSelector';
import NewOrdersPanel from './components/NewOrdersPanel';
import TableSwitchModal from './components/TableSwitchModal';

// Styled Components
const POSContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px); /* Adjust for navbar height */
  overflow: hidden;
  background-color: ${props => props.theme.colors.background.main};
`;

const POSHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.colors.background.paper};
  box-shadow: ${props => props.theme.shadows.small};
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderTitle = styled.h1`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.3rem;
  margin: 0;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const IconButton = styled.button`
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
  position: relative;
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main}50;
    color: ${props => props.theme.colors.primary};
  }
  
  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: ${props => props.theme.colors.error};
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const POSContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const TabsContainer = styled.div`
  width: 70px;
  background-color: ${props => props.theme.colors.background.paper};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  box-shadow: ${props => props.theme.shadows.small};
`;

const TabButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
  border: none;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.main};
  }
  
  svg {
    font-size: 1.2rem;
  }
  
  span {
    font-size: 0.65rem;
  }
`;

const POSMainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TableFilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.background.main};
  border-radius: ${props => props.theme.borderRadius.small};
  padding: 0 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.text.secondary};
    font-size: 0.9rem;
    margin-right: 0.5rem;
  }
  
  input {
    border: none;
    background: transparent;
    padding: 0.5rem;
    width: 180px;
    color: ${props => props.theme.colors.text.primary};
    font-size: 0.9rem;
    
    &:focus {
      outline: none;
    }
  }
`;

const POSLeftPanel = styled.div`
  flex: 1;
  overflow-y: auto;
  display: ${props => props.visible ? 'block' : 'none'};
  padding: 1rem;
`;

const POSMenuPanel = styled.div`
  flex: 1;
  overflow-y: auto;
  display: ${props => props.visible ? 'block' : 'none'};
  padding: 1rem;
`;

const POSRightPanel = styled.div`
  width: 380px;
  background-color: ${props => props.theme.colors.background.paper};
  border-left: 1px solid ${props => props.theme.colors.background.main};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1024px) {
    width: 320px;
  }
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  overflow-x: auto;
  background-color: ${props => props.theme.colors.background.paper};
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.primary}50;
    border-radius: 4px;
  }
`;

const CategoryTab = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.main};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : `${props.theme.colors.background.main}80`};
  }
`;

const MenuItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const MenuItem = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
  overflow: hidden;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  border: 1px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
    border-color: ${props => props.theme.colors.primary}30;
  }
`;

const MenuItemImage = styled.div`
  height: 100px;
  background-color: #f0f0f0;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const MenuItemContent = styled.div`
  padding: 0.75rem;
`;

const MenuItemName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 500;
`;

const MenuItemPrice = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

// Helper functions for generating demo data
const generateDemoTables = (branchId) => {
  const tables = [];
  const numTables = 20; // Fixed number of tables
  
  for (let i = 1; i <= numTables; i++) {
    // Randomly assign status for demo
    const status = Math.random() < 0.3 ? 'occupied' : 
                  (Math.random() < 0.5 ? 'reserved' : 'available');
    
    tables.push({
      id: parseInt(`${branchId}${String(i).padStart(3, '0')}`), // Unique ID combining branch and table
      number: i,
      capacity: Math.floor(Math.random() * 4) + 2, // 2-6 people
      status: status,
      section: i <= numTables/2 ? 'Indoor' : 'Outdoor',
      occupiedSince: status === 'occupied' ? new Date(Date.now() - (Math.random() * 7200000)).toISOString() : null, // Random time in last 2 hours
      orderId: status === 'occupied' ? parseInt(`${branchId}${String(i).padStart(3, '0')}`) : null
    });
  }
  
  return tables;
};

// Generate demo menu items
const generateDemoMenuItems = (branchId) => {
  const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Sides'];
  const menuItems = [];
  
  // Generate items for each category
  categories.forEach((category, categoryIndex) => {
    const itemCount = Math.floor(Math.random() * 5) + 3; // 3-7 items per category
    
    for (let i = 1; i <= itemCount; i++) {
      const basePrice = categoryIndex === 3 ? 3 : // Beverages are cheaper
                       categoryIndex === 2 ? 7 :  // Desserts mid-priced
                       categoryIndex === 0 ? 8 :  // Appetizers
                       categoryIndex === 4 ? 5 :  // Sides
                       15;                        // Main courses are more expensive
      
      menuItems.push({
        id: parseInt(`${branchId}${categoryIndex}${i}`),
        name: `${category.slice(0, -1)} ${i}`,
        price: (basePrice + Math.random() * 5).toFixed(2),
        category,
        description: `Delicious ${category.toLowerCase()} option ${i}`,
        status: Math.random() > 0.1 ? 'active' : 'inactive' // Most items are active
      });
    }
  });
  
  return menuItems;
};

// Generate demo orders for occupied tables
const generateDemoOrders = (branchId, occupiedTables, menuItems) => {
  const orders = [];
  
  occupiedTables.forEach(table => {
    const orderItems = [];
    const itemCount = Math.floor(Math.random() * 4) + 1; // 1-4 items per order
    
    // Add random menu items to the order
    for (let i = 0; i < itemCount; i++) {
      if (menuItems.length === 0) continue;
      
      const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
      
      orderItems.push({
        id: Date.now() + i,
        menuItemId: randomItem.id,
        name: randomItem.name,
        price: randomItem.price,
        quantity,
        amount: (parseFloat(randomItem.price) * quantity).toFixed(2),
        status: Math.random() > 0.3 ? 'served' : 'preparing'
      });
    }
    
    orders.push({
      id: table.orderId || Date.now(),
      tableId: table.id,
      tableNumber: table.number,
      status: 'active',
      items: orderItems,
      timestamp: table.occupiedSince || new Date().toISOString(),
      paid: false
    });
  });
  
  return orders;
};

const POSScreen = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const containerRef = useRef(null);
  
  // State variables
  const [activeTab, setActiveTab] = useState('tables'); // tables, menu, orders
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]); // Orders for selected table
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewOrders, setShowNewOrders] = useState(false);
  const [newOrders, setNewOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrderIndex, setActiveOrderIndex] = useState(0);
  const [showTableSwitchModal, setShowTableSwitchModal] = useState(false);
  const [orderToSwitch, setOrderToSwitch] = useState(null);
  
  // Toggle fullscreen
  // Toggle fullscreen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullScreen(false);
    }
  };
  
  // Load branches and data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load branches from localStorage
        const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
        
        if (storedBranches.length === 0) {
          // Create demo data if no branches exist
          const demoBranches = [
            { id: 1, name: 'Downtown Branch', restaurantId: 1 },
            { id: 2, name: 'Mall Branch', restaurantId: 1 },
            { id: 3, name: 'Beachside Branch', restaurantId: 2 }
          ];
          localStorage.setItem('branches', JSON.stringify(demoBranches));
          setBranches(demoBranches);
          
          // Set initial branch
          if (branchId) {
            const branch = demoBranches.find(b => b.id === parseInt(branchId));
            if (branch) {
              setSelectedBranch(branch);
              await loadBranchData(branch.id);
            } else {
              setSelectedBranch(demoBranches[0]);
              await loadBranchData(demoBranches[0].id);
            }
          } else {
            setSelectedBranch(demoBranches[0]);
            await loadBranchData(demoBranches[0].id);
          }
        } else {
          setBranches(storedBranches);
          
          // Set initial branch
          if (branchId) {
            const branch = storedBranches.find(b => b.id === parseInt(branchId));
            if (branch) {
              setSelectedBranch(branch);
              await loadBranchData(parseInt(branchId));
            } else if (storedBranches.length > 0) {
              setSelectedBranch(storedBranches[0]);
              await loadBranchData(storedBranches[0].id);
            }
          } else if (storedBranches.length > 0) {
            setSelectedBranch(storedBranches[0]);
            await loadBranchData(storedBranches[0].id);
          }
        }
        
        // Generate mock notifications
        const mockNotifications = [
          {
            id: 1,
            type: 'call-waiter',
            title: 'Waiter Requested',
            message: 'Customer at Table #5 has requested assistance',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
            read: false
          },
          {
            id: 2,
            type: 'order-ready',
            title: 'Order Ready',
            message: 'Order #1023 for Table #3 is ready for pickup',
            timestamp: new Date(Date.now() - 12 * 60000).toISOString(), // 12 minutes ago
            read: true
          }
        ];
        
        setNotifications(mockNotifications);
        
        // Load incoming orders
        const incomingOrders = JSON.parse(localStorage.getItem(`branch_incoming_orders_${branchId || 1}`) || '[]');
        setNewOrders(incomingOrders);
      } catch (error) {
        console.error('Error loading branches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Set up polling for new orders (simulate customer orders coming in)
    const interval = setInterval(() => {
      const currentIncomingOrders = JSON.parse(localStorage.getItem(`branch_incoming_orders_${branchId || 1}`) || '[]');
      setNewOrders(currentIncomingOrders);
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [branchId]);

  // Update table orders when selected table changes
  useEffect(() => {
    if (selectedTable) {
      const tableOrders = orders.filter(order => order.tableId === selectedTable.id);
      setCurrentOrders(tableOrders);
    } else {
      setCurrentOrders([]);
    }
  }, [selectedTable, orders]);
  
  // Load branch data (tables, menu, orders)
  const loadBranchData = async (branchId) => {
    try {
      // Load tables
      let storedTables = JSON.parse(localStorage.getItem(`branch_tables_${branchId}`) || '[]');
      
      if (storedTables.length === 0) {
        // Generate demo tables if none exist
        storedTables = generateDemoTables(branchId);
        localStorage.setItem(`branch_tables_${branchId}`, JSON.stringify(storedTables));
      }
      
      setTables(storedTables);
      
      // Load menu items from branch or restaurant
      let menuItemsData = [];
      
      // First try to get branch-specific menu
      const branchMenuItems = JSON.parse(localStorage.getItem(`branch_menu_${branchId}`) || '[]');
      
      if (branchMenuItems.length > 0) {
        menuItemsData = branchMenuItems;
      } else {
        // If no branch menu, try to get the restaurant menu
        const branch = branches.find(b => b.id === branchId);
        if (branch && branch.restaurantId) {
          const restaurantMenuItems = JSON.parse(localStorage.getItem(`restaurant_menu_${branch.restaurantId}`) || '[]');
          if (restaurantMenuItems.length > 0) {
            menuItemsData = restaurantMenuItems;
          }
        }
        
        // If still no menu items, create mock data
        if (menuItemsData.length === 0) {
          menuItemsData = generateDemoMenuItems(branchId);
          localStorage.setItem(`branch_menu_${branchId}`, JSON.stringify(menuItemsData));
        }
      }
      
      setMenuItems(menuItemsData);
      setFilteredMenuItems(menuItemsData);
      
      // Extract categories
      const uniqueCategories = ['All', ...new Set(menuItemsData.map(item => item.category))];
      setCategories(uniqueCategories);
      
      // Load orders
      let storedOrders = JSON.parse(localStorage.getItem(`branch_orders_${branchId}`) || '[]');
      
      if (storedOrders.length === 0) {
        // Generate demo orders for occupied tables
        const occupiedTables = storedTables.filter(table => table.status === 'occupied');
        storedOrders = generateDemoOrders(branchId, occupiedTables, menuItemsData);
        localStorage.setItem(`branch_orders_${branchId}`, JSON.stringify(storedOrders));
      }
      
      setOrders(storedOrders);
      
      // Reset selections
      setSelectedTable(null);
      setCurrentOrders([]);
      
    } catch (error) {
      console.error(`Error loading branch data for ${branchId}:`, error);
    }
  };
  const handleSwitchTable = (orderId, newTableId) => {
    if (!selectedTable || !newTableId) return;
    
    // Find the order to switch
    const orderToSwitch = orders.find(order => order.id === orderId);
    if (!orderToSwitch) return;
    
    // Find the new table
    const newTable = tables.find(table => table.id === newTableId);
    if (!newTable) return;
    
    // Update order with new table info
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          tableId: newTable.id,
          tableNumber: newTable.number
        };
      }
      return order;
    });
    
    // Update both tables' status
    const updatedTables = tables.map(table => {
      if (table.id === selectedTable.id) {
        // Old table becomes available
        return {
          ...table,
          status: 'available',
          occupiedSince: null,
          orderId: null
        };
      }
      if (table.id === newTable.id) {
        // New table becomes occupied
        return {
          ...table,
          status: 'occupied',
          occupiedSince: new Date().toISOString(),
          orderId: orderId
        };
      }
      return table;
    });
    
    // Update state
    setOrders(updatedOrders);
    setTables(updatedTables);
    setSelectedTable(newTable);
    
    // Update current orders - keep all orders and just update table references
    const updatedCurrentOrders = currentOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          tableId: newTable.id,
          tableNumber: newTable.number
        };
      }
      return order;
    });
    setCurrentOrders(updatedCurrentOrders);
    
    // Reset modal state
    setShowTableSwitchModal(false);
    setOrderToSwitch(null);
    
    // Save to localStorage
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
    localStorage.setItem(`branch_tables_${selectedBranch.id}`, JSON.stringify(updatedTables));
  };

  const openTableSwitchModal = (order) => {
    setOrderToSwitch(order);
    setShowTableSwitchModal(true);
  };
  // Handle deleting an order
  const handleDeleteOrder = (orderId) => {
    try {
      // Remove the order from the orders array
      const updatedOrders = orders.filter(order => order.id !== orderId);
      setOrders(updatedOrders);
      
      // If this was the last order for the table, free up the table
      const tableOrders = updatedOrders.filter(order => 
        order.tableId === selectedTable.id
      );
      
      if (tableOrders.length === 0) {
        const updatedTables = tables.map(t => {
          if (t.id === selectedTable.id) {
            return { ...t, status: 'available', occupiedSince: null, orderId: null };
          }
          return t;
        });
        
        setTables(updatedTables);
        
        // Save to localStorage
        localStorage.setItem(`branch_tables_${selectedBranch.id}`, JSON.stringify(updatedTables));
      }
      
      // Update current orders
      setCurrentOrders(tableOrders);
      
      // If all orders are deleted, clear selected table and return to tables view
      if (tableOrders.length === 0) {
        setSelectedTable(null);
        setActiveTab('tables');
      }
      
      // Save to localStorage
      localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Handle table selection
  const handleTableSelect = (table) => {
    setSelectedTable(table);
    
    // Find orders for this table
    const tableOrders = orders.filter(order => order.tableId === table.id);
    
    // If no orders exist for this table, create a new one
    if (tableOrders.length === 0) {
      const newOrder = createOrderForTable(table);
      setCurrentOrders([newOrder]);
    } else {
      setCurrentOrders(tableOrders);
    }
    
    // Reset the active order index
    setActiveOrderIndex(0);
    
    // Switch to menu tab
    setActiveTab('menu');
  };
  
  // Create a new order for a table
  const createOrderForTable = (table) => {
    const newOrder = {
      id: Date.now(),
      tableId: table.id,
      tableNumber: table.number,
      status: 'preparing',
      items: [],
      timestamp: new Date().toISOString(),
      paid: false,
      modified: false
    };
    
    // Add to orders array
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    
    // Update table status
    const updatedTables = tables.map(t => {
      if (t.id === table.id) {
        return {
          ...t,
          status: 'occupied',
          occupiedSince: new Date().toISOString(),
          orderId: newOrder.id
        };
      }
      return t;
    });
    
    setTables(updatedTables);
    
    // Save to localStorage
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
    localStorage.setItem(`branch_tables_${selectedBranch.id}`, JSON.stringify(updatedTables));
    
    return newOrder;
  };
  
   
  // First add this to your state variables in POSScreen.js
// Add this alongside your other useState declarations:


const handleAddMenuItem = (menuItem) => {
    if (!selectedTable || currentOrders.length === 0) return;
    
    // Get the active order based on activeOrderIndex
    const activeOrder = currentOrders[activeOrderIndex];
    
    // Check if item already exists in order
    const existingItemIndex = activeOrder.items.findIndex(item => item.menuItemId === menuItem.id);
    
    let updatedItems;
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems = activeOrder.items.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = item.quantity + 1;
          const newAmount = (parseFloat(menuItem.price) * newQuantity).toFixed(2);
          return { ...item, quantity: newQuantity, amount: newAmount };
        }
        return item;
      });
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        amount: menuItem.price,
        status: 'ordered'
      };
      
      updatedItems = [...activeOrder.items, newItem];
    }
    
    // Set the modified flag if the order has been confirmed or served
    const orderStatus = activeOrder.status;
    const shouldSetModified = orderStatus === 'confirmed' || orderStatus === 'served';
    
    // Update active order
    const updatedOrder = { 
      ...activeOrder, 
      items: updatedItems,
      modified: shouldSetModified ? true : activeOrder.modified
    };
    
    // Update in orders array
    const updatedOrders = orders.map(order => 
      order.id === activeOrder.id ? updatedOrder : order
    );
    setOrders(updatedOrders);
    
    // Update current orders - keep all orders and just update the active one
    const updatedCurrentOrders = currentOrders.map((order, index) => 
      index === activeOrderIndex ? updatedOrder : order
    );
    setCurrentOrders(updatedCurrentOrders);
    
    // Save to localStorage
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };

// Also need to add UI for order selection to OrderPanel component
// You'll need to pass activeOrderIndex and setActiveOrderIndex as props to OrderPanel
// Update the handleUpdateQuantity function:
const handleUpdateQuantity = (orderId, itemId, change) => {
    if (!selectedTable) return;
    
    // Get the active order
    const activeOrder = currentOrders[activeOrderIndex];
    
    // Update item quantity
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.id === itemId) {
            const newQuantity = Math.max(1, item.quantity + change);
            const newAmount = (parseFloat(item.price) * newQuantity).toFixed(2);
            return { ...item, quantity: newQuantity, amount: newAmount };
          }
          return item;
        });
        
        // Set the modified flag if the order has been confirmed or served
        const orderStatus = order.status;
        const shouldSetModified = orderStatus === 'confirmed' || orderStatus === 'served';
        
        return { 
          ...order, 
          items: updatedItems,
          modified: shouldSetModified ? true : order.modified
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Update current orders
    const updatedCurrentOrders = currentOrders.map((order, index) => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.id === itemId) {
            const newQuantity = Math.max(1, item.quantity + change);
            const newAmount = (parseFloat(item.price) * newQuantity).toFixed(2);
            return { ...item, quantity: newQuantity, amount: newAmount };
          }
          return item;
        });
        
        // Set the modified flag if the order has been confirmed or served
        const orderStatus = order.status;
        const shouldSetModified = orderStatus === 'confirmed' || orderStatus === 'served';
        
        return { 
          ...order, 
          items: updatedItems,
          modified: shouldSetModified ? true : order.modified
        };
      }
      return order;
    });
    
    setCurrentOrders(updatedCurrentOrders);
    
    // Save to localStorage
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };

   // Update the handleRemoveItem function:
const handleRemoveItem = (orderId, itemId) => {
    if (!selectedTable) return;
    
    // Filter out the item
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.filter(item => item.id !== itemId);
        
        // Set the modified flag if the order has been confirmed or served
        const orderStatus = order.status;
        const shouldSetModified = orderStatus === 'confirmed' || orderStatus === 'served';
        
        return { 
          ...order, 
          items: updatedItems,
          modified: shouldSetModified ? true : order.modified
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Update current orders
    const updatedCurrentOrders = currentOrders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.filter(item => item.id !== itemId);
        
        // Set the modified flag if the order has been confirmed or served
        const orderStatus = order.status;
        const shouldSetModified = orderStatus === 'confirmed' || orderStatus === 'served';
        
        return { 
          ...order, 
          items: updatedItems,
          modified: shouldSetModified ? true : order.modified
        };
      }
      return order;
    });
    
    setCurrentOrders(updatedCurrentOrders);
    
    // Save to localStorage
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };
  // Handle payment completion
  const handlePaymentComplete = (orderId) => {
    // Update order status
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: 'completed', paid: true };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Check if there are other active orders for this table
    const tableActiveOrders = updatedOrders.filter(order => 
      order.tableId === selectedTable.id && order.status !== 'completed'
    );
    
    // If no active orders remain, free up the table
    if (tableActiveOrders.length === 0) {
      const updatedTables = tables.map(table => {
        if (table.id === selectedTable.id) {
          return { ...table, status: 'available', occupiedSince: null, orderId: null };
        }
        return table;
      });
      
      setTables(updatedTables);
      localStorage.setItem(`branch_tables_${selectedBranch.id}`, JSON.stringify(updatedTables));
    }
    
    // Update current orders - remove paid orders from current view
    const updatedCurrentOrders = currentOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: 'completed', paid: true };
      }
      return order;
    }).filter(order => !order.paid);
    
    setCurrentOrders(updatedCurrentOrders);
    
    // If all orders are paid, clear selected table and return to tables view
    if (updatedCurrentOrders.length === 0) {
      setSelectedTable(null);
      setActiveTab('tables');
    }
    
    // Save to localStorage
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };
  
  // Update order status (e.g., mark as served, add discount)
  const handleSetOrderStatus = (orderId, statusUpdates) => {
    // Update order status
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, ...statusUpdates };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Update current orders
    const updatedCurrentOrders = currentOrders.map(order => {
      if (order.id === orderId) {
        return { ...order, ...statusUpdates };
      }
      return order;
    });
    
    setCurrentOrders(updatedCurrentOrders);
    
    // Save to localStorage
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };
  
  // Handle branch change
  const handleBranchChange = (e) => {
    const newBranchId = parseInt(e.target.value);
    const branch = branches.find(b => b.id === newBranchId);
    
    if (branch) {
      setSelectedBranch(branch);
      loadBranchData(newBranchId);
      navigate(`/pos/${newBranchId}`);
    }
  };
  
  // Handle confirming a new customer order
  const handleConfirmNewOrder = (order, tableId) => {
    // Find the table
    const table = tables.find(t => t.id === parseInt(tableId));
    if (!table) return;
    
    // Convert the incoming order to a POS order
    const newOrder = {
      id: order.id,
      tableId: table.id,
      tableNumber: table.number,
      status: 'preparing',
      items: order.items.map(item => ({
        id: item.id,
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        amount: item.amount,
        status: 'ordered'
      })),
      timestamp: order.timestamp,
      customerName: order.customerName || 'Customer',
      paid: false
    };
    
    // Update orders
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    
    // Update table status
    const updatedTables = tables.map(t => {
      if (t.id === table.id) {
        return {
          ...t,
          status: 'occupied',
          occupiedSince: new Date().toISOString(),
          orderId: newOrder.id
        };
      }
      return t;
    });
    
    setTables(updatedTables);
    
    // Remove the order from new orders
    const updatedNewOrders = newOrders.filter(o => o.id !== order.id);
    setNewOrders(updatedNewOrders);
    
    // Save to localStorage
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
    localStorage.setItem(`branch_tables_${selectedBranch.id}`, JSON.stringify(updatedTables));
    localStorage.setItem(`branch_incoming_orders_${selectedBranch.id}`, JSON.stringify(updatedNewOrders));
  };
  
  // Handle rejecting a new customer order
  const handleRejectNewOrder = (orderId) => {
    // Remove the order from new orders
    const updatedNewOrders = newOrders.filter(o => o.id !== orderId);
    setNewOrders(updatedNewOrders);
    
    // Save to localStorage
    localStorage.setItem(`branch_incoming_orders_${selectedBranch.id}`, JSON.stringify(updatedNewOrders));
  };
  
  // Add a new order to an existing occupied table
  const handleAddOrder = (tableId) => {
    if (!tableId) return;
    
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    
    const newOrder = {
      id: Date.now(),
      tableId: table.id,
      tableNumber: table.number,
      status: 'preparing',
      items: [],
      timestamp: new Date().toISOString(),
      paid: false
    };
    
    // Add to orders array
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    
    // Add to current orders
    const updatedCurrentOrders = [...currentOrders, newOrder];
    setCurrentOrders(updatedCurrentOrders);
    
    // Save to localStorage
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };
  
  // Filter menu items by category and search
  useEffect(() => {
    if (menuItems.length === 0) return;
    
    let filtered = [...menuItems];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(lowercaseQuery) || 
        item.description?.toLowerCase().includes(lowercaseQuery) ||
        item.category.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    setFilteredMenuItems(filtered);
  }, [selectedCategory, searchQuery, menuItems]);
  
  // Count unread notifications and new orders
  const unreadCount = notifications.filter(n => !n.read).length;
  const newOrdersCount = newOrders.length;
  
  // Get available tables for new orders
  const availableTables = tables.filter(table => table.status === 'available');
  
  return (
    <POSContainer
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <POSHeader>
        <HeaderLeft>
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', color: theme.colors.text.secondary }}>
            <FaArrowLeft />
          </Link>
          <HeaderTitle>
            <FaCashRegister />
            Point of Sale
          </HeaderTitle>
        </HeaderLeft>
        
        <HeaderRight>
          <BranchSelector 
            branches={branches}
            selectedBranch={selectedBranch}
            onBranchChange={handleBranchChange}
          />
          
          <IconButton onClick={() => setShowNewOrders(!showNewOrders)}>
            <FaShoppingBasket />
            {newOrdersCount > 0 && <div className="badge">{newOrdersCount}</div>}
          </IconButton>
          
          <IconButton onClick={() => setShowNotifications(!showNotifications)}>
            <FaBell />
            {unreadCount > 0 && <div className="badge">{unreadCount}</div>}
          </IconButton>
          
          <IconButton onClick={toggleFullScreen}>
            {isFullScreen ? <FaCompress /> : <FaExpand />}
          </IconButton>
        </HeaderRight>
      </POSHeader>
      
      <POSContent>
        <TabsContainer>
          <TabButton 
            active={activeTab === 'tables'} 
            onClick={() => setActiveTab('tables')}
          >
            <FaChair />
            <span>Tables</span>
          </TabButton>
          
          <TabButton 
            active={activeTab === 'menu'} 
            onClick={() => setActiveTab('menu')}
          >
            <FaUtensils />
            <span>Menu</span>
          </TabButton>
          
          <TabButton 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')}
          >
            <FaListAlt />
            <span>Orders</span>
          </TabButton>
        </TabsContainer>
        
        <POSMainArea>
          {/* Tables View */}
          <POSLeftPanel visible={activeTab === 'tables'}>
            <TableGrid 
              tables={tables}
              selectedTable={selectedTable}
              onTableSelect={handleTableSelect}
              isLoading={isLoading}
            />
          </POSLeftPanel>
          
          {/* Menu View */}
          <POSMenuPanel visible={activeTab === 'menu'}>
            {/* Category filters */}
            <CategoryTabs>
              {categories.map(category => (
                <CategoryTab 
                  key={category}
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </CategoryTab>
              ))}
            </CategoryTabs>
            
            {/* Search bar */}
            <TableFilterBar>
              <div style={{ fontWeight: 500 }}>
                {filteredMenuItems.length} Items
              </div>
              
              <SearchBox>
                <FaSearch />
                <input 
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </SearchBox>
            </TableFilterBar>
            
            {/* Menu items grid */}
            <MenuItemsGrid>
              {filteredMenuItems.map(item => (
                <MenuItem 
                  key={item.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddMenuItem(item)}
                >
                  <MenuItemImage 
                    image={item.imageUrl || `https://source.unsplash.com/random/300x200/?food,${item.category}`} 
                  />
                  <MenuItemContent>
                    <MenuItemName>{item.name}</MenuItemName>
                    <MenuItemPrice>${item.price}</MenuItemPrice>
                  </MenuItemContent>
                </MenuItem>
              ))}
            </MenuItemsGrid>
          </POSMenuPanel>
          
          {/* Orders History View */}
          <POSLeftPanel visible={activeTab === 'orders'}>
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <h3>Order History</h3>
              <p>Order history functionality is coming soon.</p>
            </div>
          </POSLeftPanel>
        </POSMainArea>
        
        {/* Order Panel (Right Side) */}
        <POSRightPanel>
        <OrderPanel 
          orders={currentOrders}
          table={selectedTable}
          onPaymentComplete={handlePaymentComplete}
          branch={selectedBranch}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onSetOrderStatus={handleSetOrderStatus}
          onAddOrder={handleAddOrder}
          onDeleteOrder={handleDeleteOrder}
          activeOrderIndex={activeOrderIndex}
          setActiveOrderIndex={setActiveOrderIndex}
          onSwitchTable={openTableSwitchModal}
        />
      </POSRightPanel>
      </POSContent>
      
      {/* Notifications Panel (Slide in from right) */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationsPanel 
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
            onMarkAsRead={(id) => {
              setNotifications(notifications.map(n => 
                n.id === id ? { ...n, read: true } : n
              ));
            }}
          />
        )}
      </AnimatePresence>
      
      {/* New Orders Panel (Slide in from right) */}
      <AnimatePresence>
        {showNewOrders && (
          <NewOrdersPanel 
            newOrders={newOrders}
            availableTables={availableTables}
            onClose={() => setShowNewOrders(false)}
            onConfirmOrder={handleConfirmNewOrder}
            onRejectOrder={handleRejectNewOrder}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTableSwitchModal && (
          <TableSwitchModal 
            show={showTableSwitchModal}
            onClose={() => setShowTableSwitchModal(false)}
            currentTable={selectedTable}
            availableTables={tables.filter(table => table.status === 'available')}
            onSwitchTable={(newTableId) => handleSwitchTable(orderToSwitch.id, newTableId)}
          />
        )}
      </AnimatePresence>
    </POSContainer>
  );
};

export default POSScreen;