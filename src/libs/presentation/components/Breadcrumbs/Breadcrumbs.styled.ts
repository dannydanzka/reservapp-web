import styled from 'styled-components';

export const StyledBreadcrumbs = styled.nav`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 0.875rem;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem 0;
`;

export const StyledBreadcrumbItem = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

export const StyledBreadcrumbLink = styled.div`
  a,
  span {
    align-items: center;
    border-radius: 0.375rem;
    color: #6b7280;
    display: flex;
    padding: 0.25rem 0.5rem;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      background-color: #f3f4f6;
      color: #8b5cf6;
    }

    &:focus {
      outline: 2px solid #8b5cf6;
      outline-offset: 2px;
    }
  }
`;

export const StyledBreadcrumbCurrent = styled.span`
  align-items: center;
  color: #1f2937;
  display: flex;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
`;

export const StyledSeparator = styled.span`
  align-items: center;
  color: #d1d5db;
  display: flex;
  user-select: none;

  svg {
    flex-shrink: 0;
  }
`;
