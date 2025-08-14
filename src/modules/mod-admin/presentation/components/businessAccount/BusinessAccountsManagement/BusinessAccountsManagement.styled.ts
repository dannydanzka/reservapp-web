import styled from 'styled-components';

export const Container = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  padding: 2rem;
`;

export const Header = styled.div`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  color: ${(props) => props.theme.colors.secondary[900]};
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
`;

export const Subtitle = styled.p`
  color: ${(props) => props.theme.colors.secondary[600]};
  font-size: 1rem;
  margin: 0;
`;

export const FiltersContainer = styled.div`
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.secondary[200]};
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
`;

export const FilterLabel = styled.label`
  color: ${(props) => props.theme.colors.secondary[900]};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const SearchInput = styled.input`
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.secondary[200]};
  border-radius: 8px;
  color: ${(props) => props.theme.colors.secondary[900]};
  font-size: 0.875rem;
  padding: 0.75rem 1rem;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary[600]};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary[100]};
    outline: none;
  }
`;

export const Select = styled.select`
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.secondary[200]};
  border-radius: 8px;
  color: ${(props) => props.theme.colors.secondary[900]};
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;

  &:focus {
    border-color: ${(props) => props.theme.colors.primary[600]};
    box-shadow: 0 0 0 3px ${(props) => props.theme.colors.primary[100]};
    outline: none;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.secondary[200]};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

export const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

export const StatValue = styled.div`
  color: ${(props) => props.theme.colors.primary[600]};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  color: ${(props) => props.theme.colors.secondary[600]};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const TableContainer = styled.div`
  background: ${(props) => props.theme.colors.white};
  border: 1px solid ${(props) => props.theme.colors.secondary[200]};
  border-radius: 12px;
  overflow: hidden;
`;

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

export const TableHeader = styled.thead`
  background: ${(props) => props.theme.colors.secondary[50]};
`;

export const TableRow = styled.tr`
  &:hover {
    background: ${(props) => props.theme.colors.secondary[50]};
  }
`;

export const TableHeaderCell = styled.th`
  border-bottom: 1px solid ${(props) => props.theme.colors.secondary[200]};
  color: ${(props) => props.theme.colors.secondary[900]};
  cursor: pointer;
  font-weight: 600;
  padding: 1rem;
  text-align: left;

  &:hover {
    background: ${(props) => props.theme.colors.secondary[100]};
  }
`;

export const TableCell = styled.td`
  border-bottom: 1px solid ${(props) => props.theme.colors.secondary[200]};
  color: ${(props) => props.theme.colors.secondary[600]};
  padding: 1rem;
`;

export const BusinessInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const BusinessName = styled.span`
  color: ${(props) => props.theme.colors.secondary[900]};
  font-weight: 600;
`;

export const BusinessDetails = styled.span`
  color: ${(props) => props.theme.colors.secondary[600]};
  font-size: 0.875rem;
`;

export const StatusBadge = styled.span<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;

  ${(props) => {
    switch (props.$status) {
      case 'ACTIVE':
        return `
          background: #dcfce7;
          color: #166534;
        `;
      case 'INACTIVE':
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
      case 'PENDING':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      default:
        return `
          background: ${props.theme.colors.secondary[100]};
          color: ${props.theme.colors.secondary[600]};
        `;
    }
  }}
`;

export const GiroTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

export const GiroTag = styled.span`
  align-items: center;
  background: ${(props) => props.theme.colors.primary[100]};
  border-radius: 4px;
  color: ${(props) => props.theme.colors.primary[700]};
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
`;

export const MetricsGrid = styled.div`
  display: grid;
  font-size: 0.875rem;
  gap: 0.5rem;
  grid-template-columns: repeat(3, 1fr);
`;

export const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

export const MetricValue = styled.span`
  color: ${(props) => props.theme.colors.secondary[900]};
  font-weight: 600;
`;

export const MetricLabel = styled.span`
  color: ${(props) => props.theme.colors.secondary[600]};
  font-size: 0.75rem;
`;

export const ActionButton = styled.button`
  align-items: center;
  background: ${(props) => props.theme.colors.primary[600]};
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-size: 0.875rem;
  font-weight: 500;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.colors.primary[700]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const LoadingContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 4rem;
`;

export const EmptyState = styled.div`
  color: ${(props) => props.theme.colors.secondary[600]};
  padding: 4rem 2rem;
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

export const EmptyStateTitle = styled.h3`
  color: ${(props) => props.theme.colors.secondary[900]};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const EmptyStateText = styled.p`
  color: ${(props) => props.theme.colors.secondary[600]};
  margin: 0;
`;
