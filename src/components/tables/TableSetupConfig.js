// src/components/tables/TableSetupConfig.js
import React from 'react';
import styled from 'styled-components';
import { FaChair, FaInfoCircle } from 'react-icons/fa';

const SettingsCard = styled.div`
  background-color: ${props => props.theme.colors.background.main}50;
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.background.main};
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.small};
    border-color: ${props => props.theme.colors.primary}30;
  }
  
  h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
    
    svg {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
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
    
    input[type="range"] {
      flex: 1;
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 8px;
      background: ${props => props.theme.colors.background.main};
      border-radius: 5px;
      outline: none;
      
      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${props => props.theme.colors.primary};
        cursor: pointer;
        transition: all 0.2s ease;
        
        &:hover {
          transform: scale(1.2);
          box-shadow: 0 0 10px ${props => props.theme.colors.primary}50;
        }
      }
      
      &::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: ${props => props.theme.colors.primary};
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
        
        &:hover {
          transform: scale(1.2);
          box-shadow: 0 0 10px ${props => props.theme.colors.primary}50;
        }
      }
    }
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  
  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: ${props => props.theme.colors.primary};
  }
  
  label {
    cursor: pointer;
    font-size: 1rem;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const InfoText = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-top: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  
  svg {
    margin-top: 0.2rem;
    color: ${props => props.theme.colors.secondary};
    flex-shrink: 0;
  }
`;

const TableSetupConfig = ({ formData, handleChange }) => {
  return (
    <SettingsCard>
      <h3>
        <FaChair /> Table Configuration
      </h3>
      <SliderContainer>
        <div className="slider-label">
          <span>Number of Tables</span>
          <span className="slider-value">{formData.tableCount}</span>
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
      
      <Checkbox>
        <input
          type="checkbox"
          id="includeIndoorTables"
          name="includeIndoorTables"
          checked={formData.includeIndoorTables}
          onChange={handleChange}
        />
        <label htmlFor="includeIndoorTables">Indoor Tables</label>
      </Checkbox>
      
      <Checkbox>
        <input
          type="checkbox"
          id="includeOutdoorTables"
          name="includeOutdoorTables"
          checked={formData.includeOutdoorTables}
          onChange={handleChange}
        />
        <label htmlFor="includeOutdoorTables">Outdoor Tables</label>
      </Checkbox>
      
      <InfoText>
        <FaInfoCircle />
        Tables will be automatically created based on these settings. You can adjust the layout and assign tables to sections later.
      </InfoText>
    </SettingsCard>
  );
};

export default TableSetupConfig;