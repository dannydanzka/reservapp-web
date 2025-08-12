/**
 * Settings HTTP API Service
 * Handles user profile and notification settings via API
 */

import { handleRequest } from '../http/handleRequest';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface NotificationSettings {
  id: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  bookingReminders: boolean;
  promotionalOffers: boolean;
  updatedAt: string;
}

export interface NotificationSettingsUpdate {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  marketingEmails?: boolean;
  bookingReminders?: boolean;
  promotionalOffers?: boolean;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
  message?: string;
}

export interface NotificationSettingsResponse {
  success: boolean;
  data: NotificationSettings;
  message?: string;
}

export class SettingsApiService {
  private static readonly profileUrl = '/api/settings/profile';
  private static readonly notificationsUrl = '/api/settings/notifications';

  /**
   * Get user profile
   */
  static async getProfile(): Promise<UserProfileResponse> {
    return await handleRequest({
      endpoint: this.profileUrl,
      method: 'GET',
    });
  }

  /**
   * Update user profile
   */
  static async updateProfile(profileData: UserProfileUpdate): Promise<UserProfileResponse> {
    return await handleRequest({
      body: profileData,
      endpoint: this.profileUrl,
      method: 'PUT',
    });
  }

  /**
   * Change password
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<UserProfileResponse> {
    return await handleRequest({
      body: {
        currentPassword,
        newPassword,
      },
      endpoint: this.profileUrl,
      method: 'PUT',
    });
  }

  /**
   * Get notification settings
   */
  static async getNotificationSettings(): Promise<NotificationSettingsResponse> {
    return await handleRequest({
      endpoint: this.notificationsUrl,
      method: 'GET',
    });
  }

  /**
   * Update notification settings
   */
  static async updateNotificationSettings(
    settings: NotificationSettingsUpdate
  ): Promise<NotificationSettingsResponse> {
    return await handleRequest({
      body: settings,
      endpoint: this.notificationsUrl,
      method: 'PUT',
    });
  }

  /**
   * Enable all notifications
   */
  static async enableAllNotifications(): Promise<NotificationSettingsResponse> {
    return this.updateNotificationSettings({
      bookingReminders: true,
      emailNotifications: true,
      pushNotifications: true,
    });
  }

  /**
   * Disable all notifications
   */
  static async disableAllNotifications(): Promise<NotificationSettingsResponse> {
    return this.updateNotificationSettings({
      bookingReminders: false,
      emailNotifications: false,
      marketingEmails: false,
      promotionalOffers: false,
      pushNotifications: false,
      smsNotifications: false,
    });
  }
}

export const settingsApiService = SettingsApiService;
