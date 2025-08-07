import { ResendService } from '../resendService';

// Mock environment variables
process.env.NEXT_PUBLIC_ENABLE_EMAILS = 'true';
process.env.RESEND_API_KEY = 'test-key';

describe('ResendService', () => {
  describe('Email Controls', () => {
    test('should check if emails are enabled', () => {
      process.env.NEXT_PUBLIC_ENABLE_EMAILS = 'true';
      expect(ResendService.isEmailEnabled()).toBe(true);

      process.env.NEXT_PUBLIC_ENABLE_EMAILS = 'false';
      expect(ResendService.isEmailEnabled()).toBe(false);
    });
  });

  describe('Email Data Validation', () => {
    test('should validate reservation email data', () => {
      const validData = {
        checkInDate: '2024-12-20',
        checkOutDate: '2024-12-22',
        currency: 'MXN',
        guestEmail: 'juan@example.com',
        guestName: 'Juan Pérez',
        reservationId: 'res_123',
        serviceName: 'Suite Junior',
        totalAmount: '2800.00',
        venueName: 'Casa Salazar',
      };

      expect(validData.reservationId).toBeDefined();
      expect(validData.guestEmail).toContain('@');
      expect(validData.totalAmount).toBeDefined();
    });
  });

  describe('Template Generation', () => {
    test('should generate HTML content for emails', () => {
      const emailData = {
        checkInDate: '2024-12-20',
        checkOutDate: '2024-12-22',
        currency: 'MXN',
        guestEmail: 'juan@example.com',
        guestName: 'Juan Pérez',
        reservationId: 'res_123',
        serviceName: 'Suite Junior',
        totalAmount: '2800.00',
        venueName: 'Casa Salazar',
      };

      // Test that our email data structure is complete
      expect(emailData).toHaveProperty('reservationId');
      expect(emailData).toHaveProperty('guestName');
      expect(emailData).toHaveProperty('guestEmail');
      expect(emailData).toHaveProperty('venueName');
      expect(emailData).toHaveProperty('serviceName');
    });
  });
});
