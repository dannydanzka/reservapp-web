'use client';

import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { LoadingSpinner } from '@libs/ui/components/LoadingSpinner';
import { UserRole } from '@prisma/client';
import { useUser } from '@/libs/presentation/hooks/useUser';

import { UserFormModal } from './UserFormModal';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary'; disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  border: none;

  ${({ disabled }) =>
    disabled &&
    `
    opacity: 0.5;
    cursor: not-allowed;
  `}

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
    background-color: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary[700]};
    }
  `
      : `
    background-color: ${theme.colors.white};
    color: ${theme.colors.secondary[700]};
    border: 1px solid ${theme.colors.secondary[300]};
    
    &:hover:not(:disabled) {
      background-color: ${theme.colors.secondary[50]};
    }
  `}
`;

const FilterSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.secondary[700]};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background-color: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const UserCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  padding: ${({ theme }) => theme.spacing[6]};
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const UserAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[400]},
    ${({ theme }) => theme.colors.primary[600]}
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
`;

const UserEmail = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[600]};
  word-break: break-all;
`;

const UserPhone = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.secondary[500]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const StatusBadge = styled.span<{ $isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: auto;
  flex-shrink: 0;

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

const UserDetails = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.secondary[600]};
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.secondary[900]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-align: right;
  font-family: monospace;
`;

const RoleBadge = styled.span<{ $role: UserRole }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ $role, theme }) => {
    switch ($role) {
      case UserRole.ADMIN:
        return `
          background-color: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      case UserRole.MANAGER:
        return `
          background-color: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case UserRole.EMPLOYEE:
        return `
          background-color: ${theme.colors.info[100]};
          color: ${theme.colors.info[700]};
        `;
      case UserRole.USER:
        return `
          background-color: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      default:
        return `
          background-color: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[700]};
        `;
    }
  }}
