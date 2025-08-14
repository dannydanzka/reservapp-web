export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  faqs: FAQItem[];
}

export interface QuickGuide {
  title: string;
  description: string;
  icon: string;
  steps: string[];
}

export interface HelpPageProps {
  className?: string;
}
