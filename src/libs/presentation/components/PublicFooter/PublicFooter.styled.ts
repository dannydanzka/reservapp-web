import { styled } from 'styled-components';
import Link from 'next/link';

export const FooterContainer = styled.footer`
  background: ${({ theme }) => theme.colors.secondary[900]};
  color: ${({ theme }) => theme.colors.secondary[300]};
  padding: ${({ theme }) => theme.spacing[12]} 0 ${({ theme }) => theme.spacing[6]};
`;

export const FooterContent = styled.div`
  margin: 0 auto;
  max-width: 1280px;
  padding: 0 ${({ theme }) => theme.spacing[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing[6]};
  }
`;

export const FooterGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[8]};
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const FooterSection = styled.div`
  h3 {
    color: ${({ theme }) => theme.colors.white};
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

export const FooterLink = styled(Link)`
  color: ${({ theme }) => theme.colors.secondary[400]};
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`;

export const FooterBottom = styled.div`
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[700]};
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    text-align: center;
  }
`;

export const Copyright = styled.p`
  color: ${({ theme }) => theme.colors.secondary[500]};
  font-size: 0.875rem;
  margin: 0;
`;

export const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
`;
