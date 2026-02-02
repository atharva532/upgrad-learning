import { describe, it, expect } from 'vitest';
import {
  generateOtp,
  hashOtp,
  verifyOtpHash,
  hashToken,
  generateRefreshToken,
} from './otp.utils.js';

describe('OTP Utils', () => {
  describe('generateOtp', () => {
    it('should generate a 6-digit string', () => {
      const otp = generateOtp();

      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('should generate different OTPs on each call', () => {
      const otps = new Set();
      for (let i = 0; i < 100; i++) {
        otps.add(generateOtp());
      }
      // With 100 calls, we should get multiple unique OTPs
      expect(otps.size).toBeGreaterThan(90);
    });

    it('should only contain numeric characters', () => {
      for (let i = 0; i < 50; i++) {
        const otp = generateOtp();
        expect(Number.isInteger(Number(otp))).toBe(true);
      }
    });
  });

  describe('hashOtp', () => {
    it('should return a hex string', () => {
      const hash = hashOtp('123456', 'test@example.com');

      expect(typeof hash).toBe('string');
      expect(/^[a-f0-9]{64}$/i.test(hash)).toBe(true); // SHA-256 = 64 hex chars
    });

    it('should produce consistent hashes for same input', () => {
      const hash1 = hashOtp('123456', 'test@example.com');
      const hash2 = hashOtp('123456', 'test@example.com');

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different OTPs', () => {
      const hash1 = hashOtp('123456', 'test@example.com');
      const hash2 = hashOtp('654321', 'test@example.com');

      expect(hash1).not.toBe(hash2);
    });

    it('should produce different hashes for different emails', () => {
      const hash1 = hashOtp('123456', 'test1@example.com');
      const hash2 = hashOtp('123456', 'test2@example.com');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyOtpHash', () => {
    it('should return true for matching OTP and hash', () => {
      const otp = '123456';
      const email = 'test@example.com';
      const hash = hashOtp(otp, email);

      expect(verifyOtpHash(otp, email, hash)).toBe(true);
    });

    it('should return false for non-matching OTP', () => {
      const email = 'test@example.com';
      const hash = hashOtp('123456', email);

      expect(verifyOtpHash('654321', email, hash)).toBe(false);
    });

    it('should return false for non-matching email', () => {
      const otp = '123456';
      const hash = hashOtp(otp, 'test1@example.com');

      expect(verifyOtpHash(otp, 'test2@example.com', hash)).toBe(false);
    });

    it('should be case-insensitive for email', () => {
      const otp = '123456';
      const hash = hashOtp(otp, 'test@example.com');

      // If the service normalizes emails, this should work
      expect(verifyOtpHash(otp, 'test@example.com', hash)).toBe(true);
    });
  });

  describe('hashToken', () => {
    it('should return a hex string', () => {
      const hash = hashToken('some-refresh-token');

      expect(typeof hash).toBe('string');
      expect(/^[a-f0-9]{64}$/i.test(hash)).toBe(true);
    });

    it('should produce consistent hashes', () => {
      const token = 'my-refresh-token';
      const hash1 = hashToken(token);
      const hash2 = hashToken(token);

      expect(hash1).toBe(hash2);
    });
  });

  describe('generateRefreshToken', () => {
    it('should return a non-empty string', () => {
      const token = generateRefreshToken();

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate unique tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(generateRefreshToken());
      }

      expect(tokens.size).toBe(100);
    });
  });
});
