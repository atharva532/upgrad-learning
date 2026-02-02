/**
 * Authentication Controller
 * Handles OTP request, verification, session management
 */

import { Request, Response } from 'express';
import { requestOtp, verifyOtp } from '../services/otp.service.js';
import {
  createTokenPair,
  rotateRefreshToken,
  revokeRefreshToken,
  getUserSessions,
  revokeSession,
  revokeAllUserTokens,
} from '../services/token.service.js';
import { hashToken } from '../utils/otp.utils.js';
import { getClientIp } from '../utils/device.utils.js';
import { AUTH_CONFIG } from '../config/auth.config.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { prisma } from '../lib/prisma.js';

/**
 * POST /api/auth/otp/request
 * Request OTP for email
 */
export async function requestOtpController(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Email is required',
        code: 'MISSING_EMAIL',
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid email address',
        code: 'INVALID_EMAIL',
      });
      return;
    }

    const ipAddress = getClientIp(req.ip, req.headers['x-forwarded-for']);
    const userAgent = req.headers['user-agent'];

    const result = await requestOtp(email, ipAddress, userAgent);

    if (!result.success) {
      const statusCode = result.error === 'RATE_LIMIT_EXCEEDED' ? 429 : 400;
      res.status(statusCode).json({
        success: false,
        error: result.message,
        code: result.error,
        data: {
          retryAfter: result.retryAfter?.toISOString(),
          waitSeconds: result.waitSeconds,
          resendAvailableAt: result.resendAvailableAt?.toISOString(),
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        email: email.toLowerCase().trim(),
        expiresAt: result.expiresAt?.toISOString(),
        resendAvailableAt: result.resendAvailableAt?.toISOString(),
        remainingRequests: result.remainingRequests,
      },
    });
  } catch (error) {
    console.error('OTP request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process OTP request',
      code: 'INTERNAL_ERROR',
    });
  }
}

/**
 * POST /api/auth/otp/verify
 * Verify OTP and issue tokens
 */
export async function verifyOtpController(req: Request, res: Response): Promise<void> {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        error: 'Email and OTP are required',
        code: 'MISSING_FIELDS',
      });
      return;
    }

    if (typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
      res.status(400).json({
        success: false,
        error: 'OTP must be a 6-digit code',
        code: 'INVALID_OTP_FORMAT',
      });
      return;
    }

    const ipAddress = getClientIp(req.ip, req.headers['x-forwarded-for']);
    const userAgent = req.headers['user-agent'];

    const result = await verifyOtp(email, otp, ipAddress, userAgent);

    if (!result.success || !result.user) {
      res.status(401).json({
        success: false,
        error: result.message,
        code: result.error,
        data: {
          attemptsRemaining: result.attemptsRemaining,
        },
      });
      return;
    }

    // Issue tokens
    const { accessToken, refreshToken } = await createTokenPair(result.user, {
      userAgent,
      ipAddress,
    });

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', refreshToken, AUTH_CONFIG.COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        accessToken,
        isNewUser: result.isNewUser,
      },
    });
  } catch (error) {
    console.error('OTP verify error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify OTP',
      code: 'INTERNAL_ERROR',
    });
  }
}

/**
 * POST /api/auth/token/refresh
 * Refresh access token using refresh token cookie
 */
export async function refreshTokenController(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: 'Refresh token required',
        code: 'NO_REFRESH_TOKEN',
      });
      return;
    }

    const ipAddress = getClientIp(req.ip, req.headers['x-forwarded-for']);
    const userAgent = req.headers['user-agent'];

    const result = await rotateRefreshToken(refreshToken, { userAgent, ipAddress });

    if (!result) {
      // Clear invalid cookie
      res.clearCookie('refreshToken', {
        ...AUTH_CONFIG.COOKIE_OPTIONS,
        maxAge: 0,
      });

      res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token',
        code: 'INVALID_REFRESH_TOKEN',
      });
      return;
    }

    // Set new refresh token cookie
    res.cookie('refreshToken', result.refreshToken, AUTH_CONFIG.COOKIE_OPTIONS);

    res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh token',
      code: 'INTERNAL_ERROR',
    });
  }
}

/**
 * POST /api/auth/logout
 * Logout - works with refresh token only (no access token required)
 */
