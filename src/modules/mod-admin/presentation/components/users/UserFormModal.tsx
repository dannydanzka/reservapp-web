'use client';

import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { LoadingSpinner } from '@ui/LoadingSpinner';
import { User } from '@services/core/api/usersApiService';

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
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary[900]};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
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
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
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
  font-size: 0.875rem;
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.secondary[200]};
  align-items: center;
`;

const TextField = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.secondary[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.2s;

  ${({ $variant = 'primary', theme }) => {
    if ($variant === 'primary') {
      return `
        background-color: ${theme.colors.primary[600]};
        border-color: ${theme.colors.primary[600]};
        color: white;
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[700]};
          border-color: ${theme.colors.primary[700]};
        }
      `;
    } else {
      return `
        background-color: white;
        border-color: ${theme.colors.secondary[300]};
        color: ${theme.colors.secondary[700]};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondary[50]};
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// User interface imported from API service

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  mode: 'create' | 'edit';
  onSubmit?: (userData: any, mode: 'create' | 'edit') => Promise<void>;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSubmit,
  user,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    confirmPassword: '',
    email: '',
    firstName: '',
    isActive: true,
    lastName: '',
    password: '',
    phone: '',
    role: 'USER',
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
          role: 'USER',
        });
      }
      setErrors([]);
    }
  }, [isOpen, user, mode]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const validateFormData = () => {
    const validationErrors: string[] = [];

    if (!formData.firstName.trim()) {
      validationErrors.push('El nombre es requerido');
    }
    if (!formData.lastName.trim()) {
      validationErrors.push('El apellido es requerido');
    }
    if (!formData.email.trim()) {
      validationErrors.push('El email es requerido');
    }
    if (!formData.role) {
      validationErrors.push('El rol es requerido');
    }

    if (mode === 'create') {
      if (!formData.password.trim()) {
        validationErrors.push('La contraseña es requerida');
      }
      if (formData.password !== formData.confirmPassword) {
        validationErrors.push('Las contraseñas no coinciden');
      }
      if (formData.password.length < 6) {
        validationErrors.push('La contraseña debe tener al menos 6 caracteres');
      }
    }

    return validationErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors([]);

      if (onSubmit) {
        await onSubmit(formData, mode);
      }

      onClose();
    } catch (error: any) {
      setErrors([error.message || 'Error al procesar la solicitud']);
    } finally {
      setIsLoading(false);
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
            <Label htmlFor='role'>Rol *</Label>
            <Select
              id='role'
              required
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
            >
              <option value='USER'>Usuario</option>
              <option value='EMPLOYEE'>Empleado</option>
              <option value='MANAGER'>Manager</option>
              <option value='ADMIN'>Administrador</option>
            </Select>
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
            {isLoading && <LoadingSpinner />}
            <Button $variant='secondary' disabled={isLoading} type='button' onClick={onClose}>
              Cancelar
            </Button>
            <Button $variant='primary' disabled={isLoading} type='submit'>
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
