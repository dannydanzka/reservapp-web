'use client';

import { createGlobalStyle } from 'styled-components';

/**
 * Global styles for the application.
 * Includes CSS reset, base styles, and global utilities.
 */
export const GlobalStyles = createGlobalStyle`
  /* CSS Reset and Base Styles */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
    padding: 0;
  }

  html {
    height: 100%;
    scroll-behavior: smooth;
  }

  body {
    height: 100%;
    font-family: ${({ theme }) => theme.typography.fontFamily.body.join(', ')};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.colors.secondary[900]};
    background-color: ${({ theme }) => theme.colors.secondary[50]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeSpeed;
  }

  #__next {
    height: 100%;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading.join(', ')};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    color: ${({ theme }) => theme.colors.secondary[900]};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }

  p {
    font-family: ${({ theme }) => theme.typography.fontFamily.body.join(', ')};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primary[700]};
      text-decoration: underline;
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
      outline-offset: 2px;
    }
  }

  /* Forms */
  button, input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    width: 100%;
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
    border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: ${({ theme }) => theme.colors.white};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    transition: all ${({ theme }) => theme.transitions.fast};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.secondary[400]};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.secondary[100]};
      cursor: not-allowed;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  /* Lists */
  ul, ol {
    padding-left: ${({ theme }) => theme.spacing[6]};
  }

  li {
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Utilities */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing[4]};

    @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
      padding: 0 ${({ theme }) => theme.spacing[6]};
    }

    @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
      padding: 0 ${({ theme }) => theme.spacing[8]};
    }
  }

  /* Loading spinner animation */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  /* Fade animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .fade-in {
    animation: fadeIn ${({ theme }) => theme.transitions.normal};
  }

  .fade-out {
    animation: fadeOut ${({ theme }) => theme.transitions.normal};
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Print styles */
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    a, a:visited {
      text-decoration: underline;
    }

    img {
      max-width: 100% !important;
    }

    p, h2, h3 {
      orphans: 3;
      widows: 3;
    }

    h2, h3 {
      page-break-after: avoid;
    }
  }
`;
