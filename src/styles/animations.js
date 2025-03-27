// src/styles/animations.js
import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const slideInRight = keyframes`
  from { transform: translateX(50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const slideInLeft = keyframes`
  from { transform: translateX(-50px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const slideInUp = keyframes`
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

// Animation utility functions
export const animateElement = (element, animation, delay = 0) => {
  if (element) {
    element.style.opacity = '0';
    element.style.animation = `${animation} 0.5s ease forwards ${delay}s`;
  }
};

export const staggerChildren = (parent, animation, staggerDelay = 0.1) => {
  if (parent) {
    const children = Array.from(parent.children);
    children.forEach((child, index) => {
      animateElement(child, animation, index * staggerDelay);
    });
  }
};