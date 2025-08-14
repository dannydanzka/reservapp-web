export interface VenueTableData {
  id: string;
  name: string;
  category: string;
  reservationsCount: number;
  rating: number;
}

export interface VenuesTableProps {
  data: VenueTableData[];
  loading?: boolean;
  maxRows?: number;
}
