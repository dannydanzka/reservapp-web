// Re-export with explicit naming to avoid conflicts
export { publicApiService } from './publicApiService';
export type { PublicVenue } from './publicApiService';
export { httpPublicApiService } from './httpPublicApiService';

// New API Services
export { servicesApiService, ServicesApiService } from './servicesApiService';
export type {
  Service,
  ServiceFilters,
  ServiceCreateData,
  ServiceUpdateData,
} from './servicesApiService';
export { settingsApiService, SettingsApiService } from './settingsApiService';
export type {
  UserProfile,
  NotificationSettings,
  UserProfileUpdate,
  NotificationSettingsUpdate,
} from './settingsApiService';
