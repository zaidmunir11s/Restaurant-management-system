// src/components/pos/components/BranchSelector.js
import React from 'react';
import styled from 'styled-components';
import { FaStore } from 'react-icons/fa';

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.theme.colors.background.main};
  padding: 0.4rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.small};
`;

const StoreIcon = styled(FaStore)`
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
`;

const Select = styled.select`
  padding: 0.25rem 0.5rem;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.primary};
  
  &:focus {
    outline: none;
  }
`;

const BranchSelector = ({ branches, selectedBranch, onBranchChange }) => {
  return (
    <SelectorContainer>
      <StoreIcon />
      <Select 
        value={selectedBranch?.id || ''}
        onChange={onBranchChange}
      >
        <option value="" disabled>Select Branch</option>
        {branches.map(branch => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </Select>
    </SelectorContainer>
  );
};

export default BranchSelector;