import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';

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
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
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
`;

const LinkText = styled(motion.p)`
  text-align: center;
  margin-top: 1.5rem;
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError('');
    setIsSuccess(true);
  };
  
  return (
    <ResetPasswordContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Title>Create New Password</Title>
      
      {isSuccess ? (
        <>
          <Text>
            Your password has been reset successfully.
          </Text>
          <LinkText>
            <Link to="/signin">Sign In with your new password</Link>
          </LinkText>
        </>
      ) : (
        <>
          <Text>
            Enter and confirm your new password below.
          </Text>
          
          <Form onSubmit={handleSubmit}>
            {error && (
              <Text style={{ color: 'red', marginBottom: '1rem' }}>{error}</Text>
            )}
            
            <FormGroup>
              <Label htmlFor="password">New Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </FormGroup>
            
            <Button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reset Password
            </Button>
          </Form>
          
          <LinkText>
            <Link to="/signin">Back to Sign In</Link>
          </LinkText>
        </>
      )}
    </ResetPasswordContainer>
  );
};

export default ResetPassword;