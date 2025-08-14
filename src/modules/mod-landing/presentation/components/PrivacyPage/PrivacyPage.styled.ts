import { styled } from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
`;

export const PageHeader = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[900]};
  margin-bottom: 0;
  padding: 4rem 2rem;
  position: relative;
  text-align: center;
`;

export const PageTitle = styled.h1`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.1);

  @media (width <= 768px) {
    font-size: 2rem;
  }
`;

export const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 1.25rem;
  margin: 0 auto;
  max-width: 600px;
`;

export const ContentContainer = styled.div`
  margin: 0 auto;
  max-width: 1000px;
  padding: 0;
`;

export const Section = styled.section<{ $isGray?: boolean }>`
  background: ${({ $isGray, theme }) => ($isGray ? theme.colors.primary[50] : 'white')};
  padding: 3rem 2rem;

  @media (width <= 768px) {
    padding: 2rem 1rem;
  }
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  margin-top: 0;
`;

export const SectionContent = styled.div`
  color: ${({ theme }) => theme.colors.primary[800]};
  line-height: 1.6;
  max-width: 800px;

  p {
    margin-bottom: 1rem;
  }

  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  strong {
    color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

export const LastUpdated = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.9rem;
  font-style: italic;
  margin-bottom: 2rem;
  text-align: center;
`;

export const ContactInfo = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border-left: 4px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 8px;
  margin-top: 2rem;
  padding: 1.5rem;

  h3 {
    color: ${({ theme }) => theme.colors.primary[900]};
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    margin-top: 0;
  }

  p {
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const HighlightBox = styled.div`
  background: ${({ theme }) => theme.colors.secondary[50]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: 8px;
  margin: 1.5rem 0;
  padding: 1.5rem;

  h4 {
    color: ${({ theme }) => theme.colors.primary[900]};
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    margin-top: 0;
  }

  p {
    margin-bottom: 0;
  }
`;
