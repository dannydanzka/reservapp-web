export interface AboutPageProps {
  className?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image?: string;
  description?: string;
}

export interface CompanyValue {
  icon: string;
  title: string;
  description: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}
