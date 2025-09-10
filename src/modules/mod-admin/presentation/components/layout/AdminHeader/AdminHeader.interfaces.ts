export interface AdminHeaderProps {
  user: {
    firstName?: string;
    lastName?: string;
    name?: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}
