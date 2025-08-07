'use client';

import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button } from '@libs/ui/components/Button';
import { TextField } from '@libs/ui/components/TextField';
import { useAuth } from '@/libs/ui/providers/AuthProvider';
import { UserRole } from '@prisma/client';
import { useUser } from '@/libs/presentation/hooks/useUser';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  color: ${({ theme }) => theme.colors.secondary[500]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary[700]};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const FormField = styled.div`
  flex: 1;
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.secondary[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background-color: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const CheckboxField = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[200]};
`;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  mode: 'create' | 'edit';
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, mode, onClose, user }) => {
  const { createUser, isLoading, updateUser, validateCreateUserData } = useUser();
  const { user: currentUser } = useAuth();

  // Check if current user is a business user (ADMIN with business data)
  const isBusinessUser = currentUser?.role === 'admin' && currentUser?.businessName;

  const [formData, setFormData] = useState({
    confirmPassword: '',
    email: '',
    firstName: '',
    isActive: true,
    lastName: '',
    password: '',
    phone: '',
    role: (isBusinessUser ? UserRole.EMPLOYEE : UserRole.USER) as UserRole,
  });

  const [errors, setErrors] = useState<string[]>([]);

  // Initialize form data when modal opens or user changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && user) {
        setFormData({
          confirmPassword: '',
          email: user.email,
          firstName: user.firstName,
          isActive: user.isActive,
          lastName: user.lastName,
          password: '',
          phone: user.phone || '',
          role: user.role,
        });
      } else {
        setFormData({
          confirmPassword: '',
          email: '',
          firstName: '',
          isActive: true,
          lastName: '',
          password: '',
          phone: '',
          role: UserRole.USER,
        });
      }
      setErrors([]);
    }
  }, [isOpen, user, mode]);

  const handleInputChange = (field: string, value: string | boolean | UserRole) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === 'create') {
        // Validate form data for creation
        const validationErrors = validateCreateUserData(formData);
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          return;
        }

        await createUser(formData);
      } else if (mode === 'edit' && user) {
        const updateData: any = {
          email: formData.email,
          firstName: formData.firstName,
          id: user.id,
          isActive: formData.isActive,
          lastName: formData.lastName,
          phone: formData.phone,
          role: formData.role,
        };

        await updateUser(updateData);
      }

      onClose();
    } catch (error: any) {
      setErrors([error.message || 'Error al procesar la solicitud']);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{mode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          {errors.length > 0 && (
            <ErrorMessage>
              {errors.map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </ErrorMessage>
          )}

          <FormRow>
            <FormField>
              <Label htmlFor='firstName'>Nombre *</Label>
              <TextField
                id='firstName'
                placeholder='Ingresa el nombre'
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
              />
            </FormField>
            <FormField>
              <Label htmlFor='lastName'>Apellido *</Label>
              <TextField
                id='lastName'
                placeholder='Ingresa el apellido'
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
              />
            </FormField>
          </FormRow>

          <FormField>
            <Label htmlFor='email'>Email *</Label>
            <TextField
              id='email'
              placeholder='Ingresa el email'
              required
              type='email'
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </FormField>

          <FormField>
            <Label htmlFor='phone'>Teléfono</Label>
            <TextField
              id='phone'
              placeholder='Ingresa el teléfono (opcional)'
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </FormField>

          <FormField>
            <Label htmlFor='role'>
              Rol *
              {isBusinessUser && (
                <span style={{ color: '#6B7280', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                  (Solo empleados y managers de tu negocio)
                </span>
              )}
            </Label>
            <Select
              id='role'
              required
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
            >
              {isBusinessUser ? (
                // Business users can only create MANAGER and EMPLOYEE roles
                <>
                  <option value={UserRole.EMPLOYEE}>Empleado - Acceso básico al sistema</option>
                  <option value={UserRole.MANAGER}>
                    Manager - Gestión completa de reservaciones
                  </option>
                </>
              ) : (
                // System admins can create all roles except ADMIN
                <>
                  <option value={UserRole.USER}>Usuario</option>
                  <option value={UserRole.EMPLOYEE}>Empleado</option>
                  <option value={UserRole.MANAGER}>Manager</option>
                  {currentUser?.role === 'admin' && !isBusinessUser && (
                    <option value={UserRole.ADMIN}>Administrador del Sistema</option>
                  )}
                </>
              )}
            </Select>
            {isBusinessUser && (
              <div style={{ color: '#6B7280', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                Los usuarios creados tendrán acceso limitado a la gestión de tu negocio:{' '}
                {currentUser?.businessName}
              </div>
            )}
          </FormField>

          {mode === 'create' && (
            <>
              <FormField>
                <Label htmlFor='password'>Contraseña *</Label>
                <TextField
                  id='password'
                  placeholder='Ingresa la contraseña'
                  required
                  type='password'
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                />
              </FormField>

              <FormField>
                <Label htmlFor='confirmPassword'>Confirmar Contraseña *</Label>
                <TextField
                  id='confirmPassword'
                  placeholder='Confirma la contraseña'
                  required
                  type='password'
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                />
              </FormField>
            </>
          )}

          <CheckboxField>
            <Checkbox
              checked={formData.isActive}
              id='isActive'
              type='checkbox'
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
            />
            <Label htmlFor='isActive'>Usuario activo</Label>
          </CheckboxField>

          <ModalActions>
            <Button color='secondary' disabled={isLoading} variant='outlined' onClick={onClose}>
              Cancelar
            </Button>
            <Button color='primary' disabled={isLoading} type='submit' variant='contained'>
              {isLoading
                ? 'Procesando...'
                : mode === 'create'
                  ? 'Crear Usuario'
                  : 'Actualizar Usuario'}
            </Button>
          </ModalActions>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};
