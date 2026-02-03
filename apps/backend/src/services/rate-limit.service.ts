/**
 * Rate Limit Service
 * Database-backed rate limiting for OTP requests and verifications
 */

import { prisma } from '../lib/prisma.js';
import { AUTH_CONFIG, RateLimitType } from '../config/auth.config.js';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: Date;
  waitSeconds?: number;
}

/**
 * Check and update rate limit for a given identifier
 * Uses atomic upsert to handle concurrent requests safely
 */
export async function checkRateLimit(
  identifier: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  const config = AUTH_CONFIG.RATE_LIMITS[type];
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  // First, try to find existing record
  const existingRecord = await prisma.rateLimit.findUnique({
    where: {
      identifier_type: { identifier, type },
    },
  });

  // If record exists and window is still valid
  if (existingRecord && existingRecord.windowStart > windowStart) {
    // Check if already at limit before attempting increment
    if (existingRecord.count >= config.maxRequests) {
      const retryAfter = new Date(existingRecord.windowStart.getTime() + config.windowMs);
      return {
        allowed: false,
        remaining: 0,
        retryAfter,
        waitSeconds: Math.ceil((retryAfter.getTime() - now.getTime()) / 1000),
      };
    }

    // ATOMIC: Conditional increment - only succeeds if count < maxRequests
    // This prevents race conditions where concurrent requests could exceed the limit
    const result = await prisma.rateLimit.updateMany({
      where: {
        id: existingRecord.id,
        count: { lt: config.maxRequests },
        windowStart: existingRecord.windowStart,
      },
      data: {
        count: { increment: 1 },
      },
    });

    // If count === 0, a concurrent request beat us to the limit
    if (result.count === 0) {
      const retryAfter = new Date(existingRecord.windowStart.getTime() + config.windowMs);
      return {
        allowed: false,
        remaining: 0,
        retryAfter,
        waitSeconds: Math.ceil((retryAfter.getTime() - now.getTime()) / 1000),
      };
    }

    // Increment succeeded - fetch updated record to get actual count
    const updated = await prisma.rateLimit.findUnique({
      where: { id: existingRecord.id },
    });

    return {
      allowed: true,
      remaining: updated ? config.maxRequests - updated.count : 0,
    };
  }

  // Window expired or no record - create/reset
  await prisma.rateLimit.upsert({
    where: {
      identifier_type: { identifier, type },
    },
    update: {
      count: 1,
      windowStart: now,
    },
    create: {
      identifier,
      type,
      count: 1,
      windowStart: now,
    },
  });

  return {
    allowed: true,
    remaining: config.maxRequests - 1,
  };
}

/**
 * Get remaining rate limit without incrementing
 */
export async function getRateLimitStatus(
  identifier: string,
  type: RateLimitType
): Promise<RateLimitResult> {
  const config = AUTH_CONFIG.RATE_LIMITS[type];
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);

  const record = await prisma.rateLimit.findUnique({
    where: {
      identifier_type: { identifier, type },
    },
  });

  if (!record || record.windowStart < windowStart) {
    return {
      allowed: true,
      remaining: config.maxRequests,
    };
  }

  if (record.count >= config.maxRequests) {
    const retryAfter = new Date(record.windowStart.getTime() + config.windowMs);
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
      waitSeconds: Math.ceil((retryAfter.getTime() - now.getTime()) / 1000),
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
  };
}

/**
 * Reset rate limit for an identifier (admin use)
 */
export async function resetRateLimit(identifier: string, type: RateLimitType): Promise<void> {
  await prisma.rateLimit.deleteMany({
    where: { identifier, type },
  });
}
