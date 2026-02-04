/**
 * OTP Utility Functions
 * Secure OTP generation and HMAC-based hashing
 */

import crypto from 'crypto';
import { AUTH_CONFIG } from '../config/auth.config.js';

/**
 * Generate a cryptographically secure 6-digit OTP
 * Includes leading zeros (e.g., "001234")
 */
export function generateOtp(): string {
  const otp = crypto.randomInt(0, 1000000);
  return otp.toString().padStart(6, '0');
}

/**
 * Create HMAC hash of OTP with email as additional context
 * Even with database access, attacker cannot reverse without OTP_SECRET
 */
export function hashOtp(otp: string, email: string): string {
  const hmac = crypto.createHmac('sha256', AUTH_CONFIG.OTP_SECRET);
  hmac.update(`${email.toLowerCase()}:${otp}`);
  return hmac.digest('hex');
}

/**
 * Verify OTP by comparing HMAC hashes
 * Uses timing-safe comparison to prevent timing attacks
 */
export function verifyOtpHash(submittedOtp: string, email: string, storedHash: string): boolean {
  const submittedHash = hashOtp(submittedOtp, email);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(submittedHash, 'hex'),
      Buffer.from(storedHash, 'hex')
    );
  } catch {
    // If buffers have different lengths, they don't match
    return false;
  }
}

/**
 * Hash a token for storage (refresh tokens)
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a secure random refresh token
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('base64url');
}
