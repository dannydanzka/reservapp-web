import styled from 'styled-components';

export const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const QuickFilters = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const FilterField = styled.div<{ minWidth?: string }>`
  ${({ minWidth }) =>
    minWidth &&
    `
    min-width: ${minWidth};
  `}

  &.flex-1 {
    flex: 1;
  }
`;

export const FilterLabel = styled.label`
  color: #374151;
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;

  svg {
    display: inline;
    height: 1rem;
    margin-right: 0.25rem;
    width: 1rem;
  }
`;

export const FilterSelect = styled.select`
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  width: 100%;

  &:focus {
    border-color: transparent;
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
  }
`;

export const FilterInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  width: 100%;

  &:focus {
    border-color: transparent;
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
  }
`;

export const ExpandButtonContainer = styled.div`
  align-items: flex-end;
  display: flex;
`;

export const ExpandIcon = styled.div<{ $isExpanded: boolean }>`
  width: 1rem;
  height: 1rem;
  transition: transform 0.2s ease;

  ${({ $isExpanded }) =>
    $isExpanded &&
    `
    transform: rotate(180deg);
  `}
`;

export const AdvancedFiltersCard = styled.div`
  background: #f9fafb;
  padding: 1rem;
`;

export const AdvancedFiltersGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (width >= 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (width >= 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const ActionsContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const ActionsLeft = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

export const ActionsRight = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const ActiveFiltersIndicator = styled.span`
  align-items: center;
  display: inline-flex;
  gap: 0.25rem;

  svg {
    height: 1rem;
    width: 1rem;
  }
`;
