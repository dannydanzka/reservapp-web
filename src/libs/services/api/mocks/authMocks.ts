/**
 * Authentication API mocks for development and testing
 */

import { LoginSession, User, UserRole } from '@/modules/mod-auth/domain/interfaces/auth.interfaces';

export const mockUsers: User[] = [
  {
    createdAt: new Date().toISOString(),
    email: 'admin@reservapp.com',
    id: '1',
    isActive: true,
    name: 'Administrador ReservApp',
    role: UserRole.ADMIN,
    updatedAt: new Date().toISOString(),
  },
  {
    createdAt: new Date().toISOString(),
    email: 'manager@reservapp.com',
    id: '2',
    isActive: true,
    name: 'Venue Manager',
    role: UserRole.MANAGER,
    updatedAt: new Date().toISOString(),
  },
  {
    createdAt: new Date().toISOString(),
    email: 'employee@reservapp.com',
    id: '3',
    isActive: true,
    name: 'Empleado Recepción',
    role: UserRole.EMPLOYEE,
    updatedAt: new Date().toISOString(),
  },
  {
    createdAt: new Date().toISOString(),
    email: 'user@reservapp.com',
    id: '4',
    isActive: true,
    name: 'Usuario Regular',
    role: UserRole.USER,
    updatedAt: new Date().toISOString(),
  },
];

export const loginSuccessMock = {
  response: (email: string): { success: boolean; message: string; data: LoginSession } => {
    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return {
      data: {
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        refreshToken: `mock_refresh_${Date.now()}_${user.id}`,
        token: `mock_token_${Date.now()}_${user.id}`, // 24 hours
        user: user,
      },
      message: 'Inicio de sesión exitoso',
      success: true,
    };
  },
};

export const loginErrorMock = {
  response: {
    error: 'INVALID_CREDENTIALS',
    message: 'Credenciales inválidas',
    success: false,
  },
};

export const registerSuccessMock = {
  response: (userData: {
    email: string;
    name: string;
  }): { success: boolean; message: string; data: LoginSession } => {
    const newUser: User = {
      createdAt: new Date().toISOString(),
      email: userData.email,
      id: `${Date.now()}`,
      isActive: true,
      name: userData.name,
      role: UserRole.USER,
      updatedAt: new Date().toISOString(),
    };

    return {
      data: {
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        refreshToken: `mock_refresh_${Date.now()}_${newUser.id}`,
        token: `mock_token_${Date.now()}_${newUser.id}`,
        user: newUser,
      },
      message: 'Registro exitoso',
      success: true,
    };
  },
};
