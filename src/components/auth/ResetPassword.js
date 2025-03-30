import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

const ResetPasswordContainer = styled(motion.div)`
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

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword, isLoading, error } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  
  // Update errors when there's an authentication error
  useEffect(() => {
    if (error) {
      setErrors({ general: error });
    }
  }, [error]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (!password) {
      setErrors({ password: 'New password is required' });
      return;
    }
    
    if (password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters long' });
      return;
    }
    
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    
    try {
      await resetPassword(token, password);
      setIsSuccess(true);
    } catch (err) {
      // Error handling is done in AuthContext via useEffect above
    }
  };
  
  return (
    <ResetPasswordContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Title variants={itemVariants}>Create New Password</Title>
      
      {isSuccess ? (
        <>
          <Text variants={itemVariants}>
            Your password has been reset successfully.
          </Text>
          <LinkText variants={itemVariants}>
            <Link to="/signin">Sign In with your new password</Link>
          </LinkText>
        </>
      ) : (
        <>
          <Text variants={itemVariants}>
            Enter and confirm your new password below.
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
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
                whileFocus={{ scale: 1.01 }}
              />
              {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup variants={itemVariants}>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                required
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
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </Form>
          
          <LinkText variants={itemVariants}>
            <Link to="/signin">Back to Sign In</Link>
          </LinkText>
        </>
      )}
    </ResetPasswordContainer>
  );
};

export default ResetPassword;