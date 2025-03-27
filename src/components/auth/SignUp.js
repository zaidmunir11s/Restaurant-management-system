// src/components/auth/SignUp.js
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

// Styled components - reusing same styling approach as SignIn
const SignUpContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 500px;
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

const FormGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
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

const SignUp = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'owner' // Default role is owner
  });
  
  const [errors, setErrors] = useState({});
  const { register, isLoading } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    
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
    
    // Validation
    const validationErrors = {};
    if (!userData.firstName) validationErrors.firstName = 'First name is required';
    if (!userData.lastName) validationErrors.lastName = 'Last name is required';
    if (!userData.email) validationErrors.email = 'Email is required';
    if (!userData.password) validationErrors.password = 'Password is required';
    if (userData.password && userData.password.length < 8) {
      validationErrors.password = 'Password must be at least 8 characters';
    }
    if (userData.password !== userData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      await register(userData);
      // Redirect will be handled by AuthContext
    } catch (error) {
      setErrors({
        general: error.message || 'Registration failed. Please try again.'
      });
    }
  };

  return (
    <SignUpContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Title variants={itemVariants}>Create Your Account</Title>
      
      <Form onSubmit={handleSubmit}>
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorMessage>{errors.general}</ErrorMessage>
          </motion.div>
        )}
        
        <FormGrid>
          <FormGroup variants={itemVariants}>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              whileFocus={{ scale: 1.01 }}
            />
            {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup variants={itemVariants}>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              whileFocus={{ scale: 1.01 }}
            />
            {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
          </FormGroup>
        </FormGrid>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            error={errors.email}
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
            value={userData.password}
            onChange={handleChange}
            error={errors.password}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup variants={itemVariants}>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            whileFocus={{ scale: 1.01 }}
          />
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
        </FormGroup>
        
        <Button
          type="submit"
          disabled={isLoading}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </Form>
      
      <LinkText variants={itemVariants}>
        Already have an account? <Link to="/signin">Sign In</Link>
      </LinkText>
    </SignUpContainer>
  );
};

export default SignUp;