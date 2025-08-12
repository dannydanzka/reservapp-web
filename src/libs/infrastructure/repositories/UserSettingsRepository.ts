import { prismaService } from '@infrastructure/services/core/database/prismaService';
import { UserSettings } from '@prisma/client';

export interface CreateUserSettingsData {
  userId: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmails?: boolean;
}

export interface UpdateUserSettingsData {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmails?: boolean;
}

class UserSettingsRepository {
  private readonly prisma = prismaService.getClient();

  async create(data: CreateUserSettingsData): Promise<UserSettings> {
    try {
      return await this.prisma.userSettings.create({
        data: {
          emailNotifications: data.emailNotifications ?? true,
          marketingEmails: data.marketingEmails ?? false,
          pushNotifications: data.pushNotifications ?? true,
          userId: data.userId,
        },
      });
    } catch (error) {
      console.error('UserSettingsRepository.create error:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<UserSettings | null> {
    try {
      return await this.prisma.userSettings.findUnique({
        where: { userId },
      });
    } catch (error) {
      console.error('UserSettingsRepository.findByUserId error:', error);
      throw error;
    }
  }

  async update(userId: string, data: UpdateUserSettingsData): Promise<UserSettings> {
    try {
      return await this.prisma.userSettings.update({
        data: {
          ...data,
          updatedAt: new Date(),
        },
        where: { userId },
      });
    } catch (error) {
      console.error('UserSettingsRepository.update error:', error);
      throw error;
    }
  }

  async upsert(userId: string, data: UpdateUserSettingsData): Promise<UserSettings> {
    try {
      return await this.prisma.userSettings.upsert({
        create: {
          emailNotifications: data.emailNotifications ?? true,
          marketingEmails: data.marketingEmails ?? false,
          pushNotifications: data.pushNotifications ?? true,
          userId,
        },
        update: {
          ...data,
          updatedAt: new Date(),
        },
        where: { userId },
      });
    } catch (error) {
      console.error('UserSettingsRepository.upsert error:', error);
      throw error;
    }
  }

  async delete(userId: string): Promise<void> {
    try {
      await this.prisma.userSettings.delete({
        where: { userId },
      });
    } catch (error) {
      console.error('UserSettingsRepository.delete error:', error);
      throw error;
    }
  }
}

export const userSettingsRepository = new UserSettingsRepository();
export default userSettingsRepository;
