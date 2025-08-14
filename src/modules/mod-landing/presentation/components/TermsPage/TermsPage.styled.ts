import { styled } from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
`;

export const HeroSection = styled.section`
  background: ${({ theme }) => theme.colors.primary[50]};
  padding: 6rem 2rem;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  font-family: Montserrat, sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;

  @media (width <= 768px) {
    font-size: 2.5rem;
  }
`;

export const HeroSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: Lato, sans-serif;
  font-size: 1.5rem;
  line-height: 1.6;
  margin: 0 auto 3rem;
  max-width: 800px;

  @media (width <= 768px) {
    font-size: 1.2rem;
  }
`;

export const ContentSection = styled.section<{ $background?: 'white' | 'gray' }>`
  background: ${(props) =>
    props.$background === 'white' ? 'white' : props.theme.colors.primary[50]};
  padding: 80px 20px;
`;

export const SectionContainer = styled.div`
  margin: 0 auto;
  max-width: 1200px;
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: Montserrat, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (width <= 768px) {
    font-size: 2rem;
  }
`;

export const SectionSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: Lato, sans-serif;
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 0 auto 3rem;
  max-width: 800px;
  text-align: center;
`;

export const TermsContent = styled.div`
  margin: 0 auto;
  max-width: 900px;
`;

export const TermsSection = styled.div`
  margin-bottom: 3rem;
`;

export const TermsSectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: Montserrat, sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

export const TermsSectionSubtitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: Montserrat, sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
`;

export const TermsText = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: Lato, sans-serif;
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

export const TermsList = styled.ul`
  margin: 1.5rem 0;
  padding-left: 1.5rem;
`;

export const TermsListItem = styled.li`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: Lato, sans-serif;
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 0.75rem;
`;

export const HighlightBox = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border-left: 4px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 8px;
  margin: 2rem 0;
  padding: 2rem;
`;

export const HighlightTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: Montserrat, sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const HighlightText = styled.p`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: Lato, sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
`;

export const DateSection = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  margin-top: 3rem;
  padding: 2rem;
  text-align: center;
`;

export const DateTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: Montserrat, sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const DateText = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: Lato, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
`;

export const ContactSection = styled.section`
  background: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[900]};
  padding: 80px 20px;
  text-align: center;
`;

export const ContactTitle = styled.h2`
  font-family: Montserrat, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;

  @media (width <= 768px) {
    font-size: 2rem;
  }
`;

export const ContactDescription = styled.p`
  font-family: Lato, sans-serif;
  font-size: 1.25rem;
  margin-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
`;

export const ContactButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;
