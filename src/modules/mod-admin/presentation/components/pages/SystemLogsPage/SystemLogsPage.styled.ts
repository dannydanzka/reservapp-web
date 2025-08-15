import styled from 'styled-components';

export const Container = styled.div`
  margin: 0 auto;
  max-width: 100%;
  padding: 2rem;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (width >= 768px) {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const HeaderContent = styled.div`
  flex: 1;
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (width >= 768px) {
    flex-wrap: nowrap;
  }
`;

export const Title = styled.h1`
  color: var(--color-text-primary);
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
`;

export const Subtitle = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin: 0;
`;

// Stats Grid
export const StatsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-bottom: 2rem;
`;

export const StatsCard = styled.div<{ $color?: 'primary' | 'success' | 'warning' | 'error' }>`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;

  ${({ $color = 'primary' }) => {
    const colors = {
      error: 'var(--color-error)',
      primary: 'var(--color-primary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
    };

    return `
      border-left: 4px solid ${colors[$color]};
      
      &:hover {
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }
    `;
  }}
`;

export const StatsIcon = styled.div<{ $color?: 'primary' | 'success' | 'warning' | 'error' }>`
  background: ${({ $color = 'primary' }) => {
    const colors = {
      error: 'var(--color-error-light)',
      primary: 'var(--color-primary-light)',
      success: 'var(--color-success-light)',
      warning: 'var(--color-warning-light)',
    };
    return colors[$color];
  }};
  border-radius: 0.5rem;
  color: ${({ $color = 'primary' }) => {
    const colors = {
      error: 'var(--color-error)',
      primary: 'var(--color-primary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
    };
    return colors[$color];
  }};
  font-size: 2rem;
  padding: 0.75rem;
`;

export const StatsContent = styled.div`
  flex: 1;
`;

export const StatsValue = styled.div`
  color: var(--color-text-primary);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
`;

export const StatsLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;

export const StatsTrend = styled.div<{ $positive?: boolean }>`
  color: ${({ $positive }) => ($positive ? 'var(--color-success)' : 'var(--color-error)')};
  font-size: 0.75rem;
  font-weight: 500;
`;

// Filters Section
export const FiltersSection = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
`;

export const FiltersHeader = styled.div`
  align-items: center;
  display: flex;
  justify-content: between;
  margin-bottom: 1rem;
`;

export const FiltersTitle = styled.h3`
  color: var(--color-text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

export const FiltersGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin-bottom: 1rem;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FilterLabel = styled.label`
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 500;
`;

export const FilterActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
`;

// Logs Table Section
export const TableSection = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  padding: 1.5rem;
`;

export const TableTitle = styled.h3`
  color: var(--color-text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
`;

export const TableActions = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const Table = styled.div`
  overflow-x: auto;
`;

export const TableContent = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

export const TableHead = styled.thead`
  background: var(--color-background-alt);
`;

export const TableRow = styled.tr<{ $clickable?: boolean }>`
  border-bottom: 1px solid var(--color-border);

  ${({ $clickable }) =>
    $clickable &&
    `
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background: var(--color-background-alt);
    }
  `}

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  padding: 1rem;
  vertical-align: top;
`;

// Badges
export const LogLevelBadge = styled.span<{ $level: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${({ $level }) => {
    switch ($level) {
      case 'DEBUG':
        return `
          background: var(--color-info-light);
          color: var(--color-info);
        `;
      case 'INFO':
        return `
          background: var(--color-success-light);
          color: var(--color-success);
        `;
      case 'WARN':
        return `
          background: var(--color-warning-light);
          color: var(--color-warning);
        `;
      case 'ERROR':
        return `
          background: var(--color-error-light);
          color: var(--color-error);
        `;
      case 'CRITICAL':
        return `
          background: var(--color-error);
          color: white;
        `;
      default:
        return `
          background: var(--color-background-alt);
          color: var(--color-text-secondary);
        `;
    }
  }}
`;

export const CategoryBadge = styled.span`
  align-items: center;
  background: var(--color-background-alt);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  color: var(--color-text-secondary);
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
`;

// Pagination
export const PaginationContainer = styled.div`
  align-items: center;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  padding: 1.5rem;
`;

export const PaginationInfo = styled.div`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
`;

export const PaginationActions = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

// Modal Styles
export const ModalOverlay = styled.div`
  align-items: center;
  background: rgb(0 0 0 / 0.5);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 1rem;
  position: fixed;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: var(--color-surface);
  border-radius: 0.75rem;
  box-shadow:
    0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 10px 10px -5px rgb(0 0 0 / 0.04);
  max-height: 90vh;
  max-width: 800px;
  overflow-y: auto;
  width: 100%;
`;

export const ModalHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
`;

export const ModalTitle = styled.h2`
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

export const ModalBody = styled.div`
  padding: 1.5rem;
`;

export const ModalSection = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ModalSectionTitle = styled.h4`
  color: var(--color-text-primary);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
`;

export const DetailGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

export const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const DetailLabel = styled.span`
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const DetailValue = styled.span`
  color: var(--color-text-primary);
  font-family:
    Monaco,
    Menlo,
    Ubuntu Mono,
    monospace;
  font-size: 0.875rem;
  word-break: break-all;
`;

export const CodeBlock = styled.pre`
  background: var(--color-background-alt);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
  color: var(--color-text-primary);
  font-family:
    Monaco,
    Menlo,
    Ubuntu Mono,
    monospace;
  font-size: 0.75rem;
  margin: 0;
  max-height: 300px;
  overflow-y: auto;
  padding: 1rem;
  white-space: pre-wrap;
  word-break: break-all;
`;

export const EmptyState = styled.div`
  color: var(--color-text-secondary);
  padding: 4rem 2rem;
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.h3`
  color: var(--color-text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
`;

export const EmptyStateDescription = styled.p`
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin: 0;
`;

export const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 4rem 2rem;
`;

export const LoadingSpinner = styled.div`
  animation: spin 1s linear infinite;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  border-top: 2px solid var(--color-primary);
  height: 2rem;
  width: 2rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

// Auto-refresh indicator
export const AutoRefreshIndicator = styled.div<{ $active: boolean }>`
  align-items: center;
  color: ${({ $active }) => ($active ? 'var(--color-success)' : 'var(--color-text-secondary)')};
  display: flex;
  font-size: 0.875rem;
  gap: 0.5rem;

  &::before {
    animation: ${({ $active }) => ($active ? 'pulse 2s infinite' : 'none')};
    background: ${({ $active }) => ($active ? 'var(--color-success)' : 'var(--color-border)')};
    border-radius: 50%;
    content: '';
    height: 8px;
    width: 8px;
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }
  }
`;
