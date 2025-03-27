// src/components/dashboard/OwnerDashboard.js
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaUtensils, 
  FaStore, 
  FaUsers,
  FaCheck, 
  FaChartLine, 
  FaPlus, 
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChair,
  FaShoppingCart,
  FaBookOpen,
  FaBell,
  FaArrowUp,
  FaArrowDown,
  FaEllipsisV,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaCashRegister,
  FaReceipt,
  FaClipboardList,
  FaTasks,
  FaPercentage
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const DashboardContainer = styled(motion.div)`
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const WelcomeBar = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem 2rem;
  box-shadow: ${props => props.theme.shadows.small};
`;

const WelcomeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled(motion.h1)`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.25rem;
  font-size: 1.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Subtitle = styled(motion.p)`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1rem;
`;

const DateDisplay = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.background.main};
  color: ${props => props.primary ? 'white' : props.theme.colors.text.primary};
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  text-decoration: none;
  transition: all ${props => props.theme.transitions.short};
  box-shadow: ${props => props.primary ? props.theme.shadows.small : 'none'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.primary ? props.theme.shadows.medium : props.theme.shadows.small};
    background-color: ${props => {
      if (props.primary) {
        const hexColor = props.theme.colors.primary.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r * 0.9}, ${g * 0.9}, ${b * 0.9}, 1)`;
      } else {
        return props.theme.colors.background.paper;
      }
    }};
  }
`;

const SystemStatusBar = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1rem;
  box-shadow: ${props => props.theme.shadows.small};
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
  }
  
  .icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background-color: ${props => `${props.color}15` || `${props.theme.colors.primary}15`};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    svg {
      color: ${props => props.color || props.theme.colors.primary};
      font-size: 1.2rem;
    }
  }
  
  .content {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    
    .label {
      font-size: 0.8rem;
      color: ${props => props.theme.colors.text.secondary};
    }
    
    .value {
      font-size: 1rem;
      font-weight: 600;
      color: ${props => props.theme.colors.text.primary};
    }
  }
`;

const StatGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all ${props => props.theme.transitions.short};
  
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
    background-color: ${props => props.color || props.theme.colors.primary};
  }
`;

const IconContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background-color: ${props => `${props.color}15` || `${props.theme.colors.primary}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    color: ${props => props.color || props.theme.colors.primary};
    font-size: 1.75rem;
  }
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const TrendIndicator = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.small};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: ${props => props.positive ? '#E3F9E5' : '#FEECEB'};
  color: ${props => props.positive ? '#2F9E44' : '#E03131'};
`;

const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuickAccessCard = styled(Link)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  text-decoration: none;
  transition: all ${props => props.theme.transitions.short};
  box-shadow: ${props => props.theme.shadows.small};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
    background-color: ${props => props.active ? `${props.theme.colors.primary}10` : props.theme.colors.background.paper};
  }
  
  .icon {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background-color: ${props => `${props.color}15` || `${props.theme.colors.primary}15`};
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      color: ${props => props.color || props.theme.colors.primary};
      font-size: 1.5rem;
    }
  }
  
  .label {
    font-size: 0.9rem;
    font-weight: 500;
    color: ${props => props.theme.colors.text.primary};
  }
  
  .description {
    font-size: 0.8rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const SectionContainer = styled.div`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.large};
  box-shadow: ${props => props.theme.shadows.small};
  margin-bottom: 2rem;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const SectionAction = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
`;

const RestaurantCard = styled(Link)`
  background-color: ${props => `${props.theme.colors.background.main}50`};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-decoration: none;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.small};
    background-color: ${props => props.theme.colors.background.paper};
  }
`;

const RestaurantHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const RestaurantInfo = styled.div`
  flex: 1;
`;

const RestaurantName = styled.h3`
  color: ${props => props.theme.colors.text.primary};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
`;

const RestaurantMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.85rem;
`;

const MoreButton = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
    color: ${props => props.theme.colors.primary};
  }
