import { styled } from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
`;

export const HeroSection = styled.section`
  background: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[900]};
  padding: 6rem 2rem 4rem;
  position: relative;
  text-align: center;
`;

export const HeroContent = styled.div`
  margin: 0 auto;
  max-width: 800px;
  position: relative;
  z-index: 1;
`;

export const HeroTitle = styled.h1`
  font-family: Montserrat, sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgb(0 0 0 / 0.1);

  @media (width <= 768px) {
    font-size: 2.5rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-family: Lato, sans-serif;
  font-size: 1.25rem;
  font-weight: 300;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.95;

  @media (width <= 768px) {
    font-size: 1.1rem;
  }
`;

export const Section = styled.section<{ $background?: string }>`
  background: ${({ $background }) => $background || 'white'};
  padding: 5rem 2rem;

  &:nth-child(even) {
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

export const Container = styled.div`
  margin: 0 auto;
  max-width: 1200px;
`;

export const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-family: Montserrat, sans-serif;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;

  @media (width <= 768px) {
    font-size: 2rem;
  }
`;

export const SectionSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: Lato, sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 auto 3rem;
  max-width: 600px;
  text-align: center;
`;

export const FAQGrid = styled.div`
  display: grid;
  gap: 3rem;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
`;

export const FAQCategory = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 0.08);
  padding: 2rem;
`;

export const CategoryTitle = styled.h3`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary[800]};
  display: flex;
  font-family: Montserrat, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const CategoryIcon = styled.span`
  background: ${({ theme }) => theme.colors.primary[100]};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1.5rem;
  padding: 0.75rem;
`;

export const FAQItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[100]};
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const Question = styled.h4`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-family: Montserrat, sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

export const Answer = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: Lato, sans-serif;
  line-height: 1.6;
`;

export const QuickGuidesGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export const GuideCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgb(0 0 0 / 0.12);
    transform: translateY(-4px);
  }
`;

export const GuideHeader = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  padding: 2rem;
  text-align: center;
`;

export const GuideIcon = styled.div`
  background: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  color: white;
  font-size: 2rem;
  height: 4rem;
  line-height: 4rem;
  margin: 0 auto 1rem;
  width: 4rem;
`;

export const GuideTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-family: Montserrat, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

export const GuideDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: Lato, sans-serif;
  line-height: 1.5;
`;

export const GuideContent = styled.div`
  padding: 2rem;
`;

export const StepsList = styled.ol`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-family: Lato, sans-serif;
  line-height: 1.6;
  padding-left: 1.5rem;
`;

export const StepItem = styled.li`
  margin-bottom: 0.75rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ContactSection = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
`;

export const ContactTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-family: Montserrat, sans-serif;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const ContactDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: Lato, sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 auto 2rem;
  max-width: 600px;
`;

export const ContactMethods = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-top: 2rem;
`;

export const ContactMethod = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
`;

export const ContactIcon = styled.div`
  background: ${({ theme }) => theme.colors.primary[100]};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1.5rem;
  height: 3rem;
  line-height: 3rem;
  margin: 0 auto 1rem;
  width: 3rem;
`;

export const ContactMethodTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-family: Montserrat, sans-serif;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const ContactMethodDescription = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: Lato, sans-serif;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const HighlightBox = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 2px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: 16px;
  color: ${({ theme }) => theme.colors.primary[900]};
  margin: 3rem 0;
  padding: 3rem;
  text-align: center;
`;

export const HighlightTitle = styled.h3`
  font-family: Montserrat, sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const HighlightText = styled.p`
  font-family: Lato, sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.95;
`;

export const HighlightButton = styled.button`
  background: white;
  border: none;
  border-radius: 25px;
  color: ${({ theme }) => theme.colors.primary[600]};
  cursor: pointer;
  font-family: Montserrat, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  padding: 1rem 2rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 15px rgb(255 255 255 / 0.3);
    transform: translateY(-2px);
  }
`;
