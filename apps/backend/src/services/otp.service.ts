/**
 * OTP Service
 * Core OTP operations: request, verify, and email sending
 */

import { Resend } from 'resend';
import { prisma } from '../lib/prisma.js';
import { AUTH_CONFIG } from '../config/auth.config.js';
import { generateOtp, hashOtp, verifyOtpHash } from '../utils/otp.utils.js';
import { checkRateLimit } from './rate-limit.service.js';
import { cleanupOtpsForEmail } from './cleanup.service.js';

// Initialize Resend client (lazy - only if API key exists)
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export interface OtpRequestResult {
  success: boolean;
  message: string;
  expiresAt?: Date;
  resendAvailableAt?: Date;
  remainingRequests?: number;
  error?: string;
  retryAfter?: Date;
  waitSeconds?: number;
}

export interface OtpVerifyResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    createdAt: Date;
  };
  isNewUser?: boolean;
  error?: string;
  attemptsRemaining?: number;
}

/**
 * Request a new OTP for email
 */
export async function requestOtp(
  email: string,
  ipAddress?: string,
  userAgent?: string
): Promise<OtpRequestResult> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check resend cooldown
  const lastOtp = await prisma.otpRecord.findFirst({
    where: { email: normalizedEmail, used: false },
    orderBy: { createdAt: 'desc' },
  });

  const now = Date.now();
  const cooldownMs = AUTH_CONFIG.OTP_RESEND_COOLDOWN_SECONDS * 1000;

  if (lastOtp) {
    const timeSinceLastRequest = now - lastOtp.createdAt.getTime();
    if (timeSinceLastRequest < cooldownMs) {
      const resendAvailableAt = new Date(lastOtp.createdAt.getTime() + cooldownMs);
      return {
        success: false,
        message: 'Please wait before requesting another OTP',
        error: 'COOLDOWN_ACTIVE',
        resendAvailableAt,
        waitSeconds: Math.ceil((cooldownMs - timeSinceLastRequest) / 1000),
      };
    }
  }

  // Check rate limit
  const rateLimit = await checkRateLimit(normalizedEmail, 'otp_request');
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: 'Too many OTP requests. Please try again later.',
      error: 'RATE_LIMIT_EXCEEDED',
      retryAfter: rateLimit.retryAfter,
      waitSeconds: rateLimit.waitSeconds,
    };
  }

  // Clean up old OTPs for this email
  await cleanupOtpsForEmail(normalizedEmail);

  // Generate new OTP
  const otp = generateOtp();
  const otpHash = hashOtp(otp, normalizedEmail);
  const expiresAt = new Date(now + AUTH_CONFIG.OTP_EXPIRY_MINUTES * 60 * 1000);
  const resendAvailableAt = new Date(now + cooldownMs);

  // Store OTP
  await prisma.otpRecord.create({
    data: {
      email: normalizedEmail,
      otpHash,
      expiresAt,
      ipAddress,
      userAgent,
    },
  });

  // Send email (or log in development)
  const emailSent = await sendOtpEmail(normalizedEmail, otp);

  if (!emailSent && process.env.NODE_ENV === 'production') {
    return {
      success: false,
      message: 'Failed to send OTP email. Please try again.',
      error: 'EMAIL_SEND_FAILED',
    };
  }

  // Log audit event
  await prisma.auditLog.create({
    data: {
      email: normalizedEmail,
      action: 'OTP_REQUESTED',
      ipAddress,
      userAgent,
    },
  });

  return {
    success: true,
    message: 'OTP sent to your email',
    expiresAt,
    resendAvailableAt,
    remainingRequests: rateLimit.remaining,
  };
}

/**
 * Verify OTP and return user
 */
export async function verifyOtp(
  email: string,
  otp: string,
  ipAddress?: string,
  userAgent?: string
): Promise<OtpVerifyResult> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check rate limit for verification attempts
  const rateLimit = await checkRateLimit(normalizedEmail, 'otp_verify');
  if (!rateLimit.allowed) {
    return {
      success: false,
      message: 'Too many verification attempts. Please try again later.',
      error: 'RATE_LIMIT_EXCEEDED',
    };
  }

  // Find valid OTP record
  const otpRecord = await prisma.otpRecord.findFirst({
    where: {
      email: normalizedEmail,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Unified error response to prevent email enumeration
  const genericError: OtpVerifyResult = {
    success: false,
    message: 'Invalid or expired verification code',
    error: 'INVALID_OTP',
  };

  if (!otpRecord) {
    // Log failed attempt
    await prisma.auditLog.create({
      data: {
        email: normalizedEmail,
        action: 'OTP_FAILED',
        ipAddress,
        userAgent,
        metadata: { reason: 'no_record' },
      },
    });
    return genericError;
  }

  // Check max attempts
  if (otpRecord.attempts >= AUTH_CONFIG.OTP_MAX_ATTEMPTS) {
    // Invalidate the OTP
    await prisma.otpRecord.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    await prisma.auditLog.create({
      data: {
        email: normalizedEmail,
        action: 'OTP_FAILED',
        ipAddress,
        userAgent,
        metadata: { reason: 'max_attempts' },
      },
    });

    return genericError;
  }

  // Verify OTP hash
  const isValid = verifyOtpHash(otp, normalizedEmail, otpRecord.otpHash);

  if (!isValid) {
    // Increment attempt counter
    const updated = await prisma.otpRecord.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    await prisma.auditLog.create({
      data: {
        email: normalizedEmail,
        action: 'OTP_FAILED',
        ipAddress,
        userAgent,
        metadata: { reason: 'invalid_code', attempts: updated.attempts },
      },
    });

    return {
      success: false,
      message: 'Invalid or expired verification code',
      error: 'INVALID_OTP',
      attemptsRemaining: AUTH_CONFIG.OTP_MAX_ATTEMPTS - updated.attempts,
    };
  }

  // OTP is valid - mark as used
  await prisma.otpRecord.update({
    where: { id: otpRecord.id },
    data: { used: true },
  });

  // Find or create user (upsert for race condition safety)
  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {}, // No updates for existing user
    create: { email: normalizedEmail },
  });

  // Determine if this is a new user (created just now)
  const isNewUser = user.createdAt.getTime() > Date.now() - 5000; // Within 5 seconds

  // Log success
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      email: normalizedEmail,
      action: isNewUser ? 'SIGNUP_SUCCESS' : 'LOGIN_SUCCESS',
      ipAddress,
      userAgent,
    },
  });

  return {
    success: true,
    message: 'Authentication successful',
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    isNewUser,
  };
}

/**
 * Send OTP via email
 * Returns true if sent successfully, false otherwise
 */
async function sendOtpEmail(email: string, otp: string): Promise<boolean> {
  const resend = getResendClient();

  if (!resend) {
    // Development mode - log OTP to console
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 OTP for ${email}: ${otp}`);
    console.log(`⏰ Expires in ${AUTH_CONFIG.OTP_EXPIRY_MINUTES} minutes`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return true;
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'UpGrad Learning <noreply@upgrad.com>',
      to: email,
      subject: 'Your Login Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p>Use the following code to log in to UpGrad Learning:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px;">This code expires in ${AUTH_CONFIG.OTP_EXPIRY_MINUTES} minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
}
