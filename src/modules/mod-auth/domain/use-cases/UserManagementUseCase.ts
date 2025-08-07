import bcrypt from 'bcryptjs';

import {
  CreateUserData,
  PaginationOptions,
  UpdateUserData,
  UserFilters,
  userRepository,
  UserWithReservations,
} from '@/libs/data/repositories/UserRepository';
import { User, UserRole } from '@prisma/client';
import { USER_CONSTANTS } from '@/libs/core/constants/database.constants';

export interface CreateUserRequest extends Omit<CreateUserData, 'password'> {
  password: string;
  confirmPassword: string;
}

export interface UpdateUserRequest extends UpdateUserData {
  id: string;
}

export interface ChangePasswordRequest {
  id: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class UserManagementUseCase {
  private readonly SALT_ROUNDS = 12;

  private validatePassword(password: string): void {
    if (password.length < USER_CONSTANTS.PASSWORD.MIN_LENGTH) {
      throw new Error(
        `Password must be at least ${USER_CONSTANTS.PASSWORD.MIN_LENGTH} characters long`
      );
    }
    if (password.length > USER_CONSTANTS.PASSWORD.MAX_LENGTH) {
      throw new Error(`Password must not exceed ${USER_CONSTANTS.PASSWORD.MAX_LENGTH} characters`);
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    if (email.length > USER_CONSTANTS.EMAIL.MAX_LENGTH) {
      throw new Error(`Email must not exceed ${USER_CONSTANTS.EMAIL.MAX_LENGTH} characters`);
    }
  }

  private validateName(name: string, fieldName: string): void {
    if (name.length < USER_CONSTANTS.NAME.MIN_LENGTH) {
      throw new Error(
        `${fieldName} must be at least ${USER_CONSTANTS.NAME.MIN_LENGTH} characters long`
      );
    }
    if (name.length > USER_CONSTANTS.NAME.MAX_LENGTH) {
      throw new Error(`${fieldName} must not exceed ${USER_CONSTANTS.NAME.MAX_LENGTH} characters`);
    }
  }

  async createUser(request: CreateUserRequest): Promise<User> {
    // Validation
    this.validateEmail(request.email);
    this.validateName(request.firstName, 'First name');
    this.validateName(request.lastName, 'Last name');
    this.validatePassword(request.password);

    if (request.password !== request.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (request.phone && request.phone.length > USER_CONSTANTS.PHONE.MAX_LENGTH) {
      throw new Error(`Phone must not exceed ${USER_CONSTANTS.PHONE.MAX_LENGTH} characters`);
    }

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(request.password, this.SALT_ROUNDS);

    // Create user
    const userData: CreateUserData = {
      email: request.email.toLowerCase(),
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim(),
      password: hashedPassword,
      phone: request.phone?.trim() || undefined,
      role: request.role || UserRole.USER,
    };

    return await userRepository.create(userData);
  }

  async getUserById(id: string): Promise<User | null> {
    if (!id) {
      throw new Error('User ID is required');
    }
    return await userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new Error('Email is required');
    }
    this.validateEmail(email);
    return await userRepository.findByEmail(email.toLowerCase());
  }

  async getUserWithReservations(id: string): Promise<UserWithReservations | null> {
    if (!id) {
      throw new Error('User ID is required');
    }
    return await userRepository.findByIdWithReservations(id);
  }

  async getUsers(
    filters: UserFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ users: User[]; total: number; page: number; limit: number; totalPages: number }> {
    const result = await userRepository.findMany(filters, pagination);

    const page = pagination.page || 1;
    const limit = pagination.limit || 10;
    const totalPages = Math.ceil(result.total / limit);

    return {
      ...result,
      limit,
      page,
      totalPages,
    };
  }

  async updateUser(request: UpdateUserRequest): Promise<User> {
    if (!request.id) {
      throw new Error('User ID is required');
    }

    // Validation
    if (request.email) {
      this.validateEmail(request.email);

      // Check if email is already taken by another user
      const existingUser = await userRepository.findByEmail(request.email);
      if (existingUser && existingUser.id !== request.id) {
        throw new Error('Email is already taken by another user');
      }
    }

    if (request.firstName) {
      this.validateName(request.firstName, 'First name');
    }

    if (request.lastName) {
      this.validateName(request.lastName, 'Last name');
    }

    if (request.phone && request.phone.length > USER_CONSTANTS.PHONE.MAX_LENGTH) {
      throw new Error(`Phone must not exceed ${USER_CONSTANTS.PHONE.MAX_LENGTH} characters`);
    }

    const updateData: UpdateUserData = {
      ...(request.email && { email: request.email.toLowerCase() }),
      ...(request.firstName && { firstName: request.firstName.trim() }),
      ...(request.lastName && { lastName: request.lastName.trim() }),
      ...(request.phone !== undefined && { phone: request.phone?.trim() || undefined }),
      ...(request.role && { role: request.role }),
      ...(request.isActive !== undefined && { isActive: request.isActive }),
    };

    return await userRepository.update(request.id, updateData);
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    // Validation
    this.validatePassword(request.newPassword);

    if (request.newPassword !== request.confirmPassword) {
      throw new Error('New passwords do not match');
    }

    // Get current user
    const user = await userRepository.findById(request.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(request.currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(request.newPassword, this.SALT_ROUNDS);

    // Update password
    await userRepository.updatePassword(request.id, hashedNewPassword);
  }

  async deactivateUser(id: string): Promise<User> {
    if (!id) {
      throw new Error('User ID is required');
    }
    return await userRepository.update(id, { isActive: false });
  }

  async activateUser(id: string): Promise<User> {
    if (!id) {
      throw new Error('User ID is required');
    }
    return await userRepository.update(id, { isActive: true });
  }

  async deleteUser(id: string): Promise<void> {
    if (!id) {
      throw new Error('User ID is required');
    }
    await userRepository.delete(id);
  }

  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Record<UserRole, number>;
  }> {
    const [total, active, adminCount, managerCount, employeeCount, userCount] = await Promise.all([
      userRepository.getActiveUsersCount(),
      userRepository.getActiveUsersCount(),
      userRepository.countByRole(UserRole.ADMIN),
      userRepository.countByRole(UserRole.MANAGER),
      userRepository.countByRole(UserRole.EMPLOYEE),
      userRepository.countByRole(UserRole.USER),
    ]);

    return {
      active,
      byRole: {
        [UserRole.ADMIN]: adminCount,
        [UserRole.MANAGER]: managerCount,
        [UserRole.EMPLOYEE]: employeeCount,
        [UserRole.USER]: userCount,
      },
      inactive: total - active,
      total,
    };
  }
}

export const userManagementUseCase = new UserManagementUseCase();
export default userManagementUseCase;
