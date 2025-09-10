'use client';

import React, { useEffect, useState } from 'react';

import { Calendar, CheckCircle, Clock, Mail, MessageSquare, Phone, XCircle } from 'lucide-react';
import { styled } from 'styled-components';

import { Button } from '@ui/Button';

// Styled Components
const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 1rem;
`;

const FilterBar = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary[500] : theme.colors.primary[50]};
  border: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary[500] : theme.colors.primary[200])};
  border-radius: 8px;
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.primary[700])};
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary[600] : theme.colors.primary[100]};
  }
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactCard = styled.div`
  background: white;
  border: 2px solid ${({ theme }) => theme.colors.primary[100]};
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ContactHeader = styled.div`
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.h3`
  color: ${({ theme }) => theme.colors.primary[900]};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const ContactMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const MetaItem = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary[600]};
  display: flex;
  font-size: 0.9rem;
  gap: 0.25rem;

  svg {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`;

const StatusBadge = styled.div<{ $status: string }>`
  align-items: center;
  background: ${({ $status, theme }) => {
    switch ($status) {
      case 'RESOLVED':
        return theme.colors.success[100];
      case 'IN_PROGRESS':
        return theme.colors.warning[100];
      case 'ARCHIVED':
        return theme.colors.secondary[100];
      default:
        return theme.colors.primary[100];
    }
  }};
  border-radius: 20px;
  color: ${({ $status, theme }) => {
    switch ($status) {
      case 'RESOLVED':
        return theme.colors.success[700];
      case 'IN_PROGRESS':
        return theme.colors.warning[700];
      case 'ARCHIVED':
        return theme.colors.secondary[700];
      default:
        return theme.colors.primary[700];
    }
  }};
  display: flex;
  font-size: 0.85rem;
  font-weight: 600;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
`;

const Subject = styled.h4`
  color: ${({ theme }) => theme.colors.primary[800]};
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const NotesSection = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border-left: 4px solid ${({ theme }) => theme.colors.primary[300]};
  border-radius: 8px;
  margin-top: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const NotesLabel = styled.div`
  color: ${({ theme }) => theme.colors.primary[700]};
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Notes = styled.p`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const EmptyState = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${({ theme }) => theme.colors.primary[600]};
  padding: 3rem;
  text-align: center;
`;

const LoadingState = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  padding: 2rem;
  text-align: center;
`;

const Pagination = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 2rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active, theme }) => ($active ? theme.colors.primary[500] : 'white')};
  border: 1px solid ${({ theme }) => theme.colors.primary[300]};
  border-radius: 8px;
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.primary[700])};
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary[600] : theme.colors.primary[50]};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Types
interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'ARCHIVED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ContactFormsPage = () => {
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [pagination, setPagination] = useState<PaginationInfo>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const fetchContactForms = async (page = 1, status?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '10',
        page: page.toString(),
      });

      if (status && status !== 'ALL') {
        params.append('status', status);
      }

      const response = await fetch(`/api/contact?${params}`);
      const data = await response.json();

      if (data.success) {
        setContactForms(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching contact forms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactForms(1, filter === 'ALL' ? undefined : filter);
  }, [filter]);

  const updateStatus = async (id: string, status: string, notes?: string) => {
    try {
      const response = await fetch('/api/contact', {
        body: JSON.stringify({ id, notes, status }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      });

      if (response.ok) {
        fetchContactForms(pagination.page, filter === 'ALL' ? undefined : filter);
      }
    } catch (error) {
      console.error('Error updating contact form:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return <CheckCircle size={16} />;
      case 'IN_PROGRESS':
        return <Clock size={16} />;
      case 'ARCHIVED':
        return <XCircle size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('es-MX', {
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Container>
      <Header>
        <Title>Formularios de Contacto</Title>
        <Subtitle>Gestiona las consultas y mensajes de los usuarios</Subtitle>
      </Header>

      <FilterBar>
        <FilterButton $active={filter === 'ALL'} onClick={() => setFilter('ALL')}>
          Todos
        </FilterButton>
        <FilterButton $active={filter === 'PENDING'} onClick={() => setFilter('PENDING')}>
          Pendientes
        </FilterButton>
        <FilterButton $active={filter === 'IN_PROGRESS'} onClick={() => setFilter('IN_PROGRESS')}>
          En Progreso
        </FilterButton>
        <FilterButton $active={filter === 'RESOLVED'} onClick={() => setFilter('RESOLVED')}>
          Resueltos
        </FilterButton>
        <FilterButton $active={filter === 'ARCHIVED'} onClick={() => setFilter('ARCHIVED')}>
          Archivados
        </FilterButton>
      </FilterBar>

      {loading ? (
        <LoadingState>Cargando formularios...</LoadingState>
      ) : contactForms.length === 0 ? (
        <EmptyState>
          No hay formularios de contacto {filter !== 'ALL' && `con estado ${filter}`}
        </EmptyState>
      ) : (
        <>
          <ContactList>
            {contactForms.map((form) => (
              <ContactCard key={form.id}>
                <ContactHeader>
                  <ContactInfo>
                    <ContactName>{form.name}</ContactName>
                    <ContactMeta>
                      <MetaItem>
                        <Mail size={16} />
                        {form.email}
                      </MetaItem>
                      {form.phone && (
                        <MetaItem>
                          <Phone size={16} />
                          {form.phone}
                        </MetaItem>
                      )}
                      <MetaItem>
                        <Calendar size={16} />
                        {formatDate(form.createdAt)}
                      </MetaItem>
                    </ContactMeta>
                  </ContactInfo>
                  <StatusBadge $status={form.status}>
                    {getStatusIcon(form.status)}
                    {form.status === 'PENDING' && 'Pendiente'}
                    {form.status === 'IN_PROGRESS' && 'En Progreso'}
                    {form.status === 'RESOLVED' && 'Resuelto'}
                    {form.status === 'ARCHIVED' && 'Archivado'}
                  </StatusBadge>
                </ContactHeader>

                <Subject>{form.subject}</Subject>
                <Message>{form.message}</Message>

                {form.notes && (
                  <NotesSection>
                    <NotesLabel>Notas del Admin:</NotesLabel>
                    <Notes>{form.notes}</Notes>
                  </NotesSection>
                )}

                <Actions>
                  {form.status === 'PENDING' && (
                    <>
                      <Button
                        size='small'
                        variant='outlined'
                        onClick={() => updateStatus(form.id, 'IN_PROGRESS')}
                      >
                        Marcar En Progreso
                      </Button>
                      <Button
                        size='small'
                        variant='contained'
                        onClick={() => updateStatus(form.id, 'RESOLVED')}
                      >
                        Marcar Resuelto
                      </Button>
                    </>
                  )}
                  {form.status === 'IN_PROGRESS' && (
                    <Button
                      size='small'
                      variant='contained'
                      onClick={() => updateStatus(form.id, 'RESOLVED')}
                    >
                      Marcar Resuelto
                    </Button>
                  )}
                  {form.status === 'RESOLVED' && (
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => updateStatus(form.id, 'ARCHIVED')}
                    >
                      Archivar
                    </Button>
                  )}
                  {form.status === 'ARCHIVED' && (
                    <Button
                      size='small'
                      variant='outlined'
                      onClick={() => updateStatus(form.id, 'PENDING')}
                    >
                      Reabrir
                    </Button>
                  )}
                  <Button
                    size='small'
                    variant='text'
                    onClick={() => window.open(`mailto:${form.email}?subject=Re: ${form.subject}`)}
                  >
                    Responder por Email
                  </Button>
                </Actions>
              </ContactCard>
            ))}
          </ContactList>

          {pagination.totalPages > 1 && (
            <Pagination>
              <PageButton
                disabled={pagination.page === 1}
                onClick={() =>
                  fetchContactForms(pagination.page - 1, filter === 'ALL' ? undefined : filter)
                }
              >
                Anterior
              </PageButton>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <PageButton
                  $active={page === pagination.page}
                  key={page}
                  onClick={() => fetchContactForms(page, filter === 'ALL' ? undefined : filter)}
                >
                  {page}
                </PageButton>
              ))}
              <PageButton
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  fetchContactForms(pagination.page + 1, filter === 'ALL' ? undefined : filter)
                }
              >
                Siguiente
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default ContactFormsPage;
