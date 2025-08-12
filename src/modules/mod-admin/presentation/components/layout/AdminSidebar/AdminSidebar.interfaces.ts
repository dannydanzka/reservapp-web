export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  current: boolean;
}

export interface AdminSidebarProps {
  navigation: NavigationItem[];
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}
