import styled from 'styled-components';

export const PageContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  min-height: 100vh;
`;

export const HeroSection = styled.section`
  background: ${({ theme }) => theme.colors.primary[50]};
  margin: 0 auto;
  max-width: 1200px;
  padding: 120px 20px 80px;
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

export const MissionSection = styled.section`
  background: white;
  padding: 80px 20px;
`;

export const SectionContainer = styled.div`
  margin: 0 auto;
  max-width: 1200px;
`;

export const SectionTitle = styled.h2`
  color: #1f2937;
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
  color: #6b7280;
  font-family: Lato, sans-serif;
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 0 auto 3rem;
  max-width: 800px;
  text-align: center;
`;

export const MissionGrid = styled.div`
  display: grid;
  gap: 3rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  margin-top: 3rem;
`;

export const MissionCard = styled.div`
  text-align: center;
`;

export const MissionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
`;

export const MissionTitle = styled.h3`
  color: #1f2937;
  font-family: Montserrat, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const MissionDescription = styled.p`
  color: #6b7280;
  font-family: Lato, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
`;

export const ValuesSection = styled.section`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  padding: 80px 20px;
`;

export const ValuesGrid = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-top: 3rem;
`;

export const ValueCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
  padding: 2rem;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 10px 20px rgb(0 0 0 / 0.1);
    transform: translateY(-5px);
  }
`;

export const ValueIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

export const ValueTitle = styled.h3`
  color: #1f2937;
  font-family: Montserrat, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

export const ValueDescription = styled.p`
  color: #6b7280;
  font-family: Lato, sans-serif;
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const TeamSection = styled.section`
  background: white;
  padding: 80px 20px;
`;

export const TeamGrid = styled.div`
  display: grid;
  gap: 3rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin-top: 3rem;
`;

export const TeamMemberCard = styled.div`
  text-align: center;
`;

export const TeamMemberImage = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.primary[100]};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.primary[700]};
  display: flex;
  font-size: 3rem;
  height: 150px;
  justify-content: center;
  margin: 0 auto 1.5rem;
  width: 150px;
`;

export const TeamMemberName = styled.h3`
  color: #1f2937;
  font-family: Montserrat, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const TeamMemberRole = styled.p`
  color: #764ba2;
  font-family: Lato, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

export const TeamMemberDescription = styled.p`
  color: #6b7280;
  font-family: Lato, sans-serif;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 auto;
  max-width: 300px;
`;

export const TimelineSection = styled.section`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  padding: 80px 20px;
`;

export const Timeline = styled.div`
  margin: 3rem auto 0;
  max-width: 800px;
  position: relative;

  @media (width <= 768px) {
    &::before {
      left: 20px;
    }
  }

  &::before {
    background: #e5e7eb;
    content: '';
    height: 100%;
    left: 50%;
    position: absolute;
    transform: translateX(-50%);
    width: 2px;
  }
`;

export const TimelineItem = styled.div<{ $position?: 'left' | 'right' }>`
  position: relative;
  width: 50%;
  padding: 20px 40px;
  ${(props) => (props.$position === 'left' ? 'left: 0' : 'left: 50%')};

  @media (width <= 768px) {
    left: 0;
    padding-left: 60px;
    width: 100%;
  }
`;

export const TimelineContent = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 0.1);
  padding: 1.5rem;
  position: relative;
`;

export const TimelineTitle = styled.h3`
  color: #1f2937;
  font-family: Montserrat, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

export const TimelineDescription = styled.p`
  color: #6b7280;
  font-family: Lato, sans-serif;
  font-size: 0.95rem;
  line-height: 1.5;
`;

export const CTASection = styled.section`
  background: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[900]};
  padding: 80px 20px;
  text-align: center;
`;

export const CTATitle = styled.h2`
  font-family: Montserrat, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;

  @media (width <= 768px) {
    font-size: 2rem;
  }
`;

export const CTADescription = styled.p`
  font-family: Lato, sans-serif;
  font-size: 1.25rem;
  margin-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
`;

export const CTAButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
`;
