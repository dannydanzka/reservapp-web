import styled from 'styled-components';

export const Container = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  padding: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 1.125rem;
`;

export const ContentGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[6]};
  grid-template-columns: 1fr 1fr;
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  overflow: hidden;
`;

export const CardHeader = styled.div`
  background: ${({ theme }) => theme.colors.secondary[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const CardTitle = styled.h2`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary[900]};
  display: flex;
  font-size: 1.25rem;
  font-weight: 600;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const FormRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const Label = styled.label`
  color: ${({ theme }) => theme.colors.secondary[700]};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  padding: ${({ theme }) => theme.spacing[3]};
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary[400]};
  }
`;

export const Select = styled.select`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: 1rem;
  padding: ${({ theme }) => theme.spacing[3]};
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    outline: none;
  }
`;

export const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: inherit;
  font-size: 1rem;
  padding: ${({ theme }) => theme.spacing[3]};
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary[400]};
  }
`;

export const CheckboxGroup = styled.div`
  background: ${({ theme }) => theme.colors.secondary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: grid;
  gap: ${({ theme }) => theme.spacing[3]};
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const CheckboxLabel = styled.label`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary[700]};
  cursor: pointer;
  display: flex;
  font-size: 0.875rem;
  gap: ${({ theme }) => theme.spacing[2]};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

export const CheckboxInput = styled.input`
  accent-color: ${({ theme }) => theme.colors.primary[600]};
  cursor: pointer;
  height: 18px;
  width: 18px;
`;

export const SaveButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.colors.primary[600]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 1rem;
  font-weight: 600;
  gap: ${({ theme }) => theme.spacing[2]};
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[700]};
    box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error[700]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.colors.success[50]};
  border: 1px solid ${({ theme }) => theme.colors.success[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.success[700]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

// Bank Account Components
export const BankAccountCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.08);
  }
`;

export const BankAccountHeader = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary[900]};
  display: flex;
  font-size: 1.125rem;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const BankAccountInfo = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  display: flex;
  flex-direction: column;
  font-size: 0.875rem;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const BankAccountActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const AddBankButton = styled.button`
  align-items: center;
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 2px dashed ${({ theme }) => theme.colors.primary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.primary[700]};
  cursor: pointer;
  display: flex;
  font-weight: 600;
  gap: ${({ theme }) => theme.spacing[2]};
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[100]};
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }
`;

export const StatusBadge = styled.span<{ $status: string }>`
  background: ${({ theme }) => theme.colors.success[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.success[700]};
  font-size: 0.75rem;
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  text-transform: uppercase;
`;

export const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const SectionDescription = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};

  svg {
    color: ${({ theme }) => theme.colors.primary[600]};
    flex-shrink: 0;
  }
`;

export const InfoTitle = styled.div`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const InfoText = styled.div`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 0.875rem;
  line-height: 1.5;
`;

// Progress Components
export const ProgressBar = styled.div`
  background: ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  height: 8px;
  margin-top: ${({ theme }) => theme.spacing[3]};
  overflow: hidden;
  width: 100%;
`;

export const ProgressFill = styled.div<{ $percentage: number }>`
  background: ${({ $percentage, theme }) =>
    $percentage === 100
      ? theme.colors.success[500]
      : $percentage >= 75
        ? theme.colors.warning[500]
        : theme.colors.primary[500]};
  height: 100%;
  transition: width 0.3s ease;
  width: ${({ $percentage }) => $percentage}%;
`;

export const ProgressText = styled.div`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing[2]};
  text-align: center;
`;

export const CompletionCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const CompletionIcon = styled.div<{ $isComplete: boolean }>`
  align-items: center;
  background: ${({ $isComplete, theme }) =>
    $isComplete ? theme.colors.success[100] : theme.colors.warning[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ $isComplete, theme }) =>
    $isComplete ? theme.colors.success[700] : theme.colors.warning[700]};
  display: flex;
  flex-shrink: 0;
  height: 64px;
  justify-content: center;
  width: 64px;
`;

export const CompletionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const CompletionText = styled.p`
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const CompletionList = styled.ul`
  list-style: none;
  margin: ${({ theme }) => theme.spacing[3]} 0;
  padding: 0;
`;

export const CompletionItem = styled.li<{ $completed: boolean }>`
  align-items: center;
  color: ${({ $completed, theme }) =>
    $completed ? theme.colors.success[700] : theme.colors.secondary[600]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} 0;

  &::before {
    color: ${({ $completed, theme }) =>
      $completed ? theme.colors.success[600] : theme.colors.secondary[400]};
    content: ${({ $completed }) => ($completed ? '"✓"' : '"○"')};
    font-weight: bold;
  }
`;
