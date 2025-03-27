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
  height: calc(100vh - 60px);
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background.main};
`;

const POSHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.background.paper};
  box-shadow: ${({ theme }) => theme.shadows.small};
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
    color: ${({ theme }) => theme.colors.primary};
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
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all ${({ theme }) => theme.transitions.short};
  position: relative;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.main}50;
    color: ${({ theme }) => theme.colors.primary};
  }
  
  .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: ${({ theme }) => theme.colors.error};
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
  background-color: ${({ theme }) => theme.colors.background.paper};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const TabButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.background.main};
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
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.main};
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.main};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 0 0.75rem;
  
  svg {
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: 0.9rem;
    margin-right: 0.5rem;
  }
  
  input {
    border: none;
    background: transparent;
    padding: 0.5rem;
    width: 180px;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 0.9rem;
    
    &:focus { outline: none; }
  }
`;

const POSLeftPanel = styled.div`
  flex: 1;
  overflow-y: auto;
  display: ${({ visible }) => visible ? 'block' : 'none'};
  padding: 1rem;
`;

const POSMenuPanel = styled.div`
  flex: 1;
  overflow-y: auto;
  display: ${({ visible }) => visible ? 'block' : 'none'};
  padding: 1rem;
`;

const POSRightPanel = styled.div`
  width: 380px;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-left: 1px solid ${({ theme }) => theme.colors.background.main};
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
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.colors.background.main};
  
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.primary}50;
    border-radius: 4px;
  }
`;

const CategoryTab = styled.button`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.background.main};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text.primary};
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transitions.short};
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primary : `${theme.colors.background.main}80`};
  }
`;

const MenuItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const MenuItem = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  overflow: hidden;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.short};
  border: 1px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    border-color: ${({ theme }) => theme.colors.primary}30;
  }
`;

const MenuItemImage = styled.div`
  height: 100px;
  background-color: #f0f0f0;
  background-image: url(${({ image }) => image});
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
  color: ${({ theme }) => theme.colors.primary};
