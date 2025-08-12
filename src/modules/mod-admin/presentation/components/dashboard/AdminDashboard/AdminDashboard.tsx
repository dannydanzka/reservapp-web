'use client';

import React from 'react';

import { useTranslation } from '@i18n/index';

import { AdminDashboardProps } from './AdminDashboard.interfaces';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ContentGrid,
  DashboardContainer,
  EmptyStateText,
  Header,
  StatCard,
  StatLabel,
  StatsGrid,
  StatValue,
  Subtitle,
  Title,
} from './AdminDashboard.styled';

/**
 * Admin dashboard component with overview stats and recent activity.
 * Simplified version to avoid complex service dependencies.
 */
export const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const { t } = useTranslation();

  return (
    <DashboardContainer>
      <Header>
        <Title>Panel de Administración</Title>
        <Subtitle>Bienvenido al sistema de gestión de reservas</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Total de Reservas</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Venues Activos</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>$0</StatValue>
          <StatLabel>Ingresos del Mes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>0</StatValue>
          <StatLabel>Usuarios Registrados</StatLabel>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Card>
          <CardHeader>
            <CardTitle>Reservas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyStateText>No hay reservas recientes para mostrar</EmptyStateText>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Venues Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyStateText>No hay datos de venues disponibles</EmptyStateText>
          </CardContent>
        </Card>
      </ContentGrid>
    </DashboardContainer>
  );
};
