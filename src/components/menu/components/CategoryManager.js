// src/components/menu/components/CategoryManager.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPencilAlt, FaPlus, FaCheck, FaTimes, FaLayerGroup } from 'react-icons/fa';

const Container = styled.div`
  margin-bottom: 2rem;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.small};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const CategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const CategoryChip = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.main};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.9rem;
  gap: 0.5rem;
  
  ${props => props.isSpecial && !props.active && `
    border: 1px solid #FFB74D;
    color: #E65100;
  `}

  ${props => !props.active && `
    &:hover {
      background-color: ${props.theme.colors.background.main}90;
    }
  `}
`;

const EditButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-left: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${props => props.theme.colors.text.secondary};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const AddButton = styled.button`
  background-color: ${props => props.theme.colors.primary}20;
  color: ${props => props.theme.colors.primary};
  border: 1px dashed ${props => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}30;
  }
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 3rem;
  border: 1px solid #e0e0e0;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}33;
  }
`;

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${props => props.theme.colors.background.paper};
  border: 1px solid #e0e0e0;
  border-radius: ${props => props.theme.borderRadius.small};
  z-index: 10;
  box-shadow: ${props => props.theme.shadows.medium};
`;

const SuggestionItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
  }
`;

const SuggestionSection = styled.div`
  border-bottom: 1px solid #e0e0e0;
  padding: 0.5rem 0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
  padding: 0.5rem 1rem;
  font-weight: 500;
  background-color: ${props => props.theme.colors.background.main}50;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
`;

const IconButton = styled.button`
  background: none;
  border: none;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  
  &:hover {
    background-color: ${props => props.theme.colors.background.main};
  }
  
  svg {
    color: ${props => props.color || props.theme.colors.text.secondary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.small};
  cursor: pointer;
  font-weight: 500;
  
  &.primary {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${props => {
        const hexColor = props.theme.colors.primary.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r * 0.9}, ${g * 0.9}, ${b * 0.9}, 1)`;
      }};
    }
  }
  
  &.secondary {
    background-color: transparent;
    color: ${props => props.theme.colors.text.primary};
    border: 1px solid #e0e0e0;
    
    &:hover {
      background-color: ${props => props.theme.colors.background.main};
    }
  }
