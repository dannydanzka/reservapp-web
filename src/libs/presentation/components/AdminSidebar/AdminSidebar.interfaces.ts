import { UserRoleEnum } from '@prisma/client';

export interface NavItemData {
  href: string;
  icon: string;
  label: string;
  roles?: UserRoleEnum[]; // Roles that can see this item
}

export interface NavSectionData {
  title: string;
  items: NavItemData[];
  roles?: UserRoleEnum[]; // Roles that can see this section
}

// Props interface for AdminSidebar component
export interface AdminSidebarProps {
  navigation?: Array<{
    current: boolean;
    href: string;
    icon: any;
    name: string;
  }>;
  user?: {
    id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: UserRoleEnum | string;
  };
  onLogout?: () => void;
}