`;

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

// Helper functions for generating demo data
const generateDemoTables = (branchId) => {
  const tables = [];
  const numTables = 20;
  for (let i = 1; i <= numTables; i++) {
    const status = Math.random() < 0.3 ? 'occupied' : (Math.random() < 0.5 ? 'reserved' : 'available');
    tables.push({
      id: parseInt(`${branchId}${String(i).padStart(3, '0')}`),
      number: i,
      capacity: Math.floor(Math.random() * 4) + 2,
      status,
      section: i <= numTables / 2 ? 'Indoor' : 'Outdoor',
      occupiedSince: status === 'occupied' ? new Date(Date.now() - (Math.random() * 7200000)).toISOString() : null,
      orderId: status === 'occupied' ? parseInt(`${branchId}${String(i).padStart(3, '0')}`) : null
    });
  }
  return tables;
};

const generateDemoMenuItems = (branchId) => {
  const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages', 'Sides'];
  const menuItems = [];
  categories.forEach((category, categoryIndex) => {
    const itemCount = Math.floor(Math.random() * 5) + 3;
    for (let i = 1; i <= itemCount; i++) {
      const basePrice = categoryIndex === 3 ? 3 :
                        categoryIndex === 2 ? 7 :
                        categoryIndex === 0 ? 8 :
                        categoryIndex === 4 ? 5 : 15;
      menuItems.push({
        id: parseInt(`${branchId}${categoryIndex}${i}`),
        name: `${category.slice(0, -1)} ${i}`,
        price: (basePrice + Math.random() * 5).toFixed(2),
        category,
        description: `Delicious ${category.toLowerCase()} option ${i}`,
        status: Math.random() > 0.1 ? 'active' : 'inactive'
      });
    }
  });
  return menuItems;
};

const generateDemoOrders = (branchId, occupiedTables, menuItems) => {
  const orders = [];
  occupiedTables.forEach(table => {
    const orderItems = [];
    const itemCount = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < itemCount; i++) {
      if (menuItems.length === 0) continue;
      const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
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
  
  const [activeTab, setActiveTab] = useState('tables'); // tables, menu, orders
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
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
  
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
        if (storedBranches.length === 0) {
          const demoBranches = [
            { id: 1, name: 'Downtown Branch', restaurantId: 1 },
            { id: 2, name: 'Mall Branch', restaurantId: 1 },
            { id: 3, name: 'Beachside Branch', restaurantId: 2 }
          ];
          localStorage.setItem('branches', JSON.stringify(demoBranches));
          setBranches(demoBranches);
          const initBranch = branchId ? demoBranches.find(b => b.id === parseInt(branchId)) || demoBranches[0] : demoBranches[0];
          setSelectedBranch(initBranch);
          await loadBranchData(initBranch.id);
        } else {
          setBranches(storedBranches);
          const initBranch = branchId ? storedBranches.find(b => b.id === parseInt(branchId)) || storedBranches[0] : storedBranches[0];
          setSelectedBranch(initBranch);
          await loadBranchData(initBranch.id);
        }
        
        const mockNotifications = [
          {
            id: 1,
            type: 'call-waiter',
            title: 'Waiter Requested',
            message: 'Customer at Table #5 has requested assistance',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            read: false
          },
          {
            id: 2,
            type: 'order-ready',
            title: 'Order Ready',
            message: 'Order #1023 for Table #3 is ready for pickup',
            timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
            read: true
          }
        ];
        setNotifications(mockNotifications);
        
        const incomingOrders = JSON.parse(localStorage.getItem(`branch_incoming_orders_${branchId || 1}`) || '[]');
        setNewOrders(incomingOrders);
      } catch (error) {
        console.error('Error loading branches:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    
    const interval = setInterval(() => {
      const currentIncomingOrders = JSON.parse(localStorage.getItem(`branch_incoming_orders_${branchId || 1}`) || '[]');
      setNewOrders(currentIncomingOrders);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [branchId]);

  useEffect(() => {
    if (selectedTable) {
      const tableOrders = orders.filter(order => order.tableId === selectedTable.id);
      setCurrentOrders(tableOrders);
    } else {
      setCurrentOrders([]);
    }
  }, [selectedTable, orders]);
  
  const loadBranchData = async (branchId) => {
    try {
      let storedTables = JSON.parse(localStorage.getItem(`branch_tables_${branchId}`) || '[]');
      if (storedTables.length === 0) {
        storedTables = generateDemoTables(branchId);
        localStorage.setItem(`branch_tables_${branchId}`, JSON.stringify(storedTables));
      }
      setTables(storedTables);
      
      let menuItemsData = [];
      const branchMenuItems = JSON.parse(localStorage.getItem(`branch_menu_${branchId}`) || '[]');
      if (branchMenuItems.length > 0) {
        menuItemsData = branchMenuItems;
      } else {
        const branchData = branches.find(b => b.id === branchId);
        if (branchData && branchData.restaurantId) {
          const restaurantMenuItems = JSON.parse(localStorage.getItem(`restaurant_menu_${branchData.restaurantId}`) || '[]');
          if (restaurantMenuItems.length > 0) {
            menuItemsData = restaurantMenuItems;
          }
        }
        if (menuItemsData.length === 0) {
          menuItemsData = generateDemoMenuItems(branchId);
          localStorage.setItem(`branch_menu_${branchId}`, JSON.stringify(menuItemsData));
        }
      }
      setMenuItems(menuItemsData);
      setFilteredMenuItems(menuItemsData);
      const uniqueCategories = ['All', ...new Set(menuItemsData.map(item => item.category))];
      setCategories(uniqueCategories);
      
      let storedOrders = JSON.parse(localStorage.getItem(`branch_orders_${branchId}`) || '[]');
      if (storedOrders.length === 0) {
        const occupiedTables = storedTables.filter(table => table.status === 'occupied');
        storedOrders = generateDemoOrders(branchId, occupiedTables, menuItemsData);
        localStorage.setItem(`branch_orders_${branchId}`, JSON.stringify(storedOrders));
      }
      setOrders(storedOrders);
      setSelectedTable(null);
      setCurrentOrders([]);
    } catch (error) {
      console.error(`Error loading branch data for ${branchId}:`, error);
    }
  };

  const handleSwitchTable = (orderId, newTableId) => {
    if (!selectedTable || !newTableId) return;
    const orderToSwitch = orders.find(order => order.id === orderId);
    if (!orderToSwitch) return;
    const newTable = tables.find(table => table.id === newTableId);
    if (!newTable) return;
    
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, tableId: newTable.id, tableNumber: newTable.number } : order
    );
    setOrders(updatedOrders);
    
    const updatedTables = tables.map(table => {
      if (table.id === selectedTable.id) {
        return { ...table, status: 'available', occupiedSince: null, orderId: null };
      }
      if (table.id === newTable.id) {
        return { ...table, status: 'occupied', occupiedSince: new Date().toISOString(), orderId: orderId };
      }
      return table;
    });
    setTables(updatedTables);
    setSelectedTable(newTable);
    
    const updatedCurrentOrders = currentOrders.map((order, index) => 
      index === activeOrderIndex ? { ...order, tableId: newTable.id, tableNumber: newTable.number } : order
    );
    setCurrentOrders(updatedCurrentOrders);
    
    setShowTableSwitchModal(false);
    setOrderToSwitch(null);
    
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
    localStorage.setItem(`branch_tables_${selectedBranch.id}`, JSON.stringify(updatedTables));
  };

  const openTableSwitchModal = (order) => {
    setOrderToSwitch(order);
    setShowTableSwitchModal(true);
  };

  const handleDeleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    const tableOrders = updatedOrders.filter(order => order.tableId === selectedTable.id);
    if (tableOrders.length === 0) {
      const updatedTables = tables.map(t => t.id === selectedTable.id ? { ...t, status: 'available', occupiedSince: null, orderId: null } : t);
      setTables(updatedTables);
      localStorage.setItem(`branch_tables_${selectedBranch.id}`, JSON.stringify(updatedTables));
    }
    setCurrentOrders(tableOrders);
    if (tableOrders.length === 0) {
      setSelectedTable(null);
      setActiveTab('tables');
    }
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    const tableOrders = orders.filter(order => order.tableId === table.id);
    if (tableOrders.length === 0) {
      const newOrder = createOrderForTable(table);
      setCurrentOrders([newOrder]);
    } else {
      setCurrentOrders(tableOrders);
    }
    setActiveOrderIndex(0);
    setActiveTab('menu');
  };

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
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    
    const updatedTables = tables.map(t => 
      t.id === table.id ? { ...t, status: 'occupied', occupiedSince: new Date().toISOString(), orderId: newOrder.id } : t
    );
    setTables(updatedTables);
    
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
    localStorage.setItem(`branch_tables_${selectedBranch.id}`, JSON.stringify(updatedTables));
    
    return newOrder;
  };

  const handleAddMenuItem = (menuItem) => {
    if (!selectedTable || currentOrders.length === 0) return;
    const activeOrder = currentOrders[activeOrderIndex];
    const existingItemIndex = activeOrder.items.findIndex(item => item.menuItemId === menuItem.id);
    let updatedItems;
    if (existingItemIndex >= 0) {
      updatedItems = activeOrder.items.map((item, index) => {
        if (index === existingItemIndex) {
          const newQuantity = item.quantity + 1;
          const newAmount = (parseFloat(menuItem.price) * newQuantity).toFixed(2);
          return { ...item, quantity: newQuantity, amount: newAmount };
        }
        return item;
      });
    } else {
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
    const orderStatus = activeOrder.status;
    const shouldSetModified = orderStatus === 'confirmed' || orderStatus === 'served';
    const updatedOrder = { 
      ...activeOrder, 
      items: updatedItems,
      modified: shouldSetModified ? true : activeOrder.modified
    };
    const updatedOrders = orders.map(order => order.id === activeOrder.id ? updatedOrder : order);
    setOrders(updatedOrders);
    const updatedCurrentOrders = currentOrders.map((order, index) =>
      index === activeOrderIndex ? updatedOrder : order
    );
    setCurrentOrders(updatedCurrentOrders);
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };

  const handleUpdateQuantity = (orderId, itemId, change) => {
    if (!selectedTable) return;
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
        const orderStatus = order.status;
        const shouldSetModified = orderStatus === 'confirmed' || orderStatus === 'served';
        return { ...order, items: updatedItems, modified: shouldSetModified ? true : order.modified };
      }
      return order;
    });
    setOrders(updatedOrders);
    const updatedCurrentOrders = currentOrders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.id === itemId) {
            const newQuantity = Math.max(1, item.quantity + change);
            const newAmount = (parseFloat(item.price) * newQuantity).toFixed(2);
            return { ...item, quantity: newQuantity, amount: newAmount };
          }
          return item;
        });
        const orderStatus = order.status;
        const shouldSetModified = orderStatus === 'confirmed' || orderStatus === 'served';
        return { ...order, items: updatedItems, modified: shouldSetModified ? true : order.modified };
      }
      return order;
    });
    setCurrentOrders(updatedCurrentOrders);
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };

  const handleRemoveItem = (orderId, itemId) => {
    if (!selectedTable) return;
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.filter(item => item.id !== itemId);
        const orderStatus = order.status;
        const shouldSetModified = orderStatus === 'confirmed' || orderStatus === 'served';
        return { ...order, items: updatedItems, modified: shouldSetModified ? true : order.modified };
      }
      return order;
    });
    setOrders(updatedOrders);
    const updatedCurrentOrders = currentOrders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.filter(item => item.id !== itemId);
        const orderStatus = order.status;
        const shouldSetModified = orderStatus === 'confirmed' || orderStatus === 'served';
        return { ...order, items: updatedItems, modified: shouldSetModified ? true : order.modified };
      }
      return order;
    });
    setCurrentOrders(updatedCurrentOrders);
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };

  const handlePaymentComplete = (orderId) => {
    const updatedOrders = orders.map(order => order.id === orderId ? { ...order, status: 'completed', paid: true } : order);
    setOrders(updatedOrders);
    const tableActiveOrders = updatedOrders.filter(order => order.tableId === selectedTable.id && order.status !== 'completed');
    if (tableActiveOrders.length === 0) {
      const updatedTables = tables.map(table => table.id === selectedTable.id ? { ...table, status: 'available', occupiedSince: null, orderId: null } : table);
      setTables(updatedTables);
      localStorage.setItem(`branch_tables_${selectedBranch.id}`, JSON.stringify(updatedTables));
    }
    const updatedCurrentOrders = currentOrders.map(order => order.id === orderId ? { ...order, status: 'completed', paid: true } : order)
                                              .filter(order => !order.paid);
    setCurrentOrders(updatedCurrentOrders);
    if (updatedCurrentOrders.length === 0) {
      setSelectedTable(null);
      setActiveTab('tables');
    }
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };

  const handleSetOrderStatus = (orderId, statusUpdates) => {
    const updatedOrders = orders.map(order => order.id === orderId ? { ...order, ...statusUpdates } : order);
    setOrders(updatedOrders);
    const updatedCurrentOrders = currentOrders.map(order => order.id === orderId ? { ...order, ...statusUpdates } : order);
    setCurrentOrders(updatedCurrentOrders);
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };

  const handleBranchChange = (e) => {
    const newBranchId = parseInt(e.target.value);
    const branch = branches.find(b => b.id === newBranchId);
    if (branch) {
      setSelectedBranch(branch);
      loadBranchData(newBranchId);
      navigate(`/pos/${newBranchId}`);
    }
  };

  const handleConfirmNewOrder = (order, tableId) => {
    const table = tables.find(t => t.id === parseInt(tableId));
    if (!table) return;
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
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    const updatedTables = tables.map(t => t.id === table.id ? { ...t, status: 'occupied', occupiedSince: new Date().toISOString(), orderId: newOrder.id } : t);
    setTables(updatedTables);
    const updatedNewOrders = newOrders.filter(o => o.id !== order.id);
    setNewOrders(updatedNewOrders);
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
    localStorage.setItem(`branch_tables_${selectedBranch.id}`, JSON.stringify(updatedTables));
    localStorage.setItem(`branch_incoming_orders_${selectedBranch.id}`, JSON.stringify(updatedNewOrders));
  };

  const handleRejectNewOrder = (orderId) => {
    const updatedNewOrders = newOrders.filter(o => o.id !== orderId);
    setNewOrders(updatedNewOrders);
    localStorage.setItem(`branch_incoming_orders_${selectedBranch.id}`, JSON.stringify(updatedNewOrders));
  };

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
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    const updatedCurrentOrders = [...currentOrders, newOrder];
    setCurrentOrders(updatedCurrentOrders);
    localStorage.setItem(`branch_orders_${selectedBranch.id}`, JSON.stringify(updatedOrders));
  };

  useEffect(() => {
    if (menuItems.length === 0) return;
    let filtered = [...menuItems];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
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
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const newOrdersCount = newOrders.length;
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
          <POSLeftPanel visible={activeTab === 'tables'}>
            <TableGrid 
              tables={tables}
              selectedTable={selectedTable}
              onTableSelect={handleTableSelect}
              isLoading={isLoading}
            />
          </POSLeftPanel>
          
          <POSMenuPanel visible={activeTab === 'menu'}>
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
          
          <POSLeftPanel visible={activeTab === 'orders'}>
            <div style={{ padding: '1rem', textAlign: 'center' }}>
              <h3>Order History</h3>
              <p>Order history functionality is coming soon.</p>
            </div>
          </POSLeftPanel>
        </POSMainArea>
        
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
      
      <AnimatePresence>
        {showNotifications && (
          <NotificationsPanel 
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
            onMarkAsRead={(id) => {
              setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            }}
          />
        )}
      </AnimatePresence>
      
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
