// src/components/pos/components/NotificationsPanel.js
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaBell, 
  FaTimes, 
  FaCheck, 
  FaUser, 
  FaExclamationCircle
} from 'react-icons/fa';

const Panel = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 350px;
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

const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const NotificationItem = styled.div`
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.colors.background.main};
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  
  ${props => !props.read && `
    border-left: 3px solid ${props.theme.colors.primary};
  `}
  
  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => {
      switch (props.type) {
        case 'call-waiter':
          return '#2196F350';
        case 'order-ready':
          return '#4CAF5050';
        case 'alert':
          return '#F4433650';
        default:
          return '#9E9E9E50';
      }
    }};
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      color: ${props => {
        switch (props.type) {
          case 'call-waiter':
            return '#2196F3';
          case 'order-ready':
            return '#4CAF50';
          case 'alert':
            return '#F44336';
          default:
            return '#9E9E9E';
        }
      }};
    }
  }
  
  .content {
    flex: 1;
  }
  
  .title {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .message {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.text.secondary};
    margin-bottom: 0.5rem;
  }
  
  .time {
    font-size: 0.8rem;
    color: ${props => props.theme.colors.text.disabled};
  }
  
  .action {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.text.secondary};
  
  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.background.paper}80;
  }
`;

const NotificationsPanel = ({ notifications, onClose, onMarkAsRead }) => {
  // Format time difference
  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return time.toLocaleDateString();
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'call-waiter':
        return <FaUser />;
      case 'order-ready':
        return <FaCheck />;
      case 'alert':
        return <FaExclamationCircle />;
      default:
        return <FaBell />;
    }
  };
  
  return (
    <Panel
      initial={{ x: 350 }}
      animate={{ x: 0 }}
      exit={{ x: 350 }}
      transition={{ type: 'spring', damping: 25 }}
    >
      <PanelHeader>
        <PanelTitle>
          <FaBell /> Notifications
        </PanelTitle>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </PanelHeader>
      
      <NotificationList>
        {notifications.length === 0 ? (
          <EmptyState>
            <FaBell />
            <p>No notifications</p>
          </EmptyState>
        ) : (
          notifications.map(notification => (
            <NotificationItem 
              key={notification.id}
              read={notification.read}
              type={notification.type}
            >
              <div className="icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="content">
                <div className="title">{notification.title}</div>
                <div className="message">{notification.message}</div>
                <div className="time">{formatTime(notification.timestamp)}</div>
                {!notification.read && (
                  <div className="action">
                    <ActionButton onClick={() => onMarkAsRead(notification.id)}>
                      <FaCheck /> Mark as read
                    </ActionButton>
                  </div>
                )}
              </div>
            </NotificationItem>
          ))
        )}
      </NotificationList>
    </Panel>
  );
};

export default NotificationsPanel;