`;

const UserActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'warning' | 'success' | 'danger' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

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

const ErrorContainer = styled.div`
  background: ${({ theme }) => theme.colors.error[50]};
  border: 1px solid ${({ theme }) => theme.colors.error[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error[700]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const NoUsersMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  background: ${({ theme }) => theme.colors.secondary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};

  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.secondary[600]};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.secondary[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const PaginationInfo = styled.span`
  color: ${({ theme }) => theme.colors.secondary[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

/**
 * Users management component for admin interface.
 * Connected to real API with full CRUD functionality.
 */
export const UsersManagement: React.FC = () => {
  // Redux hooks
  const {
    clearFilters,
    clearUserError,
    deleteUser,
    error,
    fetchUsers,
    filterByRole,
    filterByStatus,
    filters,
    isLoading,
    nextPage,
    pagination,
    previousPage,
    searchUsers,
    totalUsers,
    users,
  } = useUser();

  // Local UI state
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [roleFilter, setRoleFilter] = useState<string>(filters.role || 'all');
  const [statusFilter, setStatusFilter] = useState<string>(
    filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive'
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== filters.search) {
        searchUsers(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Clear error on mount
  useEffect(() => {
    if (error) {
      clearUserError();
    }
  }, []);

  // Helper functions
  const getRoleInSpanish = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrador';
      case UserRole.MANAGER:
        return 'Manager';
      case UserRole.EMPLOYEE:
        return 'Empleado';
      case UserRole.USER:
        return 'Usuario';
      default:
        return role;
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Event handlers
  const handleCreateNew = () => {
    setModalMode('create');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setModalMode('edit');
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar al usuario "${user?.firstName} ${user?.lastName}"?`
      )
    ) {
      try {
        await deleteUser(userId);
        alert('Usuario eliminado exitosamente');
      } catch (err) {
        alert('Error al eliminar el usuario');
      }
    }
  };

  const handleToggleStatus = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    const newStatus = user?.isActive ? 'desactivar' : 'activar';
    if (
      confirm(
        `¿Estás seguro de que deseas ${newStatus} al usuario "${user?.firstName} ${user?.lastName}"?`
      )
    ) {
      alert(`Funcionalidad de ${newStatus} usuario próximamente`);
    }
  };

  const handleExport = () => {
    alert('Funcionalidad de exportar próximamente');
  };

  const handleRoleFilterChange = async (role: string) => {
    setRoleFilter(role);
    if (role === 'all') {
      await filterByRole(undefined);
    } else {
      await filterByRole(role as UserRole);
    }
  };

  const handleStatusFilterChange = async (status: string) => {
    setStatusFilter(status);
    if (status === 'all') {
      await filterByStatus(undefined);
    } else {
      await filterByStatus(status === 'active');
    }
  };

  const handleClearFilters = async () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    await clearFilters();
  };

  return (
    <Container>
      <Header>
        <Title>Gestión de Usuarios</Title>
        <Actions>
          <Button $variant='primary' onClick={handleCreateNew}>
            + Nuevo Usuario
          </Button>
          <Button $variant='secondary' onClick={handleExport}>
            📊 Exportar
          </Button>
        </Actions>
      </Header>

      <FilterSection>
        <FilterGrid>
          <FilterGroup>
            <Label htmlFor='role'>Rol</Label>
            <Select
              id='role'
              value={roleFilter}
              onChange={(e) => handleRoleFilterChange(e.target.value)}
            >
              <option value='all'>Todos los roles</option>
              <option value='ADMIN'>Administrador</option>
              <option value='MANAGER'>Manager</option>
              <option value='EMPLOYEE'>Empleado</option>
              <option value='USER'>Usuario</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label htmlFor='status'>Estado</Label>
            <Select
              id='status'
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <option value='all'>Todos los estados</option>
              <option value='active'>Activos</option>
              <option value='inactive'>Inactivos</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label htmlFor='search'>Buscar</Label>
            <Input
              id='search'
              placeholder='Buscar por nombre o email...'
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterGroup>

          <FilterGroup style={{ justifyContent: 'flex-end', paddingTop: '1.5rem' }}>
            <Button $variant='secondary' onClick={handleClearFilters}>
              Limpiar Filtros
            </Button>
          </FilterGroup>
        </FilterGrid>
      </FilterSection>

      {/* Loading State */}
      {isLoading && (
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            height: '200px',
            justifyContent: 'center',
          }}
        >
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && (
        <ErrorContainer>
          <ErrorMessage>{error}</ErrorMessage>
          <Button onClick={clearUserError}>Cerrar</Button>
        </ErrorContainer>
      )}

      {/* Users Grid */}
      {!isLoading && !error && (
        <>
          <UsersGrid>
            {users.length > 0 ? (
              users.map((user) => (
                <UserCard key={user.id}>
                  <UserHeader>
                    <UserAvatar>{`${user.firstName[0]}${user.lastName[0]}`}</UserAvatar>
                    <UserInfo>
                      <UserName>{`${user.firstName} ${user.lastName}`}</UserName>
                      <UserEmail>{user.email}</UserEmail>
                      <UserPhone>{user.phone || 'Sin teléfono'}</UserPhone>
                    </UserInfo>
                    <StatusBadge $isActive={user.isActive}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </StatusBadge>
                  </UserHeader>

                  <UserDetails>
                    <DetailRow>
                      <DetailLabel>Rol:</DetailLabel>
                      <RoleBadge $role={user.role}>{getRoleInSpanish(user.role)}</RoleBadge>
                    </DetailRow>

                    <DetailRow>
                      <DetailLabel>ID:</DetailLabel>
                      <DetailValue>{user.id.substring(0, 8)}...</DetailValue>
                    </DetailRow>

                    <DetailRow>
                      <DetailLabel>Registrado:</DetailLabel>
                      <DetailValue>{formatDate(user.createdAt)}</DetailValue>
                    </DetailRow>

                    <DetailRow>
                      <DetailLabel>Actualizado:</DetailLabel>
                      <DetailValue>{formatDate(user.updatedAt)}</DetailValue>
                    </DetailRow>
                  </UserDetails>

                  <UserActions>
                    <ActionButton onClick={() => handleEdit(user.id)}>Editar</ActionButton>
                    <ActionButton
                      $variant={user.isActive ? 'warning' : 'success'}
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      {user.isActive ? 'Desactivar' : 'Activar'}
                    </ActionButton>
                    <ActionButton $variant='danger' onClick={() => handleDelete(user.id)}>
                      Eliminar
                    </ActionButton>
                  </UserActions>
                </UserCard>
              ))
            ) : (
              <NoUsersMessage>
                <p>No se encontraron usuarios con los filtros aplicados.</p>
                <Button onClick={handleClearFilters}>Limpiar filtros</Button>
              </NoUsersMessage>
            )}
          </UsersGrid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <PaginationContainer>
              <Button $variant='secondary' disabled={pagination.page === 1} onClick={previousPage}>
                Anterior
              </Button>
              <PaginationInfo>
                Página {pagination.page} de {pagination.totalPages} ({totalUsers} usuarios)
              </PaginationInfo>
              <Button
                $variant='secondary'
                disabled={pagination.page === pagination.totalPages}
                onClick={nextPage}
              >
                Siguiente
              </Button>
            </PaginationContainer>
          )}
        </>
      )}

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        user={selectedUser}
        onClose={handleCloseModal}
      />
    </Container>
  );
};
