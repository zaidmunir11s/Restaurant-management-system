import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const ForgotPasswordContainer = styled(motion.div)`
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
  margin-bottom: 1rem;
`;

const Text = styled(motion.p)`
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled(motion.form)`
  width: 100%;
`;

const FormGroup = styled(motion.div)`
  margin-bottom: 1.5rem;
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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.2 }
  }
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const { forgotPassword, isLoading, error } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  
  // Update errors when there's an authentication error
  useEffect(() => {
    if (error) {
      setErrors({ general: error });
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      // Error handling is done in AuthContext via useEffect above
    }
  };
  
  return (
    <ForgotPasswordContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Title variants={itemVariants}>Reset Password</Title>
      
      {isSubmitted ? (
        <>
          <Text variants={itemVariants}>
            If an account exists with the email address you provided, 
            we have sent password reset instructions to that address.
          </Text>
          <LinkText variants={itemVariants}>
            <Link to="/signin">Return to Sign In</Link>
          </LinkText>
        </>
      ) : (
        <>
          <Text variants={itemVariants}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
          
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
            
            <FormGroup variants={itemVariants}>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
                whileFocus={{ scale: 1.01 }}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            
            <Button
              type="submit"
              disabled={isLoading}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </Form>
          
          <LinkText variants={itemVariants}>
            <Link to="/signin">Back to Sign In</Link>
          </LinkText>
        </>
      )}
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;