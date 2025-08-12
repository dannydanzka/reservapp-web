import { DATABASE_CONSTANTS } from '@constants/database.constants';
import { Prisma, ReservationStatus, User, UserRoleEnum } from '@prisma/client';
import { prismaService } from '@infrastructure/services/core/database/prismaService';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRoleEnum;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRoleEnum;
  isActive?: boolean;
  stripeCustomerId?: string;
}

export interface UserFilters {
  email?: string;
  role?: UserRoleEnum;
  isActive?: boolean;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export type UserWithReservations = User & {
  reservations: Array<{
    id: string;
    checkInDate: Date;
    checkOutDate: Date;
    status: ReservationStatus;
    totalAmount: Prisma.Decimal;
  }>;
};

class UserRepository {
  private readonly prisma = prismaService.getClient();

  async create(data: CreateUserData): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          role: data.role || UserRoleEnum.USER,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Email already exists');
        }
      }
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to find user by ID: ${error}`);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error}`);
    }
  }

  async findMany(
    filters: UserFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ users: User[]; total: number }> {
    try {
      const page = Math.max(1, pagination.page || 1);
      const limit = Math.min(
        DATABASE_CONSTANTS.MAX_PAGE_SIZE,
        Math.max(
          DATABASE_CONSTANTS.MIN_PAGE_SIZE,
          pagination.limit || DATABASE_CONSTANTS.DEFAULT_PAGE_SIZE
        )
      );
      const skip = (page - 1) * limit;

      const where: Prisma.UserWhereInput = {};

      if (filters.email) {
        where.email = { contains: filters.email };
      }

      if (filters.role) {
        where.role = filters.role;
      }

      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters.search) {
        where.OR = [
          { firstName: { contains: filters.search } },
          { lastName: { contains: filters.search } },
          { email: { contains: filters.search } },
        ];
      }

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
          where,
        }),
        this.prisma.user.count({ where }),
      ]);

      return { total, users };
    } catch (error) {
      throw new Error(`Failed to find users: ${error}`);
    }
  }

  async findByIdWithReservations(id: string): Promise<UserWithReservations | null> {
    try {
      return await this.prisma.user.findUnique({
        include: {
          reservations: {
            orderBy: { createdAt: 'desc' },
            select: {
              checkInDate: true,
              checkOutDate: true,
              id: true,
              status: true,
              totalAmount: true,
            },
          },
        },
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to find user with reservations: ${error}`);
    }
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    try {
      return await this.prisma.user.update({
        data,
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('Email already exists');
        }
        if (error.code === 'P2025') {
          throw new Error('User not found');
        }
      }
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('User not found');
        }
      }
      throw new Error(`Failed to delete user: ${error}`);
    }
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    try {
      return await this.prisma.user.update({
        data: { password: hashedPassword },
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('User not found');
        }
      }
      throw new Error(`Failed to update password: ${error}`);
    }
  }

  async countByRole(role: UserRoleEnum): Promise<number> {
    try {
      return await this.prisma.user.count({
        where: { isActive: true, role },
      });
    } catch (error) {
      throw new Error(`Failed to count users by role: ${error}`);
    }
  }

  async getActiveUsersCount(): Promise<number> {
    try {
      return await this.prisma.user.count({
        where: { isActive: true },
      });
    } catch (error) {
      throw new Error(`Failed to count active users: ${error}`);
    }
  }
}

export const userRepository = new UserRepository();
