import styled from 'styled-components';

export const StatsGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (width >= 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (width >= 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (width >= 1280px) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

export const StatCard = styled.div<{ $bgColor: string }>`
  padding: 1rem;

  ${({ $bgColor }) => {
    switch ($bgColor) {
      case 'bg-blue-50':
        return 'background-color: #eff6ff;';
      case 'bg-green-50':
        return 'background-color: #f0fdf4;';
      case 'bg-yellow-50':
        return 'background-color: #fefce8;';
      case 'bg-red-50':
        return 'background-color: #fef2f2;';
      case 'bg-purple-50':
        return 'background-color: #faf5ff;';
      case 'bg-indigo-50':
        return 'background-color: #eef2ff;';
      default:
        return 'background-color: #f9fafb;';
    }
  }}
`;

export const StatCardContent = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export const StatCardMain = styled.div`
  flex: 1;
`;

export const StatCardHeader = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const StatIcon = styled.div<{ $iconColor: string }>`
  width: 1rem;
  height: 1rem;

  ${({ $iconColor }) => {
    switch ($iconColor) {
      case 'text-blue-600':
        return 'color: #2563eb;';
      case 'text-green-600':
        return 'color: #16a34a;';
      case 'text-yellow-600':
        return 'color: #ca8a04;';
      case 'text-red-600':
        return 'color: #dc2626;';
      case 'text-purple-600':
        return 'color: #9333ea;';
      case 'text-indigo-600':
        return 'color: #4f46e5;';
      default:
        return 'color: #6b7280;';
    }
  }}
`;

export const StatTitle = styled.p`
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const StatValue = styled.p`
  color: #111827;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

export const StatAmount = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

export const StatSubtitleContainer = styled.div``;

export const StatSubtitle = styled.p`
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0;
`;

export const StatSubAmount = styled.p`
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
`;

export const StatPercentageContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 0.25rem;
`;

export const StatPercentageDot = styled.div<{ $color: string }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;

  ${({ $color }) => {
    switch ($color) {
      case 'blue':
        return 'background-color: #3b82f6;';
      case 'green':
        return 'background-color: #10b981;';
      case 'yellow':
        return 'background-color: #f59e0b;';
      case 'red':
        return 'background-color: #ef4444;';
      case 'purple':
        return 'background-color: #8b5cf6;';
      case 'indigo':
        return 'background-color: #6366f1;';
      default:
        return 'background-color: #6b7280;';
    }
  }}
`;

export const StatPercentage = styled.p`
  color: #6b7280;
  font-size: 0.75rem;
  margin: 0;
`;
