import React from 'react';
import styled from 'styled-components';
import { FaChair } from 'react-icons/fa';

const SettingsCard = styled.div`
  background-color: ${props => props.theme.colors.background.main}50;
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.background.main};
  margin-bottom: 1.5rem;
`;

const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text.primary};
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }
  
  label {
    cursor: pointer;
    font-size: 0.9rem;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  
  .slider-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .slider-value {
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.primary}20;
    padding: 0.25rem 0.75rem;
    border-radius: ${props => props.theme.borderRadius.full};
  }
  
  .slider-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const TableSetupConfig = ({ formData, handleChange }) => {
  return (
    <SettingsCard>
      <CardTitle>
        <FaChair /> Table Configuration
      </CardTitle>
      
      <Checkbox>
        <input
          type="checkbox"
          id="includeIndoorTables"
          name="includeIndoorTables"
          checked={formData.includeIndoorTables}
          onChange={handleChange}
        />
        <label htmlFor="includeIndoorTables">Include Indoor Tables</label>
      </Checkbox>
      
      <Checkbox>
        <input
          type="checkbox"
          id="includeOutdoorTables"
          name="includeOutdoorTables"
          checked={formData.includeOutdoorTables}
          onChange={handleChange}
        />
        <label htmlFor="includeOutdoorTables">Include Outdoor Tables</label>
      </Checkbox>
      
      <SliderContainer>
        <div className="slider-label">
          <label htmlFor="tableCount">Number of Tables</label>
          <div className="slider-value">{formData.tableCount}</div>
        </div>
        <div className="slider-row">
          <input
            type="range"
            id="tableCount"
            name="tableCount"
            min="1"
            max="50"
            value={formData.tableCount}
            onChange={handleChange}
          />
        </div>
      </SliderContainer>
    </SettingsCard>
  );
};

export default TableSetupConfig;