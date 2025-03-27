// src/components/menu/components/BranchSelector.js
import React from 'react';
import styled from 'styled-components';
import { FaStore } from 'react-icons/fa';

const SelectorContainer = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SelectLabel = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: ${props => props.theme.borderRadius.small};
  border: 1px solid #e0e0e0;
  background-color: ${props => props.theme.colors.background.paper};
  font-size: 1rem;
  color: ${props => props.theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const BranchSelector = ({ branches, selectedBranchId, onChange }) => {
  return (
    <SelectorContainer>
      <SelectLabel htmlFor="branchSelector">
        <FaStore /> Select Branch
      </SelectLabel>
      <Select 
        id="branchSelector" 
        value={selectedBranchId || ''}
        onChange={onChange}
      >
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