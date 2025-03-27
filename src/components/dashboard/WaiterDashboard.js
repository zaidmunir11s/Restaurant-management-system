import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUtensils, FaClipboardList, FaChair, FaClock } from 'react-icons/fa';

const DashboardContainer = styled(motion.div)`
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled(motion.div)`
  margin-bottom: 2rem;
`;

const Title = styled(motion.h1)`
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled(motion.p)`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1.1rem;
`;

const StatGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
  display: flex;
  flex-direction: column;
  
  .icon {
    color: ${props => props.iconColor || props.theme.colors.primary};
    margin-bottom: 1rem;
    font-size: 2rem;
  }
  
  .stat {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.text.primary};
  }
  
  .label {
    font-size: 1rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const WaiterDashboard = () => {
  return (
    <DashboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>Waiter Dashboard</Title>
        <Subtitle>Manage active orders and tables</Subtitle>
      </Header>
      
      <StatGrid>
        <StatCard
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <FaClipboardList className="icon" />
          <div className="stat">5</div>
          <div className="label">Active Orders</div>
        </StatCard>
        
        <StatCard
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          iconColor="#2196F3"
        >
          <FaChair className="icon" style={{ color: '#2196F3' }} />
          <div className="stat">12</div>
          <div className="label">Occupied Tables</div>
        </StatCard>
        
        <StatCard
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          iconColor="#8BC34A"
        >
          <FaUtensils className="icon" style={{ color: '#8BC34A' }} />
          <div className="stat">3</div>
          <div className="label">Orders Ready</div>
        </StatCard>
        
        <StatCard
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          iconColor="#9C27B0"
        >
          <FaClock className="icon" style={{ color: '#9C27B0' }} />
          <div className="stat">18 min</div>
          <div className="label">Avg. Waiting Time</div>
        </StatCard>
      </StatGrid>
      
      <div>
        <h2>Under Development</h2>
        <p>Waiter dashboard is currently under development.</p>
      </div>
    </DashboardContainer>
  );
};

export default WaiterDashboard;