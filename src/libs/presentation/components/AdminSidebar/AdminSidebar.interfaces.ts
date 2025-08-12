export interface NavItemData {
  href: string;
  icon: string;
  label: string;
}

export interface NavSectionData {
  title: string;
  items: NavItemData[];
}

// Props interface for AdminSidebar component
export interface AdminSidebarProps {
  navigation?: Array<{
    current: boolean;
    href: string;
    icon: any;
    name: string;
  }>;
  user?: any;
  onLogout?: () => void;
}
