import { authService } from '@/libs/services/api/authService';

import { AuthRepository } from '../AuthRepository';
import { UserRole } from '../../../domain/interfaces/auth.interfaces';

// Mock environment for testing
process.env.NEXT_PUBLIC_ENABLE_MOCKS = 'true';

// Mock authService
jest.mock('@/libs/services/api/authService');

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  const mockedAuthService = authService as jest.Mocked<typeof authService>;

  beforeEach(() => {
    authRepository = new AuthRepository();
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    test('should authenticate valid user credentials', async () => {
      const credentials = {
        email: 'admin@reservapp.com',
        password: 'password123',
      };

      const mockSession = {
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        refreshToken: 'mock-refresh-token',
        token: 'mock-jwt-token',
        user: {
          createdAt: new Date().toISOString(),
          email: credentials.email,
          id: '1',
          isActive: true,
          name: 'Admin User',
          role: UserRole.ADMIN,
          updatedAt: new Date().toISOString(),
        },
      };

      mockedAuthService.login.mockResolvedValueOnce({
        data: mockSession,
        message: 'Login successful',
        success: true,
      });

      const session = await authRepository.authenticate(credentials);

      expect(session).toBeDefined();
      expect(session.user.email).toBe(credentials.email);
      expect(session.user.role).toBe(UserRole.ADMIN);
      expect(session.token).toBeDefined();
      expect(session.refreshToken).toBeDefined();
      expect(mockedAuthService.login).toHaveBeenCalledWith(credentials);
    });

    test('should reject invalid credentials', async () => {
      const credentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      mockedAuthService.login.mockResolvedValueOnce({
        data: undefined,
        message: 'Credenciales inválidas',
        success: false,
      });

      await expect(authRepository.authenticate(credentials)).rejects.toThrow(
        'Credenciales inválidas'
      );
    });

    test('should reject wrong password', async () => {
      const credentials = {
        email: 'admin@reservapp.com',
        password: 'wrongpassword',
      };

      mockedAuthService.login.mockRejectedValueOnce(new Error('Credenciales inválidas'));

      await expect(authRepository.authenticate(credentials)).rejects.toThrow(
        'Credenciales inválidas'
      );
    });
  });

  describe('User Registration', () => {
    test('should register new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123',
      };

      const mockSession = {
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        refreshToken: 'mock-refresh-token',
        token: 'mock-jwt-token',
        user: {
          createdAt: new Date().toISOString(),
          email: userData.email,
          id: '2',
          isActive: true,
          name: userData.name,
          role: UserRole.USER,
          updatedAt: new Date().toISOString(),
        },
      };

      mockedAuthService.register.mockResolvedValueOnce({
        data: mockSession,
        message: 'Registration successful',
        success: true,
      });

      const session = await authRepository.register(userData);

      expect(session).toBeDefined();
      expect(session.user.email).toBe(userData.email);
      expect(session.user.name).toBe(userData.name);
      expect(session.user.role).toBe(UserRole.USER);
      expect(mockedAuthService.register).toHaveBeenCalledWith(userData);
    });

    test('should prevent duplicate email registration', async () => {
      const userData = {
        email: 'admin@reservapp.com',
        name: 'Duplicate User',
        password: 'password123',
      };

      mockedAuthService.register.mockRejectedValueOnce(new Error('El usuario ya existe'));

      await expect(authRepository.register(userData)).rejects.toThrow('El usuario ya existe');
    });
  });

  describe('Token Management', () => {
    test('should validate tokens', async () => {
      const mockUser = {
        createdAt: new Date().toISOString(),
        email: 'admin@reservapp.com',
        id: '1',
        isActive: true,
        name: 'Admin User',
        role: UserRole.ADMIN,
        updatedAt: new Date().toISOString(),
      };

      mockedAuthService.getProfile.mockResolvedValueOnce({
        data: mockUser,
        message: 'Profile retrieved successfully',
        success: true,
      });

      const user = await authRepository.validateToken();

      expect(user).toBeDefined();
      expect(user.id).toBe('1');
      expect(user.email).toBe('admin@reservapp.com');
      expect(mockedAuthService.getProfile).toHaveBeenCalled();
    });

    test('should reject invalid tokens', async () => {
      mockedAuthService.getProfile.mockRejectedValueOnce(new Error('Token inválido o expirado'));

      await expect(authRepository.validateToken()).rejects.toThrow('Token inválido o expirado');
    });
  });
});
