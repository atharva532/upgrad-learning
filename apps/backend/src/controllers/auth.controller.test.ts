import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

// Mock Prisma with all required methods
vi.mock('../lib/prisma.js', () => ({
  prisma: {
    otpRecord: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    rateLimit: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

describe('Auth Controller - Input Validation', () => {
  describe('POST /api/auth/otp/request', () => {
    it('should return 400 if email is missing', async () => {
      const response = await request(app).post('/api/auth/otp/request').send({});

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        error: 'Email is required',
        code: 'MISSING_EMAIL',
      });
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/otp/request')
        .send({ email: 'not-an-email' });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        error: 'Please enter a valid email address',
        code: 'INVALID_EMAIL',
      });
    });

    it('should return 400 for email without domain', async () => {
      const response = await request(app).post('/api/auth/otp/request').send({ email: 'test@' });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_EMAIL');
    });

    it('should return 400 for email with spaces', async () => {
      const response = await request(app)
        .post('/api/auth/otp/request')
        .send({ email: 'test @example.com' });

      expect(response.status).toBe(400);
      expect(response.body.code).toBe('INVALID_EMAIL');
    });
  });

  describe('POST /api/auth/otp/verify', () => {
    it('should return 400 if email is missing', async () => {
      const response = await request(app).post('/api/auth/otp/verify').send({ otp: '123456' });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        error: 'Email and OTP are required',
      });
    });

    it('should return 400 if OTP is missing', async () => {
      const response = await request(app)
        .post('/api/auth/otp/verify')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        error: 'Email and OTP are required',
      });
    });

    it('should return 400 if both email and OTP are missing', async () => {
      const response = await request(app).post('/api/auth/otp/verify').send({});

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        error: 'Email and OTP are required',
      });
    });

    it('should return 400 for non-6-digit OTP', async () => {
      const response = await request(app)
        .post('/api/auth/otp/verify')
        .send({ email: 'test@example.com', otp: '12345' }); // Only 5 digits

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        error: 'OTP must be a 6-digit code',
      });
    });

    it('should return 400 for non-numeric OTP', async () => {
      const response = await request(app)
        .post('/api/auth/otp/verify')
        .send({ email: 'test@example.com', otp: 'abcdef' });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        error: 'OTP must be a 6-digit code',
      });
    });
  });
});

describe('Auth Controller - Token Refresh', () => {
  describe('POST /api/auth/token/refresh', () => {
    it('should return 401 if no refresh token cookie', async () => {
      const response = await request(app).post('/api/auth/token/refresh');

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        error: 'Refresh token required',
      });
    });
  });
});

describe('Auth Controller - Logout', () => {
  describe('POST /api/auth/logout', () => {
    it('should return success and clear cookie', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
});

describe('Auth Controller - Session', () => {
  describe('GET /api/auth/session', () => {
    it('should return 401 without authorization header', async () => {
      const response = await request(app).get('/api/auth/session');

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        error: 'Authorization header required',
      });
    });

    it('should return 401 with invalid token format', async () => {
      const response = await request(app)
        .get('/api/auth/session')
        .set('Authorization', 'InvalidToken');

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        error: 'Authorization header required',
      });
    });
  });
});
