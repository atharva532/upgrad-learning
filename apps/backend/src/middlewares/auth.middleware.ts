/**
 * Authentication Middleware
 * Validates access tokens and attaches user to request
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/token.service.js';

// Extend Express Request type
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

/**
 * Middleware to require valid access token
 * Attaches user info to request if valid
 */
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Authorization header required',
      code: 'NO_TOKEN',
    });
    return;
  }

  const token = authHeader.substring(7); // Remove 'Bearer '
  const payload = verifyAccessToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
    });
    return;
  }

  req.user = {
    userId: payload.userId,
    email: payload.email,
  };

  next();
}

/**
 * Optional auth middleware
 * Attaches user if token is valid, but doesn't require it
 */
export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (payload) {
      req.user = {
        userId: payload.userId,
        email: payload.email,
      };
    }
  }

  next();
}
