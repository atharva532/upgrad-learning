import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

// Mock Prisma with interest-related methods
vi.mock('../lib/prisma.js', () => ({
  prisma: {
    interest: {
      findMany: vi.fn().mockResolvedValue([
        { id: 'interest-1', name: 'Web Development' },
        { id: 'interest-2', name: 'Data Science' },
      ]),
      count: vi.fn().mockResolvedValue(2),
    },
    userInterest: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      createMany: vi.fn().mockResolvedValue({ count: 2 }),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
    // Keep existing mocks for auth tests
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
      findUnique: vi.fn(),
      update: vi.fn(),
      deleteMany: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

describe('Interest Controller', () => {
  describe('GET /api/interests', () => {
    it('should return list of all interests', async () => {
      const response = await request(app).get('/api/interests');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
    });
  });

  describe('POST /api/interests/user', () => {
    it('should return 401 without authorization header', async () => {
      const response = await request(app)
        .post('/api/interests/user')
        .send({ interestIds: ['interest-1'] });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 with invalid token before body validation occurs', async () => {
      const response = await request(app)
        .post('/api/interests/user')
        .set('Authorization', 'Bearer invalid-token')
        .send({ interestIds: 'not-an-array' });

      // Auth middleware rejects invalid token before body validation
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 with invalid token format', async () => {
      const response = await request(app)
        .post('/api/interests/user')
        .set('Authorization', 'InvalidToken')
        .send({ interestIds: ['interest-1'] });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/interests/user', () => {
    it('should return 401 without authorization header', async () => {
      const response = await request(app).get('/api/interests/user');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
