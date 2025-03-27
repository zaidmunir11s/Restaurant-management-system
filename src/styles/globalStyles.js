// src/styles/globalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: ${props => props.theme.typography.fontFamily};
    background-color: ${props => props.theme.colors.background.main};
    color: ${props => props.theme.colors.text.primary};
    transition: background-color ${props => props.theme.transitions.medium}, color ${props => props.theme.transitions.medium};
    line-height: 1.5;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  h1 {
    font-size: ${props => props.theme.typography.h1.fontSize};
  }
  
  h2 {
    font-size: ${props => props.theme.typography.h2.fontSize};
  }
  
  h3 {
    font-size: ${props => props.theme.typography.h3.fontSize};
  }
  
  h4 {
    font-size: ${props => props.theme.typography.h4.fontSize};
  }
  
  h5 {
    font-size: ${props => props.theme.typography.h5.fontSize};
  }
  
  h6 {
    font-size: ${props => props.theme.typography.h6.fontSize};
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color ${props => props.theme.transitions.short};
    
    &:hover {
      color: ${props => {
        const hexColor = props.theme.colors.primary.replace('#', '');
        const r = parseInt(hexColor.substring(0, 2), 16);
        const g = parseInt(hexColor.substring(2, 4), 16);
        const b = parseInt(hexColor.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, 0.8)`;
      }};
    }
  }
  
  button, input, select, textarea {
    font-family: inherit;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background.main};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}80;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primary};
  }
  
  /* Transitions for dark/light mode */
  .theme-transition {
    transition: background-color ${props => props.theme.transitions.medium},
                color ${props => props.theme.transitions.medium},
                border-color ${props => props.theme.transitions.medium},
                box-shadow ${props => props.theme.transitions.medium};
  }
  
  /* Page transitions */
  .page-transition-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  
  .page-transition-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 300ms, transform 300ms;
  }
  
  .page-transition-exit {
    opacity: 1;
    transform: translateY(0);
  }
  
  .page-transition-exit-active {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 300ms, transform 300ms;
  }
`;

export default GlobalStyles;