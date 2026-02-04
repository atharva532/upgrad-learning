/**
 * Device Utility Functions
 * User agent parsing and device fingerprinting
 */

import { UAParser, IResult } from 'ua-parser-js';

/**
 * Parse user agent string to get human-readable device name
 * e.g., "Chrome on MacOS", "Safari on iPhone"
 */
export function getDeviceName(userAgent: string | undefined): string {
  if (!userAgent) {
    return 'Unknown Device';
  }

  // Create parser and get result
  const parser = new UAParser(userAgent);
  const result: IResult = parser.getResult();

  const browserName = result.browser.name || 'Unknown Browser';
  const osName = result.os.name || 'Unknown OS';

  // For mobile devices, include device type
  if (result.device.type) {
    return `${browserName} on ${result.device.vendor || ''} ${result.device.model || result.device.type}`.trim();
  }

  return `${browserName} on ${osName}`;
}

/**
 * Get client IP address from request
 * Handles proxies and load balancers
 */
export function getClientIp(
  ip: string | undefined,
  forwardedFor: string | string[] | undefined
): string {
  // Check X-Forwarded-For header (from proxies/load balancers)
  if (forwardedFor) {
    const forwarded = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    // Take the first IP in the chain (original client)
    const firstIp = forwarded.split(',')[0]?.trim();
    if (firstIp) {
      return firstIp;
    }
  }

  // Fall back to direct IP
  return ip || 'unknown';
}
