// src/components/tables/TableSetupConfig.js
import React from 'react';
import styled from 'styled-components';
import { FaChair, FaInfoCircle } from 'react-icons/fa';

const SetupContainer = styled.div`
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const SetupTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.text.primary};
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const FormField = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid ${props => props.theme.colors.background.main};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  transition: all ${props => props.theme.transitions.short};
  background-color: ${props => props.theme.colors.background.main}50;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    background-color: white;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const CheckboxField = styled.div`
  margin-bottom: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  input {
    width: 20px;
    height: 20px;
    accent-color: ${props => props.theme.colors.primary};
    cursor: pointer;
  }
`;

const InfoText = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text.secondary};
  
  svg {
    flex-shrink: 0;
    margin-top: 0.2rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const TableSetupConfig = ({ formData, handleChange }) => {
  return (
    <SetupContainer>
      <SetupTitle>
        <FaChair /> Table Setup
      </SetupTitle>
      
      <FormField>
        <Label>Number of Tables</Label>
        <Input
          type="number"
          name="tableCount"
          min="1"
          max="100"
          value={formData.tableCount}
          onChange={handleChange}
        />
      </FormField>
      
      <CheckboxField>
        <CheckboxLabel>
          <input
            type="checkbox"
            name="includeIndoorTables"
            checked={formData.includeIndoorTables}
            onChange={handleChange}
          />
          Include indoor tables
        </CheckboxLabel>
      </CheckboxField>
      
      <CheckboxField>
        <CheckboxLabel>
          <input
            type="checkbox"
            name="includeOutdoorTables"
            checked={formData.includeOutdoorTables}
            onChange={handleChange}
          />
          Include outdoor tables
        </CheckboxLabel>
      </CheckboxField>
      
      <InfoText>
        <FaInfoCircle />
        <p>
          Tables will be automatically created with varying capacities based on your settings. 
          You can customize them further after creating the branch.
        </p>
      </InfoText>
    </SetupContainer>
  );
};

export default TableSetupConfig;