'use client';

import React from 'react';

import styled from 'styled-components';

import { PublicFooter } from '../components/PublicFooter';
import { PublicHeader } from '../components/PublicHeader';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

/**
 * Public layout for unauthenticated pages (landing, marketing, etc.).
 * Includes public header and footer.
 */
export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <PublicHeader />
      <MainContent>{children}</MainContent>
      <PublicFooter />
    </LayoutContainer>
  );
};
