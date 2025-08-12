'use client';

import React from 'react';

import styled from 'styled-components';

import { Button } from '@ui/Button';
import { VenueType } from '@prisma/client';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  padding: ${({ theme }) => theme.spacing[6]};
  transition: transform 0.15s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const VenueHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  gap: ${({ theme }) => theme.spacing[3]};
`;

const VenueInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const VenueName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
  word-break: break-word;
`;

const VenueAddress = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const CategoryBadge = styled.span<{ $category: VenueType }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;

  ${({ $category, theme }) => {
    switch ($category) {
      case VenueType.ACCOMMODATION:
        return `
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
      case VenueType.RESTAURANT:
        return `
          background-color: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case VenueType.SPA:
        return `
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
      case VenueType.TOUR_OPERATOR:
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case VenueType.EVENT_CENTER:
        return `
          background-color: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      case VenueType.ENTERTAINMENT:
        return `
          background-color: ${theme.colors.secondary[200]};
          color: ${theme.colors.secondary[700]};
        `;
      default:
        return `
          background-color: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[700]};
        `;
    }
  }}
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: ${({ theme }) => theme.spacing[2]};

  ${({ $isActive, theme }) =>
    $isActive
      ? `
    background-color: ${theme.colors.success[100]};
    color: ${theme.colors.success[700]};
  `
      : `
    background-color: ${theme.colors.error[100]};
    color: ${theme.colors.error[700]};
  `}
`;

const VenueDetails = styled.div`
  flex: 1;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: 0.875rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.secondary[600]};
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-weight: 500;
  text-align: right;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const RatingStars = styled.div`
  color: ${({ theme }) => theme.colors.warning[500]};
  font-size: 0.875rem;
`;

const RatingValue = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary[700]};
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary[600]};
  margin: ${({ theme }) => theme.spacing[3]} 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const VenueActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: auto;
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'warning' | 'success' | 'danger' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'danger':
        return `
          background-color: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
          
          &:hover {
            background-color: ${theme.colors.error[200]};
          }
        `;
      case 'warning':
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
          
          &:hover {
            background-color: ${theme.colors.warning[200]};
          }
        `;
      case 'success':
        return `
          background-color: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
          
          &:hover {
            background-color: ${theme.colors.success[200]};
          }
        `;
      default:
        return `
          background-color: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
          
          &:hover {
            background-color: ${theme.colors.primary[200]};
          }
        `;
    }
  }}
`;

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    category: VenueType;
    description?: string;
    address: string;
    city: string;
    phone?: string;
    email?: string;
    rating?: number;
    isActive: boolean;
    _count: {
      services: number;
      reservations: number;
    };
    createdAt: string;
    updatedAt: string;
  };
  onEdit?: (venueId: string) => void;
  onToggleStatus?: (venueId: string) => void;
  onDelete?: (venueId: string) => void;
  onViewDetails?: (venueId: string) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({
  onDelete,
  onEdit,
  onToggleStatus,
  onViewDetails,
  venue,
}) => {
  const getCategoryDisplayName = (category: VenueType): string => {
    switch (category) {
      case VenueType.ACCOMMODATION:
        return 'Hospedaje';
      case VenueType.RESTAURANT:
        return 'Restaurante';
      case VenueType.SPA:
        return 'Spa';
      case VenueType.TOUR_OPERATOR:
        return 'Tours';
      case VenueType.EVENT_CENTER:
        return 'Eventos';
      case VenueType.ENTERTAINMENT:
        return 'Entretenimiento';
      default:
        return category;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const renderRating = (rating?: number) => {
    if (!rating || rating === 0) {
      return <span>Sin rating</span>;
    }

    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    return (
      <RatingContainer>
        <RatingStars>{stars}</RatingStars>
        <RatingValue>{rating.toFixed(1)}</RatingValue>
      </RatingContainer>
    );
  };

  return (
    <Card>
      <VenueHeader>
        <VenueInfo>
          <VenueName>{venue.name}</VenueName>
          <VenueAddress>
            {venue.address}
            {venue.city && `, ${venue.city}`}
          </VenueAddress>
          <div>
            <CategoryBadge $category={venue.category}>
              {getCategoryDisplayName(venue.category)}
            </CategoryBadge>
            <StatusBadge $isActive={venue.isActive}>
              {venue.isActive ? 'Activo' : 'Inactivo'}
            </StatusBadge>
          </div>
        </VenueInfo>
      </VenueHeader>

      {venue.description && <Description>{venue.description}</Description>}

      <VenueDetails>
        <DetailRow>
          <DetailLabel>Rating:</DetailLabel>
          <DetailValue>{renderRating(venue.rating)}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Servicios:</DetailLabel>
          <DetailValue>{venue._count.services}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Reservaciones:</DetailLabel>
          <DetailValue>{venue._count.reservations}</DetailValue>
        </DetailRow>

        {venue.phone && (
          <DetailRow>
            <DetailLabel>Teléfono:</DetailLabel>
            <DetailValue>{venue.phone}</DetailValue>
          </DetailRow>
        )}

        {venue.email && (
          <DetailRow>
            <DetailLabel>Email:</DetailLabel>
            <DetailValue>{venue.email}</DetailValue>
          </DetailRow>
        )}

        <DetailRow>
          <DetailLabel>Registrado:</DetailLabel>
          <DetailValue>{formatDate(venue.createdAt)}</DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Actualizado:</DetailLabel>
          <DetailValue>{formatDate(venue.updatedAt)}</DetailValue>
        </DetailRow>
      </VenueDetails>

      <VenueActions>
        {onViewDetails && (
          <ActionButton onClick={() => onViewDetails(venue.id)}>Ver Detalles</ActionButton>
        )}

        {onEdit && <ActionButton onClick={() => onEdit(venue.id)}>Editar</ActionButton>}

        {onToggleStatus && (
          <ActionButton
            $variant={venue.isActive ? 'warning' : 'success'}
            onClick={() => onToggleStatus(venue.id)}
          >
            {venue.isActive ? 'Desactivar' : 'Activar'}
          </ActionButton>
        )}

        {onDelete && (
          <ActionButton $variant='danger' onClick={() => onDelete(venue.id)}>
            Eliminar
          </ActionButton>
        )}
      </VenueActions>
    </Card>
  );
};