`;

// Category suggestions from around the world
const CATEGORY_SUGGESTIONS = {
  common: [
    'Appetizers', 'Starters', 'Main Courses', 'Entrées', 'Desserts', 
    'Beverages', 'Drinks', 'Sides', 'Salads', 'Soups', 'Specials',
    'Chef\'s Specials', 'Deals', 'Exclusive Offers', 'Combo Meals'
  ],
  cuisine: [
    // American & European
    'Burgers', 'Sandwiches', 'Pizza', 'Pasta', 'Steaks', 'Seafood', 
    'BBQ', 'Grill', 'Baked Goods', 'Breakfast', 'Brunch',
    // Asian
    'Sushi', 'Noodles', 'Rice Dishes', 'Dim Sum', 'Curries', 
    'Stir-Fry', 'Bao', 'Dumplings', 'Hot Pot',
    // Latin American
    'Tacos', 'Burritos', 'Nachos', 'Empanadas', 'Tapas', 
    // Middle Eastern
    'Shawarma', 'Kebabs', 'Falafel', 'Mezze', 'Flatbreads',
    // Others
    'Street Food', 'Fusion'
  ],
  dietary: [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 
    'Low-Carb', 'Organic', 'Plant-Based', 'Halal', 'Kosher',
    'Low-Calorie', 'High-Protein', 'Sugar-Free', 'Nut-Free'
  ],
  drinks: [
    'Cocktails', 'Mocktails', 'Beer', 'Wine', 'Spirits', 'Whiskey',
    'Coffee', 'Tea', 'Smoothies', 'Juices', 'Sodas', 'Milkshakes',
    'Signature Drinks', 'Hot Drinks', 'Cold Drinks', 'Bubble Tea'
  ],
  meals: [
    'Breakfast', 'Brunch', 'Lunch', 'Dinner', 'Late Night',
    'Snacks', 'Kids Meals', 'Family Meals', 'Sharing Platters'
  ]
};

const CategoryManager = ({ 
  categories, 
  onUpdateCategories,
  onCancel,
  showDefaultCategories = true
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedCategories, setEditedCategories] = useState([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState(CATEGORY_SUGGESTIONS);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  useEffect(() => {
    // Initialize with existing categories
    setEditedCategories(categories.filter(cat => cat !== 'All'));
    
    // Click outside handler to close suggestions
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categories]);
  
  const handleEnterEditMode = () => {
    setEditMode(true);
  };
  
  const handleSaveCategories = () => {
    // Always add "All" at the beginning
    const updatedCategories = ['All', ...editedCategories];
    onUpdateCategories(updatedCategories);
    setEditMode(false);
  };
  
  const handleCancel = () => {
    setEditMode(false);
    setEditedCategories(categories.filter(cat => cat !== 'All'));
    onCancel();
  };
  
  const handleAddCategory = () => {
    if (newCategoryInput.trim() && !editedCategories.includes(newCategoryInput.trim())) {
      setEditedCategories([...editedCategories, newCategoryInput.trim()]);
      setNewCategoryInput('');
    }
  };
  
  const handleRemoveCategory = (category) => {
    setEditedCategories(editedCategories.filter(cat => cat !== category));
  };
  
  const handleInputChange = (e) => {
    const input = e.target.value;
    setNewCategoryInput(input);
    
    if (input.trim()) {
      // Filter suggestions
      const filtered = {};
      
      Object.keys(CATEGORY_SUGGESTIONS).forEach(section => {
        const matches = CATEGORY_SUGGESTIONS[section].filter(item =>
          item.toLowerCase().includes(input.toLowerCase())
        );
        
        if (matches.length > 0) {
          filtered[section] = matches;
        }
      });
      
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions(CATEGORY_SUGGESTIONS);
      setShowSuggestions(false);
    }
  };
  
  const handleSelectSuggestion = (suggestion) => {
    if (!editedCategories.includes(suggestion)) {
      setEditedCategories([...editedCategories, suggestion]);
    }
    setNewCategoryInput('');
    setShowSuggestions(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddCategory();
    }
  };

  const isSpecialCategory = (category) => {
    return category === 'Deals' || category === 'Exclusive Offers';
  };

  if (!editMode) {
    return (
      <Container>
        <Header>
          <Title>
            <FaLayerGroup /> Menu Categories
          </Title>
          <EditButton onClick={handleEnterEditMode}>
            <FaPencilAlt /> Edit Categories
          </EditButton>
        </Header>
        <CategoriesList>
          {categories
            .filter(cat => cat !== 'All')
            .map(category => (
              <CategoryChip 
                key={category} 
                isSpecial={isSpecialCategory(category)}
              >
                {category}
              </CategoryChip>
            ))
          }
        </CategoriesList>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <Title>
          <FaLayerGroup /> Edit Menu Categories
        </Title>
      </Header>
      
      <CategoriesList>
        {editedCategories.map(category => (
          <CategoryChip key={category} isSpecial={isSpecialCategory(category)}>
            {category}
            <IconButton 
              onClick={() => handleRemoveCategory(category)}
              color="#F44336"
            >
              <FaTimes size={14} />
            </IconButton>
          </CategoryChip>
        ))}
      </CategoriesList>
      
      <InputContainer>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Add new category..."
          value={newCategoryInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => newCategoryInput.trim() && setShowSuggestions(true)}
        />
        <ButtonsContainer>
          <IconButton onClick={handleAddCategory} color={newCategoryInput.trim() ? "#4CAF50" : undefined}>
            <FaCheck size={16} />
          </IconButton>
        </ButtonsContainer>
        
        {showSuggestions && (
          <SuggestionsContainer ref={suggestionsRef}>
            {Object.keys(filteredSuggestions).map(section => (
              filteredSuggestions[section].length > 0 && (
                <SuggestionSection key={section}>
                  <SectionTitle>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </SectionTitle>
                  {filteredSuggestions[section].map(suggestion => (
                    <SuggestionItem 
                      key={suggestion}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </SuggestionItem>
                  ))}
                </SuggestionSection>
              )
            ))}
          </SuggestionsContainer>
        )}
      </InputContainer>
      
      {showDefaultCategories && (
        <>
          <Title style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Suggested Categories
          </Title>
          <CategoriesList>
            {CATEGORY_SUGGESTIONS.common.slice(0, 8).map(suggestion => (
              !editedCategories.includes(suggestion) && (
                <AddButton 
                  key={suggestion}
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <FaPlus size={12} /> {suggestion}
                </AddButton>
              )
            ))}
          </CategoriesList>
        </>
      )}
      
      <ActionButtons>
        <Button className="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="primary" onClick={handleSaveCategories}>
          Save Categories
        </Button>
      </ActionButtons>
    </Container>
  );
};

export default CategoryManager;