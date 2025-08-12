import styled from 'styled-components';

export const HeaderContainer = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  display: flex;
  flex-shrink: 0;
  gap: 1rem;
  height: 4rem;
  padding: 0 1rem;
  position: sticky;
  top: 0;
  z-index: 40;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: 1.5rem;
    padding: 0 1.5rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 2rem;
  }
`;

export const MobileMenuButton = styled.button`
  color: ${({ theme }) => theme.colors.secondary[700]};
  margin: -0.625rem;
  padding: 0.625rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export const Separator = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary[200]};
  height: 1.5rem;
  width: 1px;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: none;
  }
`;

export const MainContent = styled.div`
  align-self: stretch;
  display: flex;
  flex: 1;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: 1.5rem;
  }
`;

export const SearchForm = styled.form`
  display: flex;
  flex: 1;
  position: relative;
`;

export const SearchLabel = styled.label`
  border: 0;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const SearchIconWrapper = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.secondary[400]};
  display: flex;
  height: 100%;
  inset: 0 auto 0 0;
  margin-left: 0.75rem;
  pointer-events: none;
  position: absolute;
  width: 1.25rem;
`;

export const SearchInput = styled.input`
  background: transparent;
  border: 0;
  color: ${({ theme }) => theme.colors.secondary[900]};
  display: block;
  font-size: 0.875rem;
  height: 100%;
  padding: 0 0 0 2.5rem;
  width: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.secondary[400]};
  }

  &:focus {
    outline: none;
    ring: 0;
  }
`;

export const ActionsContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: 1.5rem;
  }
`;

export const NotificationButton = styled.button`
  color: ${({ theme }) => theme.colors.secondary[400]};
  margin: -0.625rem;
  padding: 0.625rem;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[500]};
  }
`;

export const LargeSeparator = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    background-color: ${({ theme }) => theme.colors.secondary[200]};
    display: block;
    height: 1.5rem;
    width: 1px;
  }
`;

export const ProfileDropdown = styled.div`
  position: relative;
`;

export const ProfileButton = styled.button`
  align-items: center;
  display: flex;
  margin: -0.375rem;
  padding: 0.375rem;
`;

export const Avatar = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  display: flex;
  height: 2rem;
  justify-content: center;
  width: 2rem;
`;

export const AvatarText = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.875rem;
  font-weight: 500;
`;

export const ProfileInfo = styled.span`
  display: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    align-items: center;
    display: flex;
  }
`;

export const ProfileName = styled.span`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.5;
  margin-left: 1rem;
`;

export const ChevronIcon = styled.div`
  color: ${({ theme }) => theme.colors.secondary[400]};
  height: 1.25rem;
  margin-left: 0.5rem;
  width: 1.25rem;
`;

export const MenuOverlay = styled.div`
  inset: 0;
  position: fixed;
  z-index: 10;
`;

export const MenuDropdown = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  margin-top: 0.625rem;
  padding: 0.5rem 0;
  position: absolute;
  right: 0;
  transform-origin: top right;
  width: 8rem;
  z-index: 20;
`;

export const MenuButton = styled.button`
  color: ${({ theme }) => theme.colors.secondary[900]};
  display: block;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 0.25rem 0.75rem;
  text-align: left;
  transition: background-color 0.15s ease;
  width: 100%;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary[50]};
  }
`;