`;

const RestaurantStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const RestaurantStat = styled.div`
  flex: 1;
  padding: 0.75rem;
  background-color: ${props => `${props.color}10` || `${props.theme.colors.primary}10`};
  border-radius: ${props => props.theme.borderRadius.small};
  
  .value {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${props => props.color || props.theme.colors.primary};
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.8rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const ActivityList = styled.div`
  padding: 0;
`;

const ActivityItem = styled.div`
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.background.main};
  transition: all ${props => props.theme.transitions.short};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main}50;
  }
`;

const ActivityIconContainer = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: ${props => `${props.color}15` || `${props.theme.colors.primary}15`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    color: ${props => props.color || props.theme.colors.primary};
    font-size: 1.25rem;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const ActivityDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const ActivityTime = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.disabled};
  white-space: nowrap;
`;

const TasksList = styled.div`
  padding: 1.5rem;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.background.main}50;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
  }
  
  .task-checkbox {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid ${props => props.priority === 'high' ? '#F44336' : props.priority === 'medium' ? '#FF9800' : '#4CAF50'};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    
    &.completed {
      background-color: ${props => props.priority === 'high' ? '#F44336' : props.priority === 'medium' ? '#FF9800' : '#4CAF50'};
      
      svg {
        color: white;
      }
    }
  }
  
  .task-content {
    flex: 1;
    
    .task-title {
      font-weight: 500;
      text-decoration: ${props => props.completed ? 'line-through' : 'none'};
      color: ${props => props.completed ? props.theme.colors.text.secondary : props.theme.colors.text.primary};
    }
    
    .task-details {
      font-size: 0.85rem;
      color: ${props => props.theme.colors.text.secondary};
    }
  }
  
  .task-due {
    font-size: 0.8rem;
    color: ${props => props.priority === 'high' ? '#F44336' : props.priority === 'medium' ? '#FF9800' : props.theme.colors.text.secondary};
    white-space: nowrap;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
`;

const Spinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid ${props => props.theme.colors.background.main};
  border-top-color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const OwnerDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    restaurants: 0,
    branches: 0,
    employees: 0,
    revenue: '$0',
    tables: 0,
    ordersToday: 0
  });
  const [restaurants, setRestaurants] = useState([]);
  const [branches, setBranches] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [systemStatus, setSystemStatus] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Set current date
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  
    const loadDashboardData = () => {
      try {
        // Load restaurants
        const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
        setRestaurants(storedRestaurants);
  
        // Load branches
        const storedBranches = JSON.parse(localStorage.getItem('branches') || '[]');
        setBranches(storedBranches);
  
        // Calculate stats
        const totalRestaurants = storedRestaurants.length;
        const totalBranches = storedBranches.length;
        const estimatedEmployees = totalBranches * 6 + totalRestaurants * 2;
        const estimatedRevenue = totalBranches * 42000 + totalRestaurants * 15000;
        const totalTables = totalBranches * 12;
        const estimatedOrdersToday = totalBranches * 24;
  
        setStats({
          restaurants: totalRestaurants,
          branches: totalBranches,
          employees: estimatedEmployees,
          revenue: `$${estimatedRevenue.toLocaleString()}`,
          tables: totalTables,
          ordersToday: estimatedOrdersToday
        });
        
        // Set system status items
        const systemStatusItems = [
          {
            id: 1,
            label: 'System Status',
            value: 'Operational',
            icon: <FaChartLine />,
            color: '#4CAF50'
          },
          {
            id: 2,
            label: 'Active Sessions',
            value: `${estimatedEmployees * 2}`,
            icon: <FaUsers />,
            color: '#2196F3'
          },
          {
            id: 3,
            label: 'POS Status',
            value: 'Online',
            icon: <FaCashRegister />,
            color: '#FF5722'
          },
          {
            id: 4,
            label: 'Last Backup',
            value: '2 hours ago',
            icon: <FaReceipt />,
            color: '#9C27B0'
          }
        ];
        setSystemStatus(systemStatusItems);

        // Generate pending tasks
        const tasks = [
          {
            id: 1,
            title: 'Review inventory report',
            details: 'Monthly inventory check for Downtown Branch',
            dueDate: 'Today',
            priority: 'high',
            completed: false
          },
          {
            id: 2,
            title: 'Approve staff schedule',
            details: 'Weekly schedule for Mall Branch needs approval',
            dueDate: 'Tomorrow',
            priority: 'medium',
            completed: false
          },
          {
            id: 3,
            title: 'Update menu prices',
            details: 'Seasonal price adjustments for all branches',
            dueDate: 'This week',
            priority: 'low',
            completed: true
          },
          {
            id: 4,
            title: 'Review promotion results',
            details: 'Check performance of weekend special offers',
            dueDate: 'Today',
            priority: 'medium',
            completed: false
          }
        ];
        setPendingTasks(tasks);
  
        // Generate recent activities
        const activities = [
          {
            id: 1,
            type: 'order',
            title: 'Large Order Received',
            description: 'Downtown Branch: Catering order for 50 people ($1,250)',
            timestamp: '30 minutes ago',
            icon: <FaShoppingCart />,
            color: '#FF5722'
          },
          {
            id: 2,
            type: 'menu',
            title: 'Menu Updated',
            description: 'Mall Branch: 8 new seasonal items added to menu',
            timestamp: '2 hours ago',
            icon: <FaBookOpen />,
            color: '#4CAF50'
          },
          {
            id: 3,
            type: 'staff',
            title: 'Staff Schedule Updated',
            description: 'All Branches: Weekend shifts updated for 24 employees',
            timestamp: '5 hours ago',
            icon: <FaUsers />,
            color: '#2196F3'
          },
          {
            id: 4,
            type: 'promotion',
            title: 'New Promotion Created',
            description: 'All Branches: "Family Weekend" special 20% discount',
            timestamp: '12 hours ago',
            icon: <FaPercentage />,
            color: '#9C27B0'
          },
          {
            id: 5,
            type: 'maintenance',
            title: 'Equipment Maintenance',
            description: 'Downtown Branch: Kitchen equipment servicing completed',
            timestamp: 'Yesterday',
            icon: <FaStore />,
            color: '#FF9800'
          }
        ];
        setRecentActivities(activities);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadDashboardData();
  }, []);

  const getRestaurantData = (restaurant) => {
    const restaurantBranches = branches.filter(b => b.restaurantId === restaurant.id);
    const branchCount = restaurantBranches.length;
    const revenue = branchCount * 42000 + 15000;
    const tables = branchCount * 12;
    
    return {
      branches: branchCount,
      revenue: `$${revenue.toLocaleString()}`,
      tables: tables
    };
  };

  const toggleTaskComplete = (taskId) => {
    setPendingTasks(tasks => 
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };

  if (isLoading) {
    return (
      <DashboardContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <LoadingContainer>
          <Spinner
            animate={{
              rotate: 360
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <p>Loading your dashboard...</p>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <WelcomeBar variants={itemVariants}>
        <WelcomeContent>
          <Title>
            <FaUtensils /> Welcome back, {currentUser?.firstName || 'Owner'}
          </Title>
          <Subtitle>Here's an overview of your restaurant management system</Subtitle>
          <DateDisplay>
            <FaCalendarAlt /> {currentDate}
          </DateDisplay>
        </WelcomeContent>
        <QuickActions>
          <ActionButton to="/pos/1" primary={false}>
            <FaCashRegister /> POS System
          </ActionButton>
          <ActionButton to="/restaurants/new" primary={true}>
            <FaPlus /> Add Restaurant
          </ActionButton>
        </QuickActions>
      </WelcomeBar>
      
      {/* System Status Bar */}
      <SystemStatusBar variants={itemVariants}>
        {systemStatus.map(item => (
          <StatusItem key={item.id} color={item.color}>
            <div className="icon">
              {item.icon}
            </div>
            <div className="content">
              <div className="label">{item.label}</div>
              <div className="value">{item.value}</div>
            </div>
          </StatusItem>
        ))}
      </SystemStatusBar>
      
      {/* Quick Access Grid */}
      <QuickAccessGrid>
        <QuickAccessCard to="/pos/1" color="#FF5722">
          <div className="icon">
            <FaCashRegister />
          </div>
          <div className="label">POS</div>
          <div className="description">Process orders</div>
        </QuickAccessCard>
        
        <QuickAccessCard to="/restaurants" color="#2196F3">
          <div className="icon">
            <FaStore />
          </div>
          <div className="label">Restaurants</div>
          <div className="description">Manage locations</div>
        </QuickAccessCard>
        
        <QuickAccessCard to="/menu" color="#4CAF50">
          <div className="icon">
            <FaBookOpen />
          </div>
          <div className="label">Menu</div>
          <div className="description">Update offerings</div>
        </QuickAccessCard>
        
        <QuickAccessCard to="/users" color="#9C27B0">
          <div className="icon">
            <FaUsers />
          </div>
          <div className="label">Staff</div>
          <div className="description">Manage team</div>
        </QuickAccessCard>
        
        <QuickAccessCard to="/tables" color="#FF9800">
          <div className="icon">
            <FaChair />
          </div>
          <div className="label">Tables</div>
          <div className="description">Table management</div>
        </QuickAccessCard>
        
        <QuickAccessCard to="/reports" color="#607D8B">
          <div className="icon">
            <FaChartLine />
          </div>
          <div className="label">Reports</div>
          <div className="description">View analytics</div>
        </QuickAccessCard>
      </QuickAccessGrid>
      
      <StatGrid>
      <StatCard 
          variants={itemVariants}
          color="#FF5722"
        >
          <IconContainer color="#FF5722">
            <FaStore />
          </IconContainer>
          <StatInfo>
            <StatValue>{stats.restaurants}</StatValue>
            <StatLabel>Total Restaurants</StatLabel>
          </StatInfo>
          <TrendIndicator positive={true}>
            <FaArrowUp /> 12%
          </TrendIndicator>
        </StatCard>
        
        <StatCard 
          variants={itemVariants}
          color="#2196F3"
        >
          <IconContainer color="#2196F3">
            <FaStore />
          </IconContainer>
          <StatInfo>
            <StatValue>{stats.branches}</StatValue>
            <StatLabel>Total Branches</StatLabel>
          </StatInfo>
          <TrendIndicator positive={true}>
            <FaArrowUp /> 8%
          </TrendIndicator>
        </StatCard>
        
        <StatCard 
          variants={itemVariants}
          color="#4CAF50"
        >
          <IconContainer color="#4CAF50">
            <FaMoneyBillWave />
          </IconContainer>
          <StatInfo>
            <StatValue>{stats.revenue}</StatValue>
            <StatLabel>Monthly Revenue</StatLabel>
          </StatInfo>
          <TrendIndicator positive={true}>
            <FaArrowUp /> 15%
          </TrendIndicator>
        </StatCard>
        
        <StatCard 
          variants={itemVariants}
          color="#9C27B0"
        >
          <IconContainer color="#9C27B0">
            <FaChair />
          </IconContainer>
          <StatInfo>
            <StatValue>{stats.tables}</StatValue>
            <StatLabel>Total Tables</StatLabel>
          </StatInfo>
          <TrendIndicator positive={true}>
            <FaArrowUp /> 5%
          </TrendIndicator>
        </StatCard>
        
        <StatCard 
          variants={itemVariants}
          color="#FF9800"
        >
          <IconContainer color="#FF9800">
            <FaUsers />
          </IconContainer>
          <StatInfo>
            <StatValue>{stats.employees}</StatValue>
            <StatLabel>Active Staff</StatLabel>
          </StatInfo>
          <TrendIndicator positive={false}>
            <FaArrowDown /> 2%
          </TrendIndicator>
        </StatCard>
        
        <StatCard 
          variants={itemVariants}
          color="#607D8B"
        >
          <IconContainer color="#607D8B">
            <FaShoppingCart />
          </IconContainer>
          <StatInfo>
            <StatValue>{stats.ordersToday}</StatValue>
            <StatLabel>Today's Orders</StatLabel>
          </StatInfo>
          <TrendIndicator positive={true}>
            <FaArrowUp /> 22%
          </TrendIndicator>
        </StatCard>
      </StatGrid>
      
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>
            <FaTasks /> Tasks Requiring Attention
          </SectionTitle>
          <SectionAction to="/tasks">
            View all tasks <FaExternalLinkAlt />
          </SectionAction>
        </SectionHeader>
        
        <TasksList>
          {pendingTasks.map(task => (
            <TaskItem 
              key={task.id} 
              priority={task.priority}
              completed={task.completed}
            >
              <div 
                className={`task-checkbox ${task.completed ? 'completed' : ''}`}
                onClick={() => toggleTaskComplete(task.id)}
              >
                {task.completed && <FaCheck size={12} />}
              </div>
              
              <div className="task-content">
                <div className="task-title">{task.title}</div>
                <div className="task-details">{task.details}</div>
              </div>
              
              <div className="task-due">Due: {task.dueDate}</div>
            </TaskItem>
          ))}
        </TasksList>
      </SectionContainer>
      
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>
            <FaStore /> Your Restaurants
          </SectionTitle>
          <SectionAction to="/restaurants">
            View all restaurants <FaExternalLinkAlt />
          </SectionAction>
        </SectionHeader>
        
        <CardGrid>
          {restaurants.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem 0' }}>
              <p>You haven't added any restaurants yet.</p>
              <ActionButton to="/restaurants/new" primary={true} style={{ display: 'inline-flex', marginTop: '1rem' }}>
                <FaPlus /> Add Restaurant
              </ActionButton>
            </div>
          ) : (
            restaurants.slice(0, 6).map(restaurant => {
              const data = getRestaurantData(restaurant);
              return (
                <RestaurantCard key={restaurant.id} to={`/restaurants/${restaurant.id}`}>
                  <RestaurantHeader>
                    <RestaurantInfo>
                      <RestaurantName>{restaurant.name}</RestaurantName>
                      <RestaurantMeta>
                        <FaMapMarkerAlt /> {restaurant.city}, {restaurant.state}
                      </RestaurantMeta>
                    </RestaurantInfo>
                    <MoreButton>
                      <FaEllipsisV />
                    </MoreButton>
                  </RestaurantHeader>
                  
                  <RestaurantStats>
                    <RestaurantStat color="#2196F3">
                      <div className="value">{data.branches}</div>
                      <div className="label">Branches</div>
                    </RestaurantStat>
                    
                    <RestaurantStat color="#4CAF50">
                      <div className="value">{data.revenue}</div>
                      <div className="label">Revenue</div>
                    </RestaurantStat>
                    
                    <RestaurantStat color="#FF9800">
                      <div className="value">{data.tables}</div>
                      <div className="label">Tables</div>
                    </RestaurantStat>
                  </RestaurantStats>
                </RestaurantCard>
              );
            })
          )}
        </CardGrid>
      </SectionContainer>
      
      <SectionContainer>
        <SectionHeader>
          <SectionTitle>
            <FaBell /> Recent Activity
          </SectionTitle>
          <SectionAction to="/notifications">
            View all notifications <FaExternalLinkAlt />
          </SectionAction>
        </SectionHeader>
        
        <ActivityList>
          {recentActivities.map(activity => (
            <ActivityItem key={activity.id}>
              <ActivityIconContainer color={activity.color}>
                {activity.icon}
              </ActivityIconContainer>
              
              <ActivityContent>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityDescription>{activity.description}</ActivityDescription>
              </ActivityContent>
              
              <ActivityTime>{activity.timestamp}</ActivityTime>
            </ActivityItem>
          ))}
        </ActivityList>
      </SectionContainer>
    </DashboardContainer>
  );
};

export default OwnerDashboard;