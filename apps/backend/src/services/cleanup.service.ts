/**
 * Cleanup Service
 * Scheduled and on-demand cleanup of expired records
 */

import cron from 'node-cron';
import { prisma } from '../lib/prisma.js';

interface CleanupResult {
  otpsDeleted: number;
  rateLimitsDeleted: number;
  tokensDeleted: number;
}

/**
 * Clean up expired OTPs, rate limits, and revoked tokens
 */
export async function cleanupExpiredRecords(): Promise<CleanupResult> {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Delete expired OTPs (or used OTPs older than 1 hour)
  const otpResult = await prisma.otpRecord.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: now } }, { used: true, createdAt: { lt: oneHourAgo } }],
    },
  });

  // Delete old rate limit records (window expired over 2 hours ago)
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const rateLimitResult = await prisma.rateLimit.deleteMany({
    where: {
      windowStart: { lt: twoHoursAgo },
    },
  });

  // Delete expired or revoked refresh tokens
  const tokenResult = await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: now } },
        { revokedAt: { lt: oneDayAgo } }, // Keep revoked tokens for 24h for audit
      ],
    },
  });

  return {
    otpsDeleted: otpResult.count,
    rateLimitsDeleted: rateLimitResult.count,
    tokensDeleted: tokenResult.count,
  };
}

/**
 * Start the cleanup scheduler
 * Runs every hour at minute 0
 */
export function startCleanupScheduler(): void {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('🧹 Running scheduled cleanup...');
    try {
      const result = await cleanupExpiredRecords();
      console.log('✅ Cleanup complete:', result);
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  });

  console.log('📅 Cleanup scheduler started (runs hourly)');
}

/**
 * Lazy cleanup for a specific email (run on OTP request)
 * Removes expired/used OTPs for the email
 */
export async function cleanupOtpsForEmail(email: string): Promise<number> {
  const result = await prisma.otpRecord.deleteMany({
    where: {
      email: email.toLowerCase(),
      OR: [{ expiresAt: { lt: new Date() } }, { used: true }],
    },
  });

  return result.count;
}
