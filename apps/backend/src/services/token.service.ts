/**
 * Token Service
 * JWT access tokens and refresh token rotation with family tracking
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { AUTH_CONFIG } from '../config/auth.config.js';
import { hashToken, generateRefreshToken } from '../utils/otp.utils.js';
import { getDeviceName } from '../utils/device.utils.js';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AccessTokenPayload {
  userId: string;
  email: string;
  type: 'access';
}

interface UserForToken {
  id: string;
  email: string;
}

/**
 * Create initial token pair for new login
 * Starts a new token family
 */
export async function createTokenPair(
  user: UserForToken,
  deviceInfo: { userAgent?: string; ipAddress?: string }
): Promise<TokenPair> {
  const familyId = crypto.randomUUID();
  return issueTokenPair(user, familyId, deviceInfo);
}

/**
 * Issue access + refresh tokens
 */
async function issueTokenPair(
  user: UserForToken,
  familyId: string,
  deviceInfo: { userAgent?: string; ipAddress?: string }
): Promise<TokenPair> {
  // Generate access token
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      type: 'access',
    } as AccessTokenPayload,
    AUTH_CONFIG.JWT_SECRET,
    { expiresIn: AUTH_CONFIG.ACCESS_TOKEN_TTL }
  );

  // Generate refresh token
  const refreshToken = generateRefreshToken();
  const tokenHash = hashToken(refreshToken);
  const deviceName = getDeviceName(deviceInfo.userAgent);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      familyId,
      expiresAt: new Date(Date.now() + AUTH_CONFIG.REFRESH_TOKEN_TTL_MS),
      deviceName,
      ipAddress: deviceInfo.ipAddress,
    },
  });

  return { accessToken, refreshToken };
}

/**
 * Rotate refresh token - invalidate old, issue new
 * Implements token reuse detection for security
 */
export async function rotateRefreshToken(
  oldToken: string,
  deviceInfo: { userAgent?: string; ipAddress?: string }
): Promise<TokenPair | null> {
  const oldTokenHash = hashToken(oldToken);

  // Find the old token
  const existingToken = await prisma.refreshToken.findUnique({
    where: { tokenHash: oldTokenHash },
    include: { user: true },
  });

  if (!existingToken) {
    return null; // Token not found
  }

  // Check if token is expired or revoked
  if (existingToken.revokedAt || existingToken.expiresAt < new Date()) {
    return null;
  }

  // SECURITY: Check if token was already used (potential theft!)
  if (existingToken.replacedBy) {
    // Token reuse detected - revoke entire family!
    console.warn(
      `⚠️ Refresh token reuse detected! Family: ${existingToken.familyId}, User: ${existingToken.userId}`
    );
    await revokeTokenFamily(existingToken.familyId);
    return null;
  }

  // Issue new token pair
  const newPair = await issueTokenPair(existingToken.user, existingToken.familyId, deviceInfo);
  const newTokenHash = hashToken(newPair.refreshToken);

  // Mark old token as replaced
  await prisma.refreshToken.update({
    where: { id: existingToken.id },
    data: {
      revokedAt: new Date(),
      replacedBy: newTokenHash,
    },
  });

  return newPair;
}

/**
 * Revoke all tokens in a family (security measure)
 */
export async function revokeTokenFamily(familyId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { familyId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/**
 * Revoke a specific refresh token
 */
export async function revokeRefreshToken(token: string): Promise<boolean> {
  const tokenHash = hashToken(token);

  const result = await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  return result.count > 0;
}

/**
 * Revoke all tokens for a user (logout from all devices)
 */
export async function revokeAllUserTokens(userId: string): Promise<number> {
  const result = await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  return result.count;
}

/**
 * Verify access token and return payload
 */
export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const payload = jwt.verify(token, AUTH_CONFIG.JWT_SECRET) as AccessTokenPayload;
    if (payload.type !== 'access') {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Get active sessions for a user
 */
export async function getUserSessions(userId: string) {
  return prisma.refreshToken.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: { gt: new Date() },
      replacedBy: null, // Only get the latest token in each family
    },
    select: {
      id: true,
      familyId: true,
      deviceName: true,
      ipAddress: true,
      createdAt: true,
      lastUsedAt: true,
    },
    orderBy: { lastUsedAt: 'desc' },
  });
}

/**
 * Revoke a specific session by family ID
 */
export async function revokeSession(userId: string, familyId: string): Promise<boolean> {
  // Verify session belongs to user
  const session = await prisma.refreshToken.findFirst({
    where: { familyId, userId },
  });

  if (!session) {
    return false;
  }

  await revokeTokenFamily(familyId);
  return true;
}

/**
 * Update last used timestamp for a token
 */
export async function updateTokenLastUsed(tokenHash: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { lastUsedAt: new Date() },
  });
}
