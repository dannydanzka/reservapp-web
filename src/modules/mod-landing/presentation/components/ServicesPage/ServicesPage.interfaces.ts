import { PublicVenue } from '@services/core/api';

export interface ServicesPageProps {}

export interface Category {
  icon: React.ReactNode;
  key: string;
  label: string;
}

export interface FormData {
  email: string;
  message: string;
  name: string;
  phone: string;
  subject: string;
}

export interface ServiceDetailProps {
  label: string;
  value?: React.ReactNode;
}

export interface ServiceImageProps {
  $category: string;
}

export interface FilterButtonProps {
  $active?: boolean;
}

export interface PricingCardProps {
  $featured?: boolean;
}

export interface ServicesPageState {
  venues: PublicVenue[];
  filteredVenues: PublicVenue[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
}
