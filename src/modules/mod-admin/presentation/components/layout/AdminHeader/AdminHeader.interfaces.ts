export interface AdminHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}
