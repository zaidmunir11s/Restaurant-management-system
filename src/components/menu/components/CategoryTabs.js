// src/components/menu/components/CategoryTabs.js
import React from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.primary}50;
    border-radius: 4px;
  }
`;

const Tab = styled.button`
  background: ${props => props.active ? props.theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : '#e0e0e0'};
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.short};
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.background.main};
  }
  
  &.special {
    border: 1px solid ${props => props.active ? props.theme.colors.primary : '#FFB74D'};
    color: ${props => props.active ? 'white' : '#E65100'};
  }
`;

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 0.9rem;
  margin: 0;
  color: ${props => props.theme.colors.text.secondary};
`;

const CategoryTabs = ({ 
  categories, 
  activeCategory, 
  setActiveCategory,
  hasDeals = true,
  hasExclusiveOffers = true
}) => {
  const regularCategories = categories.filter(cat => 
    cat !== 'All' && 
    cat !== 'Deals' && 
    cat !== 'Exclusive Offers'
  );
  
  // Ensure we always have "All" as first option
  const allCategory = categories.find(cat => cat === 'All') || 'All';
  
  // Check if we have these special categories in our list
  const hasDealCategory = categories.includes('Deals');
  const hasExclusiveOffersCategory = categories.includes('Exclusive Offers');
  
  return (
    <CategorySection>
      <SectionTitle>Browse Categories</SectionTitle>
      <TabsContainer>
        {/* Always show All tab */}
        <Tab 
          active={activeCategory === allCategory.toLowerCase()} 
          onClick={() => setActiveCategory(allCategory.toLowerCase())}
        >
          {allCategory}
        </Tab>
        
        {/* Special sections */}
        {hasDeals && hasDealCategory && (
          <Tab 
            className="special"
            active={activeCategory === 'deals'} 
            onClick={() => setActiveCategory('deals')}
          >
            Deals
          </Tab>
        )}
        
        {hasExclusiveOffers && hasExclusiveOffersCategory && (
          <Tab 
            className="special"
            active={activeCategory === 'exclusive offers'} 
            onClick={() => setActiveCategory('exclusive offers')}
          >
            Exclusive Offers
          </Tab>
        )}
        
        {/* Regular categories */}
        {regularCategories.map(category => (
          <Tab 
            key={category}
            active={activeCategory === category.toLowerCase()}
            onClick={() => setActiveCategory(category.toLowerCase())}
          >
            {category}
          </Tab>
        ))}
      </TabsContainer>
    </CategorySection>
  );
};

export default CategoryTabs;