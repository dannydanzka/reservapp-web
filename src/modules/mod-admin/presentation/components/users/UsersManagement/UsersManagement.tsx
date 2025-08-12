'use client';

import React, { useEffect, useState } from 'react';

import { LoadingSpinner } from '@ui/LoadingSpinner';
import { User, UserFilters } from '@services/core/api/usersApiService';
import { useUsers } from '@presentation/hooks/useUsers';

import { UserFormModal } from '../UserFormModal';
import type { UsersManagementProps } from './UsersManagement.interfaces';

import * as S from './UsersManagement.styled';

/**
 * Users management component for admin interface.
 * Connected to real API with full CRUD functionality.
 */
export const UsersManagement: React.FC<UsersManagementProps> = () => {
  // Use HTTP API hook instead of Redux
  const {
    clearError,
    clearFilters,
    createUser,
    currentPage,
    currentPageInfo,
    deleteUser,
    error,
    filters,
    goToNextPage,
    goToPreviousPage,
    hasActiveFilters,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    loadUsers,
    setFilters,
    toggleUserStatus,
    totalPages,
    totalUsers,
    updateUser,
    users,
  } = useUsers();

  // Local UI state for filters
  const [localFilters, setLocalFilters] = useState<UserFilters>({
    isActive: filters.isActive,
    role: filters.role || '',
    search: filters.search || '',
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Apply filters with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(localFilters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localFilters, setFilters]);

  // Clear error on mount
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  // Helper functions
  const getRoleInSpanish = (role: string): string => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'MANAGER':
        return 'Manager';
      case 'EMPLOYEE':
        return 'Empleado';
      case 'USER':
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

  const handleFormSubmit = async (formData: any, mode: 'create' | 'edit') => {
    try {
      if (mode === 'create') {
        const success = await createUser({
          email: formData.email,
          firstName: formData.firstName,
          isActive: formData.isActive,
          lastName: formData.lastName,
          password: formData.password,
          phone: formData.phone,
          role: formData.role,
        });

        if (success) {
          alert('Usuario creado exitosamente');
        }
      } else if (mode === 'edit' && selectedUser) {
        const success = await updateUser({
          email: formData.email,
          firstName: formData.firstName,
          id: selectedUser.id,
          isActive: formData.isActive,
          lastName: formData.lastName,
          phone: formData.phone,
          role: formData.role,
          ...(formData.password ? { password: formData.password } : {}),
        });

        if (success) {
          alert('Usuario actualizado exitosamente');
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      throw error; // Re-throw to let the modal handle the error
    }
  };

  const handleDelete = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar al usuario "${user?.firstName} ${user?.lastName}"?`
      )
    ) {
      const success = await deleteUser(userId);
      if (success) {
        alert('Usuario eliminado exitosamente');
      }
    }
  };

  const handleToggleStatus = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    const newStatus = user?.isActive ? 'desactivar' : 'activar';
    if (
      confirm(
        `¿Estás seguro de que deseas ${newStatus} al usuario "${user?.firstName} ${user?.lastName}"?`
      )
    ) {
      const success = await toggleUserStatus(userId);
      if (success) {
        alert(`Usuario ${newStatus}do exitosamente`);
      }
    }
  };

  const handleExport = () => {
    alert('Funcionalidad de exportar próximamente');
  };

  const handleRoleFilterChange = (role: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      role: role === 'all' ? '' : role,
    }));
  };

  const handleStatusFilterChange = (status: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      isActive: status === 'all' ? undefined : status === 'active',
    }));
  };

  const handleClearFilters = () => {
    setLocalFilters({ isActive: undefined, role: '', search: '' });
    clearFilters();
  };

  return (
    <S.Container>
      <S.Header>
        <S.Title>Gestión de Usuarios</S.Title>
        <S.Actions>
          <S.Button $variant='primary' onClick={handleCreateNew}>
            + Nuevo Usuario
          </S.Button>
          <S.Button $variant='secondary' onClick={handleExport}>
            📊 Exportar
          </S.Button>
        </S.Actions>
      </S.Header>

      <S.FilterSection>
        <S.FilterGrid>
          <S.FilterGroup>
            <S.Label htmlFor='role'>Rol</S.Label>
            <S.Select
              id='role'
              value={localFilters.role || 'all'}
              onChange={(e) => handleRoleFilterChange(e.target.value)}
            >
              <option value='all'>Todos los roles</option>
              <option value='ADMIN'>Administrador</option>
              <option value='MANAGER'>Manager</option>
              <option value='EMPLOYEE'>Empleado</option>
              <option value='USER'>Usuario</option>
            </S.Select>
          </S.FilterGroup>

          <S.FilterGroup>
            <S.Label htmlFor='status'>Estado</S.Label>
            <S.Select
              id='status'
              value={
                localFilters.isActive === undefined
                  ? 'all'
                  : localFilters.isActive
                    ? 'active'
                    : 'inactive'
              }
              onChange={(e) => handleStatusFilterChange(e.target.value)}
            >
              <option value='all'>Todos los estados</option>
              <option value='active'>Activos</option>
              <option value='inactive'>Inactivos</option>
            </S.Select>
          </S.FilterGroup>

          <S.FilterGroup>
            <S.Label htmlFor='search'>Buscar</S.Label>
            <S.Input
              id='search'
              placeholder='Buscar por nombre o email...'
              type='text'
              value={localFilters.search || ''}
              onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))}
            />
          </S.FilterGroup>

          <S.FilterGroup style={{ justifyContent: 'flex-end', paddingTop: '1.5rem' }}>
            <S.Button $variant='secondary' onClick={handleClearFilters}>
              Limpiar Filtros
            </S.Button>
          </S.FilterGroup>
        </S.FilterGrid>
      </S.FilterSection>

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
        <S.ErrorContainer>
          <S.ErrorMessage>{error}</S.ErrorMessage>
          <S.Button onClick={clearError}>Cerrar</S.Button>
        </S.ErrorContainer>
      )}

      {/* Users Grid */}
      {!isLoading && !error && (
        <>
          <S.UsersGrid>
            {users.length > 0 ? (
              users.map((user) => (
                <S.UserCard key={user.id}>
                  <S.UserHeader>
                    <S.UserAvatar>{`${user.firstName[0]}${user.lastName[0]}`}</S.UserAvatar>
                    <S.UserInfo>
                      <S.UserName>{`${user.firstName} ${user.lastName}`}</S.UserName>
                      <S.UserEmail>{user.email}</S.UserEmail>
                      <S.UserPhone>{user.phone || 'Sin teléfono'}</S.UserPhone>
                    </S.UserInfo>
                    <S.StatusBadge $isActive={user.isActive}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </S.StatusBadge>
                  </S.UserHeader>

                  <S.UserDetails>
                    <S.DetailRow>
                      <S.DetailLabel>Rol:</S.DetailLabel>
                      <S.RoleBadge $role={user.role}>{getRoleInSpanish(user.role)}</S.RoleBadge>
                    </S.DetailRow>

                    <S.DetailRow>
                      <S.DetailLabel>ID:</S.DetailLabel>
                      <S.DetailValue>{user.id.substring(0, 8)}...</S.DetailValue>
                    </S.DetailRow>

                    <S.DetailRow>
                      <S.DetailLabel>Registrado:</S.DetailLabel>
                      <S.DetailValue>{formatDate(user.createdAt)}</S.DetailValue>
                    </S.DetailRow>

                    <S.DetailRow>
                      <S.DetailLabel>Actualizado:</S.DetailLabel>
                      <S.DetailValue>{formatDate(user.updatedAt)}</S.DetailValue>
                    </S.DetailRow>
                  </S.UserDetails>

                  <S.UserActions>
                    <S.ActionButton onClick={() => handleEdit(user.id)}>Editar</S.ActionButton>
                    <S.ActionButton
                      $variant={user.isActive ? 'warning' : 'success'}
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      {user.isActive ? 'Desactivar' : 'Activar'}
                    </S.ActionButton>
                    <S.ActionButton $variant='danger' onClick={() => handleDelete(user.id)}>
                      Eliminar
                    </S.ActionButton>
                  </S.UserActions>
                </S.UserCard>
              ))
            ) : (
              <S.NoUsersMessage>
                <p>No se encontraron usuarios con los filtros aplicados.</p>
                <S.Button onClick={handleClearFilters}>Limpiar filtros</S.Button>
              </S.NoUsersMessage>
            )}
          </S.UsersGrid>

          {/* Pagination */}
          {totalPages > 1 && (
            <S.PaginationContainer>
              <S.Button $variant='secondary' disabled={!hasPreviousPage} onClick={goToPreviousPage}>
                Anterior
              </S.Button>
              <S.PaginationInfo>
                Página {currentPage} de {totalPages} ({totalUsers} usuarios)
              </S.PaginationInfo>
              <S.Button $variant='secondary' disabled={!hasNextPage} onClick={goToNextPage}>
                Siguiente
              </S.Button>
            </S.PaginationContainer>
          )}
        </>
      )}

      {/* User Form Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        user={selectedUser}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
      />
    </S.Container>
  );
};
