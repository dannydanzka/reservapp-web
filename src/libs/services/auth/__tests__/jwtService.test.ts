import { JWTService } from '../jwtService';

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';

describe('JWTService', () => {
  describe('Password Hashing', () => {
    test('should hash and compare passwords correctly', async () => {
      const password = 'password123';
      const hash = await JWTService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);

      const isValid = await JWTService.comparePassword(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await JWTService.comparePassword('wrongpassword', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('JWT Tokens', () => {
    test('should generate and verify tokens', () => {
      const payload = {
        email: 'test@example.com',
        role: 'USER',
        userId: 'user123',
      };

      const token = JWTService.generateToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const decoded = JWTService.verifyToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    test('should extract token from header', () => {
      const token = 'abc123';
      const header = `Bearer ${token}`;

      const extracted = JWTService.extractTokenFromHeader(header);
      expect(extracted).toBe(token);

      const nullResult = JWTService.extractTokenFromHeader('InvalidHeader');
      expect(nullResult).toBeNull();
    });
  });

  describe('Validation', () => {
    test('should validate credentials', () => {
      const validCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = JWTService.validateCredentials(validCredentials);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);

      const invalidCredentials = {
        email: 'invalid-email',
        password: '123',
      };

      const invalidResult = JWTService.validateCredentials(invalidCredentials);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });
  });
});