export async function logoutController(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const ipAddress = getClientIp(req.ip, req.headers['x-forwarded-for']);
    const userAgent = req.headers['user-agent'];

    if (refreshToken) {
      // Find and revoke the token to get user ID for audit log
      const tokenHash = hashToken(refreshToken);
      const token = await prisma.refreshToken.findUnique({
        where: { tokenHash },
      });

      if (token) {
        await revokeRefreshToken(refreshToken);

        // Audit log
        await prisma.auditLog.create({
          data: {
            userId: token.userId,
            email: '', // We don't have email here, but userId is enough
            action: 'LOGOUT',
            ipAddress,
            userAgent,
          },
        });
      }
    }

    // Clear cookie regardless
    res.clearCookie('refreshToken', {
      ...AUTH_CONFIG.COOKIE_OPTIONS,
      maxAge: 0,
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to logout',
      code: 'INTERNAL_ERROR',
    });
  }
}

/**
 * GET /api/auth/session
 * Check current session status
 */
export async function getSessionController(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        authenticated: false,
        error: 'Not authenticated',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        authenticated: false,
        error: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      authenticated: true,
      data: { user },
    });
  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check session',
      code: 'INTERNAL_ERROR',
    });
  }
}

/**
 * GET /api/auth/sessions
 * List all active sessions for current user
 */
export async function getSessionsController(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const sessions = await getUserSessions(req.user.userId);

    // Determine current session
    const currentTokenHash = req.cookies?.refreshToken ? hashToken(req.cookies.refreshToken) : null;

    const currentToken = currentTokenHash
      ? await prisma.refreshToken.findUnique({
          where: { tokenHash: currentTokenHash },
          select: { familyId: true },
        })
      : null;

    const sessionsWithCurrent = sessions.map((session: (typeof sessions)[number]) => ({
      ...session,
      isCurrent: session.familyId === currentToken?.familyId,
    }));

    res.status(200).json({
      success: true,
      data: { sessions: sessionsWithCurrent },
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get sessions',
      code: 'INTERNAL_ERROR',
    });
  }
}

/**
 * DELETE /api/auth/sessions/:familyId
 * Revoke a specific session
 */
export async function revokeSessionController(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const familyId = req.params.familyId as string;

    if (!familyId) {
      res.status(400).json({
        success: false,
        error: 'Session ID required',
      });
      return;
    }

    const revoked = await revokeSession(req.user.userId, familyId);

    if (!revoked) {
      res.status(404).json({
        success: false,
        error: 'Session not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Session revoked successfully',
    });
  } catch (error) {
    console.error('Revoke session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke session',
      code: 'INTERNAL_ERROR',
    });
  }
}

/**
 * DELETE /api/auth/sessions
 * Revoke all sessions (with optional keepCurrent)
 */
export async function revokeAllSessionsController(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const keepCurrent = req.query.keepCurrent === 'true';

    if (keepCurrent && req.cookies?.refreshToken) {
      // Revoke all except current
      const currentTokenHash = hashToken(req.cookies.refreshToken);
      const currentToken = await prisma.refreshToken.findUnique({
        where: { tokenHash: currentTokenHash },
        select: { familyId: true },
      });

      if (currentToken) {
        const result = await prisma.refreshToken.updateMany({
          where: {
            userId: req.user.userId,
            revokedAt: null,
            familyId: { not: currentToken.familyId },
          },
          data: { revokedAt: new Date() },
        });

        res.status(200).json({
          success: true,
          message: `${result.count} session(s) revoked`,
          data: { revokedCount: result.count },
        });
        return;
      }
    }

    // Revoke all sessions
    const count = await revokeAllUserTokens(req.user.userId);

    // Clear cookie if we revoked all
    if (!keepCurrent) {
      res.clearCookie('refreshToken', {
        ...AUTH_CONFIG.COOKIE_OPTIONS,
        maxAge: 0,
      });
    }

    res.status(200).json({
      success: true,
      message: `${count} session(s) revoked`,
      data: { revokedCount: count },
    });
  } catch (error) {
    console.error('Revoke all sessions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to revoke sessions',
      code: 'INTERNAL_ERROR',
    });
  }
}
