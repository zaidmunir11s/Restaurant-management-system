// src/components/auth/SignIn.js
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { fadeIn, slideInUp } from '../../styles/animations';

// Styled components for enhanced UI
const SignInContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.medium};
`;

const Title = styled(motion.h1)`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled(motion.form)`
  width: 100%;
`;

const FormGroup = styled(motion.div)`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled(motion.label)`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.error ? props.theme.colors.error : '#e0e0e0'};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  transition: all ${props => props.theme.transitions.short};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const ErrorMessage = styled(motion.p)`
  color: ${props => props.theme.colors.error};
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => {
      const hexColor = props.theme.colors.primary.replace('#', '');
      const r = parseInt(hexColor.substring(0, 2), 16);
      const g = parseInt(hexColor.substring(2, 4), 16);
      const b = parseInt(hexColor.substring(4, 6), 16);
      return `rgba(${r * 0.9}, ${g * 0.9}, ${b * 0.9}, 1)`;
    }};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.text.disabled};
    cursor: not-allowed;
  }
`;

const LinkText = styled(motion.p)`
  text-align: center;
  margin-top: 1.5rem;
  color: ${props => props.theme.colors.text.secondary};
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
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

const SignIn = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, isLoading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const validationErrors = {};
    if (!credentials.email) validationErrors.email = 'Email is required';
    if (!credentials.password) validationErrors.password = 'Password is required';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      await login(credentials);
      // Redirect will be handled by the AuthContext
    } catch (error) {
      setErrors({
        general: error.message || 'Failed to sign in. Please try again.'
      });
    }
  };

  return (
    <SignInContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Title variants={itemVariants}>Welcome Back</Title>
      
      <Form onSubmit={handleSubmit} variants={itemVariants}>
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorMessage>{errors.general}</ErrorMessage>
          </motion.div>
        )}
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your@email.com"
            whileFocus={{ scale: 1.01 }}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            whileFocus={{ scale: 1.01 }}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </FormGroup>
        
        <Button
          type="submit"
          disabled={isLoading}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </Form>
      
      <LinkText variants={itemVariants}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </LinkText>
      
      <LinkText variants={itemVariants}>
        <Link to="/forgot-password">Forgot your password?</Link>
      </LinkText>
    </SignInContainer>
  );
};

export default SignIn;