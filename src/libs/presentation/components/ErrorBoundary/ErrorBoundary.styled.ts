import styled from 'styled-components';

export const StyledErrorBoundary = styled.div`
  align-items: center;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  min-height: 400px;
  padding: 2rem;
`;

export const StyledErrorContent = styled.div`
  max-width: 500px;
  text-align: center;
`;

export const StyledErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const StyledErrorTitle = styled.h2`
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const StyledErrorMessage = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

export const StyledErrorActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;
