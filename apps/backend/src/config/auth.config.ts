/**
 * Authentication Configuration
 * Centralized configuration for OTP and token settings
 */

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'OTP_SECRET'] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar] && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const AUTH_CONFIG = {
  // OTP Settings
  OTP_SECRET: process.env.OTP_SECRET || 'dev-otp-secret-change-in-production',
  OTP_EXPIRY_MINUTES: 10,
  OTP_MAX_ATTEMPTS: 3,
  OTP_RESEND_COOLDOWN_SECONDS: 60,

  // Token Settings
  JWT_SECRET: process.env.JWT_SECRET || 'dev-jwt-secret-change-in-production',
  ACCESS_TOKEN_TTL: '15m',
  ACCESS_TOKEN_TTL_MS: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_TTL_DAYS: 7,
  REFRESH_TOKEN_TTL_MS: 7 * 24 * 60 * 60 * 1000, // 7 days

  // Rate Limiting
  RATE_LIMITS: {
    otp_request: { windowMs: 60 * 60 * 1000, maxRequests: 5 }, // 5 per hour
    otp_verify: { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // 10 per hour
    ip_request: { windowMs: 60 * 1000, maxRequests: 20 }, // 20 per minute
  },

  // Cookie Settings
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
} as const;

export type RateLimitType = keyof typeof AUTH_CONFIG.RATE_LIMITS;